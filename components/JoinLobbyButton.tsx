"use client"

import { UserPlus, Globe, Lock, Loader2 } from "lucide-react";
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
      if (!res.ok) throw new Error(data.message || "Failed to join lobby");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const isPrivate = lobby.type === "private";

  return (
    <div className="max-w-sm mx-auto mt-20 px-6">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center mx-auto">
          {isPrivate ? (
            <Lock className="w-7 h-7 text-orange-400" />
          ) : (
            <Globe className="w-7 h-7 text-orange-400" />
          )}
        </div>

        <div>
          <h1 className="text-xl font-bold text-white mb-2">{lobby.name}</h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            {isPrivate
              ? "This is a private lobby. Your request will need admin approval."
              : "This is a public lobby. You'll be added instantly."}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-red-400 font-medium">{error}</p>
          </div>
        )}

        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-150 text-white font-semibold text-sm py-3 rounded-xl shadow-lg shadow-orange-500/20"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              {isPrivate ? "Request to Join" : "Join Now"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}