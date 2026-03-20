import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const reservationId = params.id;

  // Find the reservation and verify ownership
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      class: true,
    },
  });

  if (!reservation) {
    return NextResponse.json(
      { error: "Rezervarea nu a fost gasita" },
      { status: 404 }
    );
  }

  if (reservation.userId !== userId) {
    return NextResponse.json(
      { error: "Nu ai permisiunea sa anulezi aceasta rezervare" },
      { status: 403 }
    );
  }

  // Check if more than 2 hours before class time
  const [hours, minutes] = reservation.class.startTime
    .split(":")
    .map(Number);
  const classDateTime = new Date(reservation.date);
  classDateTime.setHours(hours, minutes, 0, 0);

  const now = new Date();
  const diff = classDateTime.getTime() - now.getTime();
  const twoHoursMs = 2 * 60 * 60 * 1000;

  if (diff <= twoHoursMs) {
    return NextResponse.json(
      {
        error:
          "Nu poti anula o rezervare cu mai putin de 2 ore inainte de clasa",
      },
      { status: 400 }
    );
  }

  // If subscription tracks sessions, restore the session
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      endDate: { gte: now },
    },
    orderBy: { endDate: "desc" },
  });

  try {
    await prisma.$transaction(async (tx) => {
      // Restore session count if applicable
      if (subscription && subscription.sessionsLeft !== null) {
        await tx.subscription.update({
          where: { id: subscription.id },
          data: { sessionsLeft: { increment: 1 } },
        });
      }

      // Delete the reservation
      await tx.reservation.delete({
        where: { id: reservationId },
      });
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Eroare la anularea rezervarii";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
