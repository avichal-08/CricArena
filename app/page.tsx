import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/configs/authOptions";
import { SignInButton } from "@/components/SignInButton";
import { Flame, Trophy, Users, Star } from "lucide-react";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/home");
  }

  return (
    <div className="min-h-screen bg-[oklch(0.09_0.007_38)] flex flex-col">
      <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[17px] tracking-tight text-white">CricArena</span>
        </div>
        <SignInButton />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-orange-400">IPL 2026 Season Live</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 max-w-3xl leading-[1.05]">
          The Premier
          <span className="text-orange-400"> Fantasy Cricket </span>
          Arena
        </h1>

        <p className="text-stone-400 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
          Build your dream squad, compete with friends, and climb the global leaderboard across the entire IPL season.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-16">
          <SignInButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full">
          {[
            { icon: Trophy, label: "Private Lobbies", desc: "Invite only competitions" },
            { icon: Users, label: "Public Arenas", desc: "Join open tournaments" },
            { icon: Star, label: "Live Scoring", desc: "Real-time point tracking" },
          ].map((f) => (
            <div key={f.label} className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-left">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center mb-4">
                <f.icon className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-sm font-semibold text-white mb-1">{f.label}</p>
              <p className="text-xs text-stone-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}