"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Parolele nu coincid");
      return;
    }

    if (formData.password.length < 8) {
      setError("Parola trebuie sa aiba minim 8 caractere");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "A aparut o eroare");
        return;
      }

      // Auto-login after registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/profil");
        router.refresh();
      }
    } catch {
      setError("A aparut o eroare. Incearca din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="font-heading text-2xl font-bold text-gold">
            CROSSFIT NORD BVS
          </Link>
          <h2 className="mt-6 font-heading text-3xl font-bold text-white">
            Creeaza cont
          </h2>
          <p className="mt-2 text-grayText">
            Inregistreaza-te pentru a face rezervari si a gestiona abonamentul.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
              Nume complet
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border border-white/10 bg-cardBg px-4 py-3 text-white placeholder-grayText focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="Ion Popescu"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-white/10 bg-cardBg px-4 py-3 text-white placeholder-grayText focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="email@exemplu.ro"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
              Telefon
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-md border border-white/10 bg-cardBg px-4 py-3 text-white placeholder-grayText focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="07XX XXX XXX"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
              Parola
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-md border border-white/10 bg-cardBg px-4 py-3 text-white placeholder-grayText focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="Minim 8 caractere"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">
              Confirma parola
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-md border border-white/10 bg-cardBg px-4 py-3 text-white placeholder-grayText focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="Repeta parola"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gold py-3 font-bold text-darkBg transition hover:bg-goldHover disabled:opacity-50"
          >
            {loading ? "Se creeaza contul..." : "Creeaza cont"}
          </button>
        </form>

        <p className="text-center text-grayText">
          Ai deja cont?{" "}
          <Link href="/login" className="text-gold hover:text-goldHover transition">
            Conecteaza-te
          </Link>
        </p>
      </div>
    </div>
  );
}
