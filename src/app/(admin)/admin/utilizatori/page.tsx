"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { format } from "date-fns";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  phone: string | null;
  image: string | null;
  createdAt: string;
  _count: { subscriptions: number; reservations: number };
}

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

export default function UtilizatoriPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isLoading } = useQuery<UsersResponse>({
    queryKey: ["admin-users", page, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        ...(search && { search }),
      });
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error("Eroare la incarcarea utilizatorilor");
      return res.json();
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: string;
    }) => {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      if (!res.ok) throw new Error("Eroare la actualizarea rolului");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-6">Utilizatori</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-grayText"
          />
          <input
            type="text"
            placeholder="Cauta dupa nume sau email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-cardBg border border-white/10 rounded-lg text-sm text-white placeholder:text-grayText focus:outline-none focus:border-gold/50"
          />
        </div>
      </form>

      {/* Table */}
      <div className="bg-cardBg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-grayText text-left">
                <th className="px-4 py-3 font-medium">Nume</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">
                  Telefon
                </th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">
                  Creat
                </th>
                <th className="px-4 py-3 font-medium">Actiuni</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-grayText">
                    Se incarca...
                  </td>
                </tr>
              ) : !data?.users.length ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-grayText">
                    Niciun utilizator gasit
                  </td>
                </tr>
              ) : (
                data.users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3">{user.name || "-"}</td>
                    <td className="px-4 py-3 text-grayText">{user.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          roleMutation.mutate({
                            userId: user.id,
                            role: e.target.value,
                          })
                        }
                        className="bg-darkBg border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-gold/50"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-grayText hidden md:table-cell">
                      {user.phone || "-"}
                    </td>
                    <td className="px-4 py-3 text-grayText hidden lg:table-cell">
                      {format(new Date(user.createdAt), "dd.MM.yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-grayText hover:text-gold transition-colors"
                        title="Detalii"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
            <span className="text-sm text-grayText">
              Pagina {data.page} din {data.totalPages} ({data.total} utilizatori)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded bg-darkBg border border-white/10 disabled:opacity-30 hover:border-gold/50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="p-1.5 rounded bg-darkBg border border-white/10 disabled:opacity-30 hover:border-gold/50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User details dialog */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-cardBg rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Detalii utilizator</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-grayText">Nume</span>
                <span>{selectedUser.name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-grayText">Email</span>
                <span>{selectedUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-grayText">Telefon</span>
                <span>{selectedUser.phone || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-grayText">Rol</span>
                <span
                  className={
                    selectedUser.role === "ADMIN" ? "text-gold" : ""
                  }
                >
                  {selectedUser.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-grayText">Abonamente</span>
                <span>{selectedUser._count.subscriptions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-grayText">Rezervari</span>
                <span>{selectedUser._count.reservations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-grayText">Inregistrat</span>
                <span>
                  {format(new Date(selectedUser.createdAt), "dd.MM.yyyy HH:mm")}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full py-2.5 bg-brandRed text-white hover:bg-brandRedDark font-medium rounded-lg transition-colors text-sm"
            >
              Inchide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
