import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import 'dotenv/config'; // This loads the .env file

// For SQLite
const sqlite = new Database('dev.db');
export const db = drizzle(sqlite, { schema });

console.log('✅ Database connected (SQLite)');
