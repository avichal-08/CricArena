import { db } from '@repo/db';
import { players, teams } from '@repo/db/schema';
import squadsData from '@/data/squads.json';

async function CreatePlayer() {
    console.log('Seeding IPL Squads..');
    try {
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

        const playersToInsert: {
            name: string,
            teamId: string,
            role: string,
            playingStyle: string | null
        }[] = [];

        for (const player of squadsData) {
            const teamId = teamIdMap[player.team.toUpperCase()];

            if (!teamId) {
                console.warn(`Warning: Team ${player.team} not found in DB. Skipping ${player.name}`);
                continue;
            }

            playersToInsert.push({
                name: player.name,
                teamId,
                role: player.role,
                playingStyle: player.playingStyle
            });
        }

        if (playersToInsert.length === 0) {
            console.error("No player to insert");
            process.exit(1);
        }

        console.log(`Inserting ${playersToInsert.length} players into the DB`);

        await db.insert(players).values(playersToInsert);

        console.log(`Successfully inserted ${playersToInsert.length} players to DB`);
        process.exit(0);
    } catch {
        console.error("Error in players insertion. Maybe some DB issue");
        process.exit(1);
    }
}

CreatePlayer();