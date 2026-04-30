import { Metadata } from "next";
import Link from "next/link";
import { Flame, Lock, ArrowRight } from "lucide-react";
import { SignInButton } from "@/components/SignInButton";

export const metadata: Metadata = {
  title: "Create Free Private Cricket Lobbies | CricArena",
  description: "Set up a private, invite-only fantasy cricket lobby in seconds. Perfect for office groups, families, and college friends.",
  alternates: { canonical: "/free-private-cricket-lobbies" },
};

export default function PrivateLobbiesPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Are CricArena lobbies actually private?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. When you create a private lobby, only users with your specific invite code or direct link can view the leaderboard or enter their squads."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[oklch(0.09_0.007_38)] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="flex items-center justify-between px-6 py-5 border-b border-white/[0.05]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center"><Flame className="w-4 h-4 text-white" /></div>
          <span className="font-bold text-[17px] tracking-tight">CricArena</span>
        </Link>
        <SignInButton className="text-[13px] font-bold bg-white text-stone-900 px-4 py-2 rounded-full hover:bg-stone-200 transition-colors">Sign In</SignInButton>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-20">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-400">Invite-Only Access</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
            Create Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Private Cricket Lobbies</span> in Seconds.
          </h1>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto leading-relaxed">
            Your office. Your family. Your rules. Secure your own private arena away from the public leaderboards and compete entirely for bragging rights.
          </p>
          <div className="pt-4 flex justify-center">
            <SignInButton className="group flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[15px] px-8 py-4 rounded-full transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98]">
              Create a Private Lobby
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </SignInButton>
          </div>
        </div>
      </main>
    </div>
  );
}