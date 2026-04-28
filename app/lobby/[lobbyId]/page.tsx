import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { redirect, notFound } from "next/navigation";
import { db } from "@repo/db";
import { lobbies, lobbyMembers, users, matches, teams, matchEntries } from "@repo/db/schema";
import { eq, and, gte, asc, desc, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { JoinLobbyButton } from "@/components/JoinLobbyButton";
import { LobbyDashboardClient } from "@/components/LobbyDashboardClient";
import { Clock, XCircle, Flame } from "lucide-react";
import Link from "next/link";

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
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="relative mx-auto w-20 h-20">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center mx-auto">
              <Clock className="w-9 h-9 text-amber-400" />
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 border-2 border-background flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </span>
          </div>

          <div>
            <h1 className="text-xl font-bold text-white mb-2">Request Pending</h1>
            <p className="text-sm text-stone-500 leading-relaxed">
              Your request to join{" "}
              <span className="text-stone-300 font-semibold">{lobby.name}</span>{" "}
              is waiting for admin approval. You'll be notified once it's reviewed.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-amber-500/15 bg-amber-500/[0.04]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Status</span>
              <span className="flex items-center gap-2 font-semibold text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Awaiting Review
              </span>
            </div>
          </div>

          <Link href="/home">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-300 transition-colors cursor-pointer">
              ← Back to Home
            </div>
          </Link>
        </div>
      </div>
    );
  }

  if (membership.status === "rejected") {
    return (
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/15 flex items-center justify-center mx-auto">
            <XCircle className="w-9 h-9 text-red-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white mb-2">Request Declined</h1>
            <p className="text-sm text-stone-500 leading-relaxed">
              Your request to join{" "}
              <span className="text-stone-300 font-semibold">{lobby.name}</span>{" "}
              was not approved. You can explore other public arenas or create your own.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-red-500/15 bg-red-500/[0.04]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Status</span>
              <span className="font-semibold text-red-400">Access Denied</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Link href="/lobby/public">
              <div className="flex items-center justify-center gap-2 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold text-sm cursor-pointer">
                <Flame className="w-4 h-4" />
                Browse Public Arenas
              </div>
            </Link>
            <Link href="/home">
              <div className="flex items-center justify-center h-10 rounded-xl text-stone-500 hover:text-stone-300 transition-colors text-sm font-medium cursor-pointer">
                Back to Home
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = membership.role === "admin";

  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");

  const [upcomingMatches, leaderboard, allMembers, joinRequests] = await Promise.all([
    db
      .select({
        id: matches.id,
        startTime: matches.startTime,
        tournamentId: matches.tournamentId,
        teamAShort: teamA.shortName,
        teamBShort: teamB.shortName,
      })
      .from(matches)
      .innerJoin(teamA, eq(matches.teamAId, teamA.id))
      .innerJoin(teamB, eq(matches.teamBId, teamB.id))
      .where(
        lobby.mode === "match"
          ? eq(matches.id, lobby.matchId!)
          : and(eq(matches.tournamentId, lobby.tournamentId), gte(matches.startTime, new Date()))
      )
      .orderBy(asc(matches.startTime)),

    db
      .select({
        userId: users.id,
        userName: users.name,
        userImage: users.image,
        score: sql<number>`cast(sum(${matchEntries.score}) as integer)`,
      })
      .from(matchEntries)
      .innerJoin(users, eq(matchEntries.userId, users.id))
      .where(eq(matchEntries.lobbyId, lobbyId))
      .groupBy(users.id, users.name, users.image)
      .orderBy(desc(sql`sum(${matchEntries.score})`)),

    db
      .select({
        memberId: lobbyMembers.id,
        userId: users.id,
        name: users.name,
        image: users.image,
        role: lobbyMembers.role,
      })
      .from(lobbyMembers)
      .innerJoin(users, eq(lobbyMembers.userId, users.id))
      .where(and(eq(lobbyMembers.lobbyId, lobbyId), eq(lobbyMembers.status, "accepted"))),

    db
      .select({
        memberId: lobbyMembers.id,
        userId: users.id,
        name: users.name,
        image: users.image,
        role: lobbyMembers.role,
      })
      .from(lobbyMembers)
      .innerJoin(users, eq(lobbyMembers.userId, users.id))
      .where(and(eq(lobbyMembers.lobbyId, lobbyId), eq(lobbyMembers.status, "pending"))),
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