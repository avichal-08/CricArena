import { db } from '@repo/db';
import { teams } from '@repo/db/schema';

const IPL_TEAMS = [
  { name: 'Chennai Super Kings', shortName: 'CSK', logoUrl: '/teams/csk' },
  { name: 'Mumbai Indians', shortName: 'MI', logoUrl: '/teams/mi' },
  { name: 'Royal Challengers Bengaluru', shortName: 'RCB', logoUrl: '/teams/rcb' },
  { name: 'Kolkata Knight Riders', shortName: 'KKR', logoUrl: '/teams/kkr' },
  { name: 'Rajasthan Royals', shortName: 'RR', logoUrl: '/teams/cks' },
  { name: 'Delhi Capitals', shortName: 'DC', logoUrl: '/teams/cks' },
  { name: 'Punjab Kings', shortName: 'PBKS', logoUrl: '/teams/cks' },
  { name: 'Sunrisers Hyderabad', shortName: 'SRH', logoUrl: '/teams/cks' },
  { name: 'Lucknow Super Giants', shortName: 'LSG', logoUrl: '/teams/cks' },
  { name: 'Gujarat Titans', shortName: 'GT', logoUrl: '/teams/cks' },
];

async function CreateTeam() {
  console.log('Inserting IPL Franchises...');
  try {
    await db.insert(teams).values(IPL_TEAMS);
    console.log('All 10 teams inserted successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Database error:', error);
    process.exit(1);
  }
}

CreateTeam();