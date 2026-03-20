import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Neautorizat" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Parola curenta si parola noua sunt obligatorii" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Parola noua trebuie sa aiba minim 8 caractere" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user?.password) {
      return NextResponse.json(
        {
          error:
            "Contul tau nu are o parola setata. Ai folosit Google sau Facebook pentru autentificare.",
        },
        { status: 400 }
      );
    }

    const isValid = await compare(currentPassword, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Parola curenta este incorecta" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(newPassword, 12);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Parola a fost schimbata cu succes" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Eroare la schimbarea parolei" },
      { status: 500 }
    );
  }
}
