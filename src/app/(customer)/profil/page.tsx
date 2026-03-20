import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const userId = (session.user as { id: string }).id;

  const now = new Date();

  // Fetch active subscription with package info
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      endDate: { gte: now },
    },
    include: { package: true },
    orderBy: { endDate: "desc" },
  });

  // Fetch upcoming reservations
  const upcomingReservations = await prisma.reservation.findMany({
    where: {
      userId,
      date: { gte: now },
    },
    include: {
      class: {
        include: { trainer: true },
      },
    },
    orderBy: { date: "asc" },
    take: 5,
  });

  // Fetch recent past reservations
  const recentReservations = await prisma.reservation.findMany({
    where: {
      userId,
      date: { lt: now },
    },
    include: {
      class: {
        include: { trainer: true },
      },
    },
    orderBy: { date: "desc" },
    take: 5,
  });

  const nextReservation = upcomingReservations[0] ?? null;

  // Calculate days remaining on subscription
  const daysRemaining = subscription
    ? Math.max(
        0,
        Math.ceil(
          (subscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  // Calculate progress for session-based subscriptions
  const totalSessions = subscription?.package.sessions ?? null;
  const sessionsLeft = subscription?.sessionsLeft ?? null;
  const sessionsUsed =
    totalSessions !== null && sessionsLeft !== null
      ? totalSessions - sessionsLeft
      : null;
  const sessionProgress =
    totalSessions !== null && sessionsUsed !== null
      ? (sessionsUsed / totalSessions) * 100
      : null;

  // Duration progress (days elapsed / total days)
  const totalDays = subscription?.package.duration ?? null;
  const durationProgress =
    totalDays !== null ? ((totalDays - daysRemaining) / totalDays) * 100 : null;

  const formatDate = (date: Date) =>
    date.toLocaleDateString("ro-RO", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Dashboard</h1>

      {!subscription && (
        <div className="rounded-xl border border-gold/30 bg-gold/5 p-6 text-center">
          <p className="mb-2 text-lg font-medium">
            Nu ai un abonament activ
          </p>
          <p className="mb-4 text-sm text-grayText">
            Alege un pachet pentru a incepe antrenamentele
          </p>
          <Link
            href="/pachete"
            className="inline-block rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-goldHover"
          >
            Vezi Pachete
          </Link>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Abonament Activ */}
        {subscription && (
          <div className="rounded-xl border border-white/10 bg-cardBg p-5">
            <h2 className="mb-3 text-sm font-medium text-grayText">
              Abonament Activ
            </h2>
            <p className="mb-1 font-heading text-lg font-bold text-gold">
              {subscription.package.name}
            </p>
            <div className="mb-3 space-y-1 text-sm text-grayText">
              <p>
                Sedinte:{" "}
                <span className="text-white">
                  {sessionsLeft !== null
                    ? `${sessionsLeft} ramase din ${totalSessions}`
                    : "Nelimitat"}
                </span>
              </p>
              <p>
                Zile ramase:{" "}
                <span className="text-white">{daysRemaining}</span>
              </p>
            </div>
            {/* Progress bar */}
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gold transition-all"
                style={{
                  width: `${sessionProgress ?? durationProgress ?? 0}%`,
                }}
              />
            </div>
            <p className="mt-1 text-right text-xs text-grayText">
              {sessionProgress !== null
                ? `${sessionsUsed}/${totalSessions} sedinte`
                : durationProgress !== null
                  ? `${Math.round(durationProgress)}% din perioada`
                  : ""}
            </p>
          </div>
        )}

        {/* Urmatoarea Clasa */}
        <div className="rounded-xl border border-white/10 bg-cardBg p-5">
          <h2 className="mb-3 text-sm font-medium text-grayText">
            Urmatoarea Clasa
          </h2>
          {nextReservation ? (
            <div>
              <p className="font-heading text-lg font-bold">
                {nextReservation.class.name}
              </p>
              <p className="text-sm text-grayText">
                {formatDate(nextReservation.date)} &bull;{" "}
                {nextReservation.class.startTime} -{" "}
                {nextReservation.class.endTime}
              </p>
              {nextReservation.class.trainer && (
                <p className="mt-1 text-sm text-gold">
                  {nextReservation.class.trainer.name}
                </p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-grayText">Nicio rezervare</p>
              <Link
                href="/profil/rezervari"
                className="mt-2 inline-block text-sm font-medium text-gold hover:underline"
              >
                Rezerva o clasa
              </Link>
            </div>
          )}
        </div>

        {/* Rezervari Recente */}
        <div className="rounded-xl border border-white/10 bg-cardBg p-5 md:col-span-2 xl:col-span-1">
          <h2 className="mb-3 text-sm font-medium text-grayText">
            Rezervari Recente
          </h2>
          {recentReservations.length > 0 ? (
            <ul className="space-y-2">
              {recentReservations.map((res) => (
                <li
                  key={res.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <span className="font-medium">{res.class.name}</span>
                    <span className="ml-2 text-grayText">
                      {res.class.startTime}
                    </span>
                  </div>
                  <span className="text-grayText">
                    {formatDate(res.date)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-grayText">Nicio rezervare recenta</p>
          )}
        </div>
      </div>
    </div>
  );
}
