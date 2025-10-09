import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import * as schema from './schema';

const sqlite = new Database(process.env.DATABASE_URL || './data/devgourmet.db');
const db = drizzle(sqlite, { schema });

console.log('Running migrations...');

await migrate(db, { migrationsFolder: './src/db/migrations' });

console.log('✅ Migrations complete');
sqlite.close();
