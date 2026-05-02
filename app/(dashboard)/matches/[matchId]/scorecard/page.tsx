import { db } from "@repo/db";
import { matches, teams, players } from "@repo/db/schema";
import { eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Trophy, ChevronLeft, BarChart2 } from "lucide-react";
import Link from "next/link";

import { RichScorecard } from "@/types/RichScorecard";

export default async function MatchScorecardPage({
    params,
}: {
    params: { matchId: string };
}) {
    const { matchId } = await params;

    const [match] = await db
        .select()
        .from(matches)
        .where(eq(matches.id, matchId));

    if (!match) notFound();

    const [[teamA], [teamB]] = await Promise.all([
        db.select().from(teams).where(eq(teams.id, match.teamAId)),
        db.select().from(teams).where(eq(teams.id, match.teamBId)),
    ]);

    const matchPlayers = await db
        .select()
        .from(players)
        .where(inArray(players.teamId, [match.teamAId, match.teamBId]));

    const playerTeamMap = matchPlayers.reduce((acc, player) => {
        acc[player.name.toLowerCase()] = player.teamId;
        return acc;
    }, {} as Record<string, string>);

    const rawData = match.scorecard as any;
    const isRichFormat = rawData && !Array.isArray(rawData) && rawData.playerStats;

    const parsedStats: any[] = isRichFormat ? rawData.playerStats : (Array.isArray(rawData) ? rawData : []);
    const matchInfo = isRichFormat ? rawData.matchInfo : null;

    const getInningsData = (battingTeamId: string, bowlingTeamId: string) => {
        const batters = parsedStats.filter(s =>
            playerTeamMap[s.playerName.toLowerCase()] === battingTeamId &&
            (
                s.role === "Batter" ||
                s.ballsFaced > 0 ||
                s.runs > 0 ||
                (s.dismissal && s.dismissal !== "-" && s.dismissal !== "")
            )
        );
        const bowlers = parsedStats.filter(s =>
            playerTeamMap[s.playerName.toLowerCase()] === bowlingTeamId &&
            s.oversBowled > 0
        );
        const fielders = parsedStats.filter(s =>
            playerTeamMap[s.playerName.toLowerCase()] === bowlingTeamId &&
            s.catches > 0
        );

        return { batters, bowlers, fielders };
    };

    const teamAInnings = getInningsData(teamA.id, teamB.id);
    const teamBInnings = getInningsData(teamB.id, teamA.id);

    const InningsView = ({
        battingTeam,
        bowlingTeam,
        stats
    }: {
        battingTeam: typeof teamA;
        bowlingTeam: typeof teamA;
        stats: ReturnType<typeof getInningsData>;
    }) => {
        const { batters, bowlers, fielders } = stats;
        if (batters.length === 0 && bowlers.length === 0) return null;

        const isActiveInnings = matchInfo && (
            matchInfo.battingTeam.toLowerCase().includes(battingTeam.shortName.toLowerCase()) ||
            matchInfo.battingTeam.toLowerCase() === battingTeam.name.toLowerCase()
        );

        return (
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden mb-8 shadow-lg">
                <div className="bg-stone-900/80 px-4 py-3 border-b border-white/[0.05] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center p-1">
                            {battingTeam.logoUrl ? (
                                <Image src={`/teams/${battingTeam.shortName.toLowerCase()}.webp`} alt={battingTeam.shortName} width={24} height={24} className="object-contain" />
                            ) : (
                                <span className="text-xs font-bold text-stone-400">{battingTeam.shortName}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-[15px] font-bold text-white tracking-wide">{battingTeam.name} Innings</h3>
                        </div>
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
                                    <th className="px-4 py-3 font-semibold"></th>
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
                                        <tr
                                            key={i}
                                            className={`transition-colors ${isNotOut
                                                ? 'bg-orange-500/[0.05] hover:bg-orange-500/[0.08]'
                                                : 'hover:bg-white/[0.02]'
                                                }`}
                                        >
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

                {fielders.length > 0 && (
                    <div className="px-4 py-3 border-t border-white/[0.05] bg-stone-900/50">
                        <span className="text-[11px] font-bold uppercase text-stone-500 tracking-wider mr-2">Catches: </span>
                        <span className="text-xs text-stone-400 leading-relaxed">
                            {fielders.map(f => `${f.playerName} (${f.catches})`).join(", ")}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background pb-12">

            <div className="bg-stone-900 border-b border-white/[0.05] pt-8 pb-6 px-4 md:px-8 mb-8">
                <div className="max-w-4xl mx-auto">
                    <Link href={`/matches/${matchId}`} className="inline-flex items-center text-xs text-orange-500 hover:text-orange-400 mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Match
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                                {teamA.shortName} vs {teamB.shortName}
                            </h1>
                            <p className="text-sm text-stone-400 mt-2 font-medium">
                                Match Scorecard & Innings Breakdown
                            </p>
                        </div>

                        {matchInfo && (
                            <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-4 py-2 flex items-center gap-4">
                                <div>
                                    <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wider mb-0.5">Current Run Rate</p>
                                    <p className="text-sm font-mono text-white flex items-center gap-1.5">
                                        <BarChart2 className="w-3.5 h-3.5 text-orange-500" /> {matchInfo.crr}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-6">
                {parsedStats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                        <div className="w-16 h-16 rounded-full bg-white/[0.02] flex items-center justify-center mb-4 border border-white/[0.05]">
                            <Trophy className="w-8 h-8 text-stone-600" />
                        </div>
                        <h2 className="text-xl font-bold text-stone-200">Scorecard Not Available</h2>
                        <p className="text-sm text-stone-500 mt-2 max-w-sm">Live data has not been pasted for this match yet. Check back once the innings begins.</p>
                    </div>
                ) : (
                    <>
                        <InningsView battingTeam={teamA} bowlingTeam={teamB} stats={teamAInnings} />
                        <InningsView battingTeam={teamB} bowlingTeam={teamA} stats={teamBInnings} />
                    </>
                )}
            </div>
        </div>
    );
}