"use client"

import { UserPlus, Globe, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LobbyType } from "@/types/Lobby";

export function JoinLobbyButton({ lobby, userId }: { lobby: LobbyType, userId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleJoin() {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/lobby/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lobbyId: lobby.id }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to join lobby");
            }

            router.refresh();
            
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-8 border border-zinc-800 rounded-2xl bg-black text-center space-y-6">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-zinc-800">
                <Globe className="w-8 h-8 text-zinc-400" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white mb-2">{lobby.name}</h1>
                <p className="text-sm text-zinc-500">
                    {lobby.type === 'private' ? "This is a private lobby. You must request access to join." : "This is a public lobby."}
                </p>
            </div>

            {error && <p className="text-xs text-red-500 bg-red-500/10 py-2 rounded">{error}</p>}

            <button 
                onClick={handleJoin}
                disabled={loading}
                className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        <UserPlus className="w-4 h-4" /> 
                        {lobby.type === 'private' ? "Request to Join" : "Join Lobby instantly"}
                    </>
                )}
            </button>
        </div>
    );
}