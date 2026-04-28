import { db } from "@repo/db";
import { matches, teams, players } from "@repo/db/schema";
import { eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Trophy, Activity, Target } from "lucide-react";
import Link from "next/link";
import { getBallsFromOvers } from "@/utils/BallsFromOvers";
import type { ScorecardEntry } from "@/types/ScorecardEntry";

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

    const rawScorecard = (match.scorecard as ScorecardEntry[]) || [];

    const teamAStats: ScorecardEntry[] = [];
    const teamBStats: ScorecardEntry[] = [];

    rawScorecard.forEach((stat) => {
        const teamId = playerTeamMap[stat.playerName.toLowerCase()];
        if (teamId === teamA.id) teamAStats.push(stat);
        else if (teamId === teamB.id) teamBStats.push(stat);
    });

    const InningsView = ({
        team,
        stats,
    }: {
        team: typeof teamA;
        stats: ScorecardEntry[];
    }) => {
        const batters = stats.filter((s) => s.ballsFaced > 0 || s.runs > 0);
        const bowlers = stats.filter((s) => s.oversBowled > 0);
        const fielders = stats.filter((s) => s.catches > 0);

        return (
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden mb-6">
                <div className="bg-[oklch(0.12_0.01_38)] px-4 py-3 border-b border-white/[0.05] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.05] flex items-center justify-center p-1">
                        {team.logoUrl ? (
                            <Image src={`/teams/${team.shortName.toLowerCase()}.webp`} alt={team.shortName} width={24} height={24} className="object-contain" />
                        ) : (
                            <span className="text-xs font-bold text-stone-400">{team.shortName}</span>
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{team.name}</h3>
                        <p className="text-[11px] text-stone-400 font-medium">Innings Details</p>
                    </div>
                </div>

                {batters.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-white/[0.02] text-[11px] uppercase tracking-wider text-stone-500 border-b border-white/[0.05]">
                                <tr>
                                    <th className="px-4 py-2.5 font-semibold">Batter <Activity className="w-3 h-3 inline ml-1 text-orange-500/70" /></th>
                                    <th className="px-3 py-2.5 font-semibold text-right">R</th>
                                    <th className="px-3 py-2.5 font-semibold text-right">B</th>
                                    <th className="px-3 py-2.5 font-semibold text-right">4s</th>
                                    <th className="px-3 py-2.5 font-semibold text-right">6s</th>
                                    <th className="px-4 py-2.5 font-semibold text-right">SR</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {batters.map((b, i) => {
                                    const sr = b.ballsFaced > 0 ? ((b.runs / b.ballsFaced) * 100).toFixed(2) : "0.00";
                                    return (
                                        <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                                            <td className="px-4 py-2.5 text-stone-200 font-medium">{b.playerName}</td>
                                            <td className="px-3 py-2.5 text-right font-bold text-white">{b.runs}</td>
                                            <td className="px-3 py-2.5 text-right text-stone-400">{b.ballsFaced}</td>
                                            <td className="px-3 py-2.5 text-right text-stone-400">{b.fours}</td>
                                            <td className="px-3 py-2.5 text-right text-stone-400">{b.sixes}</td>
                                            <td className="px-4 py-2.5 text-right text-orange-400/90 font-mono text-[13px]">{sr}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {bowlers.length > 0 && (
                    <div className="overflow-x-auto border-t border-white/[0.05]">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-white/[0.02] text-[11px] uppercase tracking-wider text-stone-500 border-b border-white/[0.05]">
                                <tr>
                                    <th className="px-4 py-2.5 font-semibold">Bowler <Target className="w-3 h-3 inline ml-1 text-orange-500/70" /></th>
                                    <th className="px-3 py-2.5 font-semibold text-right">O</th>
                                    <th className="px-3 py-2.5 font-semibold text-right">M</th>
                                    <th className="px-3 py-2.5 font-semibold text-right">R</th>
                                    <th className="px-3 py-2.5 font-semibold text-right">W</th>
                                    <th className="px-4 py-2.5 font-semibold text-right">ECON</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {bowlers.map((b, i) => {
                                    const totalBalls = getBallsFromOvers(b.oversBowled);
                                    const econ = totalBalls > 0 ? (b.runsConceded / (totalBalls / 6)).toFixed(2) : "0.00";
                                    return (
                                        <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                                            <td className="px-4 py-2.5 text-stone-200 font-medium">{b.playerName}</td>
                                            <td className="px-3 py-2.5 text-right text-stone-400">{b.oversBowled}</td>
                                            <td className="px-3 py-2.5 text-right text-stone-400">{b.maidens}</td>
                                            <td className="px-3 py-2.5 text-right text-stone-400">{b.runsConceded}</td>
                                            <td className="px-3 py-2.5 text-right font-bold text-white">{b.wickets}</td>
                                            <td className="px-4 py-2.5 text-right text-sky-400/90 font-mono text-[13px]">{econ}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {fielders.length > 0 && (
                    <div className="px-4 py-3 border-t border-white/[0.05] bg-white/[0.01]">
                        <span className="text-[11px] font-bold uppercase text-stone-500 tracking-wider">Catches: </span>
                        <span className="text-xs text-stone-300">
                            {fielders.map(f => `${f.playerName} (${f.catches})`).join(", ")}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                <div className="flex items-center gap-4 border-b border-white/[0.05] pb-6">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                            Match Scorecard
                        </h1>
                        <p className="text-sm text-stone-400 mt-1">
                            {teamA.name} vs {teamB.name}
                        </p>
                    </div>
                </div>

                {rawScorecard.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                        <Trophy className="w-10 h-10 text-stone-700 mb-4" />
                        <h2 className="text-lg font-semibold text-stone-300">Scorecard Not Available</h2>
                        <p className="text-sm text-stone-500 mt-1">The match data has not been updated yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {teamAStats.length > 0 && <InningsView team={teamA} stats={teamAStats} />}
                        {teamBStats.length > 0 && <InningsView team={teamB} stats={teamBStats} />}
                    </div>
                )}

            </div>
        </div>
    );
}