import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { redirect } from "next/navigation";
import { db } from "@repo/db";
import { matches, teams, users } from "@repo/db/schema";
import { eq, desc, gte, asc, and, lte } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { ScoringFormClient } from "@/components/ScoringForm";

export default async function AdminScoringPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/api/auth/signin");

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
  if (user?.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center text-red-500 font-mono">
        403 | STRICTLY CLASSIFIED: ADMIN CLEARANCE REQUIRED
      </div>
    );
  }

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
    .where(
      and(
        gte(matches.startTime, fiveDaysAgo),
        lte(matches.startTime, fiveDaysFromNow)
      )
    )
    .orderBy(asc(matches.startTime));

  return (
    <div className="max-w-4xl mx-auto w-full p-6 md:p-10 pb-24">
      <ScoringFormClient recentMatches={recentMatches} />
    </div>
  );
}