import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { redirect } from "next/navigation";
import { db } from "@repo/db";
import { lobbies, lobbyMembers, matches, tournaments, teams } from "@repo/db/schema";
import { eq, and, or, lt, desc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import Link from "next/link";
import { Trophy, Swords, CalendarDays, ChevronRight, Lock, Globe, ShieldCheck, History } from "lucide-react";

export default async function PastLobbiesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/api/auth/signin");

  const userId = session.user.id;

  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");

  const pastLobbies = await db
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
          and(eq(lobbies.mode, "match"), lt(matches.startTime, new Date())),
          and(eq(lobbies.mode, "tournament"), lt(tournaments.endDate, new Date()))
        )
      )
    )
    .orderBy(desc(lobbies.createdAt));

  return (
    <div className="max-w-6xl mx-auto w-full p-6 md:p-10 space-y-8 pb-24">
      
      <div className="flex items-center gap-4 border-b border-zinc-800/60 pb-6">
        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-lg">
          <History className="w-6 h-6 text-zinc-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Past Arenas</h1>
          <p className="text-sm text-zinc-500 mt-1">Your completed matches and tournament history.</p>
        </div>
      </div>

      {pastLobbies.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 border border-dashed border-zinc-800 rounded-2xl bg-black">
          <History className="w-10 h-10 text-zinc-700 mb-4" />
          <h2 className="text-lg font-bold text-zinc-400">No past arenas</h2>
          <p className="text-sm text-zinc-600 mt-1 mb-6 text-center max-w-sm">
            You don't have any completed matches or tournaments yet in your history.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastLobbies.map((lobby) => (
            <Link key={lobby.id} href={`/lobby/${lobby.id}`}>
              <div className="group flex flex-col justify-between h-full p-5 rounded-2xl border border-zinc-800 bg-black/50 opacity-90 hover:opacity-100 hover:border-zinc-600 transition-all active:scale-[0.98]">
                
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-zinc-300 line-clamp-1 pr-4">{lobby.name}</h3>
                    {lobby.type === "private" ? (
                      <Lock className="w-4 h-4 text-zinc-600 shrink-0" />
                    ) : (
                      <Globe className="w-4 h-4 text-zinc-600 shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-900 border border-zinc-800/60 px-2 py-1 rounded">
                      {lobby.mode === "match" ? <Swords className="w-3 h-3" /> : <Trophy className="w-3 h-3" />}
                      {lobby.mode}
                    </span>
                    {lobby.role === "admin" && (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-900 px-2 py-1 rounded">
                        <ShieldCheck className="w-3 h-3 text-zinc-500" /> Admin
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 opacity-70">
                    <CalendarDays className="w-4 h-4 text-zinc-600" />
                    <div className="flex flex-col">
                      {lobby.mode === "match" && lobby.matchStartTime ? (
                        <>
                          <span className="text-xs font-semibold text-zinc-400">
                            {lobby.teamAShort} vs {lobby.teamBShort}
                          </span>
                          <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                            Played {new Date(lobby.matchStartTime).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-semibold text-zinc-400">
                            {lobby.tournamentName}
                          </span>
                          <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                            Ended {new Date(lobby.tournamentEndDate!).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}