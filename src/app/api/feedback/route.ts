import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, rating, message } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Numele este obligatoriu" },
        { status: 400 }
      );
    }

    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Adresa de email nu este valida" },
        { status: 400 }
      );
    }

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating-ul trebuie sa fie intre 1 si 5" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Mesajul este obligatoriu" },
        { status: 400 }
      );
    }

    await prisma.feedbackMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        rating,
        message: message.trim(),
      },
    });

    return NextResponse.json(
      { message: "Feedback-ul a fost trimis cu succes" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Feedback form error:", error);
    return NextResponse.json(
      { error: "A aparut o eroare. Incearca din nou." },
      { status: 500 }
    );
  }
}
