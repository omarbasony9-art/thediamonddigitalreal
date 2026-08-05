/**
 * export-site-pages-only.mjs
 * Exports only the site_pages table from Replit PostgreSQL → SQLite-compatible SQL.
 * Uses the pg client; strings are escaped by doubling single quotes (SQLite standard).
 * Validates every INSERT against an in-memory SQLite DB via python3 before saving.
 */

import { createRequire } from 'module';
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

const require = createRequire(import.meta.url);
const pg = require('/home/runner/workspace/node_modules/.pnpm/pg@8.22.0/node_modules/pg');
const { Client } = pg;

// ── SQLite literal formatter ─────────────────────────────────────────────────
function lit(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? '1' : '0';
  if (typeof val === 'number') return String(val);
  if (val instanceof Date) return `'${val.toISOString().replace(/'/g, "''")}'`;
  // String: double every single quote — the only escaping SQLite needs
  return `'${String(val).replace(/'/g, "''")}'`;
}

const COLUMNS = ['id', 'site_id', 'title', 'slug', 'content', 'order', 'created_at', 'updated_at'];

function buildInsert(row) {
  const colList = COLUMNS.map(c => `"${c}"`).join(', ');
  const valList = COLUMNS.map(c => lit(row[c])).join(', ');
  return `INSERT INTO site_pages (${colList}) VALUES (${valList});`;
}

// ── Query PostgreSQL ─────────────────────────────────────────────────────────
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const { rows } = await client.query(
  `SELECT ${COLUMNS.map(c => `"${c}"`).join(', ')} FROM public.site_pages ORDER BY id`
);
await client.end();

const rowCount = rows.length;
console.log(`Fetched ${rowCount} rows from PostgreSQL.`);

// ── Build SQL ────────────────────────────────────────────────────────────────
const header = `\
-- Diamond Digital — site_pages export
-- Generated: ${new Date().toISOString()}
-- Source: Replit PostgreSQL → Cloudflare D1 (SQLite)
-- Rows: ${rowCount}
-- Escaping: single quotes doubled (SQLite standard); driver-level fetch, no manual string parsing.

BEGIN;
`;

const inserts = rows.map(buildInsert).join('\n');
const footer = '\nCOMMIT;\n';
const sql = header + inserts + footer;

// ── Validate every INSERT with Python sqlite3 ────────────────────────────────
const SCHEMA = `
CREATE TABLE IF NOT EXISTS site_pages (
  id INTEGER PRIMARY KEY,
  site_id INTEGER,
  title TEXT,
  slug TEXT,
  content TEXT,
  "order" INTEGER,
  created_at TEXT,
  updated_at TEXT
);
`;

const PY_SCRIPT = `/tmp/validate_site_pages.py`;
writeFileSync(PY_SCRIPT, `
import sqlite3, sys
schema = ${JSON.stringify(SCHEMA)}
sql    = ${JSON.stringify(sql)}
con = sqlite3.connect(':memory:')
con.executescript(schema)
try:
    con.executescript(sql)
except sqlite3.Error as e:
    print('FAIL:', e, file=sys.stderr)
    sys.exit(1)
n = con.execute('SELECT COUNT(*) FROM site_pages').fetchone()[0]
print('SQLITE_OK', n)
con.close()
`);

let validated = 0;
try {
  const out = execSync(`python3 ${PY_SCRIPT}`, { encoding: 'utf8' }).trim();
  if (!out.startsWith('SQLITE_OK')) throw new Error(out);
  validated = parseInt(out.split(' ')[1], 10);
  console.log(`SQLite validation: ✓ PASSED — ${validated} rows verified, zero SQL errors`);
} catch (err) {
  console.error('SQLite validation: ✗ FAILED');
  console.error(err.stderr || err.message);
  process.exit(1);
}

if (validated !== rowCount) {
  console.error(`Row count mismatch: exported ${rowCount}, SQLite saw ${validated}`);
  process.exit(1);
}

// ── Write file ───────────────────────────────────────────────────────────────
const OUT = '/home/runner/workspace/site_pages_only.sql';
writeFileSync(OUT, sql, 'utf8');
console.log(`\nSaved: ${OUT}`);
console.log(`Total exported rows: ${rowCount}`);
