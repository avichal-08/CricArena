"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ShieldCheck,
    Loader2,
    Check,
    X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { JoinRequests } from "@/types/JoinRequests";

type RequestsListArguments = {
    requests: JoinRequests[],
    lobbyId: string
}

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
            <div className="flex flex-col items-center justify-center p-10 rounded-xl border border-zinc-800 bg-black text-zinc-500">
                <ShieldCheck className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm">No pending join requests.</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-zinc-800 bg-black overflow-hidden shadow-2xl shadow-black">
            <div className="divide-y divide-zinc-900">
                {requests.map((req: any) => (
                    <div key={req.userId} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9 border border-zinc-800">
                                <AvatarImage src={req.image} />
                                <AvatarFallback className="bg-zinc-900 text-xs text-zinc-400">{req.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <span className="text-sm font-medium text-zinc-200">{req.name}</span>
                                <p className="text-xs text-zinc-500">Requested to join</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleRequest(req.userId, "reject")}
                                disabled={processingId !== null}
                                className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50"
                                title="Reject"
                            >
                                {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => handleRequest(req.userId, "accept")}
                                disabled={processingId !== null}
                                className="p-2 text-zinc-500 hover:text-green-500 hover:bg-green-500/10 rounded-md transition-colors disabled:opacity-50"
                                title="Accept"
                            >
                                {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}