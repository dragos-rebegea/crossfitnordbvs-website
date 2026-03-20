"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "A aparut o eroare. Incearca din nou.");
        return;
      }

      toast.success("Mesajul a fost trimis cu succes!");
      e.currentTarget.reset();
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
          className="w-full rounded-lg border border-white/10 bg-cardBg px-4 py-3 text-sm text-white placeholder:text-grayText focus:border-brandRed focus:outline-none focus:ring-1 focus:ring-brandRed"
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
          className="w-full rounded-lg border border-white/10 bg-cardBg px-4 py-3 text-sm text-white placeholder:text-grayText focus:border-brandRed focus:outline-none focus:ring-1 focus:ring-brandRed"
        />
      </div>

      <div>
        <label htmlFor="subject" className="mb-1 block text-sm font-medium text-white">
          Subiect
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="Subiectul mesajului"
          className="w-full rounded-lg border border-white/10 bg-cardBg px-4 py-3 text-sm text-white placeholder:text-grayText focus:border-brandRed focus:outline-none focus:ring-1 focus:ring-brandRed"
        />
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
          placeholder="Scrie mesajul tau aici..."
          className="w-full resize-none rounded-lg border border-white/10 bg-cardBg px-4 py-3 text-sm text-white placeholder:text-grayText focus:border-brandRed focus:outline-none focus:ring-1 focus:ring-brandRed"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-brandRed px-6 py-3 font-bold text-white transition hover:bg-brandRedDark disabled:opacity-50"
      >
        {loading ? "SE TRIMITE..." : "TRIMITE MESAJUL"}
      </button>
    </form>
  );
}
