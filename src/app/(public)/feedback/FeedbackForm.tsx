"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Te rugam sa selectezi un rating.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      rating,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "A aparut o eroare. Incearca din nou.");
        return;
      }

      toast.success("Multumim pentru feedback!");
      e.currentTarget.reset();
      setRating(0);
    } catch {
      toast.error("A aparut o eroare. Incearca din nou.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-white">
          Nume
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Numele tau"
          className="w-full rounded-lg border border-zinc-700 bg-darkBg px-4 py-3 text-sm text-white placeholder:text-grayText focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-white">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="email@exemplu.ro"
          className="w-full rounded-lg border border-zinc-700 bg-darkBg px-4 py-3 text-sm text-white placeholder:text-grayText focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      {/* Star rating */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition"
            >
              <Star
                className={`h-8 w-8 transition ${
                  star <= (hoverRating || rating)
                    ? "fill-gold text-gold"
                    : "text-zinc-600"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-white">
          Mesaj
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Spune-ne parerea ta..."
          className="w-full resize-none rounded-lg border border-zinc-700 bg-darkBg px-4 py-3 text-sm text-white placeholder:text-grayText focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gold px-6 py-3 font-bold text-darkBg transition hover:bg-goldHover disabled:opacity-50"
      >
        {loading ? "SE TRIMITE..." : "TRIMITE FEEDBACK"}
      </button>
    </form>
  );
}
