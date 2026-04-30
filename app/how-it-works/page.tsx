import {
  Flame,
  ArrowRight,
  UserPlus,
  Trophy,
  Swords,
  Users,
  BarChart3,
  Check,
  ChevronRight,
  Play,
  Lock,
  Globe,
  Zap,
  Star,
  Shield,
  Clock,
  TrendingUp,
  Target,
  Medal,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/LandingNavbar";
import { SignInButton } from "@/components/SignInButton";

const MAIN_STEPS = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create your account",
    description:
      "Sign in with Google in one click. No forms, no passwords, no friction — your profile is ready instantly.",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/15",
    glow: "bg-orange-500/10",
    visual: (
      <div className="rounded-2xl border border-white/[0.07] bg-[oklch(0.12_0.007_38)] overflow-hidden shadow-xl shadow-black/40">
        <div className="p-5 border-b border-white/[0.05]">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">CricArena</span>
          </div>
          <h3 className="text-[14px] font-bold text-white text-center mb-1">
            Welcome back
          </h3>
          <p className="text-[11px] text-stone-600 text-center">
            Sign in to continue to your arena
          </p>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <span className="text-[12px] font-semibold text-stone-300">
              Continue with Google
            </span>
          </div>
          <div className="flex items-center gap-2 py-1">
            <div className="flex-1 h-px bg-white/[0.05]" />
            <span className="text-[10px] text-stone-700">secure · instant · free</span>
            <div className="flex-1 h-px bg-white/[0.05]" />
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[10px] text-stone-500 leading-snug">
              Your data is encrypted and never shared with third parties.
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "02",
    icon: Trophy,
    title: "Create or join a lobby",
    description:
      "Spin up a private arena for your friend group or jump into a public tournament. Choose match mode or full season mode.",
    color: "text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/15",
    glow: "bg-sky-500/10",
    visual: (
      <div className="rounded-2xl border border-white/[0.07] bg-[oklch(0.12_0.007_38)] overflow-hidden shadow-xl shadow-black/40">
        <div className="p-4 border-b border-white/[0.05] flex items-center justify-between">
          <h4 className="text-[12px] font-bold text-stone-300">Create Arena</h4>
          <span className="text-[10px] text-stone-600 bg-white/[0.04] px-2 py-0.5 rounded-lg">Step 1 of 1</span>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-widest text-stone-600">Lobby Name</label>
            <div className="h-9 rounded-xl border border-orange-500/30 bg-white/[0.04] px-3 flex items-center">
              <span className="text-[11px] text-stone-300">Friday Night Rivals ✦</span>
              <span className="w-0.5 h-4 bg-orange-400 animate-pulse ml-0.5 rounded-full" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-widest text-stone-600">Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl border border-orange-500/25 bg-orange-500/10 flex flex-col gap-1.5">
                <Trophy className="w-4 h-4 text-orange-400" />
                <span className="text-[10px] font-bold text-orange-300">Tournament</span>
                <span className="text-[8px] text-stone-600">Full IPL season</span>
              </div>
              <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] flex flex-col gap-1.5 opacity-50">
                <Swords className="w-4 h-4 text-stone-600" />
                <span className="text-[10px] font-bold text-stone-500">Match</span>
                <span className="text-[8px] text-stone-700">Single fixture</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-widest text-stone-600">Access</label>
            <div className="flex gap-2">
              <div className="flex-1 p-2.5 rounded-xl border border-orange-500/25 bg-orange-500/10 flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-orange-500 bg-orange-500 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white" />
                </div>
                <div>
                  <div className="text-[9px] font-bold text-orange-300 flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> Private</div>
                  <div className="text-[7px] text-stone-600">Invite only</div>
                </div>
              </div>
              <div className="flex-1 p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-2 opacity-50">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-stone-700" />
                <div>
                  <div className="text-[9px] font-bold text-stone-500 flex items-center gap-1"><Globe className="w-2.5 h-2.5" /> Public</div>
                  <div className="text-[7px] text-stone-700">Open to all</div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <span className="text-[11px] font-bold text-white">Create Arena →</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    icon: Swords,
    title: "Build your squad",
    description:
      "Select 12 players from both teams before the toss. Apply role filters, respect team caps, and lock in your best XI.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/15",
    glow: "bg-emerald-500/10",
    visual: (
      <div className="rounded-2xl border border-white/[0.07] bg-[oklch(0.12_0.007_38)] overflow-hidden shadow-xl shadow-black/40">
        <div className="p-3 border-b border-white/[0.05] flex items-center justify-between">
          <span className="text-[11px] font-bold text-stone-300">MI vs CSK — Pick Your XII</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold font-mono text-orange-400">11/12</span>
            <div className="h-6 px-3 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center">
              <span className="text-[9px] font-bold text-orange-400">Save Squad</span>
            </div>
          </div>
        </div>

        <div className="flex gap-1.5 p-2.5 border-b border-white/[0.04]">
          {["ALL", "BAT", "BOWL", "AR", "WK"].map((r, i) => (
            <div key={r} className={`px-2.5 py-1 rounded-lg text-[8px] font-bold ${i === 1 ? "bg-orange-500 text-white" : "bg-white/[0.04] text-stone-600"}`}>{r}</div>
          ))}
        </div>

        <div className="divide-y divide-white/[0.03]">
          {[
            { name: "Rohit Sharma", team: "MI", role: "BAT", selected: true },
            { name: "Virat Kohli", team: "RCB", role: "BAT", selected: true },
            { name: "Ruturaj Gaikwad", team: "CSK", role: "BAT", selected: false },
            { name: "Shubman Gill", team: "GT", role: "BAT", selected: true },
          ].map((p) => (
            <div key={p.name} className={`flex items-center justify-between px-3.5 py-2.5 ${p.selected ? "bg-orange-500/[0.06]" : ""}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${p.selected ? "bg-orange-500 border-orange-500" : "bg-white/[0.03] border-white/[0.06]"}`}>
                  {p.selected ? <Check className="w-3 h-3 text-white" /> : <span className="text-[9px] text-stone-600">+</span>}
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-stone-300">{p.name}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] font-bold text-sky-400">{p.team}</span>
                    <span className="text-stone-700 text-[8px]">·</span>
                    <span className="text-[8px] text-stone-600">{p.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-white/[0.04] grid grid-cols-4 gap-1.5">
          {[
            { r: "BAT", n: 5, c: "text-sky-400" },
            { r: "BOWL", n: 3, c: "text-violet-400" },
            { r: "AR", n: 2, c: "text-emerald-400" },
            { r: "WK", n: 1, c: "text-amber-400" },
          ].map((s) => (
            <div key={s.r} className="rounded-lg bg-white/[0.03] border border-white/[0.04] p-1.5 text-center">
              <p className={`text-[10px] font-black ${s.c}`}>{s.n}</p>
              <p className="text-[7px] text-stone-700">{s.r}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Track scores and climb",
    description:
      "Live standings update as match data is processed. Watch your score rise with every boundary and wicket your players take.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/15",
    glow: "bg-violet-500/10",
    visual: (
      <div className="rounded-2xl border border-white/[0.07] bg-[oklch(0.12_0.007_38)] overflow-hidden shadow-xl shadow-black/40">
        <div className="p-4 border-b border-white/[0.05]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[12px] font-bold text-stone-300">Live Standings</h4>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold text-emerald-400">Live</span>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { rank: 1, name: "Sneha R.", pts: 342, delta: "+18", up: true },
              { rank: 2, name: "Arjun M.", pts: 298, delta: "+12", up: true },
              { rank: 3, name: "You", pts: 271, delta: "+22", up: true, you: true },
              { rank: 4, name: "Vikram S.", pts: 264, delta: "+9", up: false },
              { rank: 5, name: "Priya N.", pts: 241, delta: "+5", up: false },
            ].map((u) => (
              <div
                key={u.name}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${u.you
                  ? "border-orange-500/25 bg-orange-500/[0.07]"
                  : "border-white/[0.04] bg-white/[0.02]"
                  }`}
              >
                <span className={`text-[10px] font-black w-4 text-center ${u.you ? "text-orange-400" : u.rank === 1 ? "text-amber-400" : "text-stone-600"}`}>
                  {u.rank}
                </span>
                <div className="flex-1">
                  <span className={`text-[10px] font-bold ${u.you ? "text-orange-300" : "text-stone-300"}`}>{u.name}</span>
                </div>
                <span className={`text-[9px] font-bold ${u.up ? "text-emerald-400" : "text-stone-600"}`}>{u.delta}</span>
                <span className={`text-[11px] font-black font-mono ${u.you ? "text-orange-400" : "text-stone-300"}`}>{u.pts}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 grid grid-cols-3 gap-2.5">
          {[
            { label: "Rank", value: "#3", sub: "of 12 players", color: "text-orange-400" },
            { label: "Points", value: "271", sub: "this match", color: "text-white" },
            { label: "Trend", value: "↑ 4", sub: "positions gained", color: "text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-2.5 text-center">
              <p className={`text-base font-black ${s.color}`}>{s.value}</p>
              <p className="text-[8px] text-stone-600 mt-0.5 leading-tight">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

function MainStepsSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-[2.2rem] md:text-[3rem] font-black text-white tracking-tight mb-4">
            Four steps to
            <br />
            <span className="text-stone-500">game day glory</span>
          </h2>
          <p className="text-[14px] text-stone-500 max-w-md mx-auto leading-relaxed">
            Everything you need to compete, from your first sign-in to topping the leaderboard.
          </p>
        </div>

        <div className="mt-10">
          {MAIN_STEPS.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={step.number}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-10 border rounded-2xl px-6 py-4 border-stone-500 transition-all duration-300 shadow-md shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 items-center ${!isEven ? "lg:[&>*:first-child]:order-last" : ""
                  }`}
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-700">
                      {step.number}
                    </div>
                    <div className="flex-1 h-px bg-white/[0.04]" />
                  </div>

                  <div className={`w-12 h-12 rounded-2xl ${step.bg} border flex items-center justify-center`}>
                    <step.icon className={`w-5.5 h-5.5 ${step.color}`} />
                  </div>

                  <div>
                    <h3 className="text-[1.6rem] md:text-[2rem] font-black text-white tracking-tight mb-3 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-[14px] text-stone-500 leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </div>

                  <div className="h-px bg-white/[0.04]" />

                  <div className="flex items-center gap-2 text-[12px] font-semibold text-stone-500 hover:text-stone-300 transition-colors cursor-pointer group">
                    Learn more
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
                  </div>
                </div>

                <div className="relative">
                  <div className={`absolute -inset-8 ${step.glow} blur-[60px] rounded-full opacity-60 pointer-events-none`} />
                  <div className="relative">{step.visual}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ScoringSection() {
  const battingRules = [
    { label: "Per Run", points: "+1", note: "" },
    { label: "Boundary (4)", points: "+1", note: "bonus" },
    { label: "Six (6)", points: "+2", note: "bonus" },
    { label: "30+ runs", points: "+4", note: "milestone" },
    { label: "50+ runs", points: "+8", note: "milestone" },
    { label: "Century", points: "+16", note: "milestone" },
  ];

  const bowlingRules = [
    { label: "Per Wicket", points: "+25", note: "" },
    { label: "3-wicket haul", points: "+4", note: "bonus" },
    { label: "4-wicket haul", points: "+8", note: "bonus" },
    { label: "5-wicket haul", points: "+16", note: "bonus" },
    { label: "Maiden over", points: "+12", note: "" },
    { label: "Per Catch", points: "+8", note: "" },
  ];

  const srRules = [
    { range: "SR < 60", pts: "−6" },
    { range: "SR 60–80", pts: "−4" },
    { range: "SR 80–100", pts: "−2" },
    { range: "SR 120–140", pts: "+2" },
    { range: "SR 140–180", pts: "+4" },
    { range: "SR > 180", pts: "+6" },
  ];

  const erRules = [
    { range: "ER < 5", pts: "+6" },
    { range: "ER 5–7", pts: "+4" },
    { range: "ER 7–9", pts: "+2" },
    { range: "ER 9–11", pts: "−2" },
    { range: "ER 11–13", pts: "−4" },
    { range: "ER > 13", pts: "−6" },
  ];

  return (
    <section className="py-24 px-6 border-y border-white/[0.05] bg-white/[0.01]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/15 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-amber-400">
              Scoring system
            </span>
          </div>
          <h2 className="text-[2.2rem] md:text-[2.8rem] font-black text-white tracking-tight mb-4">
            Points built on
            <br />
            <span className="text-stone-500">real cricket logic</span>
          </h2>
          <p className="text-[14px] text-stone-500 max-w-md mx-auto leading-relaxed">
            Every run, wicket, and economy rate is converted into points using a system that rewards skill and strategy, not just volume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="rounded-2xl border border-orange-500/15 bg-orange-500/[0.04] overflow-hidden">
            <div className="px-5 py-4 border-b border-orange-500/10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
                <Target className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-orange-300">Batting Points</h3>
                <p className="text-[10px] text-stone-600">Runs, milestones & boundaries</p>
              </div>
            </div>
            <div className="p-5 space-y-2.5">
              {battingRules.map((r) => (
                <div key={r.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[12.5px] text-stone-400 font-medium">{r.label}</span>
                    {r.note && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-orange-500/70 bg-orange-500/10 px-1.5 py-0.5 rounded">
                        {r.note}
                      </span>
                    )}
                  </div>
                  <span className="text-[13px] font-black text-white font-mono">{r.points}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] overflow-hidden">
            <div className="px-5 py-4 border-b border-emerald-500/10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                <Swords className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-emerald-300">Bowling Points</h3>
                <p className="text-[10px] text-stone-600">Wickets, hauls & maidens</p>
              </div>
            </div>
            <div className="p-5 space-y-2.5">
              {bowlingRules.map((r) => (
                <div key={r.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[12.5px] text-stone-400 font-medium">{r.label}</span>
                    {r.note && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-500/70 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {r.note}
                      </span>
                    )}
                  </div>
                  <span className="text-[13px] font-black text-white font-mono">{r.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-sky-500/15 bg-sky-500/[0.04] overflow-hidden">
            <div className="px-5 py-4 border-b border-sky-500/10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-sky-300">Strike Rate Bonus</h3>
                <p className="text-[10px] text-stone-600">Applied when 10+ balls faced</p>
              </div>
            </div>
            <div className="p-5 space-y-2">
              {srRules.map((r) => (
                <div key={r.range} className="flex items-center justify-between">
                  <span className="text-[12px] text-stone-400 font-medium font-mono">{r.range}</span>
                  <span className={`text-[13px] font-black font-mono ${r.pts.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>
                    {r.pts}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/[0.04] overflow-hidden">
            <div className="px-5 py-4 border-b border-violet-500/10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-violet-300">Economy Rate Bonus</h3>
                <p className="text-[10px] text-stone-600">Applied when 2+ overs bowled</p>
              </div>
            </div>
            <div className="p-5 space-y-2">
              {erRules.map((r) => (
                <div key={r.range} className="flex items-center justify-between">
                  <span className="text-[12px] text-stone-400 font-medium font-mono">{r.range}</span>
                  <span className={`text-[13px] font-black font-mono ${r.pts.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>
                    {r.pts}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 p-5 rounded-2xl border border-amber-500/15 bg-amber-500/[0.04] flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-amber-300 mb-1">Over format note</h4>
            <p className="text-[12px] text-stone-500 leading-relaxed">
              Overs are entered in standard cricket decimal notation.{" "}
              <code className="text-amber-400 bg-black/30 px-1.5 py-0.5 rounded text-[11px] font-mono">3.5</code> means 3 complete overs and 5 additional balls (23 total balls).
              Economy rate is calculated automatically from this value.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LobbyModesSection() {
  const modes = [
    {
      icon: Trophy,
      title: "Tournament Mode",
      subtitle: "Long-game dominance",
      description: "Your squad accumulates points across every IPL fixture in the season. One lobby, every match, one champion at the end.",
      features: [
        "Points carry across all matches",
        "Dynamic squad updates between games",
        "Season-long leaderboard",
        "Final ranking at tournament end",
      ],
      accentColor: "text-orange-400",
      accentBg: "bg-orange-500/10 border-orange-500/15",
      cardBorder: "border-orange-500/15",
      cardBg: "from-orange-500/[0.06] to-transparent",
      badge: "Full Season",
      badgeColor: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    },
    {
      icon: Swords,
      title: "Match Mode",
      subtitle: "One fixture, all stakes",
      description: "Select one upcoming match and compete purely on that game. Perfect for quick side bets, specific rivalries, or casual play.",
      features: [
        "Pick for a single fixture only",
        "Results settled same day",
        "Fast-paced and high variance",
        "Ideal for new players",
      ],
      accentColor: "text-sky-400",
      accentBg: "bg-sky-500/10 border-sky-500/15",
      cardBorder: "border-sky-500/15",
      cardBg: "from-sky-500/[0.06] to-transparent",
      badge: "Single Match",
      badgeColor: "bg-sky-500/10 border-sky-500/20 text-sky-400",
    },
  ];

  const accessTypes = [
    {
      icon: Lock,
      title: "Private Arenas",
      description: "Require admin approval for new members. Full roster management and the ability to remove players at any time.",
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/15",
    },
    {
      icon: Globe,
      title: "Public Arenas",
      description: "Open to any signed-in user. Great for community-wide tournaments or giving your lobby maximum exposure.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/15",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/15 rounded-full px-4 py-1.5 mb-6">
            <Users className="w-3 h-3 text-sky-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-sky-400">
              Lobby types
            </span>
          </div>
          <h2 className="text-[2.2rem] md:text-[2.8rem] font-black text-white tracking-tight mb-4">
            Choose your
            <br />
            <span className="text-stone-500">battlefield</span>
          </h2>
          <p className="text-[14px] text-stone-500 max-w-md mx-auto leading-relaxed">
            Whether you want a season-long grind or a quick single-match showdown, CricArena has the format.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {modes.map((mode) => (
            <div
              key={mode.title}
              className={`relative rounded-2xl border ${mode.cardBorder} bg-gradient-to-b ${mode.cardBg} overflow-hidden p-6 hover:scale-[1.01] transition-transform duration-200`}
            >
              <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${mode.badgeColor} border rounded-full px-3 py-1 mb-5`}>
                {mode.badge}
              </div>

              <div className={`w-11 h-11 rounded-2xl ${mode.accentBg} border flex items-center justify-center mb-5`}>
                <mode.icon className={`w-5 h-5 ${mode.accentColor}`} />
              </div>

              <h3 className="text-[18px] font-black text-white mb-1">{mode.title}</h3>
              <p className="text-[11px] font-semibold text-stone-600 mb-3">{mode.subtitle}</p>
              <p className="text-[13px] text-stone-500 leading-relaxed mb-6">{mode.description}</p>

              <div className="space-y-2.5">
                {mode.features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full ${mode.accentBg} border flex items-center justify-center shrink-0`}>
                      <Check className={`w-2 h-2 ${mode.accentColor}`} />
                    </div>
                    <span className="text-[12px] text-stone-400 font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accessTypes.map((a) => (
            <div
              key={a.title}
              className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-xl ${a.bg} border flex items-center justify-center shrink-0`}>
                <a.icon className={`w-4.5 h-4.5 ${a.color}`} />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-white mb-1.5">{a.title}</h4>
                <p className="text-[12px] text-stone-500 leading-relaxed">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: "Can I change my squad after submitting?",
      a: "Yes — you can update your squad any time before the match begins. Once the first ball is bowled, your selection is locked in.",
    },
    {
      q: "How many players can be from one team?",
      a: "A maximum of 7 players from either side. This ensures your squad reflects both teams and makes selection genuinely strategic.",
    },
    {
      q: "When do scores get updated?",
      a: "An admin injects the match scorecard after the game ends. Points are calculated instantly and leaderboards refresh in real time.",
    },
    {
      q: "Is CricArena completely free?",
      a: "Yes. There are no paid tiers, no coins, no premium features. CricArena is free and will remain free for all players.",
    },
    {
      q: "Can I create multiple lobbies?",
      a: "Absolutely. Create as many lobbies as you like — different friend groups, different modes, all running simultaneously.",
    },
    {
      q: "What happens if a player I picked doesn't play?",
      a: "Players who don't participate score zero points for that match. Lineup announcements are typically available before the toss.",
    },
  ];

  return (
    <section className="py-24 px-6 border-t border-white/[0.05]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[2.2rem] md:text-[2.8rem] font-black text-white tracking-tight mb-4">
            Common questions
          </h2>
          <p className="text-[14px] text-stone-500 leading-relaxed">
            Everything you need to know before your first match.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-lg bg-orange-500/10 border border-orange-500/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[9px] font-black text-orange-400">Q</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-[13px] font-bold text-white mb-2">{faq.q}</h4>
                  <p className="text-[12.5px] text-stone-500 leading-relaxed">{faq.a}</p>
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
    <section className="py-20 px-6">
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
            <div className="inline-flex items-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
              ))}
            </div>

            <h2 className="text-[2.2rem] md:text-[3rem] font-black text-white tracking-tight mb-4 leading-[1.05]">
              Your squad isn't
              <br />
              going to pick itself
            </h2>
            <p className="text-[14px] text-stone-400 max-w-md mx-auto mb-10 leading-relaxed">
              The IPL season waits for no one. Join thousands of players already competing and make every match count.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <SignInButton className="group flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.97] transition-all duration-150 text-white font-bold text-[14px] px-8 py-4 rounded-2xl shadow-2xl shadow-orange-500/30">
                Create your free account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
              </SignInButton>

              <Link href="/">
                <button className="flex items-center gap-2 text-[13px] font-semibold text-stone-500 hover:text-stone-300 transition-colors px-4 py-4">
                  ← Back to home
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5">
              {[
                { icon: Check, text: "Free forever" },
                { icon: Zap, text: "Ready in 60 seconds" },
                { icon: Medal, text: "2,400+ active players" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5">
                  <item.icon className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[12px] font-medium text-stone-500">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[oklch(0.09_0.007_38)] text-white antialiased">
      <NavBar />
      <MainStepsSection />
      <ScoringSection />
      <LobbyModesSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}