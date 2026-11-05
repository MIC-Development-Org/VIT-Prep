import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (!db) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not configured.');
    }

    const sql = postgres(databaseUrl, {
      ssl: 'require',
      max: 1,
      prepare: false,
    });
    db = drizzle(sql, { schema });
  }

  return db;
}
