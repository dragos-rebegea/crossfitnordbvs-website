import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Camera } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await prisma.newsArticle.findUnique({
    where: { slug: params.slug },
  });

  if (!article) {
    return { title: "Articol negasit | CrossFit Nord BVS" };
  }

  return {
    title: `${article.title} | CrossFit Nord BVS`,
    description: article.excerpt || undefined,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const article = await prisma.newsArticle.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!article) {
    notFound();
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/noutati"
          className="inline-flex items-center gap-2 text-sm text-grayText transition hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Inapoi la Noutati
        </Link>

        {/* Article header */}
        <article className="mt-8">
          {article.publishedAt && (
            <time className="text-sm font-medium text-gold">
              {formatDate(article.publishedAt)}
            </time>
          )}
          <h1 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
            {article.title}
          </h1>

          {/* Cover image */}
          <div className="relative mt-8 aspect-video overflow-hidden rounded-lg">
            {article.coverImage ? (
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-cardBg">
                <Camera className="h-12 w-12 text-grayText" />
              </div>
            )}
          </div>

          {/* Article content */}
          <div
            className="prose prose-invert mt-10 max-w-none prose-headings:font-heading prose-headings:text-white prose-p:text-grayText prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </div>
    </section>
  );
}
