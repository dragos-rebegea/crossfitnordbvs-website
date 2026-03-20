import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/admin";

export async function GET() {
  const { error } = await withAdmin();
  if (error) return error;

  const trainers = await prisma.trainer.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(trainers);
}

export async function POST(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const body = await req.json();
  const { name, bio, specialties, image, order } = body;

  const trainer = await prisma.trainer.create({
    data: {
      name,
      bio: bio || null,
      specialties: specialties || [],
      image: image || null,
      order: order ?? 0,
    },
  });

  return NextResponse.json(trainer, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const body = await req.json();
  const { id, name, bio, specialties, image, order } = body;

  if (!id) {
    return NextResponse.json({ error: "ID lipsă" }, { status: 400 });
  }

  const trainer = await prisma.trainer.update({
    where: { id },
    data: {
      name,
      bio: bio || null,
      specialties: specialties || [],
      image: image || null,
      order: order ?? 0,
    },
  });

  return NextResponse.json(trainer);
}

export async function DELETE(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID lipsă" }, { status: 400 });
  }

  await prisma.trainer.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
