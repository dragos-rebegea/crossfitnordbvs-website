"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Trainer {
  id: string;
  name: string;
  bio: string | null;
  image: string | null;
  specialties: string[];
  order: number;
}

const emptyForm = {
  name: "",
  bio: "",
  specialties: "",
  image: "",
  order: 0,
};

export default function AntrenoriPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: trainers = [], isLoading } = useQuery<Trainer[]>({
    queryKey: ["admin-trainers"],
    queryFn: () => fetch("/api/admin/trainers").then((r) => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      fetch("/api/admin/trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-trainers"] });
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      fetch("/api/admin/trainers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-trainers"] });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/trainers?id=${id}`, { method: "DELETE" }).then((r) =>
        r.json()
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-trainers"] });
    },
  });

  function closeDialog() {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  }

  function openEdit(trainer: Trainer) {
    setForm({
      name: trainer.name,
      bio: trainer.bio || "",
      specialties: trainer.specialties.join(", "),
      image: trainer.image || "",
      order: trainer.order,
    });
    setEditingId(trainer.id);
    setDialogOpen(true);
  }

  function handleSubmit() {
    const payload = {
      name: form.name,
      bio: form.bio,
      specialties: form.specialties
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      image: form.image,
      order: Number(form.order),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#E7B913]">Antrenori</h1>
        <Button onClick={openAdd} className="bg-brandRed text-white hover:bg-brandRedDark">
          <Plus className="mr-2 h-4 w-4" />
          Adaugă antrenor
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Se încarcă...</p>
      ) : trainers.length === 0 ? (
        <p className="text-muted-foreground">Niciun antrenor adăugat.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trainers.map((trainer) => (
            <Card key={trainer.id} className="overflow-hidden border-border bg-card p-4">
              {trainer.image && (
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="mb-3 h-48 w-full rounded-md object-cover"
                />
              )}
              <h3 className="text-lg font-semibold">{trainer.name}</h3>
              {trainer.bio && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                  {trainer.bio}
                </p>
              )}
              {trainer.specialties.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {trainer.specialties.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Ordine: {trainer.order}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(trainer)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      if (confirm("Sigur vrei să ștergi acest antrenor?")) {
                        deleteMutation.mutate(trainer.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editează antrenor" : "Adaugă antrenor"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nume</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Numele antrenorului"
              />
            </div>
            <div>
              <Label>Biografie</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Descriere scurtă"
              />
            </div>
            <div>
              <Label>Specializări (separate prin virgulă)</Label>
              <Input
                value={form.specialties}
                onChange={(e) =>
                  setForm({ ...form, specialties: e.target.value })
                }
                placeholder="CrossFit, Haltere, Gimnastică"
              />
            </div>
            <div>
              <Label>URL imagine</Label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Ordine</Label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={closeDialog}>
              Anulează
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!form.name || isSaving}
              className="bg-brandRed text-white hover:bg-brandRedDark"
            >
              {isSaving ? "Se salvează..." : "Salvează"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
