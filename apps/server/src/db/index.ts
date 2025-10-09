import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema';

// Create SQLite database
const sqlite = new Database(process.env.DATABASE_URL || './data/devgourmet.db');

// Create Drizzle ORM instance
export const db = drizzle(sqlite, { schema });

export * from './schema';
