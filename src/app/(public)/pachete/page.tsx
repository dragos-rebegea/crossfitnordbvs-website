import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import PackageTabs from "./PackageTabs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pachete si Abonamente",
  description:
    "Descopera pachetele si abonamentele CrossFit Nord BVS. Abonamente cu sedinte sau nelimitate, preturi accesibile si planuri flexibile.",
};

export default async function PachetePage() {
  const packages = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  const sessionPackages = packages.filter((pkg) => pkg.type === "SESSION");
  const unlimitedPackages = packages.filter((pkg) => pkg.type === "UNLIMITED");

  const serialize = (pkgs: typeof packages) =>
    pkgs.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      type: pkg.type,
      sessions: pkg.sessions,
      duration: pkg.duration,
      price: pkg.price,
      isPopular: pkg.isPopular,
    }));

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">
            <span className="text-grayText">PACHETE SI </span>
            <span className="text-gold">ABONAMENTE</span>
          </h1>
          <p className="mt-3 text-grayText">
            Alege planul care ti se potriveste cel mai bine
          </p>
        </div>

        <PackageTabs
          sessionPackages={serialize(sessionPackages)}
          unlimitedPackages={serialize(unlimitedPackages)}
        />
      </div>
    </section>
  );
}
