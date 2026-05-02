"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { db } from "@repo/db";
import { matchEntries, players, users, matches } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import type { ScorecardPlayer } from "@/types/ScorecardPlayer";
import { getBallsFromOvers } from "@/utils/BallsFromOvers";

export async function processMatchScores(matchId: string, scorecardJson: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [currentUser] = await db.select().from(users).where(eq(users.id, session.user.id));
  if (currentUser?.role !== "admin") throw new Error("Forbidden: Admin clearance required.");

  let fullScoreData;
  try {
    fullScoreData = JSON.parse(scorecardJson);
  } catch (e) {
    throw new Error("Invalid JSON format. Check syntax.");
  }

  const scorecard: ScorecardPlayer[] = fullScoreData.playerStats;

  await db.update(matches).set({ scorecard: fullScoreData }).where(eq(matches.id, matchId));

  const entries = await db.select().from(matchEntries).where(eq(matchEntries.matchId, matchId));
  if (entries.length === 0) throw new Error("No squads were submitted for this match.");

  const allPlayers = await db.select().from(players);
  const pointDictionary: Record<string, number> = {};

  for (const stats of scorecard) {
    const dbPlayer = allPlayers.find(p => p.name.toLowerCase() === stats.playerName.toLowerCase());
    if (!dbPlayer) continue;

    let points = 0;

    points += (stats.runs || 0) * 1;
    points += (stats.fours || 0) * 1;
    points += (stats.sixes || 0) * 2;

    if (stats.runs >= 100) points += 16;
    else if (stats.runs >= 50) points += 8;
    else if (stats.runs >= 30) points += 4;
    else if (stats.runs == 0 && stats.ballsFaced > 0) points -= 4;

    if ((stats.ballsFaced || 0) >= 10) {
      const strikeRate = (stats.runs / stats.ballsFaced) * 100;
      if (strikeRate > 170) points += 6;
      else if (strikeRate > 150) points += 4;
      else if (strikeRate >= 130) points += 2;
      else if (strikeRate < 50) points -= 6;
      else if (strikeRate < 60) points -= 4;
      else if (strikeRate < 70) points -= 2;
    }

    const wkts = stats.wickets || 0;
    points += wkts * 25;
    points += (stats.maidens || 0) * 12;

    if (wkts >= 5) points += 16;
    else if (wkts >= 4) points += 8;
    else if (wkts >= 3) points += 4;

    const overs = stats.oversBowled || 0;
    if (overs >= 2) {
      const totalBalls = getBallsFromOvers(overs);
      const economyRate = (stats.runsConceded || 0) / (totalBalls / 6);

      if (economyRate < 5) points += 6;
      else if (economyRate < 6) points += 4;
      else if (economyRate <= 7) points += 2;
      else if (economyRate > 12) points -= 6;
      else if (economyRate > 11) points -= 4;
      else if (economyRate > 10) points -= 2;
    }

    points += (stats.catches || 0) * 8;
    if (stats.catches >= 3) points += 4;

    pointDictionary[dbPlayer.id] = points;
  }

  let processedCount = 0;
  for (const entry of entries) {
    let userTotalScore = 0;
    const userBreakdown: Record<string, number> = {};

    for (const playerId of entry.teamSelection) {
      let playerPoints = pointDictionary[playerId] || 0;

      if (playerId === entry.captainId) {
        playerPoints *= 2;
      } else if (playerId === entry.viceCaptainId) {
        playerPoints *= 1.5;
      }

      userTotalScore += playerPoints;
      userBreakdown[playerId] = playerPoints;
    }

    await db.update(matchEntries)
      .set({
        score: userTotalScore,
        pointsBreakdown: userBreakdown
      })
      .where(eq(matchEntries.id, entry.id));

    processedCount++;
  }

  revalidatePath("/", "layout");
  return { success: true, processedCount };
}