"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
}

interface Reservation {
  id: string;
  userId: string;
  attended: boolean;
  createdAt: string;
  user: User;
}

interface Trainer {
  id: string;
  name: string;
}

interface ClassWithReservations {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  capacity: number;
  trainer: Trainer | null;
  reservations: Reservation[];
}

const DAY_NAMES = ["Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata", "Duminica"];

export default function AdminRezervariPage() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [classes, setClasses] = useState<ClassWithReservations[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  useEffect(() => {
    if (!date) return;
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  async function fetchReservations() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reservations?date=${date}`);
      if (!res.ok) throw new Error("Eroare la incarcarea rezervarilor");
      const data = await res.json();
      setClasses(data);
    } catch {
      toast.error("Nu s-au putut incarca rezervarile");
    } finally {
      setLoading(false);
    }
  }

  async function toggleAttendance(reservationId: string, attended: boolean) {
    try {
      const res = await fetch("/api/admin/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId, attended }),
      });
      if (!res.ok) throw new Error();
      setClasses((prev) =>
        prev.map((cls) => ({
          ...cls,
          reservations: cls.reservations.map((r) =>
            r.id === reservationId ? { ...r, attended } : r
          ),
        }))
      );
      toast.success(attended ? "Prezenta confirmata" : "Prezenta anulata");
    } catch {
      toast.error("Eroare la actualizarea prezentei");
    }
  }

  const selectedDate = new Date(date + "T00:00:00");
  const jsDay = selectedDate.getDay();
  const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-gold">Rezervari</h1>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-grayText">Selecteaza data:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-white/10 bg-cardBg px-4 py-2 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <span className="text-sm text-grayText">{DAY_NAMES[dayOfWeek]}</span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-grayText">Se incarca...</div>
      ) : classes.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-cardBg p-8 text-center text-grayText">
          Nicio clasa programata pentru aceasta zi.
        </div>
      ) : (
        <div className="space-y-4">
          {classes.map((cls) => {
            const isExpanded = expandedClass === cls.id;
            const count = cls.reservations.length;
            const attendedCount = cls.reservations.filter((r) => r.attended).length;

            return (
              <div
                key={cls.id}
                className="rounded-xl border border-white/10 bg-cardBg overflow-hidden"
              >
                {/* Class header */}
                <button
                  onClick={() => setExpandedClass(isExpanded ? null : cls.id)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="font-heading text-lg font-bold text-gold">
                        {cls.startTime}
                      </p>
                      <p className="text-xs text-grayText">{cls.endTime}</p>
                    </div>
                    <div>
                      <p className="font-heading text-lg font-bold">{cls.name}</p>
                      {cls.trainer && (
                        <p className="text-sm text-grayText">{cls.trainer.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        <span className={count >= cls.capacity ? "text-red-400" : "text-green-400"}>
                          {count}
                        </span>
                        <span className="text-grayText"> / {cls.capacity}</span>
                      </p>
                      <p className="text-xs text-grayText">
                        {attendedCount} prezenti
                      </p>
                    </div>
                    <svg
                      className={`h-5 w-5 text-grayText transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Reservations list */}
                {isExpanded && (
                  <div className="border-t border-white/10">
                    {cls.reservations.length === 0 ? (
                      <p className="px-5 py-4 text-sm text-grayText">
                        Nicio rezervare pentru aceasta clasa.
                      </p>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/5 text-left text-xs text-grayText">
                            <th className="px-5 py-2 font-medium">Prezent</th>
                            <th className="px-5 py-2 font-medium">Nume</th>
                            <th className="px-5 py-2 font-medium">Email</th>
                            <th className="px-5 py-2 font-medium">Telefon</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cls.reservations.map((res) => (
                            <tr
                              key={res.id}
                              className="border-b border-white/5 last:border-0"
                            >
                              <td className="px-5 py-3">
                                <input
                                  type="checkbox"
                                  checked={res.attended}
                                  onChange={(e) =>
                                    toggleAttendance(res.id, e.target.checked)
                                  }
                                  className="h-4 w-4 rounded border-white/20 bg-transparent text-gold accent-gold focus:ring-gold"
                                />
                              </td>
                              <td className="px-5 py-3 text-sm font-medium">
                                {res.user.name || "—"}
                              </td>
                              <td className="px-5 py-3 text-sm text-grayText">
                                {res.user.email}
                              </td>
                              <td className="px-5 py-3 text-sm text-grayText">
                                {res.user.phone || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
