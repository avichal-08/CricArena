import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { redirect, notFound } from "next/navigation";
import { db } from "@repo/db";
import { lobbies, lobbyMembers, users, matches, teams, matchEntries } from "@repo/db/schema";
import { eq, and, gte, asc, desc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { JoinLobbyButton } from "@/components/JoinLobbyButton";
import { LobbyDashboardClient } from "@/components/LobbyDashboardClient";

export default async function LobbyDashboard({ params }: { params: { lobbyId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/api/auth/signin");

  const userId = session.user.id;
  const { lobbyId } = await params;

  const [lobby] = await db.select().from(lobbies).where(eq(lobbies.id, lobbyId));
  if (!lobby) notFound();

  const [membership] = await db
    .select()
    .from(lobbyMembers)
    .where(and(eq(lobbyMembers.lobbyId, lobbyId), eq(lobbyMembers.userId, userId)));

  if (!membership) {
    return <JoinLobbyButton lobby={lobby} userId={userId} />;
  }

  if (membership.status === "pending") {
    return (
      <div>
        Your Join Request in pending.
      </div>
    )
  }

  const isAdmin = membership.role === "admin";

  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");

  const [upcomingMatches, leaderboard, allMembers, joinRequests] = await Promise.all([
    db
      .select({ id: matches.id, startTime: matches.startTime, tournamentId: matches.tournamentId ,teamAShort: teamA.shortName, teamBShort: teamB.shortName })
      .from(matches)
      .innerJoin(teamA, eq(matches.teamAId, teamA.id))
      .innerJoin(teamB, eq(matches.teamBId, teamB.id))
      .where(lobby.mode === "match" ? eq(matches.id, lobby.matchId!) : and(eq(matches.tournamentId, lobby.tournamentId), gte(matches.startTime, new Date())))
      .orderBy(asc(matches.startTime)),

    db
      .select({ id: matchEntries.id, score: matchEntries.score, userId: users.id, userName: users.name, userImage: users.image })
      .from(matchEntries)
      .innerJoin(users, eq(matchEntries.userId, users.id))
      .where(eq(matchEntries.lobbyId, lobbyId))
      .orderBy(desc(matchEntries.score)),

    db
      .select({ memberId: lobbyMembers.id, userId: users.id, name: users.name, image: users.image, role: lobbyMembers.role })
      .from(lobbyMembers)
      .innerJoin(users, eq(lobbyMembers.userId, users.id))
      .where(and(eq(lobbyMembers.lobbyId, lobbyId), eq(lobbyMembers.status, "accepted"))),

    db
      .select({ memberId: lobbyMembers.id, userId: users.id, name: users.name, image: users.image, role: lobbyMembers.role })
      .from(lobbyMembers)
      .innerJoin(users, eq(lobbyMembers.userId, users.id))
      .where(and(eq(lobbyMembers.lobbyId, lobbyId), eq(lobbyMembers.status, "pending")))
  ]);

  return (
    <LobbyDashboardClient
      lobby={lobby}
      isAdmin={isAdmin}
      currentUserId={userId}
      upcomingMatches={upcomingMatches}
      leaderboard={leaderboard}
      allMembers={allMembers}
      joinRequests={joinRequests}
    />
  );
}