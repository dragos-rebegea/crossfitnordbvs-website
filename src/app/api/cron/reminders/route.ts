import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, classReminderEmail } from "@/lib/email";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get today's day of week (0=Monday in our system)
    const jsDay = now.getDay(); // 0=Sunday
    const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1; // Convert to 0=Monday

    // Find classes starting in about 1 hour
    const targetHour = oneHourFromNow.getHours();

    // Find classes that start within the next hour window (30-min cron interval)
    const classes = await prisma.class.findMany({
      where: {
        dayOfWeek,
        isActive: true,
        startTime: {
          gte: `${String(targetHour).padStart(2, "0")}:00`,
          lt: `${String(targetHour + 1).padStart(2, "0")}:00`,
        },
      },
      include: { trainer: true },
    });

    let emailsSent = 0;

    for (const cls of classes) {
      // Get reservations for this class today
      const reservations = await prisma.reservation.findMany({
        where: {
          classId: cls.id,
          date: today,
        },
        include: { user: true },
      });

      // Send reminder to each attendee
      for (const reservation of reservations) {
        if (reservation.user.email) {
          const email = classReminderEmail({
            userName: reservation.user.name || "Membru",
            className: cls.name,
            time: `${cls.startTime} - ${cls.endTime}`,
            trainerName: cls.trainer?.name || "TBA",
          });

          await sendEmail({
            to: reservation.user.email,
            ...email,
          });
          emailsSent++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      classesChecked: classes.length,
      emailsSent,
    });
  } catch (error) {
    console.error("Cron reminders error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
