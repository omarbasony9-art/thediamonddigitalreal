-- Diamond Digital — Cloudflare D1 Schema
-- Run this in your Cloudflare D1 database before launching the site.
-- Steps: Cloudflare Dashboard → Workers & Pages → D1 → your database → Console → paste & run

CREATE TABLE IF NOT EXISTS admin_users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sites (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  client_name  TEXT    NOT NULL,
  project_name TEXT    NOT NULL,
  client_email TEXT,
  description  TEXT,
  domain       TEXT,
  status       TEXT    NOT NULL DEFAULT 'draft',
  tech         TEXT    NOT NULL DEFAULT 'react',
  project_type TEXT    NOT NULL DEFAULT 'website',
  live_url     TEXT,
  preview_url  TEXT,
  quote_id     INTEGER,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  launched_at  TEXT
);

CREATE TABLE IF NOT EXISTS site_pages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id    INTEGER NOT NULL,
  title      TEXT    NOT NULL,
  slug       TEXT    NOT NULL,
  content    TEXT    NOT NULL DEFAULT '',
  "order"    INTEGER NOT NULL DEFAULT 0,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quotes (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT    NOT NULL,
  email        TEXT    NOT NULL,
  phone        TEXT,
  company      TEXT,
  project_type TEXT    NOT NULL DEFAULT 'other',
  description  TEXT    NOT NULL,
  budget       TEXT,
  timeline     TEXT,
  status       TEXT    NOT NULL DEFAULT 'pending',
  admin_notes  TEXT,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activity_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  type        TEXT    NOT NULL,
  message     TEXT    NOT NULL,
  entity_id   INTEGER,
  entity_type TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS client_users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  company       TEXT,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);
