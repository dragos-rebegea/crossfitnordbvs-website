import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

import GalleryCategoryFilter from "./GalleryCategoryFilter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galerie | CrossFit Nord BVS",
  description:
    "Exploreaza galeria foto CrossFit Nord BVS. Antrenamente, competitii si momente din comunitatea noastra.",
};

export default async function GaleriePage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { order: "asc" },
  });

  const categories = Array.from(
    new Set(images.map((img) => img.category).filter(Boolean))
  ) as string[];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center font-heading text-4xl font-bold text-gold">
          GALERIE
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-grayText">
          Momente din antrenamentele, competitiile si evenimentele noastre.
        </p>

        <GalleryCategoryFilter categories={categories} images={images} />
      </div>
    </section>
  );
}
