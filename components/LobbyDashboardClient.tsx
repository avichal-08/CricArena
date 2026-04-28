"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Trophy, ChevronRight, Swords, Users } from "lucide-react";
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
  lobby: LobbyType;
  isAdmin: boolean;
  currentUserId: string;
  upcomingMatches: MatchType[];
  leaderboard: LeaderboardMemberDb[];
  allMembers: MemberType[];
  joinRequests: JoinRequests[];
};

export function LobbyDashboardClient({
  lobby,
  isAdmin,
  currentUserId,
  upcomingMatches,
  leaderboard,
  allMembers,
  joinRequests,
}: LobbyDashboardClientArguments) {
  const [activeTab, setActiveTab] = useState<"lobby" | "members" | "requests">("lobby");

  const lobbyMode = lobby.mode;
  const lobbyId = lobby.id;
  const formattedLeaderboard: LeaderboardMember[] = formatLeaderboardData(leaderboard);

  const tabs = [
    { key: "lobby", label: "Overview" },
    { key: "members", label: `Members (${allMembers.length})` },
    ...(isAdmin && lobby.type === "private"
      ? [{ key: "requests", label: `Requests${joinRequests.length > 0 ? ` (${joinRequests.length})` : ""}` }]
      : []),
  ] as const;

  return (
    <div className="max-w-6xl mx-auto w-full p-5 md:p-8 space-y-6 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.05]">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-white/[0.05] transition-colors text-stone-500 hover:text-stone-300">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-xl font-bold text-white">{lobby.name}</h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/15 px-2 py-0.5 rounded-md">
                {lobby.mode}
              </span>
            </div>
            <p className="text-[12px] text-stone-500">
              {lobby.type === "private" ? "Private lobby" : "Public lobby"} · {allMembers.length} members
            </p>
          </div>
        </div>
        <CopyLinkButton lobbyId={lobby.id} />
      </div>

      <div className="flex items-center gap-1 border-b border-white/[0.05]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 text-[13px] font-semibold transition-all duration-150 border-b-2 -mb-[1px] ${
              activeTab === tab.key
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-stone-500 hover:text-stone-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "lobby" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              {lobby.mode === "match" ? "Target Match" : "Upcoming Schedule"}
            </h2>
            <div className="space-y-2">
              {upcomingMatches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-white/[0.05] bg-white/[0.02]">
                  <Swords className="w-8 h-8 text-stone-700 mb-3" />
                  <p className="text-sm text-stone-500 font-medium">No upcoming matches</p>
                </div>
              ) : (
                upcomingMatches.map((match: any) => (
                  <Link key={match.id} href={`/lobby/${lobby.id}/match/${match.id}`}>
                    <div className="group flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-orange-500/15 transition-all duration-200 active:scale-[0.99]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">
                          <Swords className="w-3.5 h-3.5 text-orange-400" />
                        </div>
                        <div>
                          <span className="text-[13px] font-semibold text-stone-200">
                            {match.teamAShort} vs {match.teamBShort}
                          </span>
                          <p className="text-[11px] text-stone-600 mt-0.5">Tap to build your squad</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-700 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all duration-200" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              Standings
            </h2>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden min-h-[200px]">
              <Leaderboard
                leaderboard={formattedLeaderboard}
                currentUserId={currentUserId}
                lobbyMode={lobbyMode}
                lobbyId={lobbyId}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "members" && (
        <div className="max-w-2xl pt-2">
          <MembersList members={allMembers} isAdmin={isAdmin} lobbyId={lobby.id} currentUserId={currentUserId} />
        </div>
      )}

      {activeTab === "requests" && (
        <div className="max-w-2xl pt-2">
          <RequestsList requests={joinRequests} lobbyId={lobby.id} />
        </div>
      )}
    </div>
  );
}