import { db } from "@repo/db";
import { matches, teams, tournaments, players } from "@repo/db/schema";
import { eq, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, Trophy, Shield } from "lucide-react";

import { CountdownTimer } from "@/components/CountdownTimer";
import { CreateLobbyButton } from "@/components/CreateLobbyButton";

export default async function MatchDetailsPage({ params }: { params: { matchId: string } }) {
    const { matchId } = await params;

    const teamA = alias(teams, "teamA");
    const teamB = alias(teams, "teamB");

    const [matchData] = await db
        .select({
            id: matches.id,
            startTime: matches.startTime,
            tournamentName: tournaments.name,
            teamA: {
                id: teamA.id,
                name: teamA.name,
                shortName: teamA.shortName,
                logoUrl: teamA.logoUrl,
            },
            teamB: {
                id: teamB.id,
                name: teamB.name,
                shortName: teamB.shortName,
                logoUrl: teamB.logoUrl,
            },
        })
        .from(matches)
        .innerJoin(tournaments, eq(matches.tournamentId, tournaments.id))
        .innerJoin(teamA, eq(matches.teamAId, teamA.id))
        .innerJoin(teamB, eq(matches.teamBId, teamB.id))
        .where(eq(matches.id, matchId));

    if (!matchData) notFound();

    const squadPlayers = await db
        .select()
        .from(players)
        .where(inArray(players.teamId, [matchData.teamA.id, matchData.teamB.id]));

    const teamASquad = squadPlayers.filter((p) => p.teamId === matchData.teamA.id);
    const teamBSquad = squadPlayers.filter((p) => p.teamId === matchData.teamB.id);

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date);
    };

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).format(date);
    };

    return (
        <div className="max-w-6xl mx-auto w-full p-5 md:p-10 space-y-12 pb-24">

            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-6">
                <div className="flex flex-col justify-between w-full">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 -ml-2 rounded-md hover:bg-zinc-900 transition-colors text-zinc-500 hover:text-zinc-200">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                                <Trophy className="w-3 h-3" /> {matchData.tournamentName}
                            </span>
                            <h1 className="text-xl font-bold text-white mt-0.5">Match Center</h1>
                        </div>
                        <CreateLobbyButton/>
                    </div>
                </div>
                <div className="hidden md:block">
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">ID: {matchData.id}</span>
                </div>
            </div>

            <div className="relative rounded-3xl border border-zinc-800 bg-black p-8 md:p-12 overflow-hidden shadow-2xl shadow-black">

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">

                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 relative flex items-center justify-center bg-zinc-900/50 rounded-full border border-zinc-800 shadow-xl p-6">
                            <Image
                                src={`/teams/${matchData.teamA.shortName.toLowerCase()}.webp`}
                                alt={matchData.teamA.name}
                                width={120}
                                height={120}
                                className="object-contain drop-shadow-2xl"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">{matchData.teamA.shortName}</h2>
                            <p className="text-xs text-zinc-500 font-medium">{matchData.teamA.name}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="h-px w-12 bg-zinc-800 md:hidden" />
                        <span className="text-4xl font-black italic text-zinc-800 tracking-tighter">VS</span>
                        <div className="h-px w-12 bg-zinc-800 md:hidden" />
                        <div className="hidden md:flex flex-col items-center gap-1 mt-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                Live in <CountdownTimer targetDate={matchData.startTime} />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 relative flex items-center justify-center bg-zinc-900/50 rounded-full border border-zinc-800 shadow-xl p-6">
                            <Image
                                src={`/teams/${matchData.teamB.shortName.toLowerCase()}.webp`}
                                alt={matchData.teamB.name}
                                width={120}
                                height={120}
                                className="object-contain drop-shadow-2xl"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">{matchData.teamB.shortName}</h2>
                            <p className="text-xs text-zinc-500 font-medium">{matchData.teamB.name}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 pt-8 border-t border-zinc-800/50">
                    <div className="flex items-center gap-3">
                        <CalendarDays className="w-5 h-5 text-zinc-500" />
                        <span className="text-sm font-semibold text-zinc-300">{formatDate(matchData.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-zinc-500" />
                        <span className="text-sm font-semibold text-zinc-300">{formatTime(matchData.startTime)} IST</span>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Team Squads
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">

                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                            <h3 className="text-lg font-bold text-white">{matchData.teamA.shortName} Pool</h3>
                            <span className="text-xs text-zinc-500 font-mono">{teamASquad.length} Players</span>
                        </div>
                        <div className="divide-y divide-zinc-900">
                            {teamASquad.map((player) => (
                                <div key={player.id} className="py-3 flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500 group-hover:text-white transition-colors">
                                            {player.role.substring(0, 3).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{player.name}</span>
                                    </div>
                                    <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">{player.playingStyle}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                            <h3 className="text-lg font-bold text-white">{matchData.teamB.shortName} Pool</h3>
                            <span className="text-xs text-zinc-500 font-mono">{teamBSquad.length} Players</span>
                        </div>
                        <div className="divide-y divide-zinc-900">
                            {teamBSquad.map((player) => (
                                <div key={player.id} className="py-3 flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500 group-hover:text-white transition-colors">
                                            {player.role.substring(0, 3).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{player.name}</span>
                                    </div>
                                    <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">{player.playingStyle}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}