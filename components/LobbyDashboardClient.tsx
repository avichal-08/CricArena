"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Trophy,
  ChevronRight,
} from "lucide-react";

import { CopyLinkButton } from "@/components/CopyLinkButton";
import { RequestsList } from "@/components/RequestsList";
import { MembersList } from "@/components/MembersList";
import { Leaderboard } from "@/components/Leaderboard";
import { LobbyType } from "@/types/Lobby";
import { MatchType } from "@/types/Match";
import { LeaderboardMember, LeaderboardMemberDb } from "@/types/LeaderboardMember";
import { MemberType } from "@/types/Member";
import { JoinRequests } from "@/types/JoinRequests";
import { formatLeaderboardData } from "@/utils/FormatLeaderboardData";

type LobbyDashboardClientArguments = {
  lobby: LobbyType,
  isAdmin: boolean,
  currentUserId: string,
  upcomingMatches: MatchType[],
  leaderboard: LeaderboardMemberDb[],
  allMembers: MemberType[],
  joinRequests: JoinRequests[]
}

export function LobbyDashboardClient({
  lobby,
  isAdmin,
  currentUserId,
  upcomingMatches,
  leaderboard,
  allMembers,
  joinRequests
}: LobbyDashboardClientArguments) {

  const [activeTab, setActiveTab] = useState<"lobby" | "members" | "requests">("lobby");

  const formattedLeaderboard: LeaderboardMember[] = formatLeaderboardData(leaderboard);

  return (
    <div className="max-w-6xl mx-auto w-full p-5 md:p-10 space-y-6 pb-24">

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800/60 pb-6">
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
          </div>
        </div>

        <div className="flex items-center gap-6 border-b border-zinc-800 overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab("lobby")}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'lobby' ? 'border-white text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            Lobby Overview
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'members' ? 'border-white text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            Members ({allMembers.length})
          </button>

          {isAdmin && lobby.type === 'private' && (
            <button
              onClick={() => setActiveTab("requests")}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'requests' ? 'border-white text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
              Requests {joinRequests.length > 0 && <span className="ml-1 bg-white text-black px-1.5 py-0.5 rounded-full text-xs">{joinRequests.length}</span>}
            </button>
          )}
        </div>
      </div>

      {activeTab === "lobby" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4 animate-in fade-in duration-300">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> {lobby.mode === "match" ? "Target Match" : "Upcoming Schedule"}
            </h2>
            <div className="space-y-3">
              {upcomingMatches.map((match: any) => (
                <Link key={match.id} href={`/lobby/${lobby.id}/match/${match.id}`}>
                  <div className="group relative flex items-center justify-between p-5 rounded-xl border border-zinc-800 bg-black hover:border-zinc-600 transition-all active:scale-[0.99]">
                    <span className="text-sm font-bold text-zinc-300">{match.teamAShort} vs {match.teamBShort}</span>
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
            <div className="rounded-xl border border-zinc-800 bg-black overflow-hidden min-h-[200px]">
              <Leaderboard leaderboard={formattedLeaderboard} currentUserId={currentUserId} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "members" && (
        <div className="max-w-2xl pt-4 animate-in fade-in duration-300">
          <MembersList members={allMembers} isAdmin={isAdmin} lobbyId={lobby.id} currentUserId={currentUserId} />
        </div>
      )}

      {activeTab === "requests" && (
        <div className="max-w-2xl pt-4 animate-in fade-in duration-300">
          <RequestsList requests={joinRequests} lobbyId={lobby.id} />
        </div>
      )}
    </div>
  );
}
