"use client";

import { useState, useTransition, useRef } from "react";
import { Terminal, CheckCircle2, AlertCircle, Database, ChevronRight, Zap } from "lucide-react";
import { processMatchScores } from "@/actions/ProcessMatchScores";

export function ScoringFormClient({ recentMatches }: { recentMatches: any[] }) {
  const [isPending, startTransition] = useTransition();
  const matchRef = useRef<HTMLSelectElement>(null);
  const jsonRef = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState<{ type: "error" | "success" | null; message: string }>({ type: null, message: "" });

  const handleRunScript = () => {
    const matchId = matchRef.current?.value;
    const jsonString = jsonRef.current?.value;
    if (!matchId || !jsonString) {
      setStatus({ type: "error", message: "Both a match selection and JSON payload are required." });
      return;
    }
    setStatus({ type: null, message: "" });
    startTransition(async () => {
      try {
        const result = await processMatchScores(matchId, jsonString);
        setStatus({ type: "success", message: `SUCCESS — Leaderboards updated for ${result.processedCount} submitted squads.` });
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
      <div className="pb-6 border-b border-white/[0.05]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-500">Admin Terminal</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Score Processor</h1>
        <p className="text-[12px] text-stone-500 mt-1">Inject match JSON to calculate and distribute points globally.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500">Target Match</label>
            <select
              ref={matchRef}
              defaultValue=""
              className="w-full h-11 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.12] focus:border-emerald-500/30 rounded-xl px-4 text-sm text-stone-300 outline-none transition-all cursor-pointer"
            >
              <option value="" disabled>Select a recent match...</option>
              {recentMatches.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.teamAShort} vs {m.teamBShort} ·{" "}
                  {new Date(m.startTime).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ·{" "}
                  ID: {m.id.substring(0, 8)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500">JSON Payload</label>
              <button
                onClick={() => { if (jsonRef.current) jsonRef.current.value = sampleJson; }}
                className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                Insert Template
              </button>
            </div>
            <textarea
              ref={jsonRef}
              rows={12}
              placeholder='[{ "playerName": "...", "runs": 0, ... }]'
              className="w-full bg-black/50 border border-white/[0.06] hover:border-white/[0.10] focus:border-emerald-500/25 rounded-xl p-4 font-mono text-xs text-emerald-400 placeholder:text-stone-800 outline-none transition-all resize-y no-scrollbar"
              spellCheck={false}
            />
          </div>

          {status.type === "error" && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400 leading-relaxed">{status.message}</p>
            </div>
          )}

          {status.type === "success" && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-400 leading-relaxed">{status.message}</p>
            </div>
          )}

          <button
            onClick={handleRunScript}
            disabled={isPending}
            className="w-full h-12 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-150 text-white font-bold rounded-xl"
          >
            {isPending ? (
              <><Database className="w-4 h-4 animate-bounce" /> Executing Query...</>
            ) : (
              <><Zap className="w-4 h-4" /> Run Scoring Script <ChevronRight className="w-4 h-4 ml-1" /></>
            )}
          </button>
        </div>

        <div className="space-y-4">
          {[
            {
              title: "Batting Rules",
              color: "text-orange-400",
              bg: "bg-orange-500/10",
              border: "border-orange-500/15",
              items: [
                ["Base Run", "+1 pt"],
                ["Boundary (4/6)", "+1 / +2"],
                ["Milestones (30/50/100)", "+4 / +8 / +16"],
              ],
              note: "Strike Rate: −6 to +6 impact",
            },
            {
              title: "Bowling Rules",
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
              border: "border-emerald-500/15",
              items: [
                ["Base Wicket", "+25 pts"],
                ["Hauls (3/4/5 wkts)", "+4 / +8 / +16"],
                ["Maiden Over", "+12 pts"],
              ],
              note: "Economy Rate: −6 to +6 impact",
            },
          ].map((section) => (
            <div key={section.title} className={`p-4 rounded-xl border ${section.border} ${section.bg}`}>
              <h3 className={`text-[11px] font-bold uppercase tracking-widest ${section.color} mb-3`}>{section.title}</h3>
              <div className="space-y-2">
                {section.items.map(([label, value]) => (
                  <div key={label} className="flex justify-between text-[11px]">
                    <span className="text-stone-500">{label}</span>
                    <span className="font-bold text-stone-200">{value}</span>
                  </div>
                ))}
                <p className="text-[10px] text-stone-700 pt-1 border-t border-white/[0.04]">{section.note}</p>
              </div>
            </div>
          ))}

          <div className="p-4 rounded-xl border border-amber-500/15 bg-amber-500/[0.05]">
            <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">Overs Format</h3>
            <p className="text-[11px] text-amber-600/80 leading-relaxed">
              Use standard cricket decimals. <code className="bg-black/40 px-1 py-0.5 rounded text-amber-400">3.5</code> = 3 overs + 5 balls = 23 total balls. Economy is calculated automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}