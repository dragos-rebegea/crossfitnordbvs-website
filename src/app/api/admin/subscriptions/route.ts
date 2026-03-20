import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/admin";

export async function GET(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.user = {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  const subscriptions = await prisma.subscription.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
      package: { select: { id: true, name: true, type: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(subscriptions);
}

export async function POST(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const body = await req.json();
  const { userId, packageId, startDate } = body;

  const pkg = await prisma.package.findUnique({ where: { id: packageId } });
  if (!pkg) {
    return NextResponse.json({ error: "Pachet inexistent" }, { status: 400 });
  }

  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + pkg.duration);

  const subscription = await prisma.subscription.create({
    data: {
      userId,
      packageId,
      startDate: start,
      endDate: end,
      sessionsLeft: pkg.type === "SESSION" ? pkg.sessions : null,
      status: "ACTIVE",
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      package: { select: { id: true, name: true, type: true } },
    },
  });

  return NextResponse.json(subscription, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { error } = await withAdmin();
  if (error) return error;

  const body = await req.json();
  const { id, status, sessionsLeft, freeze } = body;

  if (!id) {
    return NextResponse.json({ error: "ID lipsă" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};

  if (status !== undefined) {
    data.status = status;
  }

  if (sessionsLeft !== undefined) {
    data.sessionsLeft = sessionsLeft;
  }

  if (freeze === true) {
    data.status = "FROZEN";
    data.frozenAt = new Date();
  } else if (freeze === false) {
    const sub = await prisma.subscription.findUnique({ where: { id } });
    if (sub?.frozenAt) {
      const frozenDaysAdded = Math.ceil(
        (Date.now() - new Date(sub.frozenAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      data.frozenDays = sub.frozenDays + frozenDaysAdded;
      data.endDate = new Date(
        new Date(sub.endDate).getTime() + frozenDaysAdded * 24 * 60 * 60 * 1000
      );
    }
    data.status = "ACTIVE";
    data.frozenAt = null;
  }

  const subscription = await prisma.subscription.update({
    where: { id },
    data,
    include: {
      user: { select: { id: true, name: true, email: true } },
      package: { select: { id: true, name: true, type: true } },
    },
  });

  return NextResponse.json(subscription);
}
