"use client";

import { useState, useTransition } from "react";
import { preMatch } from "@/actions/PreMatch";
import { CalendarDays, FileJson, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type Match = {
  id: string;
  startTime: Date;
  teamAShort: string;
  teamBShort: string;
};

export function PreMatchFormClient({ recentMatches }: { recentMatches: Match[] }) {
  const [selectedMatch, setSelectedMatch] = useState<string>("");
  const [jsonPayload, setJsonPayload] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = () => {
    if (!selectedMatch) {
      setStatus({ type: "error", message: "Please select a match first." });
      return;
    }
    if (!jsonPayload.trim()) {
      setStatus({ type: "error", message: "Please paste a JSON payload." });
      return;
    }

    setStatus(null);
    startTransition(async () => {
      const result = await preMatch(selectedMatch, jsonPayload);
      if (result.success) {
        setStatus({ type: "success", message: result.message });
        setJsonPayload("");
      } else {
        setStatus({ type: "error", message: result.message });
      }
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 md:p-6 space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
          <CalendarDays className="w-4 h-4" /> Select Match
        </label>
        
        <select
          value={selectedMatch}
          onChange={(e) => {
            setSelectedMatch(e.target.value);
            setStatus(null);
          }}
          className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm text-stone-200 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all appearance-none"
        >
          <option value="" disabled>-- Choose an active match --</option>
          {recentMatches.map((m) => (
            <option key={m.id} value={m.id}>
              {m.teamAShort} vs {m.teamBShort} • {formatDate(m.startTime)}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 md:p-6 space-y-4 flex flex-col h-[400px]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
            <FileJson className="w-4 h-4" /> ESPN Pre-Match Payload
          </label>
          <button 
            onClick={() => setJsonPayload("")}
            className="text-[10px] uppercase font-bold text-stone-500 hover:text-stone-300 transition-colors"
          >
            Clear
          </button>
        </div>
        
        <textarea
          value={jsonPayload}
          onChange={(e) => {
            setJsonPayload(e.target.value);
            if (status?.type === "error") setStatus(null);
          }}
          placeholder="Paste partial or full JSON here...&#10;&#10;{&#10;  &quot;toss&quot;: &quot;RR chose to bowl&quot;,&#10;  &quot;venue&quot;: &quot;...&quot;&#10;}"
          className="flex-1 w-full bg-black/40 border border-white/[0.1] rounded-xl p-4 text-sm text-emerald-400 font-mono resize-none outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-stone-700"
          spellCheck={false}
        />
      </div>

      {status && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          status.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {status.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <div className="text-sm font-medium leading-relaxed">
            {status.message}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isPending || !selectedMatch || !jsonPayload.trim()}
        className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-white/[0.05] disabled:text-stone-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:active:scale-100 disabled:pointer-events-none shadow-xl shadow-orange-500/20 disabled:shadow-none"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Processing Update...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" /> Push to Database
          </>
        )}
      </button>
    </div>
  );
}