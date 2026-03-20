import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function withAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Neautorizat" }, { status: 401 }), session: null };
  }

  if (session.user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Acces interzis" }, { status: 403 }), session: null };
  }

  return { error: null, session };
}
