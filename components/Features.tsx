import { Zap, Shield, Users, Trophy, LineChart, Globe } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Real-time Scoring Engine",
      description: "Points update instantly as every ball is bowled. No refreshing required.",
      icon: Zap,
      className: "md:col-span-2",
    },
    {
      title: "Campus Lobbies",
      description: "Create private rooms using specific passcodes to play exclusively with your college or hostel friends.",
      icon: Users,
      className: "md:col-span-1",
    },
    {
      title: "Global Leaderboards",
      description: "See where you rank against the entire CricArena community.",
      icon: Globe,
      className: "md:col-span-1",
    },
    {
      title: "Deep Analytics",
      description: "Track your historical performance, player win rates, and points-per-match averages.",
      icon: LineChart,
      className: "md:col-span-2",
    },
  ];

  return (
    <section className="w-full py-24 bg-background relative z-10">
      <div className="max-w-5xl mx-auto px-5">
        
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Built for the modern fan.
          </h2>
          <p className="text-stone-400 max-w-xl text-sm md:text-base">
            Everything you need to manage your fantasy squad, packed into a lightning-fast interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className={`group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.05] p-8 transition-all duration-300 hover:border-orange-500/30 hover:bg-white/[0.04] ${feature.className}`}
              >
                <div className="absolute -inset-px bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.08] text-orange-400 group-hover:scale-110 group-hover:bg-orange-500/10 transition-all duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-white tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-stone-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}