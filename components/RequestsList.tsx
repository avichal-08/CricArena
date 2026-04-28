"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { JoinRequests } from "@/types/JoinRequests";

type RequestsListArguments = {
  requests: JoinRequests[];
  lobbyId: string;
};

export function RequestsList({ requests, lobbyId }: RequestsListArguments) {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function handleRequest(requestUserId: string, action: "accept" | "reject") {
    setProcessingId(requestUserId);
    try {
      const res = await fetch(`/api/lobby/requests/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lobbyId, requestUserId }),
      });
      if (res.ok) router.refresh();
    } catch (error) {
      console.error(`Failed to ${action} request`, error);
    } finally {
      setProcessingId(null);
    }
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
          <ShieldCheck className="w-5 h-5 text-stone-600" />
        </div>
        <p className="text-sm font-semibold text-stone-400">No pending requests</p>
        <p className="text-xs text-stone-600 mt-1">All join requests will appear here</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <div className="divide-y divide-white/[0.04]">
        {requests.map((req: any) => (
          <div key={req.userId} className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 border border-white/[0.06]">
                <AvatarImage src={req.image} />
                <AvatarFallback className="bg-white/[0.04] text-xs text-stone-400 font-bold">{req.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <span className="text-[13px] font-semibold text-stone-200 block">{req.name}</span>
                <span className="text-[11px] text-stone-600">Wants to join</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleRequest(req.userId, "reject")}
                disabled={processingId !== null}
                className="p-2 text-stone-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-150 disabled:opacity-50"
              >
                {processingId === req.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <X className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={() => handleRequest(req.userId, "accept")}
                disabled={processingId !== null}
                className="p-2 text-stone-600 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all duration-150 disabled:opacity-50"
              >
                {processingId === req.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}