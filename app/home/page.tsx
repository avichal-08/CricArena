import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/configs/authOptions";
import { db } from "@repo/db";
import { matches, lobbies, teams, matchEntries } from "@repo/db/schema";
import { eq, gte, asc, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { UpcomingMatches } from "@/components/UpcomingMatches";
import { MyLobbies } from "@/components/MyLobbies";
import { GlobalLobbies } from "@/components/GlobalLobby";
import { CreateLobbyButton } from "@/components/CreateLobbyButton";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session){
    redirect("/")
  }

  const userId = session?.user?.id;

  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");

  try {
    const [upcomingMatches, globalLobbies, myLobbies] = await Promise.all([
      db
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
        .orderBy(asc(matches.startTime))
        .limit(5),

      db.select().from(lobbies).where(eq(lobbies.type, "public")).limit(5),

      userId
        ? db
            .selectDistinct({
              id: lobbies.id,
              name: lobbies.name,
              mode: lobbies.mode,
            })
            .from(lobbies)
            .leftJoin(matchEntries, eq(lobbies.id, matchEntries.lobbyId))
            .where(or(eq(lobbies.createdBy, userId), eq(matchEntries.userId, userId)))
        : Promise.resolve([]),
    ]);

    return (
      <div className="max-w-5xl mx-auto w-full p-5 md:p-8 space-y-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800/60 pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Overview</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage your lobbies and predict upcoming fixtures.</p>
          </div>
          <CreateLobbyButton/>
        </div>

        <UpcomingMatches matches={upcomingMatches} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {userId && myLobbies.length > 0 && <MyLobbies lobbies={myLobbies} />}
          <GlobalLobbies lobbies={globalLobbies} />
        </div>
        
      </div>
    );
  } catch (error) {
    return (
      <div className="max-w-5xl mx-auto p-5 mt-10">
        <div className="p-4 rounded-md bg-red-950/20 border border-red-900/30 text-red-500 text-sm font-medium">
          Failed to load dashboard data. Please check your database connection.
        </div>
      </div>
    );
  }
}
