"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  Home, 
  Trophy, 
  History, 
  Globe, 
  LogOut, 
  MoreVertical 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Active Lobbies", href: "/lobbies/active", icon: Trophy },
  { name: "Past Lobbies", href: "/lobbies/past", icon: History },
  { name: "Global Rank", href: "/leaderboard", icon: Globe },
];

export function AppShell({ 
  children, 
  user 
}: { 
  children: React.ReactNode;
  user?: any;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full bg-black text-zinc-50 font-sans overflow-hidden">
      
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800/60 bg-black">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
            <span className="font-bold text-4xl tracking-tight">CricArena</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-zinc-900 text-white" 
                    : "text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
                }`}>
                  <item.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-500"}`} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800/60">
          {user ? (
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-900/50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8 border border-zinc-700">
                  <AvatarImage src={user.image} />
                  <AvatarFallback className="bg-zinc-800 text-xs">{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-200">{user.name}</span>
                  <span className="text-xs text-zinc-500">Player</span>
                </div>
              </div>
              <button onClick={() => signOut()} className="text-zinc-500 hover:text-white transition-colors p-1">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/api/auth/signin" className="block w-full py-2 text-center text-sm font-medium bg-white text-black rounded-md hover:bg-zinc-200 transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </aside>

      <div className="flex flex-col flex-1 w-full h-full relative">
        
        <header className="md:hidden flex items-center justify-between px-5 py-4 border-b border-zinc-800/60 bg-black/80 backdrop-blur-md z-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-white flex items-center justify-center">
              <span className="text-black font-black text-sm">C</span>
            </div>
            <span className="font-bold text-[17px] tracking-tight">CricArena</span>
          </div>
          {user && (
            <button onClick={() => signOut()} className="active:scale-95 transition-transform">
              <Avatar className="w-8 h-8 border border-zinc-700">
                <AvatarImage src={user.image} />
                <AvatarFallback className="bg-zinc-800 text-xs">{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto bg-black pb-20 md:pb-0">
          {children}
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-zinc-800/60 bg-black/90 backdrop-blur-lg pb-safe z-50">
          <div className="flex items-center justify-around p-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 p-2 w-16">
                  <div className={`p-1.5 rounded-full transition-colors ${isActive ? "bg-zinc-800 text-white" : "text-zinc-500"}`}>
                    <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-white" : "text-zinc-500"}`}>
                    {item.name.split(' ')[0]}
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