"use client";

import { useState } from "react";

const DAY_NAMES = ["Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata", "Duminica"];

interface ClassItem {
  id: string;
  name: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  trainer: { name: string } | null;
}

interface ScheduleGridProps {
  classes: ClassItem[];
}

function ClassCard({ cls }: { cls: ClassItem }) {
  return (
    <div className="rounded-lg border border-gold/40 bg-cardBg p-3">
      <p className="font-heading text-sm font-bold text-gold">
        {cls.startTime} - {cls.endTime}
      </p>
      <h4 className="mt-1 font-heading text-sm font-bold text-white">
        {cls.name}
      </h4>
      {cls.trainer && (
        <p className="mt-0.5 text-xs text-grayText">{cls.trainer.name}</p>
      )}
      <p className="mt-1.5 text-xs text-grayText">
        <span className="text-gold font-medium">{cls.capacity}</span> locuri
      </p>
    </div>
  );
}

export default function ScheduleGrid({ classes }: ScheduleGridProps) {
  const [activeDay, setActiveDay] = useState(0);

  const classesByDay = DAY_NAMES.map((_, i) =>
    classes.filter((cls) => cls.dayOfWeek === i)
  );

  return (
    <>
      {/* Desktop: 7-column grid */}
      <div className="hidden lg:grid lg:grid-cols-7 gap-4">
        {DAY_NAMES.map((day, i) => (
          <div key={day}>
            <div className="mb-3 rounded-t-lg bg-cardBg py-2 text-center">
              <h3 className="font-heading text-sm font-bold text-gold">{day}</h3>
            </div>
            <div className="flex flex-col gap-2">
              {classesByDay[i].length > 0 ? (
                classesByDay[i].map((cls) => (
                  <ClassCard key={cls.id} cls={cls} />
                ))
              ) : (
                <p className="py-4 text-center text-xs text-grayText">
                  Nicio clasa
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: Tabs */}
      <div className="lg:hidden">
        <div className="flex overflow-x-auto gap-1 pb-2 scrollbar-hide">
          {DAY_NAMES.map((day, i) => (
            <button
              key={day}
              onClick={() => setActiveDay(i)}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-heading font-bold transition-colors ${
                activeDay === i
                  ? "bg-brandRed text-white"
                  : "bg-cardBg text-grayText hover:text-white"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {classesByDay[activeDay].length > 0 ? (
            classesByDay[activeDay].map((cls) => (
              <ClassCard key={cls.id} cls={cls} />
            ))
          ) : (
            <p className="py-8 text-center text-sm text-grayText">
              Nicio clasa programata
            </p>
          )}
        </div>
      </div>
    </>
  );
}
