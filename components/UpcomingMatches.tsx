import Link from "next/link";
import Image from "next/image";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function UpcomingMatches({ matches }: { matches: any[] }) {
    if (matches.length === 0) return null;

    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-medium text-zinc-400">Upcoming Fixtures</h2>
                <Link href="/matches" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                    View all →
                </Link>
            </div>

            <ScrollArea className="w-full whitespace-nowrap pb-4 -mx-5 px-5 md:mx-0 md:px-0">
                <div className="flex w-max space-x-4">
                    {matches.map((match) => {
                        const date = new Date(match.startTime);
                        const isToday = date.toDateString() === new Date().toDateString();

                        return (
                            <Link key={match.id} href={`/matches/${match.id}`} className="block group">
                                <div className="w-[280px] shrink-0 rounded-lg border border-zinc-800/60 bg-black p-4 hover:border-zinc-700 transition-colors">

                                    <div className="flex justify-between items-center mb-5">
                                        <span className="text-[12px] font-medium text-zinc-500">
                                            {date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                                        </span>
                                        {isToday ? (
                                            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-zinc-800/80 px-2 py-0.5 rounded-full">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                                Today
                                            </span>
                                        ) : (
                                            <span className="text-[12px] font-medium text-zinc-500">
                                                {date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center px-2">
                                        <div className="flex flex-col items-center gap-2">
                                            <Image src={`/teams/${match.teamAShort.toLowerCase()}.webp`} alt={match.teamAShort} width={40}
                                                height={40} className="width:auto height:auto object-contain drop-shadow-md opacity-90 group-hover:opacity-100 transition-opacity" />
                                            <span className="font-semibold text-[13px] text-zinc-200">{match.teamAShort}</span>
                                        </div>

                                        <span className="text-[11px] font-medium text-zinc-600">VS</span>

                                        <div className="flex flex-col items-center gap-2">
                                            <Image src={`/teams/${match.teamBShort.toLowerCase()}.webp`} alt={match.teamBShort} width={40}
                                                height={40} className="width:auto height:auto object-contain drop-shadow-md opacity-90 group-hover:opacity-100 transition-opacity" />
                                            <span className="font-semibold text-[13px] text-zinc-200">{match.teamBShort}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
        </section>
    );
}
