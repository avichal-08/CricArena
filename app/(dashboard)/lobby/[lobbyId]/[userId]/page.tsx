import { db } from "@/drizzle/src";
import { matchEntries, matches, teams } from "@/drizzle/src/db/schema";
import { authOptions } from "@/lib/configs/authOptions";
import { and, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Swords, CalendarDays, ChevronRight, FolderOpen } from "lucide-react";

export default async function AllEntries({
  params,
}: {
  params: { lobbyId: string; userId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  const { userId, lobbyId } = await params;
  if (!userId) return notFound();

  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");

  const allEntries = await db
    .select({
      id: matchEntries.id,
      teamA: teamA.shortName,
      teamALogoUrl: teamA.logoUrl,
      teamB: teamB.shortName,
      teamBLogoUrl: teamB.logoUrl,
      date: matches.startTime,
      score: matchEntries.score,
    })
    .from(matchEntries)
    .innerJoin(matches, eq(matchEntries.matchId, matches.id))
    .innerJoin(teamA, eq(matches.teamAId, teamA.id))
    .innerJoin(teamB, eq(matches.teamBId, teamB.id))
    .where(
      and(
        eq(matchEntries.lobbyId, lobbyId),
        eq(matchEntries.userId, userId)
      )
    );

  return (
    <div className="max-w-2xl mx-auto w-full p-5 md:p-8 pb-24">
      <div className="flex items-center gap-3 pb-6 border-b border-white/[0.05] mb-6">
        <Link
          href={`/lobby/${lobbyId}`}
          className="p-2 -ml-1 rounded-xl hover:bg-white/[0.05] transition-colors text-stone-500 hover:text-stone-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Match Entries</h1>
          <p className="text-[12px] text-stone-500 mt-0.5">
            All squad submissions for this lobby
          </p>
        </div>
      </div>

      {allEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-white/[0.08] text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-5">
            <FolderOpen className="w-6 h-6 text-stone-700" />
          </div>
          <h2 className="text-base font-bold text-stone-400 mb-1">No entries found</h2>
          <p className="text-sm text-stone-600 max-w-xs">
            This player hasn't submitted any squads in this lobby yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {allEntries.map((entry, index) => {
            const date = new Date(entry.date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <Link
                key={index}
                href={`/lobby/${lobbyId}/tournament/${entry.id}`}
                className="block group"
              >
                <div className="flex items-center justify-between p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-orange-500/15 transition-all duration-200 active:scale-[0.99]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center shrink-0">
                      <Swords className="w-4 h-4 text-orange-400" />
                    </div>

                    <div>
                      <p className="text-[14px] font-bold text-stone-200">
                        {entry.teamA}{" "}
                        <span className="text-stone-600 font-medium">vs</span>{" "}
                        {entry.teamB}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <CalendarDays className="w-3 h-3 text-stone-600" />
                        <span className="text-[11px] text-stone-600 font-medium">
                          {isToday
                            ? "Today"
                            : date.toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                        </span>
                        {isToday && (
                          <span className="flex items-center gap-1 ml-1">
                            <span className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-orange-400">Today</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {entry.score && entry.score > 0 && (
                      <div className="text-right">
                        <span className="text-[15px] font-black font-mono text-white block leading-tight">
                          {entry.score}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-stone-600">
                          pts
                        </span>
                      </div>
                    )}
                    <ChevronRight className="w-4 h-4 text-stone-700 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all duration-200" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}