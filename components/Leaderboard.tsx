"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { LeaderboardMember } from "@/types/LeaderboardMember";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";

type LeaderboardArguments = {
  leaderboard: LeaderboardMember[];
  currentUserId?: string;
  lobbyMode: string;
  lobbyId: string;
};

export function Leaderboard({ leaderboard, currentUserId, lobbyMode, lobbyId }: LeaderboardArguments) {
  const router = useRouter();
  const isTournament = lobbyMode === "tournament";

  if (leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Trophy className="w-8 h-8 text-stone-700 mb-3" />
        <p className="text-sm font-medium text-stone-500">No entries yet</p>
        <p className="text-xs text-stone-600 mt-1">Submit your squad to appear here</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/[0.04]">
      {leaderboard.map((member, index) => {
        const isFirst = index === 0;
        const isCurrentUser = member.userId === currentUserId;

        return (
          <div
            key={index}
            onClick={() => {
              isTournament
                ? router.push(`/lobby/${lobbyId}/${member.userId}`)
                : router.push(`/lobby/${lobbyId}/single/${member.userId}`);
            }}
            className={`flex items-center justify-between px-4 py-3.5 cursor-pointer transition-all duration-150 hover:bg-white/[0.03] ${
              isCurrentUser ? "bg-orange-500/[0.06]" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 text-center text-[11px] font-bold ${
                isFirst ? "text-orange-400" : "text-stone-600"
              }`}>
                {isFirst ? (
                  <Trophy className="w-3.5 h-3.5 text-orange-400 mx-auto" />
                ) : (
                  index + 1
                )}
              </div>

              <Avatar className={`w-8 h-8 border ${isFirst ? "border-orange-500/30" : "border-white/[0.06]"}`}>
                <AvatarImage src={member.userImage} />
                <AvatarFallback className="bg-white/[0.04] text-xs text-stone-400 font-bold">
                  {member.userName?.[0]}
                </AvatarFallback>
              </Avatar>

              <div>
                <span className="text-[13px] font-semibold text-stone-200">
                  {member.userName}
                  {isCurrentUser && (
                    <span className="ml-2 text-[9px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
                      You
                    </span>
                  )}
                </span>
              </div>
            </div>

            <span className={`text-[13px] font-bold font-mono ${isFirst ? "text-orange-400" : "text-stone-300"}`}>
              {member.score.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}