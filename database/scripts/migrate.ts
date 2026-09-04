/**
 * Custom migration runner.
 *
 * - Reads .sql files from `database/migrations/` in lexicographic order.
 * - Ensures the `schema_migrations` table exists (idempotent).
 * - For each un-applied file, runs the SQL inside a transaction and records
 *   the filename as the applied version.
 *
 * Run via: `npm run db:migrate` from the api/ folder.
 */

import { promises as fs } from 'fs';
import * as path from 'path';

// Resolve `dotenv` and `mysql2` from the api workspace so this script can be
// invoked from `npm run db:migrate` regardless of the caller's CWD.
const API_NODE_MODULES = path.resolve(__dirname, '..', '..', 'api', 'node_modules');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require(path.join(API_NODE_MODULES, 'dotenv'));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mysql = require(path.join(API_NODE_MODULES, 'mysql2', 'promise.js')) as typeof import('mysql2/promise');

dotenv.config({ path: path.resolve(__dirname, '..', '..', 'api', '.env') });

const DATABASE_URL: string = process.env.DATABASE_URL ?? '';
if (!DATABASE_URL) {
  // eslint-disable-next-line no-console
  console.error('[migrate] DATABASE_URL is not set (api/.env)');
  process.exit(1);
}

const MIGRATIONS_DIR = path.resolve(__dirname, '..', 'migrations');

function versionOf(filename: string): string {
  return filename;
}

async function ensureMigrationsTable(conn: mysql.Connection): Promise<void> {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version    VARCHAR(255) NOT NULL PRIMARY KEY,
      applied_at DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function appliedVersions(conn: mysql.Connection): Promise<Set<string>> {
  const [rows] = await conn.query<mysql.RowDataPacket[]>('SELECT version FROM schema_migrations');
  return new Set(rows.map((r) => String(r.version)));
}

async function listMigrationFiles(): Promise<string[]> {
  const entries = await fs.readdir(MIGRATIONS_DIR);
  return entries.filter((f) => f.endsWith('.sql')).sort();
}

function stripLineComments(sql: string): string {
  return sql
    .split(/\r?\n/)
    .map((line) => {
      const idx = line.indexOf('--');
      return idx === -1 ? line : line.slice(0, idx);
    })
    .join('\n');
}

function splitStatements(sql: string): string[] {
  return stripLineComments(sql)
    .split(/;\s*(?:\r?\n|$)/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function applyOne(
  conn: mysql.Connection,
  filename: string,
  contents: string,
): Promise<void> {
  const statements = splitStatements(contents);
  await conn.beginTransaction();
  try {
    for (const stmt of statements) {
      await conn.query(stmt);
    }
    await conn.query('INSERT INTO schema_migrations (version) VALUES (?)', [versionOf(filename)]);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  }
}

async function main(): Promise<void> {
  const conn = await mysql.createConnection({
    uri: DATABASE_URL,
    multipleStatements: false,
  });

  try {
    await ensureMigrationsTable(conn);
    const applied = await appliedVersions(conn);
    const files = await listMigrationFiles();

    let appliedCount = 0;
    for (const file of files) {
      if (applied.has(versionOf(file))) {
        continue;
      }
      const full = path.join(MIGRATIONS_DIR, file);
      const contents = await fs.readFile(full, 'utf8');
      // eslint-disable-next-line no-console
      console.log(`[migrate] applying ${file}`);
      await applyOne(conn, file, contents);
      appliedCount += 1;
    }

    if (appliedCount === 0) {
      // eslint-disable-next-line no-console
      console.log('[migrate] nothing to do (all migrations up to date)');
    } else {
      // eslint-disable-next-line no-console
      console.log(`[migrate] applied ${appliedCount} migration(s)`);
    }
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[migrate] failed:', err);
  process.exit(1);
});
