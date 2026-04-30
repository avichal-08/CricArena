import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/configs/authOptions";
import {
  Flame,
  Globe,
  ArrowRight,
  Check,
  Star,
  ChevronRight,
  Swords,
  TrendingUp,
  Lock,
  CircleQuestionMark,
} from "lucide-react";
import Link from "next/link";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { Features } from "@/components/Features";
import { SocialProof } from "@/components/SocialProof";
import { NavBar } from "@/components/LandingNavbar";
import { DeviceMockup } from "@/components/DeviceMockup";
import { SignInButton } from "@/components/SignInButton";

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/[0.06] rounded-full blur-[120px]" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-orange-600/[0.04] rounded-full blur-[80px]" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-amber-500/[0.04] rounded-full blur-[80px]" />
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(251,146,60,0.6) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-orange-400">
            IPL 2026 Season · Live Now
          </span>
        </div>

        <h1 className="text-[2.8rem] md:text-[4.5rem] font-black tracking-tight text-white leading-[1.02] mb-6">
          Fantasy Cricket
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400">
            Built for Winners
          </span>
        </h1>

        <p className="text-base md:text-lg text-stone-400 max-w-xl mx-auto leading-relaxed mb-10">
          Build your dream squad, challenge friends in private lobbies, and climb
          the global leaderboard across every IPL fixture — all in real time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <SignInButton className="group flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.97] transition-all duration-150 text-white font-bold text-[14px] px-7 py-3.5 rounded-2xl shadow-xl shadow-orange-500/25">
            Start Playing Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
          </SignInButton>

          <Link href="/how-it-works">
            <button className="group flex items-center gap-2.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-150 text-stone-300 font-semibold text-[14px] px-7 py-3.5 rounded-2xl">
              <CircleQuestionMark className="w-4 h-4 text-orange-400" />
              How It Works?
            </button>
          </Link>
        </div>

        <p className="text-[12px] text-stone-600 font-medium">
          Free forever · No credit card · Join 2,400+ active players
        </p>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        <DeviceMockup />
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  accent,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <div className="group relative p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200">
      <div className={`w-11 h-11 rounded-2xl ${accent} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-[15px] font-bold text-white mb-2">{title}</h3>
      <p className="text-[13px] text-stone-500 leading-relaxed">{description}</p>
    </div>
  );
}

function ProductPreview() {
  return (
    <section className="py-24 px-6 border-y border-white/[0.05] bg-white/[0.01]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/15 rounded-full px-4 py-1.5 mb-6">
              <Swords className="w-3 h-3 text-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-400">
                Squad Builder
              </span>
            </div>
            <h2 className="text-[2rem] md:text-[2.6rem] font-black text-white tracking-tight mb-5 leading-[1.08]">
              Pick your XII.
              <br />
              <span className="text-stone-500">Outsmart the field.</span>
            </h2>
            <p className="text-[14px] text-stone-500 leading-relaxed mb-8 max-w-md">
              Filter by role, respect team limits, and build a perfectly balanced squad before the toss. Real-time validation ensures you never submit a broken lineup.
            </p>

            <div className="space-y-3.5">
              {[
                "Smart role filters — BAT, BOWL, AR, WK",
                "Max 7 players per team enforced automatically",
                "Instant squad validation before submission",
                "Edit your squad right up to match start",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  <span className="text-[13px] text-stone-400 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/[0.04] blur-[60px] rounded-full pointer-events-none" />
            <div className="relative rounded-2xl border border-white/[0.07] bg-[oklch(0.11_0.007_38)] overflow-hidden shadow-2xl shadow-black/50">
              <div className="h-8 bg-[oklch(0.14_0.007_38)] border-b border-white/[0.05] flex items-center px-4 justify-between">
                <span className="text-[10px] font-bold text-stone-400">Build Your Squad — MI vs CSK</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-stone-600">12/12</span>
                  <div className="w-14 h-5 rounded-lg bg-orange-500 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">Save Squad</span>
                  </div>
                </div>
              </div>

              <div className="flex h-[320px]">
                <div className="flex-1 border-r border-white/[0.05]">
                  <div className="flex items-center gap-1.5 p-3 border-b border-white/[0.04]">
                    {["ALL", "BAT", "BOWL", "AR", "WK"].map((r, i) => (
                      <div
                        key={r}
                        className={`px-3 py-1 rounded-lg text-[8px] font-bold ${i === 0
                          ? "bg-orange-500 text-white"
                          : "bg-white/[0.04] text-stone-600"
                          }`}
                      >
                        {r}
                      </div>
                    ))}
                  </div>

                  <div className="divide-y divide-white/[0.03]">
                    {[
                      { name: "Rohit Sharma", team: "MI", role: "BAT", selected: true },
                      { name: "Virat Kohli", team: "RCB", role: "BAT", selected: false },
                      { name: "Jasprit Bumrah", team: "MI", role: "BOWL", selected: true },
                      { name: "MS Dhoni", team: "CSK", role: "WK", selected: true },
                      { name: "Hardik Pandya", team: "MI", role: "AR", selected: false },
                      { name: "Ruturaj Gaikwad", team: "CSK", role: "BAT", selected: true },
                    ].map((p) => (
                      <div
                        key={p.name}
                        className={`flex items-center justify-between px-4 py-2.5 ${p.selected ? "bg-orange-500/[0.06]" : ""
                          }`}
                      >
                        <div>
                          <p className="text-[9px] font-semibold text-stone-300">{p.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[7px] font-bold text-sky-400">{p.team}</span>
                            <span className="text-[7px] text-stone-700">·</span>
                            <span className="text-[7px] text-stone-600">{p.role}</span>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center border ${p.selected
                            ? "bg-orange-500 border-orange-500 text-white"
                            : "border-white/[0.08] bg-white/[0.03]"
                            }`}
                        >
                          {p.selected ? (
                            <Check className="w-2.5 h-2.5" />
                          ) : (
                            <span className="text-[8px] text-stone-600">+</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-32 bg-[oklch(0.10_0.007_38)] flex flex-col">
                  <div className="px-3 py-2 border-b border-white/[0.05]">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-stone-600">Your XII</p>
                  </div>
                  <div className="flex-1 p-2 space-y-1.5 overflow-hidden">
                    {[
                      { n: "Rohit S.", role: "BAT" },
                      { n: "Dhoni M.", role: "WK" },
                      { n: "Bumrah J.", role: "BOWL" },
                      { n: "Gaikwad R.", role: "BAT" },
                      { n: "Jadeja R.", role: "AR" },
                    ].map((p) => (
                      <div key={p.n} className="p-1.5 rounded-lg border border-white/[0.05] bg-white/[0.02]">
                        <p className="text-[8px] font-semibold text-stone-300 truncate">{p.n}</p>
                        <p className="text-[7px] text-stone-600">{p.role}</p>
                      </div>
                    ))}
                    <div className="pt-1 flex gap-1">
                      {[
                        { label: "BAT", n: 4, c: "text-sky-400" },
                        { label: "BOWL", n: 3, c: "text-violet-400" },
                      ].map((r) => (
                        <div key={r.label} className="flex-1 rounded-lg bg-white/[0.03] p-1.5 text-center">
                          <p className={`text-[8px] font-black ${r.c}`}>{r.n}</p>
                          <p className="text-[6px] text-stone-700">{r.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const benefits = [
    {
      icon: Globe,
      title: "Play anywhere, anytime",
      description: "Fully responsive across mobile and desktop. Build your squad on the commute, track scores at the office.",
      color: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/15",
    },
    {
      icon: TrendingUp,
      title: "Climb the global ranks",
      description: "Season-long point accumulation with a live global leaderboard. Every match is a chance to move up.",
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/15",
    },
    {
      icon: Lock,
      title: "Private by default",
      description: "Your lobbies, your rules. Approval-based joining, admin controls, and member management built in.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/15",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/15 rounded-full px-4 py-1.5 mb-6">
              <Star className="w-3 h-3 text-violet-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-violet-400">
                Why CricArena
              </span>
            </div>
            <h2 className="text-[2rem] md:text-[2.6rem] font-black text-white tracking-tight mb-5 leading-[1.08]">
              More than just
              <br />
              <span className="text-stone-500">fantasy cricket</span>
            </h2>
            <p className="text-[14px] text-stone-500 leading-relaxed mb-10 max-w-md">
              CricArena is the competitive layer your cricket fandom was missing. Built with depth, designed for speed, and optimised for the long game.
            </p>

            <div className="space-y-4">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200"
                >
                  <div className={`w-10 h-10 rounded-xl ${b.bg} border flex items-center justify-center shrink-0`}>
                    <b.icon className={`w-4.5 h-4.5 ${b.color}`} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-white mb-1">{b.title}</h4>
                    <p className="text-[12px] text-stone-500 leading-relaxed">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-violet-500/[0.03] blur-[60px] rounded-full pointer-events-none" />

            <div className="relative rounded-2xl border border-white/[0.07] bg-[oklch(0.11_0.007_38)] p-5 space-y-4 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[12px] font-bold text-stone-300">Global Rankings</h4>
                <span className="text-[10px] text-stone-600">All time</span>
              </div>

              {[
                { rank: 1, name: "Arjun Mehta", college: "IIT Kanpur", pts: 4280, badge: "🥇" },
                { rank: 2, name: "Sneha Rao", college: "BITS Pilani", pts: 3944, badge: "🥈" },
                { rank: 3, name: "Vikram S.", college: "NIT Allahabad", pts: 3712, badge: "🥉" },
                { rank: 4, name: "Priya Nair", college: "VIT Vellore", pts: 3590, badge: null },
                { rank: 5, name: "You", college: "Your College", pts: 3271, badge: null, you: true },
              ].map((u) => (
                <div
                  key={u.name}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 ${u.you
                    ? "border-orange-500/25 bg-orange-500/[0.07]"
                    : "border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                >
                  <div className="w-6 text-center">
                    {u.badge ? (
                      <span className="text-base">{u.badge}</span>
                    ) : (
                      <span className={`text-[11px] font-bold ${u.you ? "text-orange-400" : "text-stone-600"}`}>
                        {u.rank}
                      </span>
                    )}
                  </div>

                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-stone-800 border border-white/[0.08] flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-black text-stone-300">{u.name.charAt(0)}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] font-bold truncate ${u.you ? "text-orange-300" : "text-stone-200"}`}>
                      {u.name}
                    </p>
                    <p className="text-[10px] text-stone-600 truncate">{u.college}</p>
                  </div>

                  <span className={`text-[12px] font-black font-mono ${u.you ? "text-orange-400" : "text-stone-300"}`}>
                    {u.pts.toLocaleString()}
                  </span>
                </div>
              ))}

              <div className="pt-2 border-t border-white/[0.05] flex items-center justify-center">
                <button className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 hover:text-stone-300 transition-colors">
                  View full leaderboard <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="relative rounded-3xl border border-orange-500/15 bg-gradient-to-b from-orange-500/[0.08] to-transparent overflow-hidden px-8 py-16 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-orange-500/10 blur-[60px]" />
          </div>

          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(251,146,60,0.8) 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/20 rounded-full px-4 py-1.5 mb-8">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-orange-400">
                Free forever
              </span>
            </div>

            <h2 className="text-[2.4rem] md:text-[3.2rem] font-black text-white tracking-tight mb-5 leading-[1.05]">
              Ready to dominate
              <br />
              this season?
            </h2>
            <p className="text-[14px] text-stone-400 max-w-md mx-auto mb-10 leading-relaxed">
              Join thousands of players already competing. Create your first lobby in seconds — no credit card needed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <SignInButton className="group flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.97] transition-all duration-150 text-white font-bold text-[14px] px-8 py-4 rounded-2xl shadow-2xl shadow-orange-500/30">
                Create Your Free Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
              </SignInButton>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5">
              {[
                "No credit card",
                "Free forever",
                "Set up in 60 seconds"
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[12px] font-medium text-stone-500">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/home");

  return (
    <div className="min-h-screen bg-[oklch(0.09_0.007_38)] text-white antialiased">
      <NavBar />
      <HeroSection />
      <SocialProof />
      <Features />
      <ProductPreview />
      <BenefitsSection />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}