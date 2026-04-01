import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function MyLobbies({ lobbies }: { lobbies: any[] }) {
  return (
    <section>
      <h2 className="text-sm font-medium text-zinc-400 mb-4">Active Participations</h2>
      <div className="flex flex-col gap-2">
        {lobbies.map((lobby) => (
          <Link key={lobby.id} href={`/lobby/${lobby.id}`} className="group">
            <div className="rounded-md border border-zinc-800/60 bg-black p-3.5 flex justify-between items-center hover:bg-zinc-900/50 transition-colors">
              <div>
                <h3 className="font-medium text-[14px] text-zinc-200">{lobby.name}</h3>
                <p className="text-[12px] text-zinc-500 capitalize mt-0.5">
                  {lobby.mode} Match
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}