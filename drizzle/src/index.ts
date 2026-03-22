import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';

const sql = neon(process.env.DATABASE_URL!);

const dbSingleton = () => {
  return drizzle(sql, { schema });
};

declare global {
  var db: undefined | ReturnType<typeof dbSingleton>;
}

export const db = globalThis.db ?? dbSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.db = db;
}