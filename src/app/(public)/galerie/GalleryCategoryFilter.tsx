"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
  category: string | null;
  order: number;
}

interface GalleryCategoryFilterProps {
  categories: string[];
  images: GalleryImage[];
}

export default function GalleryCategoryFilter({
  categories,
  images,
}: GalleryCategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredImages = activeCategory
    ? images.filter((img) => img.category === activeCategory)
    : images;

  return (
    <>
      {/* Category filter buttons */}
      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeCategory === null
                ? "bg-gold text-darkBg"
                : "border border-zinc-700 text-grayText hover:border-gold hover:text-gold"
            }`}
          >
            Toate
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeCategory === cat
                  ? "bg-gold text-darkBg"
                  : "border border-zinc-700 text-grayText hover:border-gold hover:text-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Image grid */}
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
        {filteredImages.length > 0 ? (
          filteredImages.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              {image.url ? (
                <Image
                  src={image.url}
                  alt={image.caption || "CrossFit Nord BVS"}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-cardBg">
                  <Camera className="h-10 w-10 text-grayText" />
                </div>
              )}
              {image.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                  <p className="text-sm text-white">{image.caption}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          /* Placeholder squares when no images exist */
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-cardBg"
            >
              <Camera className="h-10 w-10 text-grayText" />
            </div>
          ))
        )}
      </div>
    </>
  );
}
