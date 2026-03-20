import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/admin";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// GET /api/admin/news
export async function GET() {
  const { error } = await withAdmin();
  if (error) return error;

  const articles = await prisma.newsArticle.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(articles);
}

// POST /api/admin/news
export async function POST(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const body = await req.json();
  const { title, content, excerpt, coverImage, published } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "Titlul si continutul sunt obligatorii" }, { status: 400 });
  }

  let slug = slugify(title);

  // Ensure unique slug
  const existing = await prisma.newsArticle.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const article = await prisma.newsArticle.create({
    data: {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      coverImage: coverImage || null,
      published: published ?? false,
      publishedAt: published ? new Date() : null,
    },
  });

  return NextResponse.json(article, { status: 201 });
}

// PUT /api/admin/news
export async function PUT(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const body = await req.json();
  const { id, title, content, excerpt, coverImage, published } = body;

  if (!id) {
    return NextResponse.json({ error: "ID-ul este obligatoriu" }, { status: 400 });
  }

  const existing = await prisma.newsArticle.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Articolul nu a fost gasit" }, { status: 404 });
  }

  // Regenerate slug if title changed
  let slug = existing.slug;
  if (title && title !== existing.title) {
    slug = slugify(title);
    const slugExists = await prisma.newsArticle.findFirst({
      where: { slug, id: { not: id } },
    });
    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  const wasPublished = existing.published;
  const isNowPublished = published ?? existing.published;

  const article = await prisma.newsArticle.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      slug,
      ...(content !== undefined && { content }),
      ...(excerpt !== undefined && { excerpt }),
      ...(coverImage !== undefined && { coverImage }),
      ...(published !== undefined && { published }),
      ...(!wasPublished && isNowPublished && { publishedAt: new Date() }),
    },
  });

  return NextResponse.json(article);
}

// DELETE /api/admin/news
export async function DELETE(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "ID-ul este obligatoriu" }, { status: 400 });
  }

  await prisma.newsArticle.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
