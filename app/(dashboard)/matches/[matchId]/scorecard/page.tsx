import { db } from "@repo/db";
import { matches, teams, tournaments, players } from "@repo/db/schema";
import { eq, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft, CalendarDays, Clock, Trophy, Shield,
    MapPin, Coins, TrendingUp, Activity, Target, ChevronLeft, BarChart2
} from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { getBallsFromOvers } from "@/utils/BallsFromOvers";

type RichScorecard = {
    matchInfo?: {
        battingTeam: string;
        bowlingTeam: string;
        totalScore: string;
        overs: string;
        extras: string;
        crr: string;
    };
    playerStats: any[];
};

export default async function MatchScorecardPage({
    params,
    searchParams
}: {
    params: { matchId: string };
    searchParams: { tab?: string };
}) {
    const { matchId } = await params;
    const sParams = await searchParams;

    const activeTab = sParams.tab || "scorecard";

    const teamATable = alias(teams, "teamA");
    const teamBTable = alias(teams, "teamB");

    const [matchData] = await db
        .select({
            id: matches.id,
            startTime: matches.startTime,
            tournamentName: tournaments.name,
            scorecard: matches.scorecard,
            venue: matches.venue,
            toss: matches.toss,
            lineups: matches.lineups,
            winProbability: matches.winProbability,
            teamA: { id: teamATable.id, name: teamATable.name, shortName: teamATable.shortName, logoUrl: teamATable.logoUrl },
            teamB: { id: teamBTable.id, name: teamBTable.name, shortName: teamBTable.shortName, logoUrl: teamBTable.logoUrl },
        })
        .from(matches)
        .innerJoin(tournaments, eq(matches.tournamentId, tournaments.id))
        .innerJoin(teamATable, eq(matches.teamAId, teamATable.id))
        .innerJoin(teamBTable, eq(matches.teamBId, teamBTable.id))
        .where(eq(matches.id, matchId));

    if (!matchData) notFound();

    const squadPlayers = await db
        .select()
        .from(players)
        .where(inArray(players.teamId, [matchData.teamA.id, matchData.teamB.id]));

    const getPlayerStatus = (playerName: string, teamShortName: string) => {
        const lineups = matchData.lineups as any;
        if (!lineups || !lineups[teamShortName]) return null;

        const teamXi = lineups[teamShortName].playingXi || [];
        const teamSubs = lineups[teamShortName].subs || [];

        const isPlaying = teamXi.some((name: string) => name.includes(playerName));
        const isSub = teamSubs.some((name: string) => name.includes(playerName));

        if (isPlaying) return "playing";
        if (isSub) return "sub";
        return "benched";
    };

    const sortSquad = (squad: typeof squadPlayers, teamShortName: string) => {
        return squad.sort((a, b) => {
            const statusA = getPlayerStatus(a.name, teamShortName);
            const statusB = getPlayerStatus(b.name, teamShortName);
            const weight = { "playing": 3, "sub": 2, "benched": 1, null: 0 };
            return (weight[statusB as keyof typeof weight] || 0) - (weight[statusA as keyof typeof weight] || 0);
        });
    };

    const teamASquad = sortSquad(squadPlayers.filter((p) => p.teamId === matchData.teamA.id), matchData.teamA.shortName);
    const teamBSquad = sortSquad(squadPlayers.filter((p) => p.teamId === matchData.teamB.id), matchData.teamB.shortName);

    const rawData = matchData.scorecard as any;
    const isRichFormat = rawData && !Array.isArray(rawData) && rawData.playerStats;
    const parsedStats: any[] = isRichFormat ? rawData.playerStats : (Array.isArray(rawData) ? rawData : []);
    const matchInfo = isRichFormat ? rawData.matchInfo : null;
    const winProb = matchData.winProbability as { favorite: string; percentage: string } | null;

    const playerTeamMap = squadPlayers.reduce((acc, player) => {
        acc[player.name.toLowerCase()] = player.teamId;
        return acc;
    }, {} as Record<string, string>);

    const getInningsData = (battingTeamId: string, bowlingTeamId: string) => {
        const batters = parsedStats.filter(s =>
            playerTeamMap[s.playerName.toLowerCase()] === battingTeamId &&
            (s.role === "Batter" || s.ballsFaced > 0 || s.runs > 0 || (s.dismissal && s.dismissal !== "-" && s.dismissal !== ""))
        );
        const bowlers = parsedStats.filter(s =>
            playerTeamMap[s.playerName.toLowerCase()] === bowlingTeamId && s.oversBowled > 0
        );
        const fielders = parsedStats.filter(s =>
            playerTeamMap[s.playerName.toLowerCase()] === bowlingTeamId && s.catches > 0
        );
        return { batters, bowlers, fielders };
    };

    const teamAInnings = getInningsData(matchData.teamA.id, matchData.teamB.id);
    const teamBInnings = getInningsData(matchData.teamB.id, matchData.teamA.id);

    const formatDate = (date: Date) => new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(date);
    const formatTime = (date: Date) => new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).format(date);

    const InningsView = ({ battingTeam, bowlingTeam, stats }: { battingTeam: typeof matchData.teamA; bowlingTeam: typeof matchData.teamA; stats: ReturnType<typeof getInningsData>; }) => {
        const { batters, bowlers, fielders } = stats;
        if (batters.length === 0 && bowlers.length === 0) return null;

        const isActiveInnings = matchInfo && (matchInfo.battingTeam.toLowerCase().includes(battingTeam.shortName.toLowerCase()) || matchInfo.battingTeam.toLowerCase() === battingTeam.name.toLowerCase());

        return (
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden mb-8 shadow-lg">
                <div className="bg-stone-900/80 px-4 py-3 border-b border-white/[0.05] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center p-1">
                            {battingTeam.logoUrl ? (<Image src={`/teams/${battingTeam.shortName.toLowerCase()}.webp`} alt={battingTeam.shortName} width={24} height={24} className="object-contain" />) : (<span className="text-xs font-bold text-stone-400">{battingTeam.shortName}</span>)}
                        </div>
                        <h3 className="text-[15px] font-bold text-white tracking-wide">{battingTeam.name} Innings</h3>
                    </div>
                    {isActiveInnings && matchInfo && (
                        <div className="text-right">
                            <span className="text-lg font-black text-white">{matchInfo.totalScore}</span>
                            <span className="text-sm text-stone-400 ml-2">({matchInfo.overs} ov)</span>
                        </div>
                    )}
                </div>

                {batters.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-white/[0.02] text-[11px] uppercase tracking-wider text-stone-500 border-b border-white/[0.05]">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Batter</th>
                                    <th className="px-4 py-3 font-semibold text-stone-600">Dismissal</th>
                                    <th className="px-3 py-3 font-semibold text-right w-12">R</th>
                                    <th className="px-3 py-3 font-semibold text-right w-12">B</th>
                                    <th className="px-3 py-3 font-semibold text-right w-12">4s</th>
                                    <th className="px-3 py-3 font-semibold text-right w-12">6s</th>
                                    <th className="px-4 py-3 font-semibold text-right w-16">SR</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {batters.map((b, i) => {
                                    const sr = b.strikeRate || (b.ballsFaced > 0 ? ((b.runs / b.ballsFaced) * 100).toFixed(2) : "0.00");
                                    const isNotOut = b.dismissal?.toLowerCase().includes("not out");
                                    return (
                                        <tr key={i} className={`transition-colors ${isNotOut ? 'bg-orange-500/[0.05] hover:bg-orange-500/[0.08]' : 'hover:bg-white/[0.02]'}`}>
                                            <td className="px-4 py-3">
                                                <span className={`font-medium ${isNotOut ? 'text-white' : 'text-stone-300'}`}>
                                                    {b.playerName} {isNotOut && <span className="text-orange-500 ml-0.5">*</span>}
                                                </span>
                                            </td>
                                            <td className={`px-4 py-3 text-[13px] max-w-[200px] truncate ${isNotOut ? 'text-orange-300/60 font-medium' : 'text-stone-400'}`}>
                                                {b.dismissal === "-" ? "" : b.dismissal}
                                            </td>
                                            <td className="px-3 py-3 text-right font-bold text-white">{b.runs}</td>
                                            <td className={`px-3 py-3 text-right ${isNotOut ? 'text-orange-100/70' : 'text-stone-400'}`}>{b.ballsFaced}</td>
                                            <td className={`px-3 py-3 text-right ${isNotOut ? 'text-orange-100/70' : 'text-stone-400'}`}>{b.fours}</td>
                                            <td className={`px-3 py-3 text-right ${isNotOut ? 'text-orange-100/70' : 'text-stone-400'}`}>{b.sixes}</td>
                                            <td className={`px-4 py-3 text-right ${isNotOut ? 'text-orange-100/70' : 'text-stone-400'}`}>{sr}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {isActiveInnings && matchInfo && (
                    <div className="bg-white/[0.01] border-t border-white/[0.05] px-4 py-3 flex items-center text-sm">
                        <span className="font-semibold text-stone-300 mr-4">Extras</span>
                        <span className="text-stone-400">{matchInfo.extras}</span>
                    </div>
                )}

                {bowlers.length > 0 && (
                    <div className="overflow-x-auto border-t border-b-0 border-white/[0.05] mt-4">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-white/[0.02] text-[11px] uppercase tracking-wider text-stone-500 border-b border-white/[0.05]">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Bowler</th>
                                    <th className="px-3 py-3 font-semibold text-right w-12">O</th>
                                    <th className="px-3 py-3 font-semibold text-right w-12">M</th>
                                    <th className="px-3 py-3 font-semibold text-right w-12">R</th>
                                    <th className="px-3 py-3 font-semibold text-right w-12 text-white">W</th>
                                    <th className="px-4 py-3 font-semibold text-right w-16">ECON</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {bowlers.map((b, i) => {
                                    const totalBalls = getBallsFromOvers(b.oversBowled);
                                    const econ = b.economy || (totalBalls > 0 ? (b.runsConceded / (totalBalls / 6)).toFixed(2) : "0.00");
                                    return (
                                        <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                                            <td className="px-4 py-3 text-stone-300 font-medium">{b.playerName}</td>
                                            <td className="px-3 py-3 text-right text-stone-400">{b.oversBowled}</td>
                                            <td className="px-3 py-3 text-right text-stone-400">{b.maidens}</td>
                                            <td className="px-3 py-3 text-right text-stone-400">{b.runsConceded}</td>
                                            <td className="px-3 py-3 text-right font-bold text-white">{b.wickets}</td>
                                            <td className="px-4 py-3 text-right text-stone-400">{econ}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            <div className="bg-stone-900 border-b border-white/[0.05] pt-8 pb-0 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <Link href="/" className="inline-flex items-center text-xs text-stone-500 hover:text-stone-300 mb-6 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div className="flex items-center gap-6">
                            <div className="flex gap-4 items-center">
                                <Image src={`/teams/${matchData.teamA.shortName.toLowerCase()}.webp`} alt={matchData.teamA.shortName} width={48} height={48} className="object-contain" />
                                <span className="text-2xl font-black italic text-stone-700">VS</span>
                                <Image src={`/teams/${matchData.teamB.shortName.toLowerCase()}.webp`} alt={matchData.teamB.shortName} width={48} height={48} className="object-contain" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                    {matchData.teamA.shortName} vs {matchData.teamB.shortName}
                                </h1>
                                <p className="text-sm text-stone-400 mt-1 font-medium flex items-center gap-2">
                                    <Trophy className="w-3.5 h-3.5 text-orange-500" /> {matchData.tournamentName}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 text-right">
                            <CountdownTimer targetDate={matchData.startTime} />
                            <div className="text-[11px] text-stone-500 font-medium">
                                {formatDate(matchData.startTime)} • {formatTime(matchData.startTime)}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide border-b border-transparent">
                        <Link
                            href={`/matches/${matchId}?tab=scorecard`}
                            className={`pb-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${activeTab === 'scorecard' ? 'border-orange-500 text-white' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
                        >
                            Scorecard
                        </Link>
                        <Link
                            href={`/matches/${matchId}?tab=info`}
                            className={`pb-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${activeTab === 'info' ? 'border-orange-500 text-white' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
                        >
                            Match Info
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 mt-8 space-y-8">

                {activeTab === "scorecard" && (
                    <div className="space-y-6">

                        {winProb && (
                            <div className="bg-gradient-to-r from-orange-500/[0.08] to-transparent border border-orange-500/[0.1] rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-orange-500" />
                                    <span className="text-sm font-bold text-stone-300 uppercase tracking-wider">Live Win Probability</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <span className="text-orange-500 font-black text-xl">{winProb.favorite}</span>
                                    <span className="text-white font-mono font-bold bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20">
                                        {winProb.percentage}
                                    </span>
                                </div>
                            </div>
                        )}

                        {parsedStats.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                                <div className="w-16 h-16 rounded-full bg-white/[0.02] flex items-center justify-center mb-4 border border-white/[0.05]">
                                    <Activity className="w-8 h-8 text-stone-600" />
                                </div>
                                <h2 className="text-xl font-bold text-stone-200">Match Has Not Started</h2>
                                <p className="text-sm text-stone-500 mt-2 max-w-sm">Live scores and statistics will appear here once the first ball is bowled.</p>
                            </div>
                        ) : (
                            <>
                                <InningsView battingTeam={matchData.teamA} bowlingTeam={matchData.teamB} stats={teamAInnings} />
                                <InningsView battingTeam={matchData.teamB} bowlingTeam={matchData.teamA} stats={teamBInnings} />
                            </>
                        )}
                    </div>
                )}

                {activeTab === "info" && (
                    <div className="space-y-8">

                        {(matchData.venue || matchData.toss) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {matchData.venue && (
                                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-white/[0.04]"><MapPin className="w-5 h-5 text-stone-400" /></div>
                                        <div>
                                            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-0.5">Venue</p>
                                            <p className="text-sm font-medium text-stone-200">{matchData.venue}</p>
                                        </div>
                                    </div>
                                )}
                                {matchData.toss && (
                                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-orange-500/[0.1]"><Coins className="w-5 h-5 text-orange-500" /></div>
                                        <div>
                                            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-0.5">Toss Result</p>
                                            <p className="text-sm font-medium text-stone-200">{matchData.toss}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-2">
                                <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500 flex items-center gap-2">
                                    <Shield className="w-4 h-4" /> {matchData.lineups ? "Playing XI" : "Team Squads"}
                                </h2>
                                {Boolean(matchData.lineups) && (
                                    <span className="flex items-center gap-1.5 text-[10px] text-green-400 uppercase font-bold tracking-widest bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> Toss Completed
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { squad: teamASquad, team: matchData.teamA },
                                    { squad: teamBSquad, team: matchData.teamB },
                                ].map(({ squad, team }) => (
                                    <div key={team.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04] bg-black/20">
                                            <div className="flex items-center gap-2">
                                                <Image src={`/teams/${team.shortName.toLowerCase()}.webp`} alt={team.shortName} width={20} height={20} className="object-contain" />
                                                <h3 className="text-[13px] font-bold text-white">{team.shortName}</h3>
                                            </div>
                                            <span className="text-[10px] font-bold text-stone-600 bg-white/[0.04] px-2 py-0.5 rounded-md">{squad.length} players</span>
                                        </div>
                                        <div className="divide-y divide-white/[0.03]">
                                            {squad.map((player) => {
                                                const status = getPlayerStatus(player.name, team.shortName);
                                                const isBenched = status === "benched" && matchData.lineups !== null;

                                                return (
                                                    <div key={player.id} className={`flex items-center justify-between px-4 py-2.5 transition-colors group ${isBenched ? 'opacity-40 hover:opacity-60' : 'hover:bg-white/[0.02]'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.05] flex items-center justify-center ${status === 'playing' ? 'border-green-500/30' : ''}`}>
                                                                <span className="text-[9px] font-black text-stone-500">{player.role.substring(0, 3).toUpperCase()}</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[12.5px] font-medium text-stone-200">{player.name}</span>
                                                                <span className="text-[9px] text-stone-600 font-medium capitalize hidden md:block">{player.playingStyle?.split("•")[0]?.trim()}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-end min-w-[80px]">
                                                            {status === "playing" && (<span className="text-[9px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded font-bold uppercase border border-green-400/20">Playing</span>)}
                                                            {status === "sub" && (<span className="text-[9px] text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded font-bold uppercase border border-yellow-400/20">Impact Sub</span>)}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}