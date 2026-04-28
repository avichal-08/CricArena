import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { redirect } from "next/navigation";
import { db } from "@repo/db";
import { matches, teams, users } from "@repo/db/schema";
import { eq, desc, gte, asc, and, lte } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { ScoringFormClient } from "@/components/ScoringForm";
import { ShieldAlert } from "lucide-react";

export default async function AdminScoringPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/api/auth/signin");

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/15 flex items-center justify-center">
          <ShieldAlert className="w-7 h-7 text-red-400" />
        </div>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white">Access Denied</h1>
          <p className="text-sm text-stone-500 mt-1 font-mono">403 · Admin clearance required</p>
        </div>
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
    .where(and(gte(matches.startTime, fiveDaysAgo), lte(matches.startTime, fiveDaysFromNow)))
    .orderBy(asc(matches.startTime));

  return (
    <div className="max-w-4xl mx-auto w-full p-5 md:p-8 pb-24">
      <ScoringFormClient recentMatches={recentMatches} />
    </div>
  );
}