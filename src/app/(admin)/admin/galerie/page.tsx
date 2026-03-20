"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
  category: string | null;
  order: number;
  createdAt: string;
}

export default function AdminGaleriePage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Bulk add
  const [bulkUrls, setBulkUrls] = useState("");
  const [bulkCategory, setBulkCategory] = useState("");

  // Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editOrder, setEditOrder] = useState(0);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setImages(data);
    } catch {
      toast.error("Eroare la incarcarea imaginilor");
    } finally {
      setLoading(false);
    }
  }

  async function handleBulkAdd() {
    const urls = bulkUrls
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urls.length === 0) {
      toast.error("Introdu cel putin un URL");
      return;
    }

    const maxOrder = images.length > 0 ? Math.max(...images.map((i) => i.order)) : 0;

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: urls.map((url, idx) => ({
            url,
            category: bulkCategory || null,
            order: maxOrder + idx + 1,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(`${urls.length} imagine(i) adaugate`);
      setBulkUrls("");
      setBulkCategory("");
      fetchImages();
    } catch {
      toast.error("Eroare la adaugarea imaginilor");
    }
  }

  function startEdit(img: GalleryImage) {
    setEditingId(img.id);
    setEditCaption(img.caption || "");
    setEditCategory(img.category || "");
    setEditOrder(img.order);
  }

  async function handleSaveEdit() {
    if (!editingId) return;

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          caption: editCaption,
          category: editCategory,
          order: editOrder,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Imaginea a fost actualizata");
      setEditingId(null);
      fetchImages();
    } catch {
      toast.error("Eroare la actualizarea imaginii");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast.success("Imaginea a fost stearsa");
      setDeletingId(null);
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch {
      toast.error("Eroare la stergerea imaginii");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-gold">Galerie</h1>

      {/* Bulk add section */}
      <div className="rounded-xl border border-white/10 bg-cardBg p-5">
        <h2 className="mb-3 font-heading text-lg font-bold">Adauga imagini</h2>
        <p className="mb-3 text-sm text-grayText">
          Introdu URL-urile Cloudinary, cate unul pe linie.
        </p>
        <textarea
          value={bulkUrls}
          onChange={(e) => setBulkUrls(e.target.value)}
          rows={4}
          placeholder={"https://res.cloudinary.com/...\nhttps://res.cloudinary.com/..."}
          className="mb-3 w-full rounded-lg border border-white/10 bg-darkBg px-4 py-2.5 text-sm text-white placeholder:text-grayText focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={bulkCategory}
            onChange={(e) => setBulkCategory(e.target.value)}
            placeholder="Categorie (optional)"
            className="rounded-lg border border-white/10 bg-darkBg px-4 py-2.5 text-sm text-white placeholder:text-grayText focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <button
            onClick={handleBulkAdd}
            className="rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-goldHover"
          >
            Adauga
          </button>
        </div>
      </div>

      {/* Images grid */}
      {loading ? (
        <div className="py-12 text-center text-grayText">Se incarca...</div>
      ) : images.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-cardBg p-8 text-center text-grayText">
          Nicio imagine in galerie.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-cardBg"
            >
              <div className="relative aspect-square">
                <Image
                  src={img.url}
                  alt={img.caption || "Galerie"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {editingId === img.id ? (
                <div className="space-y-2 p-3">
                  <input
                    type="text"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    placeholder="Descriere"
                    className="w-full rounded-lg border border-white/10 bg-darkBg px-3 py-1.5 text-sm text-white placeholder:text-grayText focus:border-gold focus:outline-none"
                  />
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    placeholder="Categorie"
                    className="w-full rounded-lg border border-white/10 bg-darkBg px-3 py-1.5 text-sm text-white placeholder:text-grayText focus:border-gold focus:outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-grayText">Ordine:</label>
                    <input
                      type="number"
                      value={editOrder}
                      onChange={(e) => setEditOrder(parseInt(e.target.value) || 0)}
                      className="w-20 rounded-lg border border-white/10 bg-darkBg px-3 py-1.5 text-sm text-white focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="rounded-lg bg-gold px-4 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-goldHover"
                    >
                      Salveaza
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg border border-white/10 px-4 py-1.5 text-xs text-grayText transition-colors hover:text-white"
                    >
                      Anuleaza
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {img.caption || "Fara descriere"}
                      </p>
                      <p className="text-xs text-grayText">
                        {img.category || "Fara categorie"} &bull; #{img.order}
                      </p>
                    </div>
                    <div className="ml-2 flex gap-1">
                      <button
                        onClick={() => startEdit(img)}
                        className="rounded p-1 text-grayText transition-colors hover:text-gold"
                        title="Editeaza"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeletingId(img.id)}
                        className="rounded p-1 text-grayText transition-colors hover:text-red-400"
                        title="Sterge"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-cardBg p-6">
            <h3 className="mb-2 font-heading text-lg font-bold">Confirma stergerea</h3>
            <p className="mb-5 text-sm text-grayText">
              Esti sigur ca vrei sa stergi aceasta imagine? Actiunea este ireversibila.
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
