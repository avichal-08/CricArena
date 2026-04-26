import { db } from "@/drizzle/src";
import { matchEntries, players } from "@/drizzle/src/db/schema";
import { authOptions } from "@/lib/configs/authOptions";
import { and, eq, inArray } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

const ROLE_ORDER = ["wk", "batsman", "all-rounder", "bowler"];

export default async function MatchEntry({ params }: { params: { entryId: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) redirect("/api/auth/signin");

    const { entryId } = await params;

    if (!entryId) notFound();

    const [matchEntry] = await db
        .select()
        .from(matchEntries)
        .where(
            eq(matchEntries.id, entryId)
        );

    if (!matchEntry) return notFound();

    const selectedPlayersID: string[] = matchEntry.teamSelection;

    if (!selectedPlayersID || selectedPlayersID.length === 0) {
        return <div className="p-4 text-center text-gray-500">No players selected for this team.</div>;
    }

    const selectedTeam = await db
        .select()
        .from(players)
        .where(
            inArray(players.id, selectedPlayersID)
        );

    const groupedPlayers = selectedTeam.reduce((acc, player) => {
        const role = player.role || "Other";
        if (!acc[role]) acc[role] = [];
        acc[role].push(player);
        return acc;
    }, {} as Record<string, typeof selectedTeam>);

    const displayRoles = [...ROLE_ORDER, ...Object.keys(groupedPlayers).filter(r => !ROLE_ORDER.includes(r))];

    return (
        <div className="p-4 max-w-2xl mx-auto min-h-screen flex flex-col bg-gray-950">

            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-xl font-extrabold text-black">Your Team</h1>
                <div className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold shadow-sm">
                    Score: {matchEntry.score}
                </div>
            </div>

            <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] bg-[#2e8b57] rounded-[3rem] sm:rounded-[4rem] overflow-hidden border-[8px] border-[#1e5631] shadow-2xl flex flex-col justify-evenly py-6">

                <div className="absolute inset-4 border-2 border-white/40 rounded-[2.5rem] sm:rounded-[3.5rem] pointer-events-none"></div>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/40 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 sm:w-20 h-32 sm:h-40 border-2 border-white/40 bg-[#d2b48c]/20 pointer-events-none"></div>

                {displayRoles.map((role) => {
                    const playersInRole = groupedPlayers[role];
                    if (!playersInRole || playersInRole.length === 0) return null;

                    return (
                        <div key={role} className="relative z-10 flex flex-col items-center w-full gap-2 mt-2">
                            <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full shadow-sm">
                                {role}
                            </span>

                            <div className="flex justify-center items-start gap-4 sm:gap-6 w-full px-2 flex-wrap">
                                {playersInRole.map((player) => (
                                    <div key={player.id} className="flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform duration-200 w-[80px] sm:w-[100px]">

                                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white text-gray-900 rounded-full flex items-center justify-center text-sm sm:text-base font-bold shadow-lg border-2 border-gray-200 group-hover:border-yellow-400">
                                            {player.name.substring(0, 2).toUpperCase()}
                                        </div>

                                        <div className="mt-1.5 bg-black/75 text-white text-[10px] sm:text-xs px-2 py-1 rounded shadow text-center w-full truncate font-medium">
                                            {player.name}
                                        </div>

                                        {player.playingStyle && (
                                            <div className="mt-1 text-[8px] sm:text-[9px] font-medium text-white/90 text-center leading-tight">
                                                {player.playingStyle}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
