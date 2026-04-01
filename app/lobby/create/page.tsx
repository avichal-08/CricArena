import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { redirect } from "next/navigation";
import { db } from "@repo/db";
import { matches, teams, tournaments } from "@repo/db/schema";
import { eq, gte, asc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { CreateLobbyForm } from "@/components/CreateLobbyForm";

export default async function CreateLobbyPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/api/auth/signin");

  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");

  // 1. Fetch data on the server
  const upcomingMatches = await db
    .select({
      id: matches.id,
      tournamentId: matches.tournamentId,
      startTime: matches.startTime,
      teamAShort: teamA.shortName,
      teamBShort: teamB.shortName,
    })
    .from(matches)
    .innerJoin(teamA, eq(matches.teamAId, teamA.id))
    .innerJoin(teamB, eq(matches.teamBId, teamB.id))
    .where(gte(matches.startTime, new Date()))
    .orderBy(asc(matches.startTime));

  const [activeTournament] = await db.select().from(tournaments).limit(1);

  // 2. Pass it to the purely interactive Client Component
  return (
    <div className="max-w-2xl mx-auto w-full p-6 md:p-10 pb-20">
      <CreateLobbyForm 
        userId={session.user.id} 
        upcomingMatches={upcomingMatches} 
        activeTournamentId={activeTournament?.id} 
      />
    </div>
  );
}