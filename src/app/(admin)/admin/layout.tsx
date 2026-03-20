"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCheck,
  Package,
  CreditCard,
  CalendarCheck,
  Image,
  Newspaper,
  MessageSquare,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/utilizatori", label: "Utilizatori", icon: Users },
  { href: "/admin/orar", label: "Orar", icon: Calendar },
  { href: "/admin/antrenori", label: "Antrenori", icon: UserCheck },
  { href: "/admin/pachete", label: "Pachete", icon: Package },
  { href: "/admin/abonamente", label: "Abonamente", icon: CreditCard },
  { href: "/admin/rezervari", label: "Rezervari", icon: CalendarCheck },
  { href: "/admin/galerie", label: "Galerie", icon: Image },
  { href: "/admin/noutati", label: "Noutati", icon: Newspaper },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const sidebar = (
    <nav className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <p className="text-gold font-heading font-bold text-lg">CROSSFIT NORD</p>
        <p className="text-grayText text-xs">BVS ADMIN</p>
      </div>

      <div className="flex-1 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors relative ${
                active
                  ? "bg-gold/10 text-gold"
                  : "text-grayText hover:text-white hover:bg-white/5"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gold rounded-r" />
              )}
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="text-sm text-grayText mb-2 truncate">
          {session?.user?.name || session?.user?.email}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 text-sm text-grayText hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          Deconectare
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-darkBg text-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-cardBg flex-col fixed inset-y-0 left-0 z-30">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-cardBg z-50 transform transition-transform lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-grayText hover:text-white"
        >
          <X size={20} />
        </button>
        {sidebar}
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="h-16 bg-cardBg border-b border-white/10 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-grayText hover:text-white"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-sm font-bold tracking-wider text-grayText">
              ADMIN PANEL
            </h1>
          </div>
          <span className="text-gold font-heading font-bold text-sm hidden sm:block">
            CROSSFIT NORD BVS
          </span>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
