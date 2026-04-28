import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { redirect, notFound } from "next/navigation";
import { db } from "@repo/db";
import { matches, lobbies, teams, players, matchEntries, lobbyMembers } from "@repo/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { SquadBuilder } from "@/components/SquadBuilder";
import { ShieldX } from "lucide-react";
import Link from "next/link";

export default async function SquadBuilderPage({
  params,
}: {
  params: { lobbyId: string; matchId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/api/auth/signin");
  const userId = session.user.id;

  const { lobbyId, matchId } = await params;

  const [membership] = await db
    .select()
    .from(lobbyMembers)
    .where(and(eq(lobbyMembers.lobbyId, lobbyId), eq(lobbyMembers.userId, userId)));

  const membershipStatus = membership?.status;

  if (membershipStatus !== "accepted") {
    return (
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/15 flex items-center justify-center mx-auto">
            <ShieldX className="w-9 h-9 text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white mb-2">Access Restricted</h1>
            <p className="text-sm text-stone-500 leading-relaxed">
              You must be an accepted member of this lobby to build a squad.
            </p>
          </div>
          <div className="p-4 rounded-2xl border border-red-500/15 bg-red-500/[0.04]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Membership</span>
              <span className="font-semibold text-red-400 capitalize">{membershipStatus || "None"}</span>
            </div>
          </div>
          <Link href={`/lobby/${lobbyId}`}>
            <div className="inline-flex items-center justify-center gap-2 h-11 w-full rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] transition-colors text-stone-300 font-semibold text-sm cursor-pointer">
              ← Back to Lobby
            </div>
          </Link>
        </div>
      </div>
    );
  }

  const [lobby] = await db.select().from(lobbies).where(eq(lobbies.id, lobbyId));
  if (!lobby) notFound();

  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");

  const [match] = await db
    .select({
      id: matches.id,
      startTime: matches.startTime,
      teamAId: matches.teamAId,
      teamBId: matches.teamBId,
      teamAShort: teamA.shortName,
      teamBShort: teamB.shortName,
    })
    .from(matches)
    .innerJoin(teamA, eq(matches.teamAId, teamA.id))
    .innerJoin(teamB, eq(matches.teamBId, teamB.id))
    .where(eq(matches.id, matchId));

  if (!match) notFound();

  const availablePlayers = await db
    .select()
    .from(players)
    .where(inArray(players.teamId, [match.teamAId, match.teamBId]));

  const [existingEntry] = await db
    .select()
    .from(matchEntries)
    .where(
      and(
        eq(matchEntries.userId, userId),
        eq(matchEntries.lobbyId, lobbyId),
        eq(matchEntries.matchId, matchId)
      )
    );

  const initialSelection = existingEntry?.teamSelection || [];

  return (
    <div className="max-w-6xl mx-auto w-full h-[calc(100vh-64px)] md:h-screen flex flex-col bg-background overflow-hidden">
      <SquadBuilder
        lobbyId={lobbyId}
        match={match}
        players={availablePlayers}
        initialSelection={initialSelection}
      />
    </div>
  );
}