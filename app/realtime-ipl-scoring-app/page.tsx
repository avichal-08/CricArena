import { Metadata } from "next";
import Link from "next/link";
import { Flame, Zap, ArrowRight } from "lucide-react";
import { SignInButton } from "@/components/SignInButton";

export const metadata: Metadata = {
  title: "The Fastest Real-Time IPL Scoring Fantasy App | CricArena",
  description: "Experience zero-latency fantasy cricket. CricArena updates points the exact millisecond the ball crosses the boundary.",
  alternates: { canonical: "/realtime-ipl-scoring-app" },
};

export default function RealtimeScoringPage() {
  return (
    <div className="min-h-screen bg-[oklch(0.09_0.007_38)] text-white">
      <header className="flex items-center justify-between px-6 py-5 border-b border-white/[0.05]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center"><Flame className="w-4 h-4 text-white" /></div>
          <span className="font-bold text-[17px] tracking-tight">CricArena</span>
        </Link>
        <SignInButton className="text-[13px] font-bold bg-white text-stone-900 px-4 py-2 rounded-full hover:bg-stone-200 transition-colors">Sign In</SignInButton>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-20">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
            <Zap className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange-400">Zero Latency Architecture</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
            The Fastest <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Real-Time IPL Scoring</span> Fantasy App.
          </h1>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto leading-relaxed">
            Stop refreshing the page. Powered by edge-compute and WebSockets, CricArena recalculates the entire global leaderboard the moment the umpire signals a boundary.
          </p>
          <div className="pt-4 flex justify-center">
            <SignInButton className="group flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[15px] px-8 py-4 rounded-full transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98]">
              Experience Live Scoring
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </SignInButton>
          </div>
        </div>
      </main>
    </div>
  );
}