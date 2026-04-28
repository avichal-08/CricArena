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
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

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
          and(eq(lobbies.mode, "match"), lt(matches.startTime, startOfToday)),
          and(eq(lobbies.mode, "tournament"), lt(tournaments.endDate, startOfToday))
        )
      )
    )
    .orderBy(desc(lobbies.createdAt));

  return (
    <div className="max-w-5xl mx-auto w-full p-5 md:p-8 space-y-8 pb-24">
      <div className="flex items-center gap-3 pb-6 border-b border-white/[0.05]">
        <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
          <History className="w-4.5 h-4.5 text-stone-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Past Arenas</h1>
          <p className="text-[12px] text-stone-500 mt-0.5">Your completed matches and tournament history</p>
        </div>
      </div>

      {pastLobbies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-white/[0.06] text-center">
          <History className="w-10 h-10 text-stone-700 mb-4" />
          <h2 className="text-base font-bold text-stone-500">No past arenas</h2>
          <p className="text-sm text-stone-700 mt-1">Your completed matches will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastLobbies.map((lobby) => (
            <Link key={lobby.id} href={`/lobby/${lobby.id}`}>
              <div className="group flex flex-col justify-between h-full p-5 rounded-2xl border border-white/[0.05] bg-white/[0.01] opacity-80 hover:opacity-100 hover:border-white/[0.08] transition-all duration-200 active:scale-[0.98]">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[14px] font-semibold text-stone-300 line-clamp-1">{lobby.name}</h3>
                    {lobby.type === "private" ? (
                      <Lock className="w-3.5 h-3.5 text-stone-700 shrink-0 mt-0.5" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-stone-700 shrink-0 mt-0.5" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-stone-600 bg-white/[0.03] border border-white/[0.05] px-2 py-0.5 rounded-md">
                      {lobby.mode === "match" ? <Swords className="w-2.5 h-2.5" /> : <Trophy className="w-2.5 h-2.5" />}
                      {lobby.mode}
                    </span>
                    {lobby.role === "admin" && (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-stone-600 bg-white/[0.03] px-2 py-0.5 rounded-md">
                        <ShieldCheck className="w-2.5 h-2.5" /> Admin
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.04] flex items-center justify-between opacity-70">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 text-stone-700" />
                    <div>
                      {lobby.mode === "match" && lobby.matchStartTime ? (
                        <>
                          <p className="text-[12px] font-semibold text-stone-400">{lobby.teamAShort} vs {lobby.teamBShort}</p>
                          <p className="text-[10px] text-stone-700">
                            Played {new Date(lobby.matchStartTime).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-[12px] font-semibold text-stone-400">{lobby.tournamentName}</p>
                          <p className="text-[10px] text-stone-700">
                            Ended {new Date(lobby.tournamentEndDate!).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-700 group-hover:text-stone-400 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}