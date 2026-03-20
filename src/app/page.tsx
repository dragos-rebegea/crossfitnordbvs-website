import { prisma } from "@/lib/prisma";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import ThreePillars from "@/components/landing/ThreePillars";
import AboutUs from "@/components/landing/AboutUs";
import CrossFitDefinition from "@/components/landing/CrossFitDefinition";
import Team from "@/components/landing/Team";
import Membership from "@/components/landing/Membership";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [trainers, packages] = await Promise.all([
    prisma.trainer.findMany({ orderBy: { order: "asc" } }),
    prisma.package.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ThreePillars />
        <AboutUs />
        <CrossFitDefinition />
        <Team trainers={trainers} />
        <Membership />
        <Pricing packages={packages} />
      </main>
      <Footer />
    </>
  );
}
