import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { redirect } from "next/navigation";
import { db } from "@repo/db";
import { matchEntries, lobbies, matches, teams } from "@repo/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import Link from "next/link";
import { ArrowLeft, Trophy, Swords, CalendarDays, TrendingUp, Medal, Flame } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/api/auth/signin");

  const userId = session.user.id;
  const user = session.user;

  const [stats] = await db
    .select({
      totalPoints: sql<number>`COALESCE(SUM(${matchEntries.score}), 0)::int`,
      matchesPlayed: sql<number>`COUNT(${matchEntries.id})::int`,
      highestScore: sql<number>`COALESCE(MAX(${matchEntries.score}), 0)::int`,
    })
    .from(matchEntries)
    .where(eq(matchEntries.userId, userId));

  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");

  const history = await db
    .select({
      entryId: matchEntries.id,
      score: matchEntries.score,
      lobbyId: lobbies.id,
      lobbyName: lobbies.name,
      matchStartTime: matches.startTime,
      teamAShort: teamA.shortName,
      teamBShort: teamB.shortName,
    })
    .from(matchEntries)
    .innerJoin(lobbies, eq(matchEntries.lobbyId, lobbies.id))
    .innerJoin(matches, eq(matchEntries.matchId, matches.id))
    .innerJoin(teamA, eq(matches.teamAId, teamA.id))
    .innerJoin(teamB, eq(matches.teamBId, teamB.id))
    .where(eq(matchEntries.userId, userId))
    .orderBy(desc(matches.startTime));

  const statCards = [
    { icon: Trophy, label: "Lifetime Points", value: stats.totalPoints, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/15", hover: "hover:border-orange-500/30" },
    { icon: Medal, label: "Best Match Score", value: stats.highestScore, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/15", hover: "hover:border-amber-500/30" },
    { icon: TrendingUp, label: "Squads Submitted", value: stats.matchesPlayed, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/15", hover: "hover:border-emerald-500/30" },
  ];

  return (
    <div className="max-w-3xl mx-auto w-full p-5 md:p-8 space-y-8 pb-24">
      <div className="flex items-center gap-3 pb-6 border-b border-white/[0.05]">
        <Link href="/" className="p-2 -ml-1 rounded-xl hover:bg-white/[0.04] transition-colors text-stone-500 hover:text-stone-300">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Player Profile</h1>
          <p className="text-[12px] text-stone-500 mt-0.5">Lifetime statistics and match history</p>
        </div>
      </div>

      <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/[0.04] blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <Avatar className="w-20 h-20 border-2 border-orange-500/20 shrink-0">
            <AvatarFallback className="bg-orange-500/10 text-3xl font-black text-orange-400">
              {user.name?.charAt(0) || "U"}
            </AvatarFallback>
            <AvatarImage src={user.image || ""} />
          </Avatar>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-black text-white">{user.name}</h2>
            <p className="text-sm text-stone-500 mt-1">{user.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-3">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[11px] font-bold text-orange-400">Active Player</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {statCards.map((stat) => (
          <div key={stat.label} className={`p-5 rounded-2xl border ${stat.border} ${stat.bg} ${stat.hover} flex flex-col items-center justify-center text-center transition-colors duration-200`}>
            <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
            <span className="text-2xl font-black font-mono text-white">{stat.value.toLocaleString()}</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-stone-600 mt-1">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500 flex items-center gap-1.5">
          <Swords className="w-3.5 h-3.5" /> Match Ledger
        </h2>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-4">
                <Swords className="w-5 h-5 text-stone-700" />
              </div>
              <p className="text-sm font-semibold text-stone-500">No match history yet</p>
              <p className="text-xs text-stone-700 mt-1">Your squad entries will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04] max-h-[500px] overflow-y-auto no-scrollbar">
              {history.map((entry) => (
                <div key={entry.entryId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center shrink-0">
                      <Swords className="w-3.5 h-3.5 text-orange-400" />
                    </div>
                    <div>
                      <Link href={`/lobby/${entry.lobbyId}`} className="text-[13px] font-bold text-stone-200 hover:text-orange-400 transition-colors">
                        {entry.lobbyName}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-semibold text-stone-500">
                          {entry.teamAShort} vs {entry.teamBShort}
                        </span>
                        <span className="w-0.5 h-0.5 rounded-full bg-stone-700" />
                        <span className="text-[10px] text-stone-600 flex items-center gap-1">
                          <CalendarDays className="w-2.5 h-2.5" />
                          {new Date(entry.matchStartTime).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center bg-white/[0.03] sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 sm:hidden">Score</span>
                    <span className="text-lg font-black font-mono text-white">{entry.score}</span>
                    <span className="hidden sm:block text-[9px] font-bold uppercase tracking-wider text-stone-700">pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}