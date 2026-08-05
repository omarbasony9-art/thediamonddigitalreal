#!/usr/bin/env python3
"""
Validate d1-data-export.sql by executing it against an in-memory SQLite database.
Reports row counts per table and any SQL errors.
"""

import sqlite3
import sys

SQL_FILE = '/home/runner/workspace/d1-data-export.sql'

SCHEMA = """
CREATE TABLE IF NOT EXISTS sites (
  id INTEGER PRIMARY KEY,
  client_name TEXT, project_name TEXT, domain TEXT, status TEXT, tech TEXT,
  description TEXT, live_url TEXT, preview_url TEXT, quote_id INTEGER,
  created_at TEXT, updated_at TEXT, launched_at TEXT,
  client_email TEXT, project_type TEXT
);
CREATE TABLE IF NOT EXISTS site_pages (
  id INTEGER PRIMARY KEY,
  site_id INTEGER, title TEXT, slug TEXT, content TEXT,
  "order" INTEGER, created_at TEXT, updated_at TEXT
);
CREATE TABLE IF NOT EXISTS quotes (
  id INTEGER PRIMARY KEY,
  name TEXT, email TEXT, phone TEXT, company TEXT, project_type TEXT,
  description TEXT, budget TEXT, timeline TEXT, status TEXT,
  admin_notes TEXT, created_at TEXT, updated_at TEXT
);
CREATE TABLE IF NOT EXISTS activity_log (
  id INTEGER PRIMARY KEY,
  type TEXT, message TEXT, entity_id INTEGER, entity_type TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS client_users (
  id INTEGER PRIMARY KEY,
  name TEXT, email TEXT, password_hash TEXT, company TEXT, created_at TEXT
);
"""

with open(SQL_FILE, 'r', encoding='utf-8') as f:
    sql = f.read()

con = sqlite3.connect(':memory:')
cur = con.cursor()

# Create schema
cur.executescript(SCHEMA)

# Execute the export file — executescript() handles BEGIN/COMMIT and all statements
try:
    cur.executescript(sql)
except sqlite3.Error as e:
    print(f'✗ FAILED: {e}')
    sys.exit(1)

# Count rows
tables = ['sites', 'site_pages', 'quotes', 'activity_log', 'client_users']
total = 0
print('SQLite validation: ✓ PASSED — zero SQL errors\n')
print('Verified row counts:')
for t in tables:
    n = cur.execute(f'SELECT COUNT(*) FROM {t}').fetchone()[0]
    total += n
    print(f'  {t:<25} {n}')
print(f'  {"TOTAL":<25} {total}')

# Spot-check: verify site_pages content column is intact (multiline HTML)
row = cur.execute("SELECT content FROM site_pages WHERE title='index.html' LIMIT 1").fetchone()
if row:
    content = row[0]
    checks = [
        ('<!DOCTYPE html>', '<!DOCTYPE html> present'),
        ('<html', '<html tag present'),
        ('\n', 'newlines preserved'),
        ('"', 'double-quotes preserved'),
    ]
    print('\nContent integrity checks for index.html page:')
    all_ok = True
    for needle, label in checks:
        ok = needle in content
        print(f'  {"✓" if ok else "✗"} {label}')
        if not ok:
            all_ok = False
    if not all_ok:
        sys.exit(1)
else:
    print('\n(No index.html page found — skipping content checks)')

con.close()
print('\nAll checks passed.')
