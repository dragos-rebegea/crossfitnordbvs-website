import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Camera } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Noutati | CrossFit Nord BVS",
  description:
    "Ultimele noutati si articole de la CrossFit Nord BVS. Afla ce e nou in comunitatea noastra.",
};

export default async function NoutatiPage() {
  const articles = await prisma.newsArticle.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center font-heading text-4xl font-bold text-gold">
          NOUTATI
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-grayText">
          Ultimele stiri, evenimente si articole din comunitatea CrossFit Nord
          BVS.
        </p>

        {articles.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group overflow-hidden rounded-lg border border-zinc-800 bg-cardBg transition hover:border-gold/30"
              >
                {/* Cover image */}
                <div className="relative aspect-video overflow-hidden">
                  {article.coverImage ? (
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-cardBg">
                      <Camera className="h-10 w-10 text-grayText" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {article.publishedAt && (
                    <time className="text-xs font-medium text-gold">
                      {formatDate(article.publishedAt)}
                    </time>
                  )}
                  <h2 className="mt-2 font-heading text-lg font-bold text-white group-hover:text-gold transition">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm text-grayText">
                      {article.excerpt}
                    </p>
                  )}
                  <Link
                    href={`/noutati/${article.slug}`}
                    className="mt-4 inline-block text-sm font-semibold text-gold transition hover:text-goldHover"
                  >
                    Citeste mai mult &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-grayText">
            Nu exista noutati momentan. Revino in curand!
          </p>
        )}
      </div>
    </section>
  );
}
