"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    ShieldCheck,
    UserMinus,
    Loader2,
    AlertTriangle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { MemberType } from "@/types/Member";

type MembersListArguments = {
    members: MemberType[],
    isAdmin: boolean,
    lobbyId: string,
    currentUserId: string
}

export function MembersList({ members, isAdmin, lobbyId, currentUserId }: MembersListArguments) {
    const router = useRouter();
    const [removingId, setRemovingId] = useState<string | null>(null);
    
    const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

    async function confirmRemoval() {
        if (!memberToRemove) return;
        
        const targetId = memberToRemove;
        setRemovingId(targetId);
        setMemberToRemove(null);

        try {
            const res = await fetch(`/api/lobby/members/remove`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lobbyId, memberId: targetId }),
            });
            if (res.ok) router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setRemovingId(null);
        }
    }

    return (
        <>
            <div className="rounded-xl border border-zinc-800 bg-black overflow-hidden shadow-2xl shadow-black">
                <div className="divide-y divide-zinc-900">
                    {members.map((member: any) => (
                        <div key={member.memberId} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-9 h-9 border border-zinc-800">
                                    <AvatarImage src={member.image} />
                                    <AvatarFallback className="bg-zinc-900 text-xs text-zinc-400">{member.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <span className="text-sm font-medium text-zinc-200">{member.name} {member.userId === currentUserId && "(You)"}</span>
                                    {member.role === "admin" && (
                                        <span className="ml-2 text-[10px] text-amber-500 font-bold uppercase tracking-widest bg-amber-500/10 px-1.5 py-0.5 rounded">
                                            <ShieldCheck className="inline w-3 h-3 mr-0.5" /> Admin
                                        </span>
                                    )}
                                </div>
                            </div>

                            {isAdmin && member.userId !== currentUserId && (
                                <button
                                    onClick={() => setMemberToRemove(member.memberId)}
                                    disabled={removingId === member.memberId}
                                    className="p-2 text-zinc-500 hover:text-red-500 transition-colors disabled:opacity-50"
                                >
                                    {removingId === member.memberId ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserMinus className="w-4 h-4" />}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {memberToRemove && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-500/10 text-red-500 rounded-full">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-semibold text-zinc-100">Remove Member</h2>
                        </div>
                        <p className="text-sm text-zinc-400 mb-6">
                            Are you sure you want to remove this member? They will lose access to the lobby and any associated data. This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setMemberToRemove(null)}
                                className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRemoval}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors shadow-lg shadow-red-900/20"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}