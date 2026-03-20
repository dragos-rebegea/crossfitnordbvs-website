"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface TrainerCardProps {
  bio: string;
}

export default function TrainerCard({ bio }: TrainerCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-sm text-gold transition hover:text-goldHover"
      >
        {expanded ? "Ascunde" : "Citeste mai mult"}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && (
        <p className="mt-3 text-sm leading-relaxed text-grayText">{bio}</p>
      )}
    </div>
  );
}
