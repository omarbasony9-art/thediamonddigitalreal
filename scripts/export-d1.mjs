/**
 * export-d1.mjs
 * Exports Replit PostgreSQL → Cloudflare D1-compatible SQL.
 * Uses the pg client; all string values are escaped by doubling internal
 * single quotes (the only escaping SQLite requires). Multiline content,
 * double-quotes, semicolons, backslashes, and Unicode are all preserved.
 */

import { createRequire } from 'module';
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

const require = createRequire(import.meta.url);

// Resolve pg from the pnpm store
const pg = require('/home/runner/workspace/node_modules/.pnpm/pg@8.22.0/node_modules/pg');
const { Client } = pg;

// ── SQLite literal formatter ────────────────────────────────────────────────
function lit(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? '1' : '0';
  if (typeof val === 'number') return String(val);
  // Date objects (pg returns them for timestamp columns)
  if (val instanceof Date) {
    return `'${val.toISOString().replace(/'/g, "''")}'`;
  }
  // Everything else: coerce to string, escape single quotes by doubling
  return `'${String(val).replace(/'/g, "''")}'`;
}

function buildInsert(table, columns, row) {
  const colList = columns.map(c => `"${c}"`).join(', ');
  const valList = columns.map(c => lit(row[c])).join(', ');
  return `INSERT INTO ${table} (${colList}) VALUES (${valList});`;
}

// ── Main ────────────────────────────────────────────────────────────────────
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const lines = [];

const header = `\
-- Diamond Digital — D1 Data Export
-- Generated: ${new Date().toISOString()}
-- Source: Replit PostgreSQL (development database)
-- Target: Cloudflare D1 (SQLite)
--
-- Included tables: sites, site_pages, quotes, activity_log, client_users
-- Excluded:        admin_users (PBKDF2 account already created in D1)
--
-- All string values escaped with doubled single-quotes (SQLite standard).
-- Multiline content, double-quotes, semicolons, backslashes, Unicode preserved.
-- NULLs preserved. PostgreSQL booleans → 1/0. Timestamps → ISO 8601 TEXT.
--
-- How to run:
--   Cloudflare Dashboard → Workers & Pages → D1 → diamond-digital → Console
--   Paste the full contents of this file and click Execute.

BEGIN;
`;
lines.push(header);

// Table specs: [tableName, orderBy, columnsToExport]
const tables = [
  [
    'sites',
    'id',
    ['id','client_name','project_name','domain','status','tech',
     'description','live_url','preview_url','quote_id',
     'created_at','updated_at','launched_at','client_email','project_type'],
  ],
  [
    'site_pages',
    'id',
    ['id','site_id','title','slug','content','order','created_at','updated_at'],
  ],
  [
    'quotes',
    'id',
    ['id','name','email','phone','company','project_type','description',
     'budget','timeline','status','admin_notes','created_at','updated_at'],
  ],
  [
    'activity_log',
    'id',
    ['id','type','message','entity_id','entity_type','created_at'],
  ],
  [
    'client_users',
    'id',
    ['id','name','email','password_hash','company','created_at'],
  ],
];

const counts = {};

for (const [table, orderBy, columns] of tables) {
  const { rows } = await client.query(
    `SELECT ${columns.map(c => `"${c}"`).join(', ')} FROM "${table}" ORDER BY "${orderBy}"`
  );
  counts[table] = rows.length;
  lines.push(`\n-- ── ${table} (${rows.length} rows) ${'─'.repeat(Math.max(0, 60 - table.length - String(rows.length).length - 12))}`);
  for (const row of rows) {
    lines.push(buildInsert(table, columns, row));
  }
}

lines.push('\nCOMMIT;');

await client.end();

// ── Write file ───────────────────────────────────────────────────────────────
const output = lines.join('\n');
const outPath = '/home/runner/workspace/d1-data-export.sql';
writeFileSync(outPath, output, 'utf8');

const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log('Written:', outPath);
console.log('Row counts:');
for (const [t, n] of Object.entries(counts)) {
  console.log(`  ${t.padEnd(20)} ${n}`);
}
console.log(`  ${'TOTAL'.padEnd(20)} ${total}`);

// ── SQLite validation via Python3 built-in sqlite3 ──────────────────────────
console.log('\nValidating with SQLite (python3)…');
try {
  const result = execSync(`python3 /home/runner/workspace/scripts/validate-d1.py`, { encoding: 'utf8' });
  console.log(result);
} catch (err) {
  console.error('SQLite validation: ✗ FAILED');
  console.error(err.stdout || err.message);
  process.exit(1);
}
