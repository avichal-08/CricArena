import Link from "next/link";
import { ChevronRight, Swords, Trophy, Lock, Globe } from "lucide-react";

export function MyLobbies({ lobbies }: { lobbies: any[] }) {
  return (
    <section>
      <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500 mb-4">Active Participations</h2>
      <div className="flex flex-col gap-2">
        {lobbies.map((lobby) => (
          <Link key={lobby.id} href={`/lobby/${lobby.id}`} className="group">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] hover:border-orange-500/15 p-4 flex items-center justify-between transition-all duration-200 group-active:scale-[0.99]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center shrink-0">
                  {lobby.mode === "match" ? (
                    <Swords className="w-3.5 h-3.5 text-orange-400" />
                  ) : (
                    <Trophy className="w-3.5 h-3.5 text-orange-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-semibold text-stone-200 truncate">{lobby.name}</h3>
                  <p className="text-[11px] text-stone-500 capitalize mt-0.5 flex items-center gap-1">
                    {lobby.type === "private" ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
                    {lobby.mode} mode
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-700 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}