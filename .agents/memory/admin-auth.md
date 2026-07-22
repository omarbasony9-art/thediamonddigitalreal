---
name: Admin Auth System
description: Custom JWT auth replacing Clerk for all admin routes; single admin user seeded in DB
---

Admin routes (`/api/quotes`, `/api/sites`, `/api/admin/*`) use `requireAdminAuth` middleware that validates a Bearer JWT signed with `SESSION_SECRET`.

Login endpoint: `POST /api/admin/auth/login` → `{ username, password }` → `{ token, username }`. 30-day JWT expiry.

Admin user seeded via direct SQL to `admin_users` table (username: TheTitanMedia). To re-seed: `node -e "..." 2>&1` using pg from `/home/runner/workspace/node_modules/.pnpm/pg@8.22.0/node_modules/pg`.

Frontend: `setAuthTokenGetter(() => localStorage.getItem("admin_token"))` called in App.tsx at module level. ProtectedAdminRoute checks `localStorage.admin_token` JWT expiry client-side, redirects to `/admin/login` if missing/expired.

**Why:** Replaced Clerk because user wanted simple username+password login (not email-based Clerk flow).
