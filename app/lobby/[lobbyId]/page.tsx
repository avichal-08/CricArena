import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { redirect, notFound } from "next/navigation";
import { db } from "@repo/db";
import { matches, lobbies, teams, matchEntries, users, lobbyMembers } from "@repo/db/schema";
import { eq, and, desc, gte, asc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import Link from "next/link";
import { ArrowLeft, Users, Trophy, Clock, Swords, CalendarDays, ChevronRight, UserPlus, Clock4, Settings, Globe } from "lucide-react";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { revalidatePath } from "next/cache";

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

  const isMember = membership?.status === "accepted";
  const isPending = membership?.status === "pending";
  const isAdmin = membership?.role === "admin";

  async function joinLobby() {
    const initialStatus = lobby.type === "public" ? "accepted" : "pending";
    
    await db.insert(lobbyMembers).values({
      lobbyId,
      userId,
      role: "member",
      status: initialStatus,
    });
    revalidatePath(`/lobby/${lobbyId}`);
  }

  if (!membership) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 border border-zinc-800 rounded-2xl bg-black text-center space-y-6">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-zinc-800">
          <Globe className="w-8 h-8 text-zinc-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white mb-2">{lobby.name}</h1>
          <p className="text-sm text-zinc-500">
            {lobby.type === 'private' ? "This is a private lobby. You must request access to join." : "This is a public lobby."}
          </p>
        </div>
        <form action={joinLobby}>
          <button className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors flex justify-center items-center gap-2">
             <UserPlus className="w-4 h-4" /> {lobby.type === 'private' ? "Request to Join" : "Join Lobby instantly"}
          </button>
        </form>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 border border-zinc-800 rounded-2xl bg-black text-center space-y-6">
         <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto border border-blue-900/50">
          <Clock4 className="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white mb-2">Request Sent</h1>
          <p className="text-sm text-zinc-500">
            Waiting for the lobby admin to approve your request. Check back later!
          </p>
        </div>
        <Link href="/home" className="block text-sm text-zinc-400 hover:text-white mt-4">Return Home</Link>
      </div>
    );
  }

  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");

  const [upcomingMatches, leaderboard] = await Promise.all([
    db
      .select({ id: matches.id, startTime: matches.startTime, teamAShort: teamA.shortName, teamBShort: teamB.shortName })
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
      .orderBy(desc(matchEntries.score))
  ]);

  return (
    <div className="max-w-6xl mx-auto w-full p-5 md:p-10 space-y-10 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800/60 pb-8">
        <div className="flex items-center gap-5">
          <Link href="/" className="p-2 -ml-2 rounded-md hover:bg-zinc-900 transition-colors text-zinc-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{lobby.name}</h1>
            <div className="flex items-center gap-3 mt-1">
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded">
                {lobby.mode}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <CopyLinkButton lobbyId={lobby.id} />
          {isAdmin && lobby.type === 'private' && (
            <Link href={`/lobby/${lobby.id}/admin`}>
              <button className="flex items-center gap-2 bg-zinc-900 text-white border border-zinc-700 hover:bg-zinc-800 transition-colors px-4 py-2.5 rounded-md font-medium text-sm">
                <Settings className="w-4 h-4" /> Manage Requests
              </button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" /> {lobby.mode === "match" ? "Target Match" : "Upcoming Schedule"}
          </h2>
          <div className="space-y-3">
            {upcomingMatches.map((match) => (
              <Link key={match.id} href={`/lobby/${lobby.id}/match/${match.id}`}>
                <div className="group relative flex items-center justify-between p-5 rounded-xl border border-zinc-800 bg-black hover:border-zinc-600 transition-all active:scale-[0.99]">
                   <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-zinc-300">{match.teamAShort} vs {match.teamBShort}</span>
                   </div>
                   <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Trophy className="w-4 h-4" /> Standings
          </h2>
          <div className="rounded-xl border border-zinc-800 bg-black overflow-hidden shadow-2xl shadow-black">
          </div>
        </div>
      </div>
    </div>
  );
}