import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import TrainerCard from "./TrainerCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Antrenorii Nostri",
  description:
    "Descopera echipa de antrenori certificati CrossFit Nord BVS. Profesionisti dedicati care te ghideaza spre cele mai bune rezultate.",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function AntrenoriPage() {
  const trainers = await prisma.trainer.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">
            <span className="text-grayText">ANTRENORII </span>
            <span className="text-gold">NOSTRI</span>
          </h1>
          <p className="mt-3 text-grayText">
            Profesionisti dedicati performantei tale
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="overflow-hidden rounded-lg bg-cardBg">
              {trainer.image ? (
                <div className="relative aspect-square">
                  <Image
                    src={trainer.image}
                    alt={trainer.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center bg-zinc-800">
                  <span className="font-heading text-5xl font-bold text-grayText">
                    {getInitials(trainer.name)}
                  </span>
                </div>
              )}

              <div className="p-6">
                <h2 className="font-heading text-xl font-bold text-white">
                  {trainer.name}
                </h2>

                {trainer.specialties.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {trainer.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="rounded bg-gold/10 px-2.5 py-1 text-xs font-medium text-gold"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}

                {trainer.bio && (
                  <TrainerCard bio={trainer.bio} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
