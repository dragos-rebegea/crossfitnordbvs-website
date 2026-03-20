"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  CreditCard,
  History,
  Settings,
  LogOut,
  User,
} from "lucide-react";

const navItems = [
  { href: "/profil", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profil/rezervari", label: "Rezervari", icon: CalendarDays },
  { href: "/profil/abonamente", label: "Abonamente", icon: CreditCard },
  { href: "/profil/istoric", label: "Istoric", icon: History },
  { href: "/profil/setari", label: "Setari", icon: Settings },
];

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/profil") return pathname === "/profil";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-darkBg text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-cardBg px-4 lg:px-6">
        <Link
          href="/"
          className="font-heading text-lg font-bold tracking-wider text-gold"
        >
          CROSSFIT NORD BVS
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-sm text-grayText">
              {session?.user?.name || session?.user?.email}
            </span>
          </div>
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt="Avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-gold">
              <User className="h-4 w-4" />
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-grayText transition-colors hover:text-white"
            title="Deconectare"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Iesire</span>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 flex-shrink-0 border-r border-white/10 bg-cardBg lg:block">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-l-2 border-gold bg-gold/10 text-gold"
                      : "border-l-2 border-transparent text-grayText hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-4rem)] flex-1 p-4 pb-24 lg:p-6 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/10 bg-cardBg lg:hidden">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                active
                  ? "border-t-2 border-gold text-gold"
                  : "border-t-2 border-transparent text-grayText"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
