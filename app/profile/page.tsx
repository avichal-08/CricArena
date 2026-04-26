import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { redirect } from "next/navigation";
import { db } from "@repo/db";
import { matchEntries, lobbies, matches, teams } from "@repo/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import Link from "next/link";
import { ArrowLeft, User, Trophy, Swords, CalendarDays, History, TrendingUp, Medal } from "lucide-react";
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

    return (
        <div className="max-w-4xl mx-auto w-full p-5 md:p-10 space-y-10 pb-24">

            <div className="flex items-center gap-4 border-b border-zinc-800/60 pb-6">
                <Link href="/" className="p-2 -ml-2 rounded-md hover:bg-zinc-900 transition-colors text-zinc-500 hover:text-zinc-200">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Player Profile</h1>
                    <p className="text-sm text-zinc-500 mt-1">Your lifetime statistics and match history</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl border border-zinc-800 bg-black shadow-2xl shadow-black relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />

                <Avatar className="w-24 h-24 border-2 border-zinc-800 shadow-xl">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback className="bg-zinc-900 text-2xl font-bold text-zinc-400">
                        {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>

                <div className="text-center sm:text-left z-10">
                    <h2 className="text-2xl font-black text-white tracking-tight">{user.name}</h2>
                    <p className="text-sm font-medium text-zinc-400 mt-1">{user.email}</p>
                    <div className="inline-flex items-center gap-2 mt-4 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-xs font-bold text-zinc-300">
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="p-6 rounded-2xl border border-zinc-800 bg-black flex flex-col items-center justify-center text-center group hover:border-blue-500/50 transition-colors">
                    <Trophy className="w-6 h-6 text-blue-500 mb-3" />
                    <span className="text-3xl font-mono font-black text-white">{stats.totalPoints}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Lifetime Points</span>
                </div>

                <div className="p-6 rounded-2xl border border-zinc-800 bg-black flex flex-col items-center justify-center text-center group hover:border-yellow-500/50 transition-colors">
                    <Medal className="w-6 h-6 text-yellow-500 mb-3" />
                    <span className="text-3xl font-mono font-black text-white">{stats.highestScore}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Highest Match Score</span>
                </div>

                <div className="p-6 rounded-2xl border border-zinc-800 bg-black flex flex-col items-center justify-center text-center group hover:border-emerald-500/50 transition-colors">
                    <TrendingUp className="w-6 h-6 text-emerald-500 mb-3" />
                    <span className="text-3xl font-mono font-black text-white">{stats.matchesPlayed}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Squads Submitted</span>
                </div>
            </div>

            <div className="space-y-6 pt-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <History className="w-4 h-4" /> Match Ledger
                </h2>

                <div className="rounded-2xl border border-zinc-800 bg-black overflow-hidden shadow-2xl shadow-black">
                    {history.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <Swords className="w-10 h-10 text-zinc-700 mb-3" />
                            <p className="text-sm font-medium text-zinc-400">No match history yet.</p>
                            <p className="text-xs text-zinc-600 mt-1">Your submitted squads will appear here.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-900 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {history.map((entry) => (
                                <div key={entry.entryId} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-900/30 transition-colors">

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                                            <Swords className="w-4 h-4 text-zinc-500" />
                                        </div>
                                        <div>
                                            <Link href={`/lobby/${entry.lobbyId}`} className="text-sm font-bold text-white hover:text-blue-400 transition-colors">
                                                {entry.lobbyName}
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[11px] font-bold text-zinc-400">
                                                    {entry.teamAShort} vs {entry.teamBShort}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                                <span className="text-[10px] font-medium text-zinc-500 flex items-center gap-1">
                                                    <CalendarDays className="w-3 h-3" />
                                                    {new Date(entry.matchStartTime).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end sm:w-32 bg-zinc-900/50 sm:bg-transparent p-3 sm:p-0 rounded-lg">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 sm:hidden">Score</span>
                                        <div className="text-right">
                                            <span className="block text-lg font-mono font-black text-white">{entry.score}</span>
                                            <span className="hidden sm:block text-[9px] font-black uppercase tracking-widest text-zinc-600">PTS</span>
                                        </div>
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