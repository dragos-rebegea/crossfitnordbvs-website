import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Neautorizat" },
        { status: 401 }
      );
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: session.user.id },
      include: { package: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Subscriptions fetch error:", error);
    return NextResponse.json(
      { error: "Eroare la incarcarea abonamentelor" },
      { status: 500 }
    );
  }
}
