import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/admin";

// GET /api/admin/feedback?isRead=true|false
export async function GET(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const isReadParam = req.nextUrl.searchParams.get("isRead");

  const where: { isRead?: boolean } = {};
  if (isReadParam === "true") where.isRead = true;
  if (isReadParam === "false") where.isRead = false;

  const feedback = await prisma.feedbackMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(feedback);
}

// PATCH /api/admin/feedback - mark as read
export async function PATCH(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "ID-ul este obligatoriu" }, { status: 400 });
  }

  const updated = await prisma.feedbackMessage.update({
    where: { id },
    data: { isRead: true },
  });

  return NextResponse.json(updated);
}
