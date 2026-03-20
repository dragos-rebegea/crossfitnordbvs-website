import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

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

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Mesajul este obligatoriu" },
        { status: 400 }
      );
    }

    const fullMessage = subject
      ? `[Subiect: ${subject.trim()}]\n\n${message.trim()}`
      : message.trim();

    await prisma.feedbackMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        message: fullMessage,
      },
    });

    return NextResponse.json(
      { message: "Mesajul a fost trimis cu succes" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "A aparut o eroare. Incearca din nou." },
      { status: 500 }
    );
  }
}
