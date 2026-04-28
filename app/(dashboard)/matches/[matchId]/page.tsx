import { db } from "@repo/db";
import { matches, teams, tournaments, players } from "@repo/db/schema";
import { eq, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { notFound, redirect } from "next/navigation";
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
      scorecard: matches.scorecard,
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

  const teamASquad = squadPlayers.filter((p) => p.teamId === matchData.teamA.id);
  const teamBSquad = squadPlayers.filter((p) => p.teamId === matchData.teamB.id);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);

  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).format(date);

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

        <div className="relative z-10 p-8 md:p-12">
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

          <div className="mt-10 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-10">
            <div className="flex items-center gap-2.5">
              <CalendarDays className="w-4 h-4 text-stone-600" />
              <span className="text-sm font-semibold text-stone-300">{formatDate(matchData.startTime)}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-stone-600" />
              <span className="text-sm font-semibold text-stone-300">{formatTime(matchData.startTime)} IST</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" /> Team Squads
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { squad: teamASquad, team: matchData.teamA },
            { squad: teamBSquad, team: matchData.teamB },
          ].map(({ squad, team }) => (
            <div key={team.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                <h3 className="text-[13px] font-bold text-white">{team.shortName} Squad</h3>
                <span className="text-[10px] font-bold text-stone-600 bg-white/[0.04] px-2 py-0.5 rounded-md">{squad.length} players</span>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {squad.map((player) => (
                  <div key={player.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.05] flex items-center justify-center">
                        <span className="text-[9px] font-black text-stone-600 group-hover:text-stone-400 transition-colors">
                          {player.role.substring(0, 3).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[12.5px] font-medium text-stone-300 group-hover:text-white transition-colors">{player.name}</span>
                    </div>
                    <span className="text-[10px] text-stone-700 font-medium capitalize">{player.playingStyle?.split("•")[0]?.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}