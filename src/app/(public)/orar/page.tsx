import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ScheduleGrid from "./ScheduleGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orar Saptamanal",
  description:
    "Consulta orarul saptamanal CrossFit Nord BVS. Clase de CrossFit, antrenamente de grup si sedinte individuale disponibile de Luni pana Duminica.",
};

export default async function OrarPage() {
  const classes = await prisma.class.findMany({
    where: { isActive: true },
    include: { trainer: true },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  const serialized = classes.map((cls) => ({
    id: cls.id,
    name: cls.name,
    dayOfWeek: cls.dayOfWeek,
    startTime: cls.startTime,
    endTime: cls.endTime,
    capacity: cls.capacity,
    trainer: cls.trainer ? { name: cls.trainer.name } : null,
  }));

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">
            <span className="text-grayText">ORAR </span>
            <span className="text-gold">SAPTAMANAL</span>
          </h1>
          <p className="mt-3 text-grayText">
            Alege clasa potrivita si rezerva-ti locul
          </p>
        </div>

        <ScheduleGrid classes={serialized} />
      </div>
    </section>
  );
}
