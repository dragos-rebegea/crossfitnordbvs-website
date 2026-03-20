"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { formatRON } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Package {
  id: string;
  name: string;
  type: "SESSION" | "UNLIMITED";
  sessions: number | null;
  duration: number;
  price: number;
  isPopular: boolean;
  isActive: boolean;
  order: number;
}

const emptyForm = {
  name: "",
  type: "SESSION" as "SESSION" | "UNLIMITED",
  sessions: 10,
  duration: 30,
  price: 0,
  isPopular: false,
  order: 0,
};

export default function PachetePage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ["admin-packages"],
    queryFn: () => fetch("/api/admin/packages").then((r) => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      fetch("/api/admin/packages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/packages?id=${id}`, { method: "DELETE" }).then((r) =>
        r.json()
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
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

  function openEdit(pkg: Package) {
    setForm({
      name: pkg.name,
      type: pkg.type,
      sessions: pkg.sessions ?? 10,
      duration: pkg.duration,
      price: pkg.price,
      isPopular: pkg.isPopular,
      order: pkg.order,
    });
    setEditingId(pkg.id);
    setDialogOpen(true);
  }

  function handleSubmit() {
    const payload = {
      name: form.name,
      type: form.type,
      sessions: form.type === "SESSION" ? Number(form.sessions) : null,
      duration: Number(form.duration),
      price: Number(form.price),
      isPopular: form.isPopular,
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
        <h1 className="text-2xl font-bold text-[#E7B913]">Pachete</h1>
        <Button onClick={openAdd} className="bg-[#E7B913] text-black hover:bg-[#E7B913]/80">
          <Plus className="mr-2 h-4 w-4" />
          Adaugă pachet
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Se încarcă...</p>
      ) : packages.length === 0 ? (
        <p className="text-muted-foreground">Niciun pachet adăugat.</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nume</TableHead>
                <TableHead>Tip</TableHead>
                <TableHead>Ședințe</TableHead>
                <TableHead>Durată (zile)</TableHead>
                <TableHead>Preț</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ordine</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id} className={!pkg.isActive ? "opacity-50" : ""}>
                  <TableCell className="font-medium">
                    <span className="flex items-center gap-2">
                      {pkg.name}
                      {pkg.isPopular && (
                        <Star className="h-4 w-4 fill-[#E7B913] text-[#E7B913]" />
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={pkg.type === "UNLIMITED" ? "gold" : "secondary"}>
                      {pkg.type === "SESSION" ? "Ședințe" : "Nelimitat"}
                    </Badge>
                  </TableCell>
                  <TableCell>{pkg.sessions ?? "—"}</TableCell>
                  <TableCell>{pkg.duration}</TableCell>
                  <TableCell>{formatRON(pkg.price)}</TableCell>
                  <TableCell>
                    <Badge variant={pkg.isActive ? "default" : "destructive"}>
                      {pkg.isActive ? "Activ" : "Inactiv"}
                    </Badge>
                  </TableCell>
                  <TableCell>{pkg.order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(pkg)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={!pkg.isActive}
                        onClick={() => {
                          if (confirm("Sigur vrei să dezactivezi acest pachet?")) {
                            deleteMutation.mutate(pkg.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editează pachet" : "Adaugă pachet"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nume</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Numele pachetului"
              />
            </div>
            <div>
              <Label>Tip</Label>
              <Select
                value={form.type}
                onValueChange={(val: "SESSION" | "UNLIMITED") =>
                  setForm({ ...form, type: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SESSION">Ședințe</SelectItem>
                  <SelectItem value="UNLIMITED">Nelimitat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.type === "SESSION" && (
              <div>
                <Label>Număr ședințe</Label>
                <Input
                  type="number"
                  value={form.sessions}
                  onChange={(e) =>
                    setForm({ ...form, sessions: Number(e.target.value) })
                  }
                />
              </div>
            )}
            <div>
              <Label>Durată (zile)</Label>
              <Input
                type="number"
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Preț (RON)</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPopular"
                checked={form.isPopular}
                onChange={(e) =>
                  setForm({ ...form, isPopular: e.target.checked })
                }
                className="h-4 w-4 rounded border-input accent-[#E7B913]"
              />
              <Label htmlFor="isPopular">Popular</Label>
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
              className="bg-[#E7B913] text-black hover:bg-[#E7B913]/80"
            >
              {isSaving ? "Se salvează..." : "Salvează"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
