import { db } from "@/drizzle/src";
import { matchEntries, matches, teams } from "@/drizzle/src/db/schema";
import { authOptions } from "@/lib/configs/authOptions";
import { and, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function AllEntries({ params }: { params: { lobbyId: string, userId: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/api/auth/signin");

    const { userId, lobbyId } = await params;

    if (!userId) return notFound();

    const teamA = alias(teams, "teamA");
    const teamB = alias(teams, "teamB");

    const allEntries = await db
        .select({ id: matchEntries.id, teamA: teamA.shortName, teamALogoUrl: teamA.logoUrl, teamB: teamB.shortName, teamBLogoUrl: teamB.logoUrl, date: matches.startTime })
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

    if (allEntries.length === 0) {
        return (
            <div>
                No Entries Found
            </div>
        )
    };

    return (
        <div>
            {allEntries.map((entry, index) => (
                <Link key={index} href={`/lobby/${lobbyId}/tournament/${entry.id}`}>
                    {entry.teamA} vs {entry.teamB}
                    <div>
                        Date: {new Date(entry.date).toLocaleString()}
                    </div>
                </Link>
            ))}
        </div>
    )
}