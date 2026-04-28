import { db } from "@/drizzle/src";
import { matchEntries, players } from "@/drizzle/src/db/schema";
import { authOptions } from "@/lib/configs/authOptions";
import { and, eq, inArray } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { Trophy } from "lucide-react";

const ROLE_ORDER = ["wk", "batsman", "all-rounder", "bowler"];

export default async function MatchEntry({ params }: { params: { memberId: string; lobbyId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/api/auth/signin");

  const { memberId, lobbyId } = await params;
  if (!memberId) return notFound();

  const [matchEntry] = await db
    .select()
    .from(matchEntries)
    .where(and(eq(matchEntries.lobbyId, lobbyId), eq(matchEntries.userId, memberId)));

  if (!matchEntry) return notFound();

  const selectedPlayersID: string[] = matchEntry.teamSelection;
  if (!selectedPlayersID || selectedPlayersID.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-stone-500">No players selected for this team.</p>
      </div>
    );
  }

  const selectedTeam = await db.select().from(players).where(inArray(players.id, selectedPlayersID));

  const groupedPlayers = selectedTeam.reduce((acc, player) => {
    const role = player.role || "Other";
    if (!acc[role]) acc[role] = [];
    acc[role].push(player);
    return acc;
  }, {} as Record<string, typeof selectedTeam>);

  const displayRoles = [...ROLE_ORDER, ...Object.keys(groupedPlayers).filter((r) => !ROLE_ORDER.includes(r))];

  const roleColors: Record<string, string> = {
    wk: "text-amber-400",
    batsman: "text-sky-400",
    "all-rounder": "text-emerald-400",
    bowler: "text-violet-400",
  };

  return (
    <div className="p-4 max-w-2xl mx-auto min-h-screen flex flex-col bg-background pb-24">
      <div className="flex justify-between items-center mb-6 bg-white/[0.04] border border-white/[0.06] p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-orange-400" />
          </div>
          <h1 className="text-[15px] font-bold text-white">Playing XI</h1>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600 block">Score</span>
          <span className="text-xl font-black font-mono text-white">{matchEntry.score}</span>
        </div>
      </div>

      <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] bg-[#1a4a2e] rounded-3xl overflow-hidden border-4 border-[#0f2e1a] shadow-2xl flex flex-col justify-evenly py-4">
        <div className="absolute inset-3 border border-white/10 rounded-[1.5rem] pointer-events-none" />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 sm:w-18 h-28 sm:h-36 border border-white/10 rounded-sm pointer-events-none" />

        {displayRoles.map((role) => {
          const playersInRole = groupedPlayers[role];
          if (!playersInRole || playersInRole.length === 0) return null;

          return (
            <div key={role} className="relative z-10 flex flex-col items-center w-full gap-2">
              <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] ${roleColors[role] || "text-white/50"} bg-black/40 px-3 py-0.5 rounded-full`}>
                {role}
              </span>
              <div className="flex justify-center items-start gap-3 sm:gap-5 w-full px-2 flex-wrap">
                {playersInRole.map((player) => (
                  <div key={player.id} className="flex flex-col items-center group cursor-pointer w-[72px] sm:w-[88px]">
                    <div className="w-11 h-11 sm:w-13 sm:h-13 bg-white/10 backdrop-blur text-white rounded-full flex items-center justify-center text-[11px] sm:text-[13px] font-black border border-white/20 group-hover:border-orange-400/60 group-hover:bg-orange-500/20 transition-all duration-200 shadow-lg">
                      {player.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="mt-1 bg-black/70 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md text-center w-full truncate font-semibold">
                      {player.name.split(" ").slice(-1)[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}