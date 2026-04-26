import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { redirect } from "next/navigation";
import { db } from "@repo/db";
import { lobbies, lobbyMembers, matches, tournaments, teams } from "@repo/db/schema";
import { eq, and, or, gte, desc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import Link from "next/link";
import { Trophy, Swords, CalendarDays, ChevronRight, Lock, Globe, ShieldCheck, Activity } from "lucide-react";

export default async function ActiveLobbiesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/api/auth/signin");

  const userId = session.user.id;

  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const activeLobbies = await db
    .select({
      id: lobbies.id,
      name: lobbies.name,
      type: lobbies.type,
      mode: lobbies.mode,
      role: lobbyMembers.role,
      matchStartTime: matches.startTime,
      teamAShort: teamA.shortName,
      teamBShort: teamB.shortName,
      tournamentName: tournaments.name,
      tournamentEndDate: tournaments.endDate,
    })
    .from(lobbyMembers)
    .innerJoin(lobbies, eq(lobbyMembers.lobbyId, lobbies.id))
    .leftJoin(matches, eq(lobbies.matchId, matches.id))
    .leftJoin(tournaments, eq(lobbies.tournamentId, tournaments.id))
    .leftJoin(teamA, eq(matches.teamAId, teamA.id))
    .leftJoin(teamB, eq(matches.teamBId, teamB.id))
    .where(
      and(
        eq(lobbyMembers.userId, userId),
        eq(lobbyMembers.status, "accepted"),
        or(
          and(eq(lobbies.mode, "match"), gte(matches.startTime, startOfToday)),
          and(eq(lobbies.mode, "tournament"), gte(tournaments.endDate, startOfToday))
        )
      )
    )
    .orderBy(desc(lobbies.createdAt));

  return (
    <div className="max-w-6xl mx-auto w-full p-6 md:p-10 space-y-8 pb-24">

      <div className="flex items-center gap-4 border-b border-zinc-800/60 pb-6">
        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-lg">
          <Activity className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Active Arenas</h1>
          <p className="text-sm text-zinc-500 mt-1">Your ongoing matches and tournaments.</p>
        </div>
      </div>

      {activeLobbies.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 border border-dashed border-zinc-800 rounded-2xl bg-black">
          <Globe className="w-10 h-10 text-zinc-700 mb-4" />
          <h2 className="text-lg font-bold text-zinc-300">No active arenas</h2>
          <p className="text-sm text-zinc-500 mt-1 mb-6 text-center max-w-sm">
            You aren't participating in any ongoing matches or tournaments. Create a new one or ask a friend for an invite link.
          </p>
          <Link href="/lobby/create">
            <button className="bg-white text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors">
              Create Arena
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeLobbies.map((lobby) => (
            <Link key={lobby.id} href={`/lobby/${lobby.id}`}>
              <div className="group flex flex-col justify-between h-full p-5 rounded-2xl border border-zinc-800 bg-black hover:border-zinc-600 transition-all active:scale-[0.98]">

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-white line-clamp-1 pr-4">{lobby.name}</h3>
                    {lobby.type === "private" ? (
                      <Lock className="w-4 h-4 text-zinc-500 shrink-0" />
                    ) : (
                      <Globe className="w-4 h-4 text-zinc-500 shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                      {lobby.mode === "match" ? <Swords className="w-3 h-3" /> : <Trophy className="w-3 h-3" />}
                      {lobby.mode}
                    </span>
                    {lobby.role === "admin" && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                        <ShieldCheck className="w-3 h-3" /> Admin
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-zinc-500" />
                    <div className="flex flex-col">
                      {lobby.mode === "match" && lobby.matchStartTime ? (
                        <>
                          <span className="text-xs font-bold text-zinc-300">
                            {lobby.teamAShort} vs {lobby.teamBShort}
                          </span>
                          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                            {new Date(lobby.matchStartTime).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-bold text-zinc-300">
                            {lobby.tournamentName}
                          </span>
                          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                            Ends {new Date(lobby.tournamentEndDate!).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-white transition-colors" />
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}