"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, Clock, Trash2, Plus, ChevronRight } from "lucide-react";

interface Trainer {
  id: string;
  name: string;
}

interface ClassInfo {
  id: string;
  name: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  trainer: Trainer | null;
}

interface Reservation {
  id: string;
  date: string;
  attended: boolean;
  class: ClassInfo;
}

interface AvailableClass extends ClassInfo {
  spotsRemaining: number;
}

const DAY_NAMES = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sam", "Dum"];
const FULL_DAY_NAMES = [
  "Luni",
  "Marti",
  "Miercuri",
  "Joi",
  "Vineri",
  "Sambata",
  "Duminica",
];

function getNext7Days(): { date: Date; label: string; dayOfWeek: number }[] {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay() === 0 ? 6 : d.getDay() - 1; // Convert JS Sunday=0 to schema Monday=0
    days.push({
      date: d,
      label: `${DAY_NAMES[dayOfWeek]} ${d.getDate()}`,
      dayOfWeek,
    });
  }
  return days;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ro-RO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function canCancel(dateStr: string, startTime: string): boolean {
  const [hours, minutes] = startTime.split(":").map(Number);
  const classDateTime = new Date(dateStr);
  classDateTime.setHours(hours, minutes, 0, 0);
  const now = new Date();
  const diff = classDateTime.getTime() - now.getTime();
  return diff > 2 * 60 * 60 * 1000; // >2 hours
}

async function fetchReservations(): Promise<{
  upcoming: Reservation[];
  past: Reservation[];
}> {
  const res = await fetch("/api/reservations");
  if (!res.ok) throw new Error("Eroare la incarcarea rezervarilor");
  return res.json();
}

async function fetchAvailableClasses(
  dayOfWeek: number,
  date: string
): Promise<AvailableClass[]> {
  const res = await fetch(
    `/api/reservations?availableFor=${dayOfWeek}&date=${date}`
  );
  if (!res.ok) throw new Error("Eroare la incarcarea claselor");
  return res.json();
}

