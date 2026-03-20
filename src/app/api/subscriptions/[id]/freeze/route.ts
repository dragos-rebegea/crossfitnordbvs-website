import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Neautorizat" },
        { status: 401 }
      );
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: params.id },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Abonamentul nu a fost gasit" },
        { status: 404 }
      );
    }

    if (subscription.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Neautorizat" },
        { status: 403 }
      );
    }

    if (subscription.status === "ACTIVE") {
      // Freeze the subscription
      const updated = await prisma.subscription.update({
        where: { id: params.id },
        data: {
          status: "FROZEN",
          frozenAt: new Date(),
        },
        include: { package: true },
      });

      return NextResponse.json(updated);
    }

    if (subscription.status === "FROZEN") {
      // Unfreeze the subscription
      if (!subscription.frozenAt) {
        return NextResponse.json(
          { error: "Data de inghetare lipseste" },
          { status: 400 }
        );
      }

      const now = new Date();
      const frozenMs = now.getTime() - subscription.frozenAt.getTime();
      const frozenDaysCount = Math.ceil(frozenMs / (1000 * 60 * 60 * 24));

      const newEndDate = new Date(subscription.endDate);
      newEndDate.setDate(newEndDate.getDate() + frozenDaysCount);

      const updated = await prisma.subscription.update({
        where: { id: params.id },
        data: {
          status: "ACTIVE",
          frozenAt: null,
          frozenDays: subscription.frozenDays + frozenDaysCount,
          endDate: newEndDate,
        },
        include: { package: true },
      });

      return NextResponse.json(updated);
    }

    return NextResponse.json(
      { error: "Abonamentul nu poate fi inghetat/dezghetat in starea curenta" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Freeze toggle error:", error);
    return NextResponse.json(
      { error: "Eroare la procesarea cererii" },
      { status: 500 }
    );
  }
}
