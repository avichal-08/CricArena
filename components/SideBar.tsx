"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Home,
  Trophy,
  History,
  Globe,
  LogOut,
  Terminal,
  Users,
  Flame,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Active Lobbies", href: "/lobby/active", icon: Trophy },
  { name: "Past Lobbies", href: "/lobby/past", icon: History },
  { name: "Public Lobbies", href: "/lobby/public", icon: Users },
  { name: "Global Rank", href: "/global-leaderboard", icon: Globe },
  { name: "Admin Panel", href: "/admin/scoring", icon: Terminal, adminOnly: true },
];

export function SideBar({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: any;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-screen w-full bg-background text-foreground font-sans overflow-hidden">
      <aside className="hidden md:flex flex-col w-64 border-r border-white/[0.05] bg-[oklch(0.10_0.007_38)]">
        <div className="p-5 pb-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:bg-orange-600 transition-colors duration-200">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[17px] tracking-tight text-white">CricArena</span>
          </Link>
        </div>

        <div className="px-4 pt-4 pb-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600 px-2">Menu</p>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 pb-4">
          {navItems.map((item) => {
            if (item.adminOnly && user?.role !== "admin") return null;
            const isActive = pathname === item.href;
            const isAdmin = item.adminOnly;

            return (
              <Link key={item.name} href={item.href}>
                <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-lg font-medium transition-all duration-150 ${
                  isActive
                    ? isAdmin
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-orange-500/10 text-orange-400"
                    : "text-stone-400 hover:text-stone-200 hover:bg-white/[0.04]"
                }`}>
                  {isActive && (
                    <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full ${isAdmin ? "bg-emerald-500" : "bg-orange-500"}`} />
                  )}
                  <item.icon className={`w-[15px] h-[15px] shrink-0 ${
                    isActive
                      ? isAdmin ? "text-emerald-400" : "text-orange-400"
                      : "text-stone-600"
                  }`} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.05]">
          {user ? (
            <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/[0.04] transition-colors">
              <button onClick={() => router.push("/profile")} className="flex items-center gap-2.5 flex-1 min-w-0">
                <Avatar className="w-8 h-8 border border-white/10 shrink-0">
                  <AvatarImage src={user.image} />
                  <AvatarFallback className="bg-orange-500/15 text-orange-400 text-xs font-bold">{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-[12.5px] font-semibold text-stone-200 truncate leading-tight">{user.name}</span>
                  <span className="text-[11px] text-stone-600 capitalize leading-tight mt-0.5">{user.role || "Player"}</span>
                </div>
              </button>
              <button
                onClick={() => signOut()}
                className="p-1.5 text-stone-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-150"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link href="/api/auth/signin">
              <div className="flex items-center justify-center h-9 bg-orange-500 hover:bg-orange-600 transition-colors rounded-xl text-white text-sm font-semibold">
                Sign In
              </div>
            </Link>
          )}
        </div>
      </aside>

      <div className="flex flex-col flex-1 w-full h-full relative overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/[0.05] bg-[oklch(0.10_0.007_38)] z-50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-[15px] tracking-tight text-white">CricArena</span>
          </div>
          {user && (
            <button onClick={() => router.push("/profile")} className="active:scale-95 transition-transform">
              <Avatar className="w-8 h-8 border border-white/10">
                <AvatarImage src={user.image} />
                <AvatarFallback className="bg-orange-500/15 text-orange-400 text-xs font-bold">{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto bg-background pb-20 md:pb-0">
          {children}
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/[0.05] bg-[oklch(0.10_0.007_38)]/95 backdrop-blur-xl pb-safe z-50">
          <div className="flex items-center justify-around px-1 pt-1 pb-1.5">
            {navItems.map((item) => {
              if (item.adminOnly && user?.role !== "admin") return null;
              const isActive = pathname === item.href;
              const isAdmin = item.adminOnly;

              return (
                <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 py-1.5 px-2.5">
                  <div className={`p-1.5 rounded-xl transition-all duration-150 ${
                    isActive
                      ? isAdmin
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-orange-500/15 text-orange-400"
                      : "text-stone-600"
                  }`}>
                    <item.icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span className={`text-[9px] font-bold tracking-wide transition-colors ${
                    isActive
                      ? isAdmin ? "text-emerald-400" : "text-orange-400"
                      : "text-stone-600"
                  }`}>
                    {item.name.split(" ")[0]}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}