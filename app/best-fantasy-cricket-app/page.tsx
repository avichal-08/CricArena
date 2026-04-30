import { Metadata } from "next";
import Link from "next/link";
import { Flame, CheckCircle2, XCircle, ArrowRight, Trophy } from "lucide-react";
import { SignInButton } from "@/components/SignInButton";

export const metadata: Metadata = {
  title: "The Best Fantasy Cricket App for Playing with Friends | CricArena",
  description: "Looking for the best fantasy cricket app without the gambling? CricArena is a 100% free platform designed for private leagues and pure skill-based competition.",
  alternates: { canonical: "/best-fantasy-cricket-app" },
};

export default function BestFantasyAppPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Which is the best free fantasy cricket app?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "CricArena is the top-rated free fantasy cricket app for private groups. It removes entry fees and allows you to compete purely for bragging rights with your friends."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[oklch(0.09_0.007_38)] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="flex items-center justify-between px-6 py-5 border-b border-white/[0.05]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[17px] tracking-tight">CricArena</span>
        </Link>
        <SignInButton className="text-[13px] font-bold bg-white text-stone-900 px-4 py-2 rounded-full hover:bg-stone-200 transition-colors">Sign In</SignInButton>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-20">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
            <Trophy className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange-400">Pure Skill · Zero Luck</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Best Fantasy Cricket App</span> Built for Friends.
          </h1>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto leading-relaxed">
            Stop giving your money to mega-corporations. CricArena is the ultimate platform for cricket purists who just want to prove they know the game better than their group chat.
          </p>
          <div className="pt-4 flex justify-center">
            <SignInButton className="group flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[15px] px-8 py-4 rounded-full transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98]">
              Start Playing Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </SignInButton>
          </div>
        </div>

        <div className="prose prose-invert prose-stone max-w-none bg-white/[0.02] border border-white/[0.05] p-8 rounded-3xl">
          <h2 className="text-2xl font-bold text-white mb-4">Why we built a different kind of platform</h2>
          <p className="text-stone-400 leading-relaxed mb-6">
            When you search for the "best fantasy cricket app," every result is a betting platform in disguise. They use complex algorithms to ensure the house always wins, and your tiny private league gets lost in a sea of millions of users. 
          </p>
          <p className="text-stone-400 leading-relaxed">
            CricArena was engineered from the ground up to focus entirely on the community aspect of the IPL. You get a clean, ad-free interface, instant live scoring, and full control over who enters your arena. It's fantasy sports the way it was meant to be played.
          </p>
        </div>
      </main>
      
      <footer className="border-t border-white/[0.05] py-8 text-center">
        <p className="text-[12px] text-stone-600">© {new Date().getFullYear()} CricArena. For the fans, by the fans.</p>
      </footer>
    </div>
  );
}