export default function RezervariPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [showNewFlow, setShowNewFlow] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState<{
    date: Date;
    dayOfWeek: number;
  } | null>(null);
  const [selectedClass, setSelectedClass] = useState<AvailableClass | null>(
    null
  );

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["reservations"],
    queryFn: fetchReservations,
  });

  const dateStr = selectedDay
    ? selectedDay.date.toISOString().split("T")[0]
    : "";

  const {
    data: availableClasses,
    isLoading: classesLoading,
  } = useQuery({
    queryKey: ["availableClasses", selectedDay?.dayOfWeek, dateStr],
    queryFn: () => fetchAvailableClasses(selectedDay!.dayOfWeek, dateStr),
    enabled: !!selectedDay && step === 2,
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Eroare la anulare");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Rezervare anulata cu succes");
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const createMutation = useMutation({
    mutationFn: async ({
      classId,
      date,
    }: {
      classId: string;
      date: string;
    }) => {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, date }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Eroare la rezervare");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Rezervare confirmata!");
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      resetFlow();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const resetFlow = () => {
    setShowNewFlow(false);
    setStep(1);
    setSelectedDay(null);
    setSelectedClass(null);
  };

  const days = getNext7Days();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Rezervari</h1>
        {!showNewFlow && (
          <button
            onClick={() => setShowNewFlow(true)}
            className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-goldHover"
          >
            <Plus className="h-4 w-4" />
            Rezervare Noua
          </button>
        )}
      </div>

      {/* New Reservation Flow */}
      {showNewFlow && (
        <div className="rounded-xl border border-gold/30 bg-cardBg p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-gold">
              Rezervare Noua
            </h2>
            <button
              onClick={resetFlow}
              className="text-sm text-grayText hover:text-white"
            >
              Anuleaza
            </button>
          </div>

          {/* Step indicators */}
          <div className="mb-5 flex items-center gap-2 text-xs text-grayText">
            <span className={step >= 1 ? "text-gold" : ""}>1. Zi</span>
            <ChevronRight className="h-3 w-3" />
            <span className={step >= 2 ? "text-gold" : ""}>2. Clasa</span>
            <ChevronRight className="h-3 w-3" />
            <span className={step >= 3 ? "text-gold" : ""}>3. Confirmare</span>
          </div>

          {/* Step 1: Pick a date */}
          {step === 1 && (
            <div>
              <p className="mb-3 text-sm text-grayText">
                Alege o zi din urmatoarele 7 zile:
              </p>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <button
                    key={day.date.toISOString()}
                    onClick={() => {
                      setSelectedDay({
                        date: day.date,
                        dayOfWeek: day.dayOfWeek,
                      });
                      setStep(2);
                    }}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition-colors hover:border-gold hover:text-gold"
                  >
                    <div className="text-xs text-grayText">
                      {FULL_DAY_NAMES[day.dayOfWeek]}
                    </div>
                    <div className="mt-0.5 text-lg font-bold">
                      {day.date.getDate()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Pick a class */}
          {step === 2 && selectedDay && (
            <div>
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedDay(null);
                }}
                className="mb-3 text-sm text-gold hover:underline"
              >
                &larr; Inapoi la alegerea zilei
              </button>
              <p className="mb-3 text-sm text-grayText">
                Clase disponibile pentru{" "}
                <span className="text-white">
                  {FULL_DAY_NAMES[selectedDay.dayOfWeek]},{" "}
                  {selectedDay.date.getDate()}{" "}
                  {selectedDay.date.toLocaleDateString("ro-RO", {
                    month: "long",
                  })}
                </span>
                :
              </p>
              {classesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse rounded-lg bg-white/5"
                    />
                  ))}
                </div>
              ) : availableClasses && availableClasses.length > 0 ? (
                <div className="space-y-2">
                  {availableClasses.map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => {
                        setSelectedClass(cls);
                        setStep(3);
                      }}
                      disabled={cls.spotsRemaining <= 0}
                      className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                        cls.spotsRemaining <= 0
                          ? "cursor-not-allowed border-white/5 bg-white/5 opacity-50"
                          : "border-white/10 bg-white/5 hover:border-gold"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{cls.name}</p>
                        <p className="text-sm text-grayText">
                          {cls.startTime} - {cls.endTime}
                          {cls.trainer && ` • ${cls.trainer.name}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-sm font-medium ${
                            cls.spotsRemaining <= 3
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {cls.spotsRemaining <= 0
                            ? "Plin"
                            : `${cls.spotsRemaining} locuri`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-grayText">
                  Nu exista clase disponibile in aceasta zi.
                </p>
              )}
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && selectedDay && selectedClass && (
            <div>
              <button
                onClick={() => {
                  setStep(2);
                  setSelectedClass(null);
                }}
                className="mb-3 text-sm text-gold hover:underline"
              >
                &larr; Inapoi la alegerea clasei
              </button>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <h3 className="font-heading text-lg font-bold">
                  {selectedClass.name}
                </h3>
                <div className="mt-2 space-y-1 text-sm text-grayText">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {FULL_DAY_NAMES[selectedDay.dayOfWeek]},{" "}
                    {selectedDay.date.toLocaleDateString("ro-RO", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {selectedClass.startTime} - {selectedClass.endTime}
                  </p>
                  {selectedClass.trainer && (
                    <p>Antrenor: {selectedClass.trainer.name}</p>
                  )}
                </div>
                <button
                  onClick={() =>
                    createMutation.mutate({
                      classId: selectedClass.id,
                      date: dateStr,
                    })
                  }
                  disabled={createMutation.isPending}
                  className="mt-4 w-full rounded-lg bg-gold py-2.5 text-sm font-semibold text-black transition-colors hover:bg-goldHover disabled:opacity-50"
                >
                  {createMutation.isPending
                    ? "Se proceseaza..."
                    : "Confirma Rezervarea"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-white/5 p-1">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "upcoming"
              ? "bg-gold text-black"
              : "text-grayText hover:text-white"
          }`}
        >
          Urmatoare
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "past"
              ? "bg-gold text-black"
              : "text-grayText hover:text-white"
          }`}
        >
          Trecute
        </button>
      </div>

      {/* Reservation Lists */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-cardBg"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {activeTab === "upcoming" &&
            (data?.upcoming && data.upcoming.length > 0 ? (
              data.upcoming.map((res) => (
                <div
                  key={res.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-cardBg p-4"
                >
                  <div>
                    <p className="font-medium">{res.class.name}</p>
                    <p className="text-sm text-grayText">
                      {formatDate(res.date)} &bull; {res.class.startTime} -{" "}
                      {res.class.endTime}
                    </p>
                    {res.class.trainer && (
                      <p className="text-xs text-gold">
                        {res.class.trainer.name}
                      </p>
                    )}
                  </div>
                  {canCancel(res.date, res.class.startTime) && (
                    <button
                      onClick={() => cancelMutation.mutate(res.id)}
                      disabled={cancelMutation.isPending}
                      className="flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
                      title="Anuleaza rezervarea"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Anuleaza
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-white/10 bg-cardBg p-8 text-center">
                <CalendarDays className="mx-auto mb-2 h-8 w-8 text-grayText" />
                <p className="text-sm text-grayText">
                  Nu ai rezervari viitoare
                </p>
              </div>
            ))}

          {activeTab === "past" &&
            (data?.past && data.past.length > 0 ? (
              data.past.map((res) => (
                <div
                  key={res.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-cardBg p-4 opacity-70"
                >
                  <div>
                    <p className="font-medium">{res.class.name}</p>
                    <p className="text-sm text-grayText">
                      {formatDate(res.date)} &bull; {res.class.startTime} -{" "}
                      {res.class.endTime}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      res.attended
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {res.attended ? "Participat" : "Absent"}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-white/10 bg-cardBg p-8 text-center">
                <CalendarDays className="mx-auto mb-2 h-8 w-8 text-grayText" />
                <p className="text-sm text-grayText">
                  Nu ai rezervari trecute
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
