import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/admin";

// GET /api/admin/gallery
export async function GET() {
  const { error } = await withAdmin();
  if (error) return error;

  const images = await prisma.galleryImage.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(images);
}

// POST /api/admin/gallery - create one or multiple images
export async function POST(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const body = await req.json();

  // Support bulk: { images: [{ url, caption?, category?, order? }] }
  // or single: { url, caption?, category?, order? }
  const items = Array.isArray(body.images) ? body.images : [body];

  const created = await prisma.$transaction(
    items.map((item: { url: string; caption?: string; category?: string; order?: number }) =>
      prisma.galleryImage.create({
        data: {
          url: item.url,
          caption: item.caption || null,
          category: item.category || null,
          order: item.order ?? 0,
        },
      })
    )
  );

  return NextResponse.json(created, { status: 201 });
}

// PUT /api/admin/gallery - update image
export async function PUT(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const body = await req.json();
  const { id, caption, category, order } = body;

  if (!id) {
    return NextResponse.json({ error: "ID-ul este obligatoriu" }, { status: 400 });
  }

  const updated = await prisma.galleryImage.update({
    where: { id },
    data: {
      ...(caption !== undefined && { caption }),
      ...(category !== undefined && { category }),
      ...(order !== undefined && { order }),
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/admin/gallery
export async function DELETE(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "ID-ul este obligatoriu" }, { status: 400 });
  }

  await prisma.galleryImage.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
