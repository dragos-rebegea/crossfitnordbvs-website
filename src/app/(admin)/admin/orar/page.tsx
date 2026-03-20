"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const DAYS = ["Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata", "Duminica"];

interface Trainer {
  id: string;
  name: string;
}

interface ClassItem {
  id: string;
  name: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  trainerId: string | null;
  isActive: boolean;
  trainer: Trainer | null;
}

interface ClassForm {
  classId?: string;
  name: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  trainerId: string;
}

const emptyForm: ClassForm = {
  name: "",
  dayOfWeek: 0,
  startTime: "08:00",
  endTime: "09:00",
  capacity: 20,
  trainerId: "",
};

export default function OrarPage() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState<ClassForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: classes = [], isLoading } = useQuery<ClassItem[]>({
    queryKey: ["admin-classes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/classes");
      if (!res.ok) throw new Error("Eroare la incarcarea claselor");
      return res.json();
    },
  });

  const { data: trainers = [] } = useQuery<Trainer[]>({
    queryKey: ["admin-trainers-list"],
    queryFn: async () => {
      const res = await fetch("/api/admin/classes");
      if (!res.ok) return [];
      const data: ClassItem[] = await res.json();
      const map = new Map<string, Trainer>();
      data.forEach((c) => {
        if (c.trainer) map.set(c.trainer.id, c.trainer);
      });
      return Array.from(map.values());
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: ClassForm) => {
      const method = data.classId ? "PUT" : "POST";
      const res = await fetch("/api/admin/classes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Eroare la salvarea clasei");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-classes"] });
      setShowDialog(false);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (classId: string) => {
      const res = await fetch(`/api/admin/classes?classId=${classId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Eroare la stergerea clasei");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-classes"] });
      setDeleteId(null);
    },
  });

  const openEdit = (item: ClassItem) => {
    setForm({
      classId: item.id,
      name: item.name,
      dayOfWeek: item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
      capacity: item.capacity,
      trainerId: item.trainerId || "",
    });
    setShowDialog(true);
  };

  const openAdd = (day?: number) => {
    setForm({ ...emptyForm, dayOfWeek: day ?? 0 });
    setShowDialog(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const classesByDay = DAYS.map((_, i) =>
    classes.filter((c) => c.dayOfWeek === i)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Orar</h1>
        <button
          onClick={() => openAdd()}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold hover:bg-goldHover text-black font-medium rounded-lg transition-colors text-sm"
        >
          <Plus size={16} />
          Adauga clasa
        </button>
      </div>

      {isLoading ? (
        <p className="text-grayText">Se incarca...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {DAYS.map((day, dayIndex) => (
            <div key={day} className="bg-cardBg rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-sm">{day}</h3>
                <button
                  onClick={() => openAdd(dayIndex)}
                  className="text-grayText hover:text-gold transition-colors"
                  title="Adauga clasa"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="p-2 space-y-2 min-h-[80px]">
                {classesByDay[dayIndex].length === 0 ? (
                  <p className="text-grayText text-xs text-center py-4">
                    Nicio clasa
                  </p>
                ) : (
                  classesByDay[dayIndex].map((item) => (
                    <div
                      key={item.id}
                      className="bg-darkBg rounded-lg p-3 group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gold mt-0.5">
                            {item.startTime} - {item.endTime}
                          </p>
                          <p className="text-xs text-grayText mt-0.5">
                            {item.trainer?.name || "Fara antrenor"} &middot;{" "}
                            {item.capacity} locuri
                          </p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-1 text-grayText hover:text-gold transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="p-1 text-grayText hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      {showDialog && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDialog(false)}
        >
          <div
            className="bg-cardBg rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                {form.classId ? "Editeaza clasa" : "Adauga clasa"}
              </h2>
              <button
                onClick={() => setShowDialog(false)}
                className="text-grayText hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-grayText mb-1">
                  Nume clasa
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-darkBg border border-white/10 rounded-lg text-sm focus:outline-none focus:border-gold/50"
                  placeholder="Ex: WOD, CrossFit, Open Gym"
                />
              </div>

              <div>
                <label className="block text-sm text-grayText mb-1">Zi</label>
                <select
                  value={form.dayOfWeek}
                  onChange={(e) =>
                    setForm({ ...form, dayOfWeek: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2.5 bg-darkBg border border-white/10 rounded-lg text-sm focus:outline-none focus:border-gold/50"
                >
                  {DAYS.map((day, i) => (
                    <option key={i} value={i}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-grayText mb-1">
                    Ora start
                  </label>
                  <input
                    type="time"
                    required
                    value={form.startTime}
                    onChange={(e) =>
                      setForm({ ...form, startTime: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-darkBg border border-white/10 rounded-lg text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-grayText mb-1">
                    Ora sfarsit
                  </label>
                  <input
                    type="time"
                    required
                    value={form.endTime}
                    onChange={(e) =>
                      setForm({ ...form, endTime: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-darkBg border border-white/10 rounded-lg text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-grayText mb-1">
                  Capacitate
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({ ...form, capacity: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2.5 bg-darkBg border border-white/10 rounded-lg text-sm focus:outline-none focus:border-gold/50"
                />
              </div>

              <div>
                <label className="block text-sm text-grayText mb-1">
                  Antrenor
                </label>
                <select
                  value={form.trainerId}
                  onChange={(e) =>
                    setForm({ ...form, trainerId: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-darkBg border border-white/10 rounded-lg text-sm focus:outline-none focus:border-gold/50"
                >
                  <option value="">Fara antrenor</option>
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="w-full py-2.5 bg-gold hover:bg-goldHover text-black font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                {saveMutation.isPending
                  ? "Se salveaza..."
                  : form.classId
                  ? "Salveaza modificarile"
                  : "Adauga clasa"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-cardBg rounded-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-2">Sterge clasa</h2>
            <p className="text-sm text-grayText mb-6">
              Esti sigur ca vrei sa stergi aceasta clasa? Aceasta actiune nu
              poate fi anulata.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 bg-darkBg border border-white/10 rounded-lg text-sm hover:border-white/20 transition-colors"
              >
                Anuleaza
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Se sterge..." : "Sterge"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
