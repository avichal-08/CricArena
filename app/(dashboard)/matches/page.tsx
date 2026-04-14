import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { alias } from "drizzle-orm/pg-core";
import { eq, gte, asc, or } from "drizzle-orm";

import { db } from "@repo/db";
import { matches, teams } from "@repo/db/schema";
import { authOptions } from "@/lib/configs/authOptions";

import { AllMatches } from "@/components/AllMatches";

export default async function Matches() {

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/")
    }

    const userId = session?.user?.id;

    const teamA = alias(teams, "teamA");
    const teamB = alias(teams, "teamB");

    const allMatches = await db
        .select({
            id: matches.id,
            startTime: matches.startTime,
            teamAShort: teamA.shortName,
            teamBShort: teamB.shortName,
        })
        .from(matches)
        .innerJoin(teamA, eq(matches.teamAId, teamA.id))
        .innerJoin(teamB, eq(matches.teamBId, teamB.id))
        .where(gte(matches.startTime, new Date()))
        .orderBy(asc(matches.startTime))

    return (
        <AllMatches matches={allMatches}/>
    )
}