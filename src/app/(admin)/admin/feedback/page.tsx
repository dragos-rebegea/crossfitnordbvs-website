"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  message: string;
  rating: number | null;
  isRead: boolean;
  createdAt: string;
}

export default function AdminFeedbackPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selected, setSelected] = useState<FeedbackItem | null>(null);

  const { data: feedback = [], isLoading } = useQuery<FeedbackItem[]>({
    queryKey: ["admin-feedback", filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter === "unread") params.set("isRead", "false");
      if (filter === "read") params.set("isRead", "true");
      const res = await fetch(`/api/admin/feedback?${params}`);
      return res.json();
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/admin/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Eroare");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-feedback"] });
      toast.success("Marcat ca citit");
    },
  });

  const renderStars = (rating: number | null) => {
    if (rating === null) return <span className="text-grayText">-</span>;
    return (
      <span className="text-gold">
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-white">Feedback</h1>
        <div className="flex gap-2">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                filter === f
                  ? "bg-gold text-darkBg font-bold"
                  : "bg-cardBg text-grayText hover:text-white"
              }`}
            >
              {f === "all" ? "Toate" : f === "unread" ? "Necitite" : "Citite"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-grayText">Se incarca...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-left">
            <thead className="bg-cardBg">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-grayText">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-grayText">Nume</th>
                <th className="px-4 py-3 text-sm font-medium text-grayText">Email</th>
                <th className="px-4 py-3 text-sm font-medium text-grayText">Rating</th>
                <th className="px-4 py-3 text-sm font-medium text-grayText">Mesaj</th>
                <th className="px-4 py-3 text-sm font-medium text-grayText">Data</th>
                <th className="px-4 py-3 text-sm font-medium text-grayText">Actiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {feedback.map((item) => (
                <tr key={item.id} className={`hover:bg-white/5 ${!item.isRead ? "bg-gold/5" : ""}`}>
                  <td className="px-4 py-3">
                    <span className={`inline-block h-2 w-2 rounded-full ${item.isRead ? "bg-grayText" : "bg-gold"}`} />
                  </td>
                  <td className="px-4 py-3 text-white">{item.name}</td>
                  <td className="px-4 py-3 text-grayText">{item.email}</td>
                  <td className="px-4 py-3">{renderStars(item.rating)}</td>
                  <td className="px-4 py-3 text-grayText max-w-xs truncate">{item.message}</td>
                  <td className="px-4 py-3 text-sm text-grayText">
                    {new Date(item.createdAt).toLocaleDateString("ro-RO")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(item)}
                        className="rounded px-2 py-1 text-xs bg-white/10 text-white hover:bg-white/20"
                      >
                        Vezi
                      </button>
                      {!item.isRead && (
                        <button
                          onClick={() => markReadMutation.mutate(item.id)}
                          className="rounded px-2 py-1 text-xs bg-gold/20 text-gold hover:bg-gold/30"
                        >
                          Citit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-lg bg-cardBg p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-white">Feedback de la {selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-grayText hover:text-white text-xl">✕</button>
            </div>
            <div className="space-y-3">
              <p className="text-grayText"><strong className="text-white">Email:</strong> {selected.email}</p>
              <p className="text-grayText"><strong className="text-white">Rating:</strong> {renderStars(selected.rating)}</p>
              <p className="text-grayText"><strong className="text-white">Data:</strong> {new Date(selected.createdAt).toLocaleDateString("ro-RO")}</p>
              <div>
                <strong className="text-white">Mesaj:</strong>
                <p className="mt-2 rounded-md bg-darkBg p-4 text-white whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              {!selected.isRead && (
                <button
                  onClick={() => { markReadMutation.mutate(selected.id); setSelected(null); }}
                  className="rounded-md bg-gold px-4 py-2 font-bold text-darkBg hover:bg-goldHover transition"
                >
                  Marcheaza ca citit
                </button>
              )}
              <button onClick={() => setSelected(null)} className="rounded-md bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition">
                Inchide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
