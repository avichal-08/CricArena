import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";

export function CampusLobby({ lobbies }: { lobbies: any[] }) {
  if (lobbies.length === 0) return null;

  return (
    <section>
      <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500 mb-4">Campus Arena</h2>
      <div className="flex flex-col gap-2">
        {lobbies.map((lobby) => (
          <Link key={lobby.id} href={`/lobby/${lobby.id}`} className="group">
            <div className="rounded-xl border border-orange-500/15 bg-orange-500/[0.04] hover:bg-orange-500/[0.07] hover:border-orange-500/25 p-4 flex items-center justify-between transition-all duration-200 group-active:scale-[0.99]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
                  <Building2 className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-stone-200">{lobby.name}</h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">Open to all students</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-orange-400 transition-colors shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}