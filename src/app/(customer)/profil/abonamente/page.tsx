"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface Package {
  id: string;
  name: string;
  type: "SESSION" | "UNLIMITED";
  sessions: number | null;
  duration: number;
}

interface Subscription {
  id: string;
  status: "ACTIVE" | "FROZEN" | "EXPIRED" | "CANCELLED";
  sessionsLeft: number | null;
  startDate: string;
  endDate: string;
  frozenAt: string | null;
  frozenDays: number;
  createdAt: string;
  package: Package;
}

const statusConfig: Record<
  Subscription["status"],
  { label: string; className: string }
> = {
  ACTIVE: { label: "Activ", className: "bg-green-500 text-white" },
  FROZEN: { label: "Inghetat", className: "bg-blue-500 text-white" },
  EXPIRED: { label: "Expirat", className: "bg-red-500 text-white" },
  CANCELLED: { label: "Anulat", className: "bg-gray-500 text-white" },
};

async function fetchSubscriptions(): Promise<Subscription[]> {
  const res = await fetch("/api/subscriptions");
  if (!res.ok) throw new Error("Eroare la incarcarea abonamentelor");
  return res.json();
}

async function toggleFreeze(id: string): Promise<Subscription> {
  const res = await fetch(`/api/subscriptions/${id}/freeze`, {
    method: "POST",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Eroare la procesare");
  }
  return res.json();
}

export default function AbonamentePage() {
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
  });

  const freezeMutation = useMutation({
    mutationFn: toggleFreeze,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success(
        data.status === "FROZEN"
          ? "Abonamentul a fost inghetat"
          : "Abonamentul a fost reactivat"
      );
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  const active = subscriptions?.find(
    (s) => s.status === "ACTIVE" || s.status === "FROZEN"
  );
  const history = subscriptions?.filter(
    (s) => s.status === "EXPIRED" || s.status === "CANCELLED"
  );

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold sm:text-3xl">
        <span className="text-grayText">ABONAMENTELE </span>
        <span className="text-gold">MELE</span>
      </h1>

      {active ? (
        <div className="rounded-xl border border-gold/20 bg-cardBg p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                {active.package.name}
              </h2>
              <Badge
                className={`mt-2 ${statusConfig[active.status].className}`}
              >
                {statusConfig[active.status].label}
              </Badge>
            </div>
            <Button
              onClick={() => freezeMutation.mutate(active.id)}
              disabled={freezeMutation.isPending}
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              {freezeMutation.isPending
                ? "Se proceseaza..."
                : active.status === "FROZEN"
                  ? "Reactiveaza"
                  : "Ingheata"}
            </Button>
          </div>

          {/* Sessions progress */}
          <div className="mt-6">
            {active.package.type === "SESSION" &&
            active.sessionsLeft !== null ? (
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-grayText">Sedinte ramase</span>
                  <span className="font-semibold text-white">
                    {active.sessionsLeft} / {active.package.sessions}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-darkBg">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-500"
                    style={{
                      width: `${
                        active.package.sessions
                          ? (active.sessionsLeft / active.package.sessions) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-grayText">Sedinte:</span>
                <span className="font-semibold text-gold">Nelimitat</span>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="text-sm text-grayText">Data inceput</span>
              <p className="font-medium text-white">
                {formatDate(active.startDate)}
              </p>
            </div>
            <div>
              <span className="text-sm text-grayText">Data expirare</span>
              <p className="font-medium text-white">
                {formatDate(active.endDate)}
              </p>
            </div>
          </div>

          {active.frozenDays > 0 && (
            <p className="mt-4 text-sm text-grayText">
              Total zile inghetate: {active.frozenDays}
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gold/30 bg-cardBg p-8 text-center">
          <p className="text-lg text-grayText">
            Nu ai un abonament activ in acest moment.
          </p>
          <Link href="/pachete">
            <Button className="mt-4 bg-brandRed text-white hover:bg-brandRedDark">
              Vezi pachetele disponibile
            </Button>
          </Link>
        </div>
      )}

      {/* Subscription history */}
      {history && history.length > 0 && (
        <div>
          <h2 className="mb-4 font-heading text-lg font-bold text-white">
            Istoric abonamente
          </h2>
          <div className="space-y-3">
            {history.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-cardBg p-4"
              >
                <div>
                  <p className="font-medium text-white">
                    {sub.package.name}
                  </p>
                  <p className="text-sm text-grayText">
                    {formatDate(sub.startDate)} - {formatDate(sub.endDate)}
                  </p>
                </div>
                <Badge
                  className={statusConfig[sub.status].className}
                >
                  {statusConfig[sub.status].label}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
