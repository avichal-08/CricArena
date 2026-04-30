import { Flame } from "lucide-react";

export function DeviceMockup() {
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
                                        className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[10px] font-medium transition-colors ${item.active
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