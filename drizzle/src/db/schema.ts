import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  integer,
  jsonb,
  unique,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from 'next-auth/adapters';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const lobbyTypeEnum = pgEnum('lobby_type', ['public', 'private']);
export const lobbyRoleEnum = pgEnum('lobby_role', ['admin', 'member']);
export const lobbyStatusEnum = pgEnum('lobby_status', ['pending', 'accepted', 'rejected']);

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  role: userRoleEnum('role').default('user').notNull(),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const tournaments = pgTable('tournament', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  startDate: timestamp('start_date', { mode: 'date' }).notNull(),
  endDate: timestamp('end_date', { mode: 'date' }).notNull(),
});

export const teams = pgTable('team', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  shortName: text('short_name').notNull(),
  logoUrl: text('logo_url'),
});

export const players = pgTable(
  'player',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    teamId: text('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    role: text('role').notNull(),
  },
  (t) => ({
    teamIdIdx: index('player_team_id_idx').on(t.teamId),
  })
);

export const matches = pgTable(
  'match',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    tournamentId: text('tournament_id')
      .notNull()
      .references(() => tournaments.id, { onDelete: 'cascade' }),
    teamAId: text('team_a_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    teamBId: text('team_b_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    startTime: timestamp('start_time', { mode: 'date' }).notNull(),
  },
  (t) => ({
    startTimeIdx: index('start_time_idx').on(t.startTime),
  })
);

export const lobbies = pgTable(
  'lobby',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    type: lobbyTypeEnum('type').default('public').notNull(),
    createdBy: text('created_by')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (t) => ({
    typeIdx: index('lobby_type_idx').on(t.type),
  })
);

export const lobbyMembers = pgTable(
  'lobby_member',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    lobbyId: text('lobby_id')
      .notNull()
      .references(() => lobbies.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: lobbyRoleEnum('role').default('member').notNull(),
    status: lobbyStatusEnum('status').default('pending').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (t) => ({
    unq: unique().on(t.lobbyId, t.userId),
    userIdIdx: index('lm_user_id_idx').on(t.userId),
    lobbyIdIdx: index('lm_lobby_id_idx').on(t.lobbyId),
  })
);

export const matchEntries = pgTable(
  'match_entry',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lobbyId: text('lobby_id')
      .notNull()
      .references(() => lobbies.id, { onDelete: 'cascade' }),
    matchId: text('match_id')
      .notNull()
      .references(() => matches.id, { onDelete: 'cascade' }),
    teamSelection: jsonb('team_selection').$type<string[]>().notNull(),
    prePredictions: jsonb('pre_predictions').$type<Record<string, string | number>>().notNull(),
    score: integer('score').default(0).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (t) => ({
    unq: unique().on(t.userId, t.lobbyId, t.matchId),
    leaderboardIdx: index('leaderboard_idx').on(t.lobbyId, t.matchId, t.score),
    matchIdx: index('me_match_id_idx').on(t.matchId),
  })
);