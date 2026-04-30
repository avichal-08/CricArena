import { Metadata } from "next";
import Link from "next/link";
import { Flame, CheckCircle2, XCircle, ArrowRight, Shield } from "lucide-react";
import { SignInButton } from "@/components/SignInButton";

export const metadata: Metadata = {
  title: "The Best Dream11 Alternative for College Students | CricArena",
  description: "Stop paying massive entry fees. CricArena is the ultimate 100% free Dream11 alternative designed specifically for college leagues, hostels, and private friend groups.",
  alternates: {
    canonical: "/dream11-alternative-for-college",
  },
};

export default function Dream11AlternativePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is CricArena really a free alternative to Dream11?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, CricArena is 100% free forever. There are no entry fees, no hidden deposits, and no gambling mechanics. It is built purely for the love of the game and bragging rights among friends."
        }
      },
      {
        "@type": "Question",
        "name": "Can I create a private IPL fantasy league for my hostel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. CricArena specializes in private, invite-only lobbies where you can compete exclusively with your college mates or hostel wing."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[oklch(0.09_0.007_38)] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <header className="flex items-center justify-between px-6 py-5 border-b border-white/[0.05]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[17px] tracking-tight">CricArena</span>
        </Link>
        <SignInButton className="text-[13px] font-bold bg-white text-stone-900 px-4 py-2 rounded-full hover:bg-stone-200 transition-colors">
          Sign In
        </SignInButton>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-20">
        
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
            <Shield className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange-400">
              100% Free · No Gambling
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
            The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Dream11 Alternative</span> for College Leagues.
          </h1>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto leading-relaxed">
            Tired of playing against millions of strangers and losing money to algorithms? Move your hostel league to a platform built entirely for private, skill-based competition.
          </p>
          <div className="pt-4 flex justify-center">
            <SignInButton className="group flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[15px] px-8 py-4 rounded-full transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98]">
              Create Your Free Lobby
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </SignInButton>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center">Why campus groups are switching to CricArena</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl border border-white/[0.05] bg-white/[0.01] space-y-6">
              <h3 className="text-lg font-bold text-stone-400 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" /> Existing Fantasy Apps
              </h3>
              <ul className="space-y-4">
                {[
                  "Must pay entry fees to compete",
                  "Playing against 10M+ unknown users",
                  "Heavy gambling and financial risk",
                  "Cluttered UI filled with ads and banners"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-stone-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-700 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 rounded-3xl border border-orange-500/20 bg-orange-500/[0.03] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px]" />
              <h3 className="text-lg font-bold text-white flex items-center gap-2 relative z-10">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> CricArena
              </h3>
              <ul className="space-y-4 relative z-10">
                {[
                  "100% free forever. No credit cards.",
                  "Private lobbies for just your friends",
                  "Zero financial risk, pure bragging rights",
                  "Beautiful, ad-free dark mode interface"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-stone-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="prose prose-invert prose-stone max-w-none">
          <h2 className="text-2xl font-bold text-white mb-4">Built for the Hostel, Not the Casino</h2>
          <p className="text-stone-400 leading-relaxed mb-6">
            If you are a student looking for a Dream11 alternative, the biggest frustration is the monetization. Mainstream apps are built around daily fantasy sports (DFS) betting. You aren't competing to prove your cricket knowledge; you are competing against algorithms and massive bankrolls.
          </p>
          <p className="text-stone-400 leading-relaxed">
            <strong>CricArena flips the model.</strong> We believe fantasy cricket is best played exactly how it started: a group of friends, a whiteboard, and a shared love for the IPL. We digitized that whiteboard. You set the rules, invite your wingmates, and our real-time engine handles the live standings.
          </p>
        </div>

      </main>

      <footer className="border-t border-white/[0.05] py-8 text-center">
        <p className="text-[12px] text-stone-600">
          © {new Date().getFullYear()} CricArena. Not affiliated with Dream11 or the BCCI.
        </p>
      </footer>
    </div>
  );
}