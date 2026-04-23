"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { db } from "@repo/db";
import { matchEntries, players } from "@repo/db/schema";
import { revalidatePath } from "next/cache";
import { inArray } from "drizzle-orm";

const getPlayerCategory = (role: string) => {
  const r = role.toLowerCase();
  if (r.includes('bat')) return 'BAT';
  if (r.includes('bowl')) return 'BOWL';
  if (r.includes('wk') || r.includes('wicket')) return 'WK';
  if (r.includes('all') || r === 'ar') return 'AR';
  return 'OTHER';
};

export async function saveSquadAction(lobbyId: string, matchId: string, playerIds: string[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (playerIds.length !== 12) {
    throw new Error("Must select exactly 12 players");
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

  await db
    .insert(matchEntries)
    .values({
      userId: session.user.id,
      lobbyId,
      matchId,
      teamSelection: playerIds,
      prePredictions: {}, 
    })
    .onConflictDoUpdate({
      target: [matchEntries.userId, matchEntries.lobbyId, matchEntries.matchId],
      set: { teamSelection: playerIds },
    });

  revalidatePath(`/lobby/${lobbyId}`);
}