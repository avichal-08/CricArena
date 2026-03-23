import { db } from '@repo/db';
import { eq } from 'drizzle-orm';
import { matches, teams, tournaments } from '@repo/db/schema';
import scheduleData from '@/data/schedule.json';

const TOURNAMENT_NAME = 'Indian Premier League 2026';

async function CreateMatch() {
    if (scheduleData.length === 0) {
        console.error("No schedule found");
        process.exit(1);
    }

    try {

        const [tournament] = await db
            .select({ id: tournaments.id })
            .from(tournaments)
            .where(eq(tournaments.name, TOURNAMENT_NAME));

        if (!tournament) {
            console.error("No tournament found");
            process.exit(1);
        }

        const tournamentId = tournament.id;

        const allTeams = await db
            .select({ id: teams.id, shortName: teams.shortName })
            .from(teams);

        if (allTeams.length === 0) {
            console.error("No team found");
            process.exit(1);
        }

        const teamIdMap: Record<string, string> = {};

        for (const team of allTeams) {
            teamIdMap[team.shortName.toUpperCase()] = team.id;
        }

        const matchesToInsert: {
            tournamentId: string,
            teamAId: string,
            teamBId: string,
            startTime: Date
        }[] = [];

        for (const match of scheduleData) {
            const teamAId = teamIdMap[match.teamA.toUpperCase()];
            const teamBId = teamIdMap[match.teamB.toUpperCase()];

            if (!teamAId || !teamBId) {
                console.warn(`Warning: Team ID not found for ${match.teamA} vs ${match.teamB} match`);
                continue;
            }

            matchesToInsert.push({
                tournamentId,
                teamAId,
                teamBId,
                startTime: new Date(match.time)
            })
        }

        if (matchesToInsert.length === 0) {
            console.error("No matches to insert");
            process.exit(1);
        }

        await db.insert(matches).values(matchesToInsert);

        console.log("matches insertion done")
    } catch {
        console.error("Error in matches creation. Might be some DB issue")
    }
}

CreateMatch();