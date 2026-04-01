"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy, Swords, Globe, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { createLobbyAction } from "@/lib/actions/createLobby";

type MatchProps = {
  id: string;
  tournamentId: string;
  startTime: Date;
  teamAShort: string;
  teamBShort: string;
};

export function CreateLobbyForm({ 
  userId, 
  upcomingMatches, 
  activeTournamentId 
}: { 
  userId: string; 
  upcomingMatches: MatchProps[];
  activeTournamentId?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const nameRef = useRef<HTMLInputElement>(null);
  const matchRef = useRef<HTMLSelectElement>(null);
  
  const [mode, setMode] = useState<"tournament" | "match">("tournament");
  const [type, setType] = useState<"public" | "private">("private");

  const handleSubmit = () => {
    const name = nameRef.current?.value;
    const matchId = matchRef.current?.value;

    if (!name || !activeTournamentId) return;

    startTransition(async () => {
      const lobbyId = await createLobbyAction({
        name,
        type,
        mode,
        userId,
        matchId: mode === "match" ? matchId : null,
        tournamentId: activeTournamentId,
      });

      if (lobbyId) {
        router.push(`/lobby/${lobbyId}`);
      }
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 border-b border-zinc-800/60 pb-6">
        <Link href="/" className="p-2 -ml-2 rounded-md hover:bg-zinc-900 transition-colors text-zinc-500 hover:text-zinc-200">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Create Arena</h1>
          <p className="text-sm text-zinc-500 mt-1">Set the rules and format for your new lobby.</p>
        </div>
      </div>

      <div className="space-y-8">
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Lobby Name</label>
          <input
            ref={nameRef}
            type="text"
            required
            maxLength={30}
            className="w-full h-12 bg-black border border-zinc-800 rounded-lg px-4 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500 transition-colors"
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-zinc-400">Lobby Mode</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div 
              onClick={() => setMode("tournament")}
              className={`cursor-pointer rounded-xl border p-4 transition-all ${mode === "tournament" ? "border-white bg-zinc-900" : "border-zinc-800 bg-black hover:bg-zinc-900/50"}`}
            >
              <div className="flex items-start gap-3">
                <Trophy className={`w-5 h-5 mt-0.5 transition-colors ${mode === "tournament" ? "text-white" : "text-zinc-500"}`} />
                <div>
                  <span className="block text-[15px] font-semibold text-zinc-200">Full Tournament</span>
                  <span className="block text-xs text-zinc-500 mt-1">Accumulate points across the entire IPL season.</span>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setMode("match")}
              className={`cursor-pointer rounded-xl border p-4 transition-all ${mode === "match" ? "border-white bg-zinc-900" : "border-zinc-800 bg-black hover:bg-zinc-900/50"}`}
            >
              <div className="flex items-start gap-3">
                <Swords className={`w-5 h-5 mt-0.5 transition-colors ${mode === "match" ? "text-white" : "text-zinc-500"}`} />
                <div>
                  <span className="block text-[15px] font-semibold text-zinc-200">Single Match</span>
                  <span className="block text-xs text-zinc-500 mt-1">Compete for a specific fixture. Immediate results.</span>
                </div>
              </div>
            </div>
          </div>

          {mode === "match" && (
            <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-sm font-medium text-zinc-400">Select Fixture</label>
              <select ref={matchRef} className="w-full h-12 bg-black border border-zinc-800 rounded-lg px-4 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500">
                <option value="" disabled selected>Choose an upcoming match...</option>
                {upcomingMatches.map((match) => (
                  <option key={match.id} value={match.id}>{match.teamAShort} vs {match.teamBShort}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t border-zinc-800/60">
          <label className="text-sm font-medium text-zinc-400">Access Level</label>
          <div className="flex flex-col sm:flex-row gap-6">
            
            <div onClick={() => setType("private")} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border transition-all ${type === "private" ? "border-white border-[4px]" : "border-zinc-700"}`}></div>
              <span className={`text-sm font-medium flex items-center gap-1.5 ${type === "private" ? "text-zinc-200" : "text-zinc-400"}`}>
                <Lock className="w-3.5 h-3.5" /> Private (Requires Approval)
              </span>
            </div>

            <div onClick={() => setType("public")} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border transition-all ${type === "public" ? "border-white border-[4px]" : "border-zinc-700"}`}></div>
              <span className={`text-sm font-medium flex items-center gap-1.5 ${type === "public" ? "text-zinc-200" : "text-zinc-400"}`}>
                <Globe className="w-3.5 h-3.5" /> Public (Instant Join)
              </span>
            </div>

          </div>
        </div>

        <div className="pt-6">
          <button 
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 active:scale-[0.98] transition-all font-bold text-[15px] flex items-center justify-center"
          >
            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Arena"}
          </button>
        </div>
      </div>
    </div>
  );
}