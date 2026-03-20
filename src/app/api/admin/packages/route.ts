import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/admin";

export async function GET() {
  const { error } = await withAdmin();
  if (error) return error;

  const packages = await prisma.package.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(packages);
}

export async function POST(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const body = await req.json();
  const { name, type, sessions, duration, price, isPopular, order } = body;

  const pkg = await prisma.package.create({
    data: {
      name,
      type,
      sessions: type === "SESSION" ? sessions : null,
      duration,
      price,
      isPopular: isPopular ?? false,
      order: order ?? 0,
    },
  });

  return NextResponse.json(pkg, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const body = await req.json();
  const { id, name, type, sessions, duration, price, isPopular, order } = body;

  if (!id) {
    return NextResponse.json({ error: "ID lipsă" }, { status: 400 });
  }

  const pkg = await prisma.package.update({
    where: { id },
    data: {
      name,
      type,
      sessions: type === "SESSION" ? sessions : null,
      duration,
      price,
      isPopular: isPopular ?? false,
      order: order ?? 0,
    },
  });

  return NextResponse.json(pkg);
}

export async function DELETE(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID lipsă" }, { status: 400 });
  }

  const pkg = await prisma.package.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json(pkg);
}
