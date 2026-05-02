import { db } from "@repo/db";
import { matches, teams } from "@repo/db/schema";
import { eq, gte, lte, asc, and } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { PreMatchFormClient } from "@/components/PreMatchForm";

export default async function AdminPreMatchPage() {
  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");
  
  const now = new Date();
  const fiveDaysAgo = new Date(now);
  fiveDaysAgo.setDate(now.getDate() - 5);
  const fiveDaysFromNow = new Date(now);
  fiveDaysFromNow.setDate(now.getDate() + 5);

  const recentMatches = await db
    .select({
      id: matches.id,
      startTime: matches.startTime,
      teamAShort: teamA.shortName,
      teamBShort: teamB.shortName,
    })
    .from(matches)
    .innerJoin(teamA, eq(matches.teamAId, teamA.id))
    .innerJoin(teamB, eq(matches.teamBId, teamB.id))
    .where(and(gte(matches.startTime, fiveDaysAgo), lte(matches.startTime, fiveDaysFromNow)))
    .orderBy(asc(matches.startTime));

  return (
    <div className="max-w-4xl mx-auto w-full p-5 md:p-8 pb-24">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-2">Pre-Match Updates</h2>
        <p className="text-sm text-stone-400">
          Paste partial or complete JSON payloads to update the venue, toss, win probability, and lineups. 
          Fields omitted from the JSON will not be overwritten.
        </p>
      </div>
      
      <PreMatchFormClient recentMatches={recentMatches} />
    </div>
  );
}