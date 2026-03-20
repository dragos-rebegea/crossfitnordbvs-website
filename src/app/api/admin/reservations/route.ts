import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/admin";

// GET /api/admin/reservations?date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const dateStr = req.nextUrl.searchParams.get("date");
  if (!dateStr) {
    return NextResponse.json({ error: "Parametrul date este obligatoriu" }, { status: 400 });
  }

  const date = new Date(dateStr + "T00:00:00");
  // 0=Sunday in JS, but schema uses 0=Monday
  const jsDay = date.getDay(); // 0=Sun,1=Mon...6=Sat
  const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1; // convert to 0=Mon...6=Sun

  const startOfDay = new Date(dateStr + "T00:00:00");
  const endOfDay = new Date(dateStr + "T23:59:59.999");

  const classes = await prisma.class.findMany({
    where: { dayOfWeek, isActive: true },
    include: {
      trainer: true,
      reservations: {
        where: {
          date: { gte: startOfDay, lte: endOfDay },
        },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json(classes);
}

// PATCH /api/admin/reservations - update attended status
export async function PATCH(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const body = await req.json();
  const { reservationId, attended } = body;

  if (!reservationId || typeof attended !== "boolean") {
    return NextResponse.json({ error: "reservationId si attended sunt obligatorii" }, { status: 400 });
  }

  const reservation = await prisma.reservation.update({
    where: { id: reservationId },
    data: { attended },
  });

  return NextResponse.json(reservation);
}
