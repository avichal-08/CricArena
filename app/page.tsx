import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/configs/authOptions";
import {
  Flame,
  Trophy,
  Users,
  Zap,
  Shield,
  BarChart3,
  Globe,
  ArrowRight,
  Check,
  Star,
  ChevronRight,
  Swords,
  TrendingUp,
  Lock,
  Play,
} from "lucide-react";
import Link from "next/link";

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/[0.05] bg-[oklch(0.09_0.007_38)]/80 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:bg-orange-600 transition-colors duration-200">
          <Flame className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-[17px] tracking-tight text-white">CricArena</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {["Features", "How it works", "Pricing", "Blog"].map((item) => (
          <a
            key={item}
            href="#"
            className="text-[13px] font-medium text-stone-400 hover:text-white transition-colors duration-150"
          >
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link href="/api/auth/signin">
          <button className="hidden md:flex items-center text-[13px] font-semibold text-stone-400 hover:text-white transition-colors duration-150 px-4 py-2">
            Sign in
          </button>
        </Link>
        <Link href="/api/auth/signin">
          <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.97] transition-all duration-150 text-white font-semibold text-[13px] px-4 py-2 rounded-xl shadow-md shadow-orange-500/20">
            Get started
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </nav>
  );
}

function DeviceMockup() {
  return (
    <div className="relative w-full max-w-3xl mx-auto select-none">
      <div className="absolute inset-0 bg-orange-500/10 blur-[80px] rounded-full scale-75 translate-y-10 pointer-events-none" />

      <div className="relative">
        <div className="relative mx-auto" style={{ width: "88%", perspective: "1200px" }}>
          <div
            className="relative rounded-2xl border border-white/[0.12] bg-[oklch(0.13_0.007_38)] shadow-2xl shadow-black/60 overflow-hidden"
            style={{ transform: "rotateX(3deg) rotateY(-1deg)" }}
          >
            <div className="h-7 bg-[oklch(0.16_0.007_38)] border-b border-white/[0.06] flex items-center px-4 gap-2">
              {["bg-red-500/70", "bg-amber-500/70", "bg-emerald-500/70"].map((c, i) => (
                <div key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />
              ))}
              <div className="flex-1 mx-4">
                <div className="h-4 w-48 mx-auto rounded-md bg-white/[0.05] flex items-center justify-center">
                  <span className="text-[9px] text-stone-600 font-medium">cricarena.app/home</span>
                </div>
              </div>
            </div>

            <div className="bg-[oklch(0.09_0.007_38)] p-0 flex h-[300px] md:h-[360px]">
              <div className="w-40 border-r border-white/[0.05] bg-[oklch(0.10_0.007_38)] flex flex-col py-4 px-3 gap-1 shrink-0">
                <div className="flex items-center gap-2 mb-4 px-1">
                  <div className="w-5 h-5 rounded-lg bg-orange-500 flex items-center justify-center">
                    <Flame className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-[11px] font-bold text-white">CricArena</span>
                </div>
                {[
                  { icon: "🏠", label: "Home", active: true },
                  { icon: "🏆", label: "Active", active: false },
                  { icon: "⏳", label: "Past", active: false },
                  { icon: "🌐", label: "Public", active: false },
                  { icon: "📊", label: "Rankings", active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[10px] font-medium transition-colors ${
                      item.active
                        ? "bg-orange-500/15 text-orange-400"
                        : "text-stone-600"
                    }`}
                  >
                    <span className="text-[10px]">{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>

              <div className="flex-1 p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[11px] font-bold text-white">Hey, Arjun 👋</div>
                    <div className="text-[9px] text-stone-600 mt-0.5">Manage lobbies and predict fixtures</div>
                  </div>
                  <div className="h-7 w-24 rounded-lg bg-orange-500 flex items-center justify-center gap-1 shadow-md shadow-orange-500/20">
                    <span className="text-[9px] font-bold text-white">+ Create Lobby</span>
                  </div>
                </div>

                <div className="text-[9px] font-bold uppercase tracking-widest text-stone-600 mb-2">Upcoming Fixtures</div>
                <div className="flex gap-2 mb-4 overflow-hidden">
                  {[
                    { a: "MI", b: "CSK", time: "Today 7:30 PM" },
                    { a: "RCB", b: "KKR", time: "Apr 30" },
                    { a: "GT", b: "SRH", time: "May 1" },
                  ].map((m, i) => (
                    <div
                      key={i}
                      className="shrink-0 w-28 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5"
                    >
                      <div className={`text-[8px] font-bold mb-2 ${i === 0 ? "text-orange-400" : "text-stone-600"}`}>
                        {m.time}
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-stone-300">
                        <span>{m.a}</span>
                        <span className="text-[8px] text-stone-700">vs</span>
                        <span>{m.b}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-stone-600 mb-2">Standings</div>
                    {[
                      { name: "Rahul S.", pts: 342 },
                      { name: "Priya M.", pts: 298 },
                      { name: "You", pts: 271, you: true },
                    ].map((u) => (
                      <div key={u.name} className={`flex items-center justify-between py-1 text-[9px] ${u.you ? "text-orange-400 font-bold" : "text-stone-500"}`}>
                        <span>{u.name}</span>
                        <span>{u.pts} pts</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-stone-600 mb-2">My Stats</div>
                    {[
                      { label: "Lifetime Pts", val: "1,284" },
                      { label: "Best Score", val: "342" },
                      { label: "Squads", val: "18" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between py-1 text-[9px] text-stone-500">
                        <span>{s.label}</span>
                        <span className="text-stone-300 font-bold">{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-3 bg-[oklch(0.15_0.007_38)] mx-auto rounded-b-xl border-x border-b border-white/[0.07]" style={{ width: "90%" }} />
          <div className="h-2 bg-[oklch(0.18_0.007_38)] mx-auto rounded-b-xl border-x border-b border-white/[0.05]" style={{ width: "75%" }} />
        </div>

        <div
          className="absolute -bottom-4 -right-2 md:-right-6 w-[100px] md:w-[130px] rounded-[20px] border border-white/[0.12] bg-[oklch(0.12_0.007_38)] shadow-2xl shadow-black/70 overflow-hidden"
          style={{ boxShadow: "0 25px 60px -10px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.07)" }}
        >
          <div className="h-5 bg-[oklch(0.10_0.007_38)] flex items-center justify-center gap-1 border-b border-white/[0.06]">
            <div className="w-6 h-1.5 rounded-full bg-white/[0.12]" />
          </div>

          <div className="bg-[oklch(0.09_0.007_38)] p-2.5 h-[200px] md:h-[240px] overflow-hidden">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-4 h-4 rounded-lg bg-orange-500 flex items-center justify-center">
                <Flame className="w-2 h-2 text-white" />
              </div>
              <span className="text-[8px] font-bold text-white">CricArena</span>
            </div>

            <div className="text-[7px] font-bold uppercase tracking-widest text-stone-600 mb-1.5">Active Lobbies</div>
            {[
              { name: "Office League", mode: "Tournament", score: 271 },
              { name: "Friends Cup", mode: "Match", score: 184 },
            ].map((l) => (
              <div key={l.name} className="p-2 rounded-xl border border-white/[0.05] bg-white/[0.02] mb-1.5">
                <div className="text-[8px] font-bold text-stone-300 truncate">{l.name}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[7px] text-orange-400 font-medium">{l.mode}</span>
                  <span className="text-[7px] text-stone-400 font-bold">{l.score} pts</span>
                </div>
              </div>
            ))}

            <div className="mt-2.5 p-2 rounded-xl bg-orange-500/10 border border-orange-500/15">
              <div className="text-[7px] font-bold text-orange-400 mb-1">Next Match</div>
              <div className="text-[8px] font-black text-white">MI vs CSK</div>
              <div className="text-[7px] text-stone-500 mt-0.5">Tonight 7:30 PM</div>
            </div>
          </div>

          <div className="h-5 bg-[oklch(0.10_0.007_38)] border-t border-white/[0.06] flex items-center justify-around px-4">
            {["🏠", "🏆", "👤"].map((icon, i) => (
              <span key={i} className="text-[9px]">{icon}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

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
          <Link href="/api/auth/signin">
            <button className="group flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.97] transition-all duration-150 text-white font-bold text-[14px] px-7 py-3.5 rounded-2xl shadow-xl shadow-orange-500/25">
              Start Playing Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
            </button>
          </Link>
          <button className="group flex items-center gap-2.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-150 text-stone-300 font-semibold text-[14px] px-7 py-3.5 rounded-2xl">
            <Play className="w-4 h-4 text-orange-400" />
            Watch Demo
          </button>
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

function SocialProof() {
  const stats = [
    { value: "2,400+", label: "Active Players" },
    { value: "180+", label: "Lobbies Created" },
    { value: "14K+", label: "Squads Submitted" },
    { value: "4.9★", label: "Player Rating" },
  ];

  return (
    <section className="py-16 px-6 border-y border-white/[0.05]">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-stone-600 mb-10">
          Trusted by cricket fans across the country
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05] rounded-2xl overflow-hidden">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-8 px-6 bg-[oklch(0.09_0.007_38)] text-center"
            >
              <span className="text-3xl font-black text-white mb-1.5">{stat.value}</span>
              <span className="text-[11px] font-medium text-stone-500">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 opacity-40">
          {["IIT Kanpur", "NIT Allahabad", "DU Campus", "BITS Pilani", "IIM Lucknow", "VIT Vellore"].map((name) => (
            <span key={name} className="text-[12px] font-bold text-stone-400 tracking-wide">
              {name}
            </span>
          ))}
        </div>
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

function FeaturesSection() {
  const features = [
    {
      icon: Swords,
      title: "Match & Tournament Modes",
      description: "Compete in single-fixture showdowns or accumulate points across the entire IPL season in full tournament lobbies.",
      accent: "bg-orange-500/10 border border-orange-500/15 text-orange-400",
    },
    {
      icon: Users,
      title: "Private & Public Lobbies",
      description: "Create invite-only private arenas with approval controls, or host public lobbies for open competition with anyone.",
      accent: "bg-sky-500/10 border border-sky-500/15 text-sky-400",
    },
    {
      icon: Zap,
      title: "Real-Time Scoring Engine",
      description: "Points update instantly after admin score injection. Every wicket, boundary, and economy rate bonus calculated automatically.",
      accent: "bg-amber-500/10 border border-amber-500/15 text-amber-400",
    },
    {
      icon: Trophy,
      title: "Smart Leaderboards",
      description: "Live lobby standings plus a global all-time leaderboard. Know exactly where you stand and who you need to beat.",
      accent: "bg-violet-500/10 border border-violet-500/15 text-violet-400",
    },
    {
      icon: Shield,
      title: "Squad Validation",
      description: "Enforce role diversity and team caps automatically. Every squad must include batsmen, bowlers, all-rounders, and a keeper.",
      accent: "bg-emerald-500/10 border border-emerald-500/15 text-emerald-400",
    },
    {
      icon: BarChart3,
      title: "Player Statistics",
      description: "Track your lifetime points, highest match score, and full match ledger — all from your personal player profile.",
      accent: "bg-rose-500/10 border border-rose-500/15 text-rose-400",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/15 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-3 h-3 text-orange-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-orange-400">
              Everything you need
            </span>
          </div>
          <h2 className="text-[2.2rem] md:text-[3rem] font-black text-white tracking-tight mb-4">
            Built for serious
            <br />
            cricket fans
          </h2>
          <p className="text-[14px] md:text-base text-stone-500 max-w-md mx-auto leading-relaxed">
            Every feature designed to make your fantasy cricket experience faster, smarter, and more competitive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
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
                        className={`px-3 py-1 rounded-lg text-[8px] font-bold ${
                          i === 0
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
                        className={`flex items-center justify-between px-4 py-2.5 ${
                          p.selected ? "bg-orange-500/[0.06]" : ""
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
                          className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                            p.selected
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
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 ${
                    u.you
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

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "CricArena completely changed how I watch IPL. Every match now has stakes and I'm glued to every delivery.",
      name: "Arjun Mehta",
      title: "IIT Kanpur · Top ranked player",
      avatar: "AM",
      rating: 5,
    },
    {
      quote: "Set up a private lobby for my college friends in under a minute. The scoring system is spot-on and fair.",
      name: "Sneha Rao",
      title: "BITS Pilani · Lobby admin",
      avatar: "SR",
      rating: 5,
    },
    {
      quote: "Finally a fantasy cricket platform that doesn't feel like a slot machine. Real strategy, real results.",
      name: "Vikram Sharma",
      title: "NIT Allahabad · Tournament winner",
      avatar: "VS",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 px-6 border-t border-white/[0.05]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-[2rem] md:text-[2.8rem] font-black text-white tracking-tight mb-4">
            Players love CricArena
          </h2>
          <p className="text-[14px] text-stone-500">
            Don't take our word for it — hear from the community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200"
            >
              <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                ))}
              </div>

              <p className="text-[13px] text-stone-400 leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.05]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500/25 to-stone-800 border border-orange-500/15 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-black text-orange-300">{t.avatar}</span>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-stone-200">{t.name}</p>
                  <p className="text-[10px] text-stone-600">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
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
              <Link href="/api/auth/signin">
                <button className="group flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.97] transition-all duration-150 text-white font-bold text-[14px] px-8 py-4 rounded-2xl shadow-2xl shadow-orange-500/30">
                  Create Your Free Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5">
              {[
                "No credit card",
                "Free forever",
                "Set up in 60 seconds",
                "2,400+ players",
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

function Footer() {
  const cols = [
    {
      title: "Product",
      links: ["Features", "How it works", "Pricing", "Changelog"],
    },
    {
      title: "Community",
      links: ["Global Rankings", "Public Arenas", "Campus Leagues", "Discord"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Privacy", "Terms"],
    },
  ];

  return (
    <footer className="border-t border-white/[0.05] px-6 pt-16 pb-10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[16px] tracking-tight text-white">CricArena</span>
            </div>
            <p className="text-[12.5px] text-stone-600 leading-relaxed max-w-[200px]">
              The premier fantasy cricket platform for IPL 2026 and beyond.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-600 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] font-medium text-stone-500 hover:text-stone-300 transition-colors duration-150"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.05]">
          <p className="text-[12px] text-stone-600">
            © 2026 CricArena. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-stone-600">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
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
      <FeaturesSection />
      <ProductPreview />
      <BenefitsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}