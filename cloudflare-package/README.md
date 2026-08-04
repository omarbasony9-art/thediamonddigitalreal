# Diamond Digital — Cloudflare Deployment Guide

Everything in one upload. No separate servers needed.

---

## What's in this package

```
dist/          ← the website (React frontend)
functions/     ← the backend API (admin, contact form, AI builder)
schema.sql     ← database setup script
README.md      ← this file
```

---

## Setup (one time, ~10 minutes)

### Step 1 — Create a D1 Database

1. Go to **Cloudflare Dashboard → Workers & Pages → D1**
2. Click **Create database**
3. Name it: `diamond-digital`
4. Click **Create**

### Step 2 — Run the Schema

1. Open your new database → click **Console**
2. Paste the entire contents of `schema.sql` and click **Execute**
3. You should see "Success" — your tables are created

### Step 3 — Upload to Cloudflare Pages

1. Go to **Workers & Pages → Create → Pages → Upload assets**
2. Name your project (e.g. `diamond-digital`)
3. Drag the entire contents of this folder (or zip it and upload)
4. Click **Deploy**

### Step 4 — Connect the Database

1. Go to your Pages project → **Settings → Bindings**
2. Click **Add binding → D1 database**
3. Variable name: `DB`
4. Database: select `diamond-digital`
5. Save and redeploy

### Step 5 — Set Environment Variables

Go to **Settings → Environment variables → Production** and add:

| Variable | Value |
|---|---|
| `SESSION_SECRET` | Any long random string (e.g. `xK9mP2qL8nR5vT3wY7zA1cF6jH4bD0eG`) |
| `OPENAI_API_KEY` | Your OpenAI API key (for the AI site builder) |

Click **Save and deploy**.

### Step 6 — Create Your Admin Account

After deployment, open your site URL and go to:

```
https://your-site.pages.dev/api/admin/setup
```

Use any HTTP tool, or run this in your browser console:

```javascript
fetch('/api/admin/setup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'YourPasswordHere' })
}).then(r => r.json()).then(console.log)
```

**This only works once** — after the first admin is created, it's permanently disabled.

Then log in at: `https://your-site.pages.dev/admin/login`

---

## Custom Domain

Go to **Workers & Pages → your project → Custom domains** and add your domain (e.g. `thediamonddigital.com`). Cloudflare handles SSL automatically.

---

## Updating the Site

When you make changes here on Replit and want to push them live:
1. Download the updated ZIP from Replit
2. Go to your Cloudflare Pages project → **Deployments → Upload**
3. Upload the new ZIP

Your database (D1) keeps all your data — it is never overwritten by uploads.
