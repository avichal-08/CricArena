"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { LeaderboardMember } from "@/types/LeaderboardMember";
import { useRouter } from "next/navigation";

type LeaderboardArguments = {
    leaderboard: LeaderboardMember[],
    currentUserId?: string,
    lobbyMode: string,
    lobbyId: string
};

export function Leaderboard({ leaderboard, currentUserId, lobbyMode, lobbyId }: LeaderboardArguments) {

    const router = useRouter();
    const isTournament:boolean = lobbyMode === "tournament";

    return (
        <div className="rounded-xl border border-zinc-800 bg-black overflow-hidden shadow-2xl shadow-black">
            <div className="divide-y divide-zinc-900">
                {leaderboard.map((member, index) => (
                    <div key={index} onClick={() => {
                        isTournament ? router.push(`/lobby/${lobbyId}/${member.userId}`) : router.push(`/lobby/${lobbyId}/single/${member.userId}`)
                    }} className="p-4 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-zinc-500 w-5 text-center">
                                {index + 1}
                            </span>

                            <Avatar className="w-9 h-9 border border-zinc-800">
                                <AvatarImage src={member.userImage} />
                                <AvatarFallback className="bg-zinc-900 text-xs text-zinc-400">{member.userName?.[0]}</AvatarFallback>
                            </Avatar>

                            <div>
                                <span className="text-sm font-medium text-zinc-200">
                                    {member.userName} {member.userId === currentUserId && "(You)"}
                                </span>
                            </div>
                        </div>

                        <div>
                            <span className="text-sm font-bold text-zinc-100 bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">
                                {member.score.toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}