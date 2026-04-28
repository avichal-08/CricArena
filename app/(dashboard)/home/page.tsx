import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { db } from "@repo/db";
import { matches, lobbies, teams, lobbyMembers, tournaments } from "@repo/db/schema";
import { eq, gte, asc, or, and, desc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { UpcomingMatches } from "@/components/UpcomingMatches";
import { MyLobbies } from "@/components/MyLobbies";
import { CampusLobby } from "@/components/CampusLobby";
import { CreateLobbyButton } from "@/components/CreateLobbyButton";
import { Flame } from "lucide-react";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  try {
    const [upcomingMatches, campusLobby, myLobbies] = await Promise.all([
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
        .where(gte(matches.startTime, startOfToday))
        .orderBy(asc(matches.startTime))
        .limit(5),

      db.select().from(lobbies).where(eq(lobbies.id, "d2e47eb4-d798-49e4-897a-2b3e8ff43912")),

      userId
        ? db
          .select({
            id: lobbies.id,
            name: lobbies.name,
            type: lobbies.type,
            mode: lobbies.mode,
            role: lobbyMembers.role,
            matchStartTime: matches.startTime,
            teamAShort: teamA.shortName,
            teamBShort: teamB.shortName,
            tournamentName: tournaments.name,
            tournamentEndDate: tournaments.endDate,
          })
          .from(lobbyMembers)
          .innerJoin(lobbies, eq(lobbyMembers.lobbyId, lobbies.id))
          .leftJoin(matches, eq(lobbies.matchId, matches.id))
          .leftJoin(tournaments, eq(lobbies.tournamentId, tournaments.id))
          .leftJoin(teamA, eq(matches.teamAId, teamA.id))
          .leftJoin(teamB, eq(matches.teamBId, teamB.id))
          .where(
            and(
              eq(lobbyMembers.userId, userId),
              eq(lobbyMembers.status, "accepted"),
              or(
                and(eq(lobbies.mode, "match"), gte(matches.startTime, startOfToday)),
                and(eq(lobbies.mode, "tournament"), gte(tournaments.endDate, startOfToday))
              )
            )
          )
          .orderBy(desc(lobbies.createdAt))
        : Promise.resolve([]),
    ]);

    return (
      <div className="max-w-5xl mx-auto w-full p-5 md:p-8 space-y-10 pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/[0.05]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-400">IPL 2026</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              {session?.user?.name ? `Hey, ${session.user.name.split(" ")[0]}` : "Overview"}
            </h1>
            <p className="text-[12px] text-stone-500 mt-1">Manage lobbies and predict upcoming fixtures</p>
          </div>
          <CreateLobbyButton />
        </div>

        <UpcomingMatches matches={upcomingMatches} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userId && myLobbies.length > 0 && <MyLobbies lobbies={myLobbies} />}
          <CampusLobby lobbies={campusLobby} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return (
      <div className="max-w-5xl mx-auto p-5 mt-10">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <p className="text-sm text-red-400 font-medium">Failed to load dashboard data. Please refresh.</p>
        </div>
      </div>
    );
  }
}