import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ReservationWithClass {
  id: string;
  date: Date;
  attended: boolean;
  class: {
    name: string;
    startTime: string;
    endTime: string;
    trainer: { name: string } | null;
  };
}

export const dynamic = "force-dynamic";

export default async function IstoricPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const reservations: ReservationWithClass[] = await prisma.reservation.findMany({
    where: {
      userId: session.user.id,
      attended: true,
    },
    include: {
      class: {
        include: { trainer: true },
      },
    },
    orderBy: { date: "desc" },
  });

  // Stats
  const totalSessions = reservations.length;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthSessions = reservations.filter(
    (r: { date: Date }) => new Date(r.date) >= startOfMonth
  ).length;

  // Calculate streak (consecutive days with at least one session)
  let streak = 0;
  if (reservations.length > 0) {
    const dateStrings: string[] = Array.from(
      new Set<string>(
        reservations.map((r: { date: Date }) => {
          const d = new Date(r.date);
          return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        })
      )
    );
    const uniqueDates = dateStrings
      .map((s) => {
        const [y, m, d] = s.split("-").map(Number);
        return new Date(y, m, d);
      })
      .sort((a, b) => b.getTime() - a.getTime());

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Streak starts from today or yesterday
    const firstDate = uniqueDates[0];
    firstDate.setHours(0, 0, 0, 0);

    if (
      firstDate.getTime() === today.getTime() ||
      firstDate.getTime() === yesterday.getTime()
    ) {
      streak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prev = uniqueDates[i - 1];
        const curr = uniqueDates[i];
        const diffDays = Math.round(
          (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold sm:text-3xl">
        <span className="text-grayText">ISTORICUL </span>
        <span className="text-gold">ANTRENAMENTELOR</span>
      </h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-cardBg p-5 text-center">
          <p className="text-3xl font-bold text-gold">{totalSessions}</p>
          <p className="mt-1 text-sm text-grayText">Total sedinte</p>
        </div>
        <div className="rounded-xl bg-cardBg p-5 text-center">
          <p className="text-3xl font-bold text-gold">{thisMonthSessions}</p>
          <p className="mt-1 text-sm text-grayText">Luna aceasta</p>
        </div>
        <div className="rounded-xl bg-cardBg p-5 text-center">
          <p className="text-3xl font-bold text-gold">
            {streak} {streak === 1 ? "zi" : "zile"}
          </p>
          <p className="mt-1 text-sm text-grayText">Serie curenta</p>
        </div>
      </div>

      {/* Reservation list */}
      {reservations.length > 0 ? (
        <div className="space-y-3">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-cardBg p-4"
            >
              <div className="space-y-1">
                <p className="font-medium text-white">
                  {reservation.class.name}
                </p>
                <p className="text-sm text-grayText">
                  {formatDate(reservation.date)} &middot;{" "}
                  {reservation.class.startTime} - {reservation.class.endTime}
                </p>
                {reservation.class.trainer && (
                  <p className="text-sm text-grayText">
                    Antrenor: {reservation.class.trainer.name}
                  </p>
                )}
              </div>
              <Badge className="bg-green-600 text-white">Prezent</Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gold/30 bg-cardBg p-8 text-center">
          <p className="text-grayText">
            Nu ai participat inca la niciun antrenament.
          </p>
        </div>
      )}
    </div>
  );
}
