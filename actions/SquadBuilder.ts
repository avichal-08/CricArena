"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { inArray } from "drizzle-orm";

import { authOptions } from "@/lib/configs/authOptions";
import { db } from "@repo/db";
import { matchEntries, players } from "@repo/db/schema";
import { getPlayerCategory } from "@/utils/PlayerCategory";


export async function saveSquadAction(lobbyId: string, matchId: string, playerIds: string[], captainId: string, viceCaptainId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (playerIds.length !== 12) {
    throw new Error("Must select exactly 12 players");
  }
  if (!captainId || !viceCaptainId) {
    throw new Error("Must select captain and vice captain");
  }

  const selectedPlayers = await db
    .select()
    .from(players)
    .where(inArray(players.id, playerIds));

  const roleCounts = {
    BAT: selectedPlayers.filter((p) => getPlayerCategory(p.role) === 'BAT').length,
    BOWL: selectedPlayers.filter((p) => getPlayerCategory(p.role) === 'BOWL').length,
    AR: selectedPlayers.filter((p) => getPlayerCategory(p.role) === 'AR').length,
    WK: selectedPlayers.filter((p) => getPlayerCategory(p.role) === 'WK').length,
  };

  const hasAllRoles = roleCounts.BAT > 0 && roleCounts.BOWL > 0 && roleCounts.AR > 0 && roleCounts.WK > 0;

  if (!hasAllRoles) {
    throw new Error("Invalid Squad: Must select at least one Batsman, Bowler, All-Rounder, and Wicketkeeper.");
  }

  const teamCounts = selectedPlayers.reduce((acc, player) => {
    acc[player.teamId] = (acc[player.teamId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const exceedsTeamLimit = Object.values(teamCounts).some(count => count > 7);

  if (exceedsTeamLimit) {
    throw new Error("Invalid Squad: Cannot select more than 7 players from a single team.");
  }

  await db
    .insert(matchEntries)
    .values({
      userId: session.user.id,
      lobbyId,
      matchId,
      teamSelection: playerIds,
      captainId,
      viceCaptainId,
      prePredictions: {},
    })
    .onConflictDoUpdate({
      target: [matchEntries.userId, matchEntries.lobbyId, matchEntries.matchId],
      set: {
        teamSelection: playerIds,
        captainId,
        viceCaptainId
      },
    });

  revalidatePath(`/lobby/${lobbyId}`);
}