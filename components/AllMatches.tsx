import Link from "next/link";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function AllMatches({ matches }: { matches: any[] }) {
  if (matches.length === 0) return null;

  return (
    <section>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">All Upcoming Fixtures</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {matches.map((match) => {
          const date = new Date(match.startTime);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <Link key={match.id} href={`/matches/${match.id}`} className="block group">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] hover:border-orange-500/20 p-5 transition-all duration-200 group-active:scale-[0.98]">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-stone-500">
                    <CalendarDays className="w-3 h-3" />
                    {date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </div>
                  {isToday ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                      <span className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                      Today
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-stone-600">
                      {date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-2">
                    <Image src={`/teams/${match.teamAShort.toLowerCase()}.webp`} alt={match.teamAShort} width={40} height={40} className="object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[12px] font-bold text-stone-300">{match.teamAShort}</span>
                  </div>
                  <span className="text-[11px] font-bold text-stone-700">VS</span>
                  <div className="flex flex-col items-center gap-2">
                    <Image src={`/teams/${match.teamBShort.toLowerCase()}.webp`} alt={match.teamBShort} width={40} height={40} className="object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[12px] font-bold text-stone-300">{match.teamBShort}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}