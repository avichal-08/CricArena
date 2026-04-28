"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserMinus, Loader2, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MemberType } from "@/types/Member";

type MembersListArguments = {
  members: MemberType[];
  isAdmin: boolean;
  lobbyId: string;
  currentUserId: string;
};

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
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="divide-y divide-white/[0.04]">
          {members.map((member: any) => (
            <div key={member.memberId} className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8 border border-white/[0.06]">
                  <AvatarImage src={member.image} />
                  <AvatarFallback className="bg-white/[0.04] text-xs text-stone-400 font-bold">{member.name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-stone-200">
                      {member.name}
                      {member.userId === currentUserId && (
                        <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </span>
                    {member.role === "admin" && (
                      <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/15 px-1.5 py-0.5 rounded">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isAdmin && member.userId !== currentUserId && (
                <button
                  onClick={() => setMemberToRemove(member.memberId)}
                  disabled={removingId === member.memberId}
                  className="p-1.5 text-stone-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-150 disabled:opacity-50"
                >
                  {removingId === member.memberId ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UserMinus className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {memberToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 bg-[oklch(0.14_0.007_38)] border border-white/[0.08] rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-white">Remove Member</h2>
                <p className="text-[11px] text-stone-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-stone-400 mb-6 leading-relaxed">
              The member will lose access to this lobby and all associated match entries.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setMemberToRemove(null)}
                className="flex-1 py-2.5 text-sm font-semibold text-stone-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoval}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
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