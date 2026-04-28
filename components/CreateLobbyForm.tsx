"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy, Swords, Globe, Lock, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { MatchType } from "@/types/Match";

export function CreateLobbyForm({
  upcomingMatches,
  activeTournamentId,
}: {
  userId: string;
  upcomingMatches: MatchType[];
  activeTournamentId?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const nameRef = useRef<HTMLInputElement>(null);
  const matchRef = useRef<HTMLSelectElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"tournament" | "match">("tournament");
  const [type, setType] = useState<"public" | "private">("private");

  const handleSubmit = () => {
    const name = nameRef.current?.value;
    const matchId = matchRef.current?.value;
    if (!name || !activeTournamentId) {
      setError("Please fill all required fields.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/lobby/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            type,
            mode,
            matchId: mode === "match" ? matchId : null,
            tournamentId: activeTournamentId,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          if (res.status === 401) {
            setError("You must be logged in.");
            router.push("/");
            return;
          }
          setError(data.message || "Something went wrong.");
          return;
        }
        router.push(`/lobby/${data.lobbyId}`);
      } catch {
        setError("Network error. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 pb-6 border-b border-white/[0.05]">
        <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-white/[0.04] transition-colors text-stone-500 hover:text-stone-300">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Create Arena</h1>
          <p className="text-[12px] text-stone-500 mt-0.5">Set up your competition lobby</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">Lobby Name</label>
          <input
            ref={nameRef}
            type="text"
            required
            maxLength={30}
            placeholder="e.g. Friday Night Fever"
            className="w-full h-11 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.12] focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/10 rounded-xl px-4 text-sm text-stone-200 placeholder:text-stone-700 outline-none transition-all duration-150"
          />
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">Lobby Mode</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode("tournament")}
              className={`p-4 rounded-xl border text-left transition-all duration-150 ${
                mode === "tournament"
                  ? "border-orange-500/30 bg-orange-500/10"
                  : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
            >
              <Trophy className={`w-5 h-5 mb-3 ${mode === "tournament" ? "text-orange-400" : "text-stone-600"}`} />
              <p className={`text-[13px] font-bold mb-1 ${mode === "tournament" ? "text-orange-300" : "text-stone-300"}`}>Full Tournament</p>
              <p className="text-[11px] text-stone-600 leading-snug">Accumulate points across the entire IPL season.</p>
            </button>

            <button
              onClick={() => setMode("match")}
              className={`p-4 rounded-xl border text-left transition-all duration-150 ${
                mode === "match"
                  ? "border-orange-500/30 bg-orange-500/10"
                  : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
            >
              <Swords className={`w-5 h-5 mb-3 ${mode === "match" ? "text-orange-400" : "text-stone-600"}`} />
              <p className={`text-[13px] font-bold mb-1 ${mode === "match" ? "text-orange-300" : "text-stone-300"}`}>Single Match</p>
              <p className="text-[11px] text-stone-600 leading-snug">Compete for one specific fixture only.</p>
            </button>
          </div>

          {mode === "match" && (
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">Select Fixture</label>
              <select
                ref={matchRef}
                className="w-full h-11 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.12] focus:border-orange-500/40 rounded-xl px-4 text-sm text-stone-300 outline-none transition-all duration-150 cursor-pointer"
              >
                <option value="" disabled>Choose an upcoming match...</option>
                {upcomingMatches.map((match) => (
                  <option key={match.id} value={match.id}>
                    {match.teamAShort} vs {match.teamBShort}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-2 border-t border-white/[0.05]">
          <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">Access Level</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setType("private")}
              className={`flex items-center gap-3 p-3.5 rounded-xl border flex-1 transition-all duration-150 ${
                type === "private"
                  ? "border-orange-500/30 bg-orange-500/10"
                  : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                type === "private" ? "border-orange-500 bg-orange-500" : "border-stone-700"
              }`} />
              <div className="text-left">
                <div className={`flex items-center gap-1.5 text-[12px] font-semibold ${type === "private" ? "text-orange-300" : "text-stone-400"}`}>
                  <Lock className="w-3 h-3" /> Private
                </div>
                <p className="text-[10px] text-stone-600 mt-0.5">Requires admin approval</p>
              </div>
            </button>

            <button
              onClick={() => setType("public")}
              className={`flex items-center gap-3 p-3.5 rounded-xl border flex-1 transition-all duration-150 ${
                type === "public"
                  ? "border-orange-500/30 bg-orange-500/10"
                  : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                type === "public" ? "border-orange-500 bg-orange-500" : "border-stone-700"
              }`} />
              <div className="text-left">
                <div className={`flex items-center gap-1.5 text-[12px] font-semibold ${type === "public" ? "text-orange-300" : "text-stone-400"}`}>
                  <Globe className="w-3 h-3" /> Public
                </div>
                <p className="text-[10px] text-stone-600 mt-0.5">Anyone can join instantly</p>
              </div>
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-150 text-white font-bold text-[14px] flex items-center justify-center shadow-lg shadow-orange-500/20"
        >
          {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Arena...</>
          ) : (
            "Create Arena"
          )}
        </button>
      </div>
    </div>
  );
}