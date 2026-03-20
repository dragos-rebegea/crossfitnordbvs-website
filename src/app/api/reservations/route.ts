import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { searchParams } = new URL(req.url);
  const availableFor = searchParams.get("availableFor");
  const dateParam = searchParams.get("date");

  // If requesting available classes for a specific day
  if (availableFor !== null && dateParam) {
    const dayOfWeek = parseInt(availableFor, 10);
    const reservationDate = new Date(dateParam + "T00:00:00.000Z");

    const classes = await prisma.class.findMany({
      where: {
        dayOfWeek,
        isActive: true,
      },
      include: {
        trainer: true,
        reservations: {
          where: { date: reservationDate },
          select: { id: true },
        },
      },
      orderBy: { startTime: "asc" },
    });

    const result = classes.map((cls) => ({
      id: cls.id,
      name: cls.name,
      dayOfWeek: cls.dayOfWeek,
      startTime: cls.startTime,
      endTime: cls.endTime,
      capacity: cls.capacity,
      trainer: cls.trainer
        ? { id: cls.trainer.id, name: cls.trainer.name }
        : null,
      spotsRemaining: cls.capacity - cls.reservations.length,
    }));

    return NextResponse.json(result);
  }

  // Default: return user's reservations split into upcoming and past
  const now = new Date();

  const [upcoming, past] = await Promise.all([
    prisma.reservation.findMany({
      where: { userId, date: { gte: now } },
      include: {
        class: {
          include: { trainer: { select: { id: true, name: true } } },
        },
      },
      orderBy: { date: "asc" },
    }),
    prisma.reservation.findMany({
      where: { userId, date: { lt: now } },
      include: {
        class: {
          include: { trainer: { select: { id: true, name: true } } },
        },
      },
      orderBy: { date: "desc" },
      take: 20,
    }),
  ]);

  return NextResponse.json({ upcoming, past });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  let body: { classId: string; date: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Date invalide" },
      { status: 400 }
    );
  }

  const { classId, date } = body;

  if (!classId || !date) {
    return NextResponse.json(
      { error: "classId si date sunt obligatorii" },
      { status: 400 }
    );
  }

  const reservationDate = new Date(date + "T00:00:00.000Z");

  // Verify class exists and is active
  const classInfo = await prisma.class.findUnique({
    where: { id: classId },
  });

  if (!classInfo || !classInfo.isActive) {
    return NextResponse.json(
      { error: "Clasa nu exista sau nu este activa" },
      { status: 404 }
    );
  }

  // Check user has active subscription with sessions remaining
  const now = new Date();
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      endDate: { gte: now },
    },
    include: { package: true },
    orderBy: { endDate: "desc" },
  });

  if (!subscription) {
    return NextResponse.json(
      { error: "Nu ai un abonament activ. Achizitioneaza un pachet pentru a rezerva." },
      { status: 403 }
    );
  }

  if (
    subscription.sessionsLeft !== null &&
    subscription.sessionsLeft <= 0
  ) {
    return NextResponse.json(
      { error: "Nu mai ai sedinte disponibile in abonamentul curent." },
      { status: 403 }
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Count existing reservations for this class+date
      const count = await tx.reservation.count({
        where: { classId, date: reservationDate },
      });

      if (count >= classInfo.capacity) {
        throw new Error("Clasa este plina");
      }

      // Check duplicate reservation
      const existing = await tx.reservation.findUnique({
        where: {
          userId_classId_date: {
            userId,
            classId,
            date: reservationDate,
          },
        },
      });

      if (existing) {
        throw new Error("Ai deja o rezervare pentru aceasta clasa");
      }

      // Decrement sessions if not unlimited
      if (subscription.sessionsLeft !== null) {
        await tx.subscription.update({
          where: { id: subscription.id },
          data: { sessionsLeft: { decrement: 1 } },
        });
      }

      // Create reservation
      return tx.reservation.create({
        data: {
          userId,
          classId,
          date: reservationDate,
        },
        include: {
          class: {
            include: { trainer: { select: { id: true, name: true } } },
          },
        },
      });
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Eroare la crearea rezervarii";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
