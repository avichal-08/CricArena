"use client";

import { useState } from "react";
import { Trophy, ChevronDown, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { LeaderboardUser } from "@/types/Leaderboarduser";

export function GlobalLeaderboardClient({
  top30,
  currentUserStats,
}: {
  top30: LeaderboardUser[];
  currentUserStats?: LeaderboardUser;
}) {
  const [visibleCount, setVisibleCount] = useState(10);
  const visibleUsers = top30.slice(0, visibleCount);

  const handleExpand = () => {
    setVisibleCount((prev) => Math.min(prev + 20, 30));
  };

  const isExpanded = visibleCount >= top30.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 pb-6 border-b border-white/[0.05]">
        <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">
          <Globe className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Global Rankings</h1>
          <p className="text-[12px] text-stone-500 mt-0.5">Standings based on total accumulated points</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="divide-y divide-white/[0.04]">
          {visibleUsers.map((user) => (
            <LeaderboardRow key={user.userId} user={user} isCurrentUser={user.userId === currentUserStats?.userId} />
          ))}
        </div>

        {!isExpanded && top30.length > 10 && (
          <button
            onClick={handleExpand}
            className="w-full py-3.5 text-[11px] font-bold uppercase tracking-widest text-stone-500 hover:text-stone-300 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-2 border-t border-white/[0.04]"
          >
            Show more <ChevronDown className="w-3.5 h-3.5" />
          </button>
        )}

        {currentUserStats && (
          <div className="sticky bottom-0 bg-[oklch(0.12_0.007_38)] border-t-2 border-orange-500/30">
            <div className="px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 text-center">
                  <span className="text-[10px] font-bold text-orange-400 block">RANK</span>
                  <span className="text-lg font-black text-white leading-tight">#{currentUserStats.rank}</span>
                </div>
                <Avatar className="w-9 h-9 border border-orange-500/20">
                  <AvatarImage src={currentUserStats.image || ""} />
                  <AvatarFallback className="bg-orange-500/10 text-orange-400 text-xs font-bold">
                    {currentUserStats.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-[13px] font-bold text-white block">You</span>
                  <span className="text-[11px] text-stone-500">Keep climbing the ranks</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black font-mono text-white block">{currentUserStats.totalScore}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-stone-600">Total Pts</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LeaderboardRow({ user, isCurrentUser }: { user: LeaderboardUser; isCurrentUser: boolean }) {
  const isFirst = user.rank === 1;
  const isSecond = user.rank === 2;
  const isThird = user.rank === 3;
  const isPodium = isFirst || isSecond || isThird;

  const rankColors = {
    1: "text-orange-400",
    2: "text-stone-300",
    3: "text-amber-600",
  };

  return (
    <div className={`flex items-center justify-between px-4 py-3.5 transition-colors ${
      isCurrentUser ? "bg-orange-500/[0.06]" : "hover:bg-white/[0.02]"
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-6 flex items-center justify-center text-[11px] font-bold ${
          isPodium ? rankColors[user.rank as 1 | 2 | 3] : "text-stone-600"
        }`}>
          {isPodium ? (
            <Trophy className="w-3.5 h-3.5" />
          ) : (
            user.rank
          )}
        </div>

        <Avatar className={`w-9 h-9 border ${isFirst ? "border-orange-500/30" : "border-white/[0.06]"}`}>
          <AvatarImage src={user.image || ""} />
          <AvatarFallback className="bg-white/[0.04] text-xs font-bold text-stone-400">
            {user.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>

        <span className="text-[13px] font-semibold text-stone-200 flex items-center gap-2">
          {user.name}
          {isCurrentUser && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
              You
            </span>
          )}
        </span>
      </div>

      <div className="text-right">
        <span className={`text-[14px] font-black font-mono ${isFirst ? "text-orange-400" : "text-stone-300"}`}>
          {user.totalScore}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-wider text-stone-700 block">pts</span>
      </div>
    </div>
  );
}