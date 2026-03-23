import { db } from '@repo/db';
import { tournaments } from '@repo/db/schema';

const TOURNAMENT_NAME = 'Indian Premier League 2026';

async function CreateTournament() {
  console.log(`Creating Tournament: ${TOURNAMENT_NAME}`);
  try {
    const [tournament] = await db
      .insert(tournaments)
      .values({
        name: TOURNAMENT_NAME,
        startDate: new Date('2026-03-28T14:00:00Z'),
        endDate: new Date('2026-05-28T18:00:00Z'),
      })
      .returning();

    console.log(`Success! Tournament ID: ${tournament.id}`);
    process.exit(0);
  } catch (error) {
    console.error('Database error:', error);
    process.exit(1);
  }
}

CreateTournament();