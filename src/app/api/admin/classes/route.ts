import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/admin";

export async function GET() {
  const { error } = await withAdmin();
  if (error) return error;

  const classes = await prisma.class.findMany({
    include: { trainer: { select: { id: true, name: true } } },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return NextResponse.json(classes);
}

export async function POST(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const { name, dayOfWeek, startTime, endTime, capacity, trainerId } =
    await req.json();

  if (!name || dayOfWeek === undefined || !startTime || !endTime) {
    return NextResponse.json(
      { error: "Campuri obligatorii lipsa" },
      { status: 400 }
    );
  }

  const newClass = await prisma.class.create({
    data: {
      name,
      dayOfWeek: Number(dayOfWeek),
      startTime,
      endTime,
      capacity: capacity ? Number(capacity) : 20,
      trainerId: trainerId || null,
    },
    include: { trainer: { select: { id: true, name: true } } },
  });

  return NextResponse.json(newClass, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const { classId, name, dayOfWeek, startTime, endTime, capacity, trainerId } =
    await req.json();

  if (!classId) {
    return NextResponse.json(
      { error: "classId este obligatoriu" },
      { status: 400 }
    );
  }

  const updated = await prisma.class.update({
    where: { id: classId },
    data: {
      ...(name !== undefined && { name }),
      ...(dayOfWeek !== undefined && { dayOfWeek: Number(dayOfWeek) }),
      ...(startTime !== undefined && { startTime }),
      ...(endTime !== undefined && { endTime }),
      ...(capacity !== undefined && { capacity: Number(capacity) }),
      ...(trainerId !== undefined && { trainerId: trainerId || null }),
    },
    include: { trainer: { select: { id: true, name: true } } },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");

  if (!classId) {
    return NextResponse.json(
      { error: "classId este obligatoriu" },
      { status: 400 }
    );
  }

  await prisma.class.delete({ where: { id: classId } });

  return NextResponse.json({ success: true });
}
