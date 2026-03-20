"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const emptyForm = {
  title: "",
  content: "",
  excerpt: "",
  coverImage: "",
  published: false,
};

export default function AdminNoutatiPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Delete
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/news");
      if (!res.ok) throw new Error();
      setArticles(await res.json());
    } catch {
      toast.error("Eroare la incarcarea articolelor");
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(article: NewsArticle) {
    setEditingId(article.id);
    setForm({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || "",
      coverImage: article.coverImage || "",
      published: article.published,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Titlul si continutul sunt obligatorii");
      return;
    }

    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...form } : form;

      const res = await fetch("/api/admin/news", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      toast.success(editingId ? "Articol actualizat" : "Articol creat");
      setDialogOpen(false);
      fetchArticles();
    } catch {
      toast.error("Eroare la salvarea articolului");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch("/api/admin/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast.success("Articol sters");
      setDeletingId(null);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch {
      toast.error("Eroare la stergerea articolului");
    }
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ro-RO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-gold">Noutati</h1>
        <button
          onClick={openNew}
          className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-goldHover"
        >
          + Articol Nou
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-grayText">Se incarca...</div>
      ) : articles.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-cardBg p-8 text-center text-grayText">
          Niciun articol.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-cardBg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase text-grayText">
                <th className="px-5 py-3 font-medium">Titlu</th>
                <th className="px-5 py-3 font-medium">Slug</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Actiuni</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-5 py-3 text-sm font-medium">{article.title}</td>
                  <td className="px-5 py-3 text-sm text-grayText">{article.slug}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        article.published
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {article.published ? "Publicat" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-grayText">
                    {formatDate(article.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(article)}
                        className="rounded px-2 py-1 text-xs text-grayText transition-colors hover:text-gold"
                      >
                        Editeaza
                      </button>
                      <button
                        onClick={() => setDeletingId(article.id)}
                        className="rounded px-2 py-1 text-xs text-grayText transition-colors hover:text-red-400"
                      >
                        Sterge
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 py-10 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-cardBg p-6">
            <h2 className="mb-5 font-heading text-xl font-bold">
              {editingId ? "Editeaza articol" : "Articol nou"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-grayText">
                  Titlu
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-darkBg px-4 py-2.5 text-sm text-white placeholder:text-grayText focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder="Titlul articolului"
                />
                {form.title && (
                  <p className="mt-1 text-xs text-grayText">
                    Slug: {slugify(form.title)}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-grayText">
                  Continut
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={10}
                  className="w-full rounded-lg border border-white/10 bg-darkBg px-4 py-2.5 text-sm text-white placeholder:text-grayText focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder="Continutul articolului..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-grayText">
                  Rezumat
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-darkBg px-4 py-2.5 text-sm text-white placeholder:text-grayText focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder="Scurta descriere..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-grayText">
                  URL Imagine Cover
                </label>
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-darkBg px-4 py-2.5 text-sm text-white placeholder:text-grayText focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="h-4 w-4 rounded border-white/20 bg-transparent accent-gold"
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Publicat
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDialogOpen(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-grayText transition-colors hover:text-white"
              >
                Anuleaza
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-gold px-6 py-2 text-sm font-semibold text-black transition-colors hover:bg-goldHover disabled:opacity-50"
              >
                {saving ? "Se salveaza..." : "Salveaza"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-cardBg p-6">
            <h3 className="mb-2 font-heading text-lg font-bold">Confirma stergerea</h3>
            <p className="mb-5 text-sm text-grayText">
              Esti sigur ca vrei sa stergi acest articol? Actiunea este ireversibila.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-grayText transition-colors hover:text-white"
              >
                Anuleaza
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Sterge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
