import { getServerSession } from "next-auth";
import { alias } from "drizzle-orm/pg-core";
import { eq, gte, asc } from "drizzle-orm";
import { db } from "@repo/db";
import { matches, teams } from "@repo/db/schema";
import { authOptions } from "@/lib/configs/authOptions";
import { AllMatches } from "@/components/AllMatches";
import { CalendarDays } from "lucide-react";

export default async function Matches() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");

  const allMatches = await db
    .select({
      id: matches.id,
      startTime: matches.startTime,
      teamAShort: teamA.shortName,
      teamBShort: teamB.shortName,
    })
    .from(matches)
    .innerJoin(teamA, eq(matches.teamAId, teamA.id))
    .innerJoin(teamB, eq(matches.teamBId, teamB.id))
    .where(gte(matches.startTime, new Date()))
    .orderBy(asc(matches.startTime));

  return (
    <div className="max-w-5xl mx-auto w-full p-5 md:p-8 pb-24">
      <div className="flex items-center gap-3 pb-6 border-b border-white/[0.05] mb-8">
        <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">
          <CalendarDays className="w-4.5 h-4.5 text-orange-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">All Fixtures</h1>
          <p className="text-[12px] text-stone-500 mt-0.5">{allMatches.length} upcoming matches</p>
        </div>
      </div>
      <AllMatches matches={allMatches} />
    </div>
  );
}