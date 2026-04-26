"use client";

import { useState, useTransition, useRef } from "react";
import { Terminal, CheckCircle2, AlertCircle, Database, ChevronRight } from "lucide-react";
import { processMatchScores } from "@/actions/ProcessMatchScores";
import Link from "next/link";

export function ScoringFormClient({ recentMatches }: { recentMatches: any[] }) {
    const [isPending, startTransition] = useTransition();
    const matchRef = useRef<HTMLSelectElement>(null);
    const jsonRef = useRef<HTMLTextAreaElement>(null);

    const [status, setStatus] = useState<{ type: "error" | "success" | null; message: string }>({ type: null, message: "" });

    const handleRunScript = () => {
        const matchId = matchRef.current?.value;
        const jsonString = jsonRef.current?.value;

        if (!matchId || !jsonString) {
            setStatus({ type: "error", message: "Both Match ID and JSON payload are required." });
            return;
        }

        setStatus({ type: null, message: "" });

        startTransition(async () => {
            try {
                const result = await processMatchScores(matchId, jsonString);
                setStatus({
                    type: "success",
                    message: `SUCCESS! Leaderboards updated for ${result.processedCount} submitted squads.`
                });
                if (jsonRef.current) jsonRef.current.value = "";
            } catch (err: any) {
                setStatus({ type: "error", message: err.message || "Failed to process scores." });
            }
        });
    };

    const sampleJson = `[
  { 
    "playerName": "Virat Kohli", 
    "runs": 82, "ballsFaced": 53, "fours": 6, "sixes": 4, 
    "wickets": 0, "oversBowled": 0, "runsConceded": 0, "maidens": 0,
    "catches": 1 
  },
  { 
    "playerName": "Jasprit Bumrah", 
    "runs": 0, "ballsFaced": 0, "fours": 0, "sixes": 0,
    "wickets": 3, "oversBowled": 4.0, "runsConceded": 21, "maidens": 1,
    "catches": 0 
  }
]`;

    return (
        <div className="space-y-8">

            <div className="border-b border-zinc-800/60 pb-6">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <Terminal className="w-5 h-5" />
                    <span className="font-mono text-sm font-bold tracking-widest uppercase">Admin Terminal</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Score Processor Engine</h1>
                <p className="text-sm text-zinc-500 mt-1">Inject live JSON data to calculate and distribute points globally.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-6">

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Target Match</label>
                        <select
                            ref={matchRef}
                            defaultValue=""
                            className="w-full h-12 bg-black border border-zinc-800 rounded-lg px-4 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
                        >
                            <option value="" disabled>Select a recent match...</option>
                            {recentMatches.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.teamAShort} vs {m.teamBShort} • {new Date(m.startTime).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short"
                                    })} at {new Date(m.startTime).toLocaleTimeString("en-IN", {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })} [ID: {m.id.substring(0, 6)}]
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center justify-between">
                            JSON Payload
                            <button
                                onClick={() => { if (jsonRef.current) jsonRef.current.value = sampleJson; }}
                                className="text-[10px] text-blue-500 hover:text-blue-400"
                            >
                                Insert Template
                            </button>
                        </label>
                        <textarea
                            ref={jsonRef}
                            rows={12}
                            placeholder="Paste raw array JSON here..."
                            className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-4 font-mono text-xs text-emerald-400 placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 custom-scrollbar resize-y"
                            spellCheck={false}
                        />
                    </div>

                    {status.type === "error" && (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-red-400 leading-relaxed">{status.message}</p>
                        </div>
                    )}

                    {status.type === "success" && (
                        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-emerald-400 leading-relaxed">{status.message}</p>
                        </div>
                    )}

                    <button
                        onClick={handleRunScript}
                        disabled={isPending}
                        className="w-full h-12 flex items-center justify-center gap-2 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2"><Database className="w-4 h-4 animate-bounce" /> Executing Query...</span>
                        ) : (
                            <span className="flex items-center gap-2">Run Scoring Script <ChevronRight className="w-4 h-4" /></span>
                        )}
                    </button>
                </div>

                <div className="lg:col-span-1 space-y-4">

                    <div className="p-5 rounded-xl border border-zinc-800 bg-[#050505]">
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <Database className="w-4 h-4 text-blue-500" /> Batting Rules
                        </h3>
                        <ul className="space-y-2 text-xs font-medium text-zinc-400">
                            <li className="flex justify-between pb-2 border-b border-zinc-800/60"><span>Base Run</span> <span className="text-white">+1 pt</span></li>
                            <li className="flex justify-between pb-2 border-b border-zinc-800/60"><span>Boundary (4/6)</span> <span className="text-white">+1 / +2</span></li>
                            <li className="flex justify-between pb-2 border-b border-zinc-800/60"><span>Milestones (30/50/100)</span> <span className="text-white">+4 / +8 / +16</span></li>
                            <li className="flex justify-between text-[10px] text-zinc-500"><span>* Strike Rate impacts scale from -6 to +6</span></li>
                        </ul>
                    </div>

                    <div className="p-5 rounded-xl border border-zinc-800 bg-[#050505]">
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <Database className="w-4 h-4 text-emerald-500" /> Bowling Rules
                        </h3>
                        <ul className="space-y-2 text-xs font-medium text-zinc-400">
                            <li className="flex justify-between pb-2 border-b border-zinc-800/60"><span>Base Wicket</span> <span className="text-white">+25 pts</span></li>
                            <li className="flex justify-between pb-2 border-b border-zinc-800/60"><span>Hauls (3/4/5 wkts)</span> <span className="text-white">+4 / +8 / +16</span></li>
                            <li className="flex justify-between pb-2 border-b border-zinc-800/60"><span>Maiden Over</span> <span className="text-white">+12 pts</span></li>
                            <li className="flex justify-between text-[10px] text-zinc-500"><span>* Economy Rate impacts scale from -6 to +6</span></li>
                        </ul>
                    </div>

                    <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                        <h3 className="text-xs font-bold text-amber-500">Overs Format Warning</h3>
                        <p className="text-[11px] text-amber-500/80 leading-relaxed">
                            Use standard cricket decimals for overs. <code className="bg-black px-1 py-0.5 rounded">3.5</code> means 3 overs and 5 balls. The engine converts this to 23 balls automatically to calculate the correct economy rate.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}