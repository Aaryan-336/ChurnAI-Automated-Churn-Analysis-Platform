import { Pool } from 'pg';

// Singleton pattern — reuse connection pool across hot reloads in dev
const globalForPg = globalThis as unknown as { pgPool: Pool };

export const db =
  globalForPg.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2_000,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pgPool = db;
}