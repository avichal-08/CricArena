import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { redirect, notFound } from "next/navigation";
import { db } from "@repo/db";
import { matches, lobbies, teams, players, matchEntries } from "@repo/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { SquadBuilder } from "@/components/SquadBuilder";

export default async function SquadBuilderPage({
  params
}: {
  params: { lobbyId: string; matchId: string }
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/api/auth/signin");
  const userId = session.user.id;

  const { lobbyId, matchId } = await params;

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
    <div className="max-w-6xl mx-auto w-full h-[calc(100vh-64px)] md:h-screen flex flex-col bg-black overflow-hidden">
      <SquadBuilder
        lobbyId={lobbyId}
        match={match} 
        players={availablePlayers} 
        initialSelection={initialSelection} 
      />
    </div>
  );
}