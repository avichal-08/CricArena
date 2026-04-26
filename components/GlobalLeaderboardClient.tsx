"use client";

import { useState } from "react";
import { Trophy, ChevronDown, Globe, Medal } from "lucide-react";
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
        setVisibleCount(prev => Math.min(prev + 20, 30));
    };

    const isExpanded = visibleCount >= top30.length;

    return (
        <div className="space-y-8">

            <div className="flex items-center gap-4 border-b border-zinc-800/60 pb-6">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-lg">
                    <Globe className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Global Rank</h1>
                    <p className="text-sm text-zinc-500 mt-1">Current standings based on overall points</p>
                </div>
            </div>

            <div className="relative rounded-2xl border border-zinc-800 bg-black overflow-hidden shadow-2xl shadow-black flex flex-col">

                <div className="divide-y divide-zinc-900">
                    {visibleUsers.map((user) => (
                        <LeaderboardRow
                            key={user.userId}
                            user={user}
                            isCurrentUser={user.userId === currentUserStats?.userId}
                        />
                    ))}
                </div>

                {!isExpanded && top30.length > 10 && (
                    <button
                        onClick={handleExpand}
                        className="w-full py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-900/50 transition-colors flex items-center justify-center gap-2 border-t border-zinc-900"
                    >
                        Show Next 20 <ChevronDown className="w-4 h-4" />
                    </button>
                )}

                {currentUserStats && (
                    <div className="sticky bottom-0 w-full bg-zinc-950 border-t-2 border-blue-600/50 shadow-[0_-10px_40px_-10px_rgba(37,99,235,0.15)] z-10">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-8 text-center flex flex-col items-center">
                                    <span className="text-[10px] font-bold text-blue-500 uppercase">Rank</span>
                                    <span className="text-lg font-black text-white">#{currentUserStats.rank}</span>
                                </div>

                                <Avatar className="w-10 h-10 border border-zinc-800 shadow-md">
                                    <AvatarImage src={currentUserStats.image || ""} />
                                    <AvatarFallback className="bg-zinc-800 text-sm font-bold">
                                        {currentUserStats.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <span className="block text-sm font-bold text-white">You</span>
                                    <span className="block text-[11px] text-zinc-500 font-medium">Keep climbing the ladder</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="block text-xl font-mono font-black text-white">{currentUserStats.totalScore}</span>
                                <span className="block text-[9px] font-black uppercase tracking-widest text-zinc-600">Total Pts</span>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

function LeaderboardRow({ user, isCurrentUser }: { user: LeaderboardUser, isCurrentUser: boolean }) {

    const isFirst = user.rank === 1;
    const isSecond = user.rank === 2;
    const isThird = user.rank === 3;

    return (
        <div className={`p-4 flex items-center justify-between transition-colors ${isCurrentUser ? 'bg-blue-950/20' : 'hover:bg-zinc-900/30'
            }`}>
            <div className="flex items-center gap-4">

                <div className={`w-8 text-center flex justify-center ${isFirst ? 'text-yellow-500' : isSecond ? 'text-zinc-300' : isThird ? 'text-amber-700' : 'text-zinc-600'
                    }`}>
                    {isFirst || isSecond || isThird ? (
                        <Trophy className="w-5 h-5 fill-current opacity-80" />
                    ) : (
                        <span className="font-mono text-sm font-bold">{user.rank}</span>
                    )}
                </div>

                <Avatar className={`w-10 h-10 border ${isFirst ? 'border-yellow-500/50' : 'border-zinc-800'}`}>
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback className="bg-zinc-900 text-xs font-bold text-zinc-400">
                        {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>

                <div>
                    <span className="flex items-center gap-2 text-sm font-bold text-zinc-200">
                        {user.name} {isCurrentUser && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded uppercase tracking-wider">You</span>}
                    </span>
                </div>
            </div>

            <div className="text-right">
                <span className={`block text-lg font-mono font-black ${isFirst ? 'text-yellow-500' : 'text-white'}`}>
                    {user.totalScore}
                </span>
                <span className="block text-[9px] font-black uppercase tracking-widest text-zinc-600">PTS</span>
            </div>
        </div>
    );
}