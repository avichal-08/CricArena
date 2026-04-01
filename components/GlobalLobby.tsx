import Link from "next/link";

export function GlobalLobbies({ lobbies }: { lobbies: any[] }) {
  if (lobbies.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-medium text-zinc-400 mb-4">Campus Public Lobbies</h2>
      <div className="flex flex-col gap-2">
        {lobbies.map((lobby) => (
          <Link key={lobby.id} href={`/lobby/${lobby.id}`} className="group">
            <div className="rounded-md border border-zinc-800/60 bg-black p-3.5 flex justify-between items-center hover:bg-zinc-900/50 transition-colors">
              <div>
                <h3 className="font-medium text-[14px] text-zinc-200">{lobby.name}</h3>
                <p className="text-[12px] text-zinc-500 mt-0.5">Global Leaderboard</p>
              </div>
              <div className="text-[11px] font-medium text-zinc-400 group-hover:text-white transition-colors border border-zinc-800 rounded px-2 py-1">
                Join →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}