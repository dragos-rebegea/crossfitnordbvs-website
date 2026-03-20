"use client";

import { useState } from "react";
import Link from "next/link";

interface PackageItem {
  id: string;
  name: string;
  type: string;
  sessions: number | null;
  duration: number;
  price: number;
  isPopular: boolean;
}

interface PackageTabsProps {
  sessionPackages: PackageItem[];
  unlimitedPackages: PackageItem[];
}

function PackageCard({ pkg }: { pkg: PackageItem }) {
  return (
    <div
      className={`relative flex flex-col rounded-lg border bg-cardBg p-6 ${
        pkg.isPopular ? "border-gold" : "border-zinc-700"
      }`}
    >
      {pkg.isPopular && (
        <span className="absolute -top-3 right-4 rounded bg-gold px-3 py-1 text-xs font-bold text-darkBg">
          POPULAR
        </span>
      )}

      <h3 className="font-heading text-xl font-bold text-white">{pkg.name}</h3>

      <div className="mt-4">
        <span className="font-heading text-4xl font-bold text-gold">
          {pkg.price}
        </span>
        <span className="ml-1 text-grayText">RON</span>
      </div>

      <p className="mt-1 text-sm text-grayText">/ {pkg.duration} zile</p>

      <div className="mt-4 border-t border-zinc-700 pt-4">
        <p className="text-sm text-white">
          Sedinte:{" "}
          <span className="font-medium text-gold">
            {pkg.sessions !== null ? pkg.sessions : "Nelimitat"}
          </span>
        </p>
      </div>

      <Link
        href="/login"
        className="mt-6 block rounded bg-gold px-6 py-3 text-center font-bold text-darkBg transition hover:bg-goldHover"
      >
        ABONEAZA-TE
      </Link>
    </div>
  );
}

export default function PackageTabs({
  sessionPackages,
  unlimitedPackages,
}: PackageTabsProps) {
  const [activeTab, setActiveTab] = useState<"sessions" | "unlimited">("sessions");

  const tabs = [
    { key: "sessions" as const, label: "Sedinte", packages: sessionPackages },
    { key: "unlimited" as const, label: "Nelimitat", packages: unlimitedPackages },
  ];

  return (
    <>
      <div className="mb-8 flex justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-lg px-6 py-2.5 font-heading text-sm font-bold transition-colors ${
              activeTab === tab.key
                ? "bg-gold text-darkBg"
                : "bg-cardBg text-grayText hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tabs
          .find((t) => t.key === activeTab)
          ?.packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
      </div>

      {tabs.find((t) => t.key === activeTab)?.packages.length === 0 && (
        <p className="py-12 text-center text-grayText">
          Niciun pachet disponibil in aceasta categorie.
        </p>
      )}
    </>
  );
}
