import { db } from "@repo/db";
import { matches, teams, tournaments, players } from "@repo/db/schema";
import { eq, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, Trophy, Shield, MapPin, Coins, TrendingUp } from "lucide-react";
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
      scorecard: matches.scorecard,
      venue: matches.venue,
      toss: matches.toss,
      lineups: matches.lineups,
      winProbability: matches.winProbability,
      teamA: { id: teamA.id, name: teamA.name, shortName: teamA.shortName, logoUrl: teamA.logoUrl },
      teamB: { id: teamB.id, name: teamB.name, shortName: teamB.shortName, logoUrl: teamB.logoUrl },
    })
    .from(matches)
    .innerJoin(tournaments, eq(matches.tournamentId, tournaments.id))
    .innerJoin(teamA, eq(matches.teamAId, teamA.id))
    .innerJoin(teamB, eq(matches.teamBId, teamB.id))
    .where(eq(matches.id, matchId));

  if (!matchData) notFound();

  if (matchData.scorecard) redirect(`/matches/${matchId}/scorecard`);

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

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);

  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).format(date);

  const winProb = matchData.winProbability as Record<string, string> | null;

  const getProb = (teamShort: string) => {
    if (!winProb) return null;
    const key = Object.keys(winProb).find(k => k.toLowerCase() === teamShort.toLowerCase());
    return key ? winProb[key] : null;
  };

  const teamAProb = getProb(matchData.teamA.shortName);
  const teamBProb = getProb(matchData.teamB.shortName);

  return (
    <div className="max-w-5xl mx-auto w-full p-5 md:p-8 space-y-10 pb-24">
      <div className="flex items-center justify-between pb-6 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 -ml-1 rounded-xl hover:bg-white/[0.05] transition-colors text-stone-500 hover:text-stone-300">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Trophy className="w-3 h-3 text-stone-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600">{matchData.tournamentName}</span>
            </div>
            <h1 className="text-lg font-bold text-white">Match Center</h1>
          </div>
        </div>
        <CreateLobbyButton />
      </div>

      <div className="relative rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/[0.03] to-transparent pointer-events-none" />

        <div className="relative z-10 p-8 md:p-12 pb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-24 h-24 md:w-28 md:h-28 relative flex items-center justify-center bg-white/[0.04] border border-white/[0.06] rounded-3xl shadow-xl p-5">
                <Image
                  src={`/teams/${matchData.teamA.shortName.toLowerCase()}.webp`}
                  alt={matchData.teamA.name}
                  width={100}
                  height={100}
                  className="object-contain drop-shadow-2xl"
                />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{matchData.teamA.shortName}</h2>
                <p className="text-[11px] text-stone-600 font-medium mt-0.5">{matchData.teamA.name}</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <span className="text-3xl font-black italic text-stone-800">VS</span>
              <CountdownTimer targetDate={matchData.startTime} />
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-24 h-24 md:w-28 md:h-28 relative flex items-center justify-center bg-white/[0.04] border border-white/[0.06] rounded-3xl shadow-xl p-5">
                <Image
                  src={`/teams/${matchData.teamB.shortName.toLowerCase()}.webp`}
                  alt={matchData.teamB.name}
                  width={100}
                  height={100}
                  className="object-contain drop-shadow-2xl"
                />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{matchData.teamB.shortName}</h2>
                <p className="text-[11px] text-stone-600 font-medium mt-0.5">{matchData.teamB.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/[0.05] bg-black/20">
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/[0.05]">

            <div className="p-4 flex-1 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-stone-500" />
                <span className="text-[13px] font-medium text-stone-300">{formatDate(matchData.startTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-500" />
                <span className="text-[13px] font-medium text-stone-300">{formatTime(matchData.startTime)}</span>
              </div>
            </div>

            {(matchData.venue || matchData.toss) && (
              <div className="p-4 flex-[1.5] flex flex-col justify-center gap-2 px-6">
                {matchData.venue && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />
                    <span className="text-[13px] text-stone-300">{matchData.venue}</span>
                  </div>
                )}
                {matchData.toss && (
                  <div className="flex items-start gap-2.5">
                    <Coins className="w-4 h-4 text-orange-500/80 mt-0.5 shrink-0" />
                    <span className="text-[13px] text-orange-100/90 font-medium">{matchData.toss}</span>
                  </div>
                )}
              </div>
            )}

            {winProb && (teamAProb || teamBProb) && (
              <div className="p-4 flex-1 flex flex-col items-center justify-center gap-1.5 bg-white/[0.01]">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-stone-500 font-bold mb-0.5">
                  <TrendingUp className="w-3 h-3" /> Win Probability
                </div>
                <div className="flex items-center gap-3">

                  {teamAProb && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-stone-300 font-bold text-[13px]">{matchData.teamA.shortName}</span>
                      <span className="text-sm font-mono font-bold text-sky-400 bg-sky-400/10 px-1.5 py-0.5 rounded border border-sky-400/20">
                        {teamAProb}{teamAProb.includes('%') ? '' : '%'}
                      </span>
                    </div>
                  )}

                  {teamAProb && teamBProb && <span className="text-stone-700 text-[10px] font-black italic">VS</span>}

                  {teamBProb && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-mono font-bold text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded border border-orange-400/20">
                        {teamBProb}{teamBProb.includes('%') ? '' : '%'}
                      </span>
                      <span className="text-stone-300 font-bold text-[13px]">{matchData.teamB.shortName}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> {matchData.lineups ? "Playing XI Announced" : "Team Squads"}
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
                <h3 className="text-[13px] font-bold text-white">{team.shortName}</h3>
                <span className="text-[10px] font-bold text-stone-600 bg-white/[0.04] px-2 py-0.5 rounded-md">{squad.length} players</span>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {squad.map((player) => {
                  const status = getPlayerStatus(player.name, team.shortName);
                  const isBenched = status === "benched" && matchData.lineups !== null; // Gray out if lineups are out and they aren't playing

                  return (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between px-4 py-2.5 transition-colors group ${isBenched ? 'opacity-40 hover:opacity-60' : 'hover:bg-white/[0.02]'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.05] flex items-center justify-center ${status === 'playing' ? 'border-green-500/30' : ''}`}>
                          <span className="text-[9px] font-black text-stone-500 transition-colors">
                            {player.role.substring(0, 3).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[12.5px] font-medium text-stone-200 transition-colors">
                            {player.name}
                          </span>
                          <span className="text-[9px] text-stone-600 font-medium capitalize hidden md:block">
                            {player.playingStyle?.split("•")[0]?.trim()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end min-w-[80px]">
                        {status === "playing" && (
                          <span className="text-[9px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-1 border border-green-400/20">
                            Playing
                          </span>
                        )}
                        {status === "sub" && (
                          <span className="text-[9px] text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-1 border border-yellow-400/20">
                            Impact Sub
                          </span>
                        )}
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
  );
}