import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, subscriptionExpiringEmail } from "@/lib/email";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Expire subscriptions that have passed their end date
    const expired = await prisma.subscription.updateMany({
      where: {
        status: "ACTIVE",
        endDate: { lt: today },
      },
      data: { status: "EXPIRED" },
    });

    // Also expire subscriptions with 0 sessions left
    const sessionsExpired = await prisma.subscription.updateMany({
      where: {
        status: "ACTIVE",
        sessionsLeft: 0,
      },
      data: { status: "EXPIRED" },
    });

    // Send warnings for subscriptions expiring in 3 days
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    const expiringSubscriptions = await prisma.subscription.findMany({
      where: {
        status: "ACTIVE",
        endDate: {
          gte: today,
          lte: threeDaysFromNow,
        },
      },
      include: {
        user: true,
        package: true,
      },
    });

    let warningsSent = 0;
    for (const sub of expiringSubscriptions) {
      if (sub.user.email) {
        const daysLeft = Math.ceil(
          (sub.endDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
        );
        const email = subscriptionExpiringEmail({
          userName: sub.user.name || "Membru",
          packageName: sub.package.name,
          endDate: sub.endDate.toLocaleDateString("ro-RO"),
          daysLeft,
        });

        await sendEmail({
          to: sub.user.email,
          ...email,
        });
        warningsSent++;
      }
    }

    return NextResponse.json({
      success: true,
      expired: expired.count,
      sessionsExpired: sessionsExpired.count,
      warningsSent,
    });
  } catch (error) {
    console.error("Cron expire-subscriptions error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
