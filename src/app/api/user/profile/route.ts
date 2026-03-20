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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        accounts: {
          select: { provider: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilizatorul nu a fost gasit" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Eroare la incarcarea profilului" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Neautorizat" },
        { status: 401 }
      );
    }

    const { name, phone, image } = await req.json();

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name: name || null }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(image !== undefined && { image: image || null }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        accounts: {
          select: { provider: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Eroare la actualizarea profilului" },
      { status: 500 }
    );
  }
}
