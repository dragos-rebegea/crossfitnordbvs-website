"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pause, Play, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface Subscription {
  id: string;
  status: "ACTIVE" | "FROZEN" | "EXPIRED" | "CANCELLED";
  sessionsLeft: number | null;
  startDate: string;
  endDate: string;
  frozenAt: string | null;
  user: { id: string; name: string | null; email: string };
  package: { id: string; name: string; type: "SESSION" | "UNLIMITED" };
}

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface Package {
  id: string;
  name: string;
  type: string;
}

const statusLabels: Record<string, string> = {
  ACTIVE: "Activ",
  FROZEN: "Înghețat",
  EXPIRED: "Expirat",
  CANCELLED: "Anulat",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-600/20 text-green-400 border-green-600/30",
  FROZEN: "bg-blue-600/20 text-blue-400 border-blue-600/30",
  EXPIRED: "bg-gray-600/20 text-gray-400 border-gray-600/30",
  CANCELLED: "bg-red-600/20 text-red-400 border-red-600/30",
};

export default function AbonamentePage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [sessionsDialog, setSessionsDialog] = useState<{
    id: string;
    current: number | null;
  } | null>(null);
  const [sessionsValue, setSessionsValue] = useState(0);
  const [statusDialog, setStatusDialog] = useState<{
    id: string;
    current: string;
  } | null>(null);
  const [newStatus, setNewStatus] = useState("");

  // Create form
  const [createForm, setCreateForm] = useState({
    userId: "",
    packageId: "",
    startDate: new Date().toISOString().split("T")[0],
  });

  const queryParams = new URLSearchParams();
  if (statusFilter !== "ALL") queryParams.set("status", statusFilter);
  if (searchQuery) queryParams.set("search", searchQuery);

  const { data: subscriptions = [], isLoading } = useQuery<Subscription[]>({
    queryKey: ["admin-subscriptions", statusFilter, searchQuery],
    queryFn: () =>
      fetch(`/api/admin/subscriptions?${queryParams.toString()}`).then((r) =>
        r.json()
      ),
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["admin-users-list"],
    queryFn: () => fetch("/api/admin/users").then((r) => r.json()).then((data) => data.users || []),
    enabled: createOpen,
  });

  const { data: packages = [] } = useQuery<Package[]>({
    queryKey: ["admin-packages-list"],
    queryFn: () => fetch("/api/admin/packages").then((r) => r.json()),
    enabled: createOpen,
  });

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      fetch("/api/admin/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      setCreateOpen(false);
      setCreateForm({
        userId: "",
        packageId: "",
        startDate: new Date().toISOString().split("T")[0],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      fetch("/api/admin/subscriptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      setSessionsDialog(null);
      setStatusDialog(null);
    },
  });

  function handleFreeze(id: string, freeze: boolean) {
    updateMutation.mutate({ id, freeze });
  }

  function handleSessionsSubmit() {
    if (!sessionsDialog) return;
    updateMutation.mutate({
      id: sessionsDialog.id,
      sessionsLeft: Number(sessionsValue),
    });
  }

  function handleStatusSubmit() {
    if (!statusDialog) return;
    updateMutation.mutate({ id: statusDialog.id, status: newStatus });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#E7B913]">Abonamente</h1>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-brandRed text-white hover:bg-brandRedDark"
        >
          <Plus className="mr-2 h-4 w-4" />
          Creează abonament
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Caută utilizator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrează status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toate</SelectItem>
            <SelectItem value="ACTIVE">Activ</SelectItem>
            <SelectItem value="FROZEN">Înghețat</SelectItem>
            <SelectItem value="EXPIRED">Expirat</SelectItem>
            <SelectItem value="CANCELLED">Anulat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-muted-foreground">Se încarcă...</p>
      ) : subscriptions.length === 0 ? (
        <p className="text-muted-foreground">Niciun abonament găsit.</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilizator</TableHead>
                <TableHead>Pachet</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ședințe rămase</TableHead>
                <TableHead>Data start</TableHead>
                <TableHead>Data expirare</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {sub.user.name || "Fără nume"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sub.user.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{sub.package.name}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColors[sub.status]}`}
                    >
                      {statusLabels[sub.status]}
                    </span>
                  </TableCell>
                  <TableCell>
                    {sub.package.type === "SESSION"
                      ? sub.sessionsLeft ?? "—"
                      : "Nelimitat"}
                  </TableCell>
                  <TableCell>{formatDate(sub.startDate)}</TableCell>
                  <TableCell>{formatDate(sub.endDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {/* Freeze / Unfreeze */}
                      {sub.status === "ACTIVE" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Înghețare"
                          onClick={() => handleFreeze(sub.id, true)}
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      {sub.status === "FROZEN" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Dezghețare"
                          onClick={() => handleFreeze(sub.id, false)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {/* Adjust sessions */}
                      {sub.package.type === "SESSION" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Ajustează ședințe"
                          onClick={() => {
                            setSessionsDialog({
                              id: sub.id,
                              current: sub.sessionsLeft,
                            });
                            setSessionsValue(sub.sessionsLeft ?? 0);
                          }}
                        >
                          #
                        </Button>
                      )}
                      {/* Change status */}
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Schimbă status"
                        onClick={() => {
                          setStatusDialog({
                            id: sub.id,
                            current: sub.status,
                          });
                          setNewStatus(sub.status);
                        }}
                      >
                        S
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Subscription Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Creează abonament</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Utilizator</Label>
              <Select
                value={createForm.userId}
                onValueChange={(val) =>
                  setCreateForm({ ...createForm, userId: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectează utilizator" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name || u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Pachet</Label>
              <Select
                value={createForm.packageId}
                onValueChange={(val) =>
                  setCreateForm({ ...createForm, packageId: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectează pachet" />
                </SelectTrigger>
                <SelectContent>
                  {packages
                    .filter((p: Package & { isActive?: boolean }) => (p as Package & { isActive: boolean }).isActive !== false)
                    .map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data de start</Label>
              <Input
                type="date"
                value={createForm.startDate}
                onChange={(e) =>
                  setCreateForm({ ...createForm, startDate: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Anulează
            </Button>
            <Button
              onClick={() => createMutation.mutate(createForm)}
              disabled={
                !createForm.userId ||
                !createForm.packageId ||
                createMutation.isPending
              }
              className="bg-brandRed text-white hover:bg-brandRedDark"
            >
              {createMutation.isPending ? "Se creează..." : "Creează"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjust Sessions Dialog */}
      <Dialog
        open={!!sessionsDialog}
        onOpenChange={() => setSessionsDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajustează ședințe</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ședințe curente: {sessionsDialog?.current ?? "—"}
            </p>
            <div>
              <Label>Ședințe noi</Label>
              <Input
                type="number"
                value={sessionsValue}
                onChange={(e) => setSessionsValue(Number(e.target.value))}
                min={0}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSessionsDialog(null)}>
              Anulează
            </Button>
            <Button
              onClick={handleSessionsSubmit}
              disabled={updateMutation.isPending}
              className="bg-brandRed text-white hover:bg-brandRedDark"
            >
              {updateMutation.isPending ? "Se salvează..." : "Salvează"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog
        open={!!statusDialog}
        onOpenChange={() => setStatusDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schimbă status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Status curent: {statusDialog ? statusLabels[statusDialog.current] : ""}
            </p>
            <div>
              <Label>Status nou</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Activ</SelectItem>
                  <SelectItem value="FROZEN">Înghețat</SelectItem>
                  <SelectItem value="EXPIRED">Expirat</SelectItem>
                  <SelectItem value="CANCELLED">Anulat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setStatusDialog(null)}>
              Anulează
            </Button>
            <Button
              onClick={handleStatusSubmit}
              disabled={updateMutation.isPending}
              className="bg-brandRed text-white hover:bg-brandRedDark"
            >
              {updateMutation.isPending ? "Se salvează..." : "Salvează"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
