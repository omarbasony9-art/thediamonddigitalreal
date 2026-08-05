/**
 * Diamond Digital — Cloudflare Pages Function
 * Handles all /api/* routes. Requires a D1 database binding named "DB".
 *
 * Environment variables required:
 *   SESSION_SECRET   — secret for signing JWTs (any long random string)
 *   OPENAI_API_KEY   — your OpenAI API key (for the AI site builder)
 *   SITE_DOMAIN      — optional: your deployment domain shown in admin
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

function b64url(data) {
  if (data instanceof Uint8Array) {
    return btoa(String.fromCharCode(...data))
      .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
  return btoa(unescape(encodeURIComponent(String(data))))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, "0")).join("");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const hashBuf = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, key, 256);
  const hashHex = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
  return `pbkdf2:${saltHex}:${hashHex}`;
}

async function verifyPassword(password, stored) {
  if (!stored?.startsWith("pbkdf2:")) return false;
  const parts = stored.split(":");
  if (parts.length !== 3) return false;
  const [, saltHex, storedHash] = parts;
  const salt = new Uint8Array(saltHex.match(/.{2}/g).map(b => parseInt(b, 16)));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const hashBuf = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, key, 256);
  const hashHex = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex === storedHash;
}

async function signJWT(payload, secret) {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 30 * 86400 }));
  const data = `${header}.${body}`;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return `${data}.${b64url(new Uint8Array(sig))}`;
}

async function verifyJWT(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid token");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const sig = Uint8Array.from(atob(parts[2].replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
  const valid = await crypto.subtle.verify("HMAC", key, sig, new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
  if (!valid) throw new Error("Invalid signature");
  const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) throw new Error("Token expired");
  return payload;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}

function err(msg, status = 400) { return json({ error: msg }, status); }

async function adminAuth(request, env) {
  const auth = request.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;
  try { return await verifyJWT(auth.slice(7), env.SESSION_SECRET || "dev-secret"); }
  catch { return null; }
}

// Convert DB snake_case → JS camelCase
function cam(row) {
  if (!row) return null;
  return Object.fromEntries(
    Object.entries(row).map(([k, v]) => [k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()), v])
  );
}
function camAll(rows) { return (rows || []).map(cam); }

function now() { return new Date().toISOString(); }

// ─── AI System Prompts ────────────────────────────────────────────────────────

const WEBSITE_PROMPT = `You are Diamond — a brilliant, opinionated creative director and senior front-end engineer at Diamond Digital, a boutique web agency. You are the user's creative partner, not just a code machine.

You are fast, decisive, and brilliant. You read between the lines. You don't ask unnecessary questions — you make smart assumptions and build immediately. You treat every prompt, no matter how short or vague, as enough information to create something great.

════════════════════════════════════════
YOUR CORE RULE: DEFAULT TO BUILDING
════════════════════════════════════════

**Almost always BUILD. Almost never ask.**

If someone says "barbershop" — you build a barbershop site. Right now.
If someone says "restaurant" — you pick a cuisine, invent a name, choose a vibe, and build.
If someone says "gym" — dark, intense, powerful. You already know.
If someone says "lawyer" — professional, authoritative, navy and gold. Build it.

You NEVER ask for information you can invent yourself. The ONLY time you ask is when the request has literally zero context. Even then — ask ONE question maximum.

════════════════════════════════════════
BUILDING — CREATIVE RULES
════════════════════════════════════════

Every site needs a concept. BANNED: "modern", "clean", "sleek" as design directions. Generic hero with centered text.

REQUIRED:
- Dramatic typographic scale
- Unexpected layouts
- Strong intentional color contrast
- Signature element consistent across all pages

DESKTOP DESIGN — MUST BE EXCEPTIONAL (1024px+):
- Full-viewport hero sections (8vw–12vw headlines with clamp())
- Asymmetric two-column layouts
- Wide card grids (3–4 columns) with hover states
- Generous negative space
- CSS Grid for 2D layouts

RESPONSIVE — NON-NEGOTIABLE:
- Font sizes via clamp() for ALL headings
- Hamburger menu on mobile, hidden on desktop
- No horizontal scroll ever
- All images: max-width:100%; height:auto

════════════════════════════════════════
BUILDING — TECHNICAL RULES
════════════════════════════════════════

NAVIGATION:
- Decide file list BEFORE writing any code
- Every nav links to EVERY HTML file, exact filenames
- Only href="about.html" style — never href="/"
- Mobile hamburger must toggle

CODE:
- Valid HTML5, meta charset, meta viewport
- All CSS in style.css with :root variables, clamp() for font sizes
- All JS in script.js, pure vanilla, wrapped in DOMContentLoaded
- Images: use div.img-placeholder with CSS gradient + aspect-ratio
- Mobile-first, breakpoints at 768px and 1200px
- EVERY HTML file must include this exact favicon line in <head>:
  <link rel="icon" type="image/png" href="https://thediamonddigital.com/favicon.png">
- Zero Lorem Ipsum, ever

TEXT OVERFLOW — NEVER CUT OFF TEXT:
- overflow: visible on text containers
- word-wrap: break-word; overflow-wrap: break-word;
- min-width: 0 on flex/grid children
- clamp() on ALL vw font sizes

CSS PATTERNS:
- Grid: grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr))
- Sections: padding: clamp(3rem, 8vw, 8rem) clamp(1rem, 5vw, 4rem)
- Container: max-width: 1200px; margin: 0 auto; padding: 0 clamp(1rem, 4vw, 2rem)

PAGE COUNT:
- Explicit count → build exactly that many HTML files
- No count → 4-7 pages, whatever fits the business
- Always include index.html, always one style.css, one script.js

════════════════════════════════════════
OUTPUT FORMAT
════════════════════════════════════════

BUILD RESPONSE:
One sentence about what you're building.

<<<FILE:index.html>>>
[complete HTML]
<<<FILE:style.css>>>
[complete CSS]
<<<FILE:script.js>>>
[complete JS]
<<<END>>>

No markdown code fences. No commentary after <<<END>>>.`;

const SPREADSHEET_PROMPT = `You are Diamond — a genius data engineer and spreadsheet wizard at Diamond Digital. You build beautiful, functional spreadsheet interfaces.

DEFAULT: BUILD immediately. "budget tracker" → build it. "inventory" → build it. Only ask if zero context.

You create fully interactive HTML/CSS/JS spreadsheet interfaces with realistic data, working formulas, sorting/filtering, conditional formatting, sticky headers, and CSV export.

DESIGN: Dark or light theme, clean grid lines, color-coded columns, professional monospaced font for numbers.

OUTPUT FORMAT:
One sentence about what you're building.
<<<FILE:index.html>>>
[complete single-file spreadsheet with embedded CSS and JS]
<<<END>>>

Always include: <link rel="icon" type="image/png" href="https://thediamonddigital.com/favicon.png">`;

const APPLICATION_PROMPT = `You are Diamond — a senior full-stack product engineer at Diamond Digital. You build real interactive web applications.

DEFAULT: BUILD immediately. "todo app" → build it. "calculator" → build it.

Real interactivity, localStorage persistence, multi-step flows, search/filter/sort, CRUD operations.

TECHNICAL RULES:
- Single-page: one index.html, style.css, script.js
- No frameworks. Pure HTML + CSS + JS.
- Responsive: clamp() everywhere, no horizontal scroll
- Every button must do something

OUTPUT FORMAT:
One sentence describing the app.
<<<FILE:index.html>>>
[HTML]
<<<FILE:style.css>>>
[CSS]
<<<FILE:script.js>>>
[JS]
<<<END>>>

Always include favicon: <link rel="icon" type="image/png" href="https://thediamonddigital.com/favicon.png">`;

const QA_PROMPT = `You are Diamond — the most knowledgeable AI research partner ever built. You give real, substantive, expert-level answers with depth, structure, and honesty.

Respond as pure text with markdown formatting. End every response with a follow-up hook.`;

const PROGRAM_PROMPT = `You are Diamond — a master software engineer at Diamond Digital. You write programs that work and are well-architected.

DEFAULT: BUILD immediately. Choose the best language for the job.

Every program: works correctly, cleanly organized, meaningful names, inline comments, example usage.

OUTPUT FORMAT:
One sentence describing what you're building.
<<<FILE:main.py>>>
[complete program]
<<<FILE:README.md>>>
[what it does, how to run it, complexity analysis]
<<<END>>>`;

const VIDEO_PROMPT = `You are Diamond — a motion graphics director and creative technologist. You create stunning animated videos using HTML5 Canvas and CSS animations.

DEFAULT: BUILD immediately.

OUTPUT FORMAT:
One sentence describing the animation.
<<<FILE:index.html>>>
[complete self-contained animation — all HTML, CSS, JS in one file]
<<<END>>>

Everything in one file. Animation starts automatically on page load.
Always include: <link rel="icon" type="image/png" href="https://thediamonddigital.com/favicon.png">`;

const SYSTEM_PROMPTS = { website: WEBSITE_PROMPT, application: APPLICATION_PROMPT, spreadsheet: SPREADSHEET_PROMPT, program: PROGRAM_PROMPT, qa: QA_PROMPT, video: VIDEO_PROMPT };

// ─── Main Handler ─────────────────────────────────────────────────────────────

export async function onRequest(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const method = request.method.toUpperCase();
  const path = "/" + (params.path ? params.path.join("/") : "");

  // CORS preflight
  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    }});
  }

  const DB = env.DB;
  const JWT_SECRET = env.SESSION_SECRET || "dev-secret";

  let body = {};
  if (["POST", "PUT", "PATCH"].includes(method)) {
    try { body = await request.json(); } catch { body = {}; }
  }

  try {

    // ── Health ──────────────────────────────────────────────────────────────
    if (path === "/healthz" && method === "GET") {
      return json({ status: "ok", db: !!DB });
    }

    // Fail fast with a clear message if the D1 binding is missing
    if (!DB) {
      return err(
        "D1 database not bound. Go to Cloudflare Pages → Settings → Bindings and add a D1 binding named DB.",
        503
      );
    }

    // ── First-Run Setup (only works when no admins exist) ───────────────────
    if (path === "/admin/setup" && method === "POST") {
      const count = await DB.prepare("SELECT COUNT(*) as n FROM admin_users").first();
      if (count.n > 0) return err("Admin already configured. Use your existing credentials.", 403);
      const { username, password } = body;
      if (!username || !password) return err("Username and password required");
      if (password.length < 8) return err("Password must be at least 8 characters");
      const hash = await hashPassword(password);
      const user = await DB.prepare("INSERT INTO admin_users (username, password_hash, created_at) VALUES (?, ?, ?) RETURNING *")
        .bind(username, hash, now()).first();
      const token = await signJWT({ adminId: user.id, username: user.username }, JWT_SECRET);
      return json({ token, username: user.username }, 201);
    }

    // ── Admin Auth ───────────────────────────────────────────────────────────
    if (path === "/admin/auth/login" && method === "POST") {
      const { username, password } = body;
      if (!username || !password) return err("Username and password required");

      const user = await DB.prepare("SELECT * FROM admin_users WHERE username = ?").bind(username).first();
      if (!user) {
        // Check whether the table is completely empty so we give a more actionable message
        const count = await DB.prepare("SELECT COUNT(*) as n FROM admin_users").first();
        if (count.n === 0) {
          return err(
            "No admin account exists yet. POST to /api/admin/setup with {username, password} to create one.",
            401
          );
        }
        return err(`No admin account found with username "${username}".`, 401);
      }

      if (!user.password_hash?.startsWith("pbkdf2:")) {
        return err(
          "Password hash format is incompatible (stored hash is not PBKDF2). " +
          "The admin account was likely migrated from the old server. " +
          "DELETE the row from admin_users in D1 and POST to /api/admin/setup to re-create it.",
          401
        );
      }

      const valid = await verifyPassword(password, user.password_hash);
      if (!valid) return err("Incorrect password.", 401);

      const token = await signJWT({ adminId: user.id, username: user.username }, JWT_SECRET);
      return json({ token, username: user.username });
    }

    if (path === "/admin/auth/me" && method === "GET") {
      const payload = await adminAuth(request, env);
      if (!payload) return err("Unauthorized", 401);
      return json({ username: payload.username, adminId: payload.adminId });
    }

    // ── Admin Stats ──────────────────────────────────────────────────────────
    if (path === "/admin/stats" && method === "GET") {
      const payload = await adminAuth(request, env);
      if (!payload) return err("Unauthorized", 401);
      const sites = camAll((await DB.prepare("SELECT * FROM sites").all()).results);
      const quotes = camAll((await DB.prepare("SELECT * FROM quotes").all()).results);
      const recentSites = camAll((await DB.prepare("SELECT * FROM sites ORDER BY updated_at DESC LIMIT 5").all()).results);
      return json({
        totalSites: sites.length,
        liveSites: sites.filter(s => s.status === "live").length,
        buildingSites: sites.filter(s => s.status === "building").length,
        pendingQuotes: quotes.filter(q => q.status === "pending").length,
        totalQuotes: quotes.length,
        recentSites,
      });
    }

    if (path === "/admin/activity" && method === "GET") {
      const payload = await adminAuth(request, env);
      if (!payload) return err("Unauthorized", 401);
      const rows = camAll((await DB.prepare("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 20").all()).results);
      return json(rows);
    }

    if (path === "/admin/deployment-domain" && method === "GET") {
      const payload = await adminAuth(request, env);
      if (!payload) return err("Unauthorized", 401);
      return json({ domain: env.SITE_DOMAIN || url.hostname });
    }

    // ── Quotes ───────────────────────────────────────────────────────────────
    if (path === "/quotes" && method === "GET") {
      const payload = await adminAuth(request, env);
      if (!payload) return err("Unauthorized", 401);
      const status = url.searchParams.get("status");
      let quotes = camAll((await DB.prepare("SELECT * FROM quotes ORDER BY created_at ASC").all()).results);
      if (status) quotes = quotes.filter(q => q.status === status);
      return json(quotes);
    }

    if (path === "/quotes" && method === "POST") {
      const { name, email, phone, company, projectType, description, budget, timeline } = body;
      if (!name || !email || !description || !projectType) return err("Name, email, description, and projectType are required");
      const q = cam(await DB.prepare(
        "INSERT INTO quotes (name, email, phone, company, project_type, description, budget, timeline, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?) RETURNING *"
      ).bind(name, email, phone || null, company || null, projectType, description, budget || null, timeline || null, now(), now()).first());
      await DB.prepare("INSERT INTO activity_log (type, message, entity_id, entity_type, created_at) VALUES (?, ?, ?, ?, ?)")
        .bind("quote_submitted", `New quote request from ${name} (${projectType})`, q.id, "quote", now()).run();
      return json(q, 201);
    }

    const quoteId = path.match(/^\/quotes\/(\d+)$/)?.[1];
    if (quoteId) {
      const id = Number(quoteId);
      if (method === "GET") {
        const payload = await adminAuth(request, env);
        if (!payload) return err("Unauthorized", 401);
        const q = cam(await DB.prepare("SELECT * FROM quotes WHERE id = ?").bind(id).first());
        return q ? json(q) : err("Quote not found", 404);
      }
      if (method === "PATCH") {
        const payload = await adminAuth(request, env);
        if (!payload) return err("Unauthorized", 401);
        const sets = [], vals = [];
        if (body.status !== undefined)     { sets.push("status = ?");      vals.push(body.status); }
        if (body.adminNotes !== undefined) { sets.push("admin_notes = ?"); vals.push(body.adminNotes); }
        if (!sets.length) return err("Nothing to update");
        sets.push("updated_at = ?"); vals.push(now()); vals.push(id);
        const q = cam(await DB.prepare(`UPDATE quotes SET ${sets.join(", ")} WHERE id = ? RETURNING *`).bind(...vals).first());
        if (!q) return err("Quote not found", 404);
        await DB.prepare("INSERT INTO activity_log (type, message, entity_id, entity_type, created_at) VALUES (?, ?, ?, ?, ?)")
          .bind("quote_updated", `Quote from ${q.name} updated to: ${q.status}`, q.id, "quote", now()).run();
        return json(q);
      }
      if (method === "DELETE") {
        const payload = await adminAuth(request, env);
        if (!payload) return err("Unauthorized", 401);
        const d = await DB.prepare("DELETE FROM quotes WHERE id = ? RETURNING id").bind(id).first();
        return d ? new Response(null, { status: 204 }) : err("Quote not found", 404);
      }
    }

    // ── Sites ────────────────────────────────────────────────────────────────
    if (path === "/sites" && method === "GET") {
      const payload = await adminAuth(request, env);
      if (!payload) return err("Unauthorized", 401);
      const status = url.searchParams.get("status");
      let sites = camAll((await DB.prepare("SELECT * FROM sites ORDER BY updated_at ASC").all()).results);
      if (status) sites = sites.filter(s => s.status === status);
      return json(sites);
    }

    if (path === "/sites" && method === "POST") {
      const payload = await adminAuth(request, env);
      if (!payload) return err("Unauthorized", 401);
      const { clientName, projectName, clientEmail, description, tech, projectType, quoteId } = body;
      if (!clientName || !projectName) return err("clientName and projectName are required");
      const site = cam(await DB.prepare(
        "INSERT INTO sites (client_name, project_name, client_email, description, tech, project_type, quote_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?) RETURNING *"
      ).bind(clientName, projectName, clientEmail || null, description || null, tech || "react", projectType || "website", quoteId || null, now(), now()).first());
      await DB.prepare("INSERT INTO activity_log (type, message, entity_id, entity_type, created_at) VALUES (?, ?, ?, ?, ?)")
        .bind("site_created", `New site created: "${site.projectName}" for ${site.clientName}`, site.id, "site", now()).run();
      return json(site, 201);
    }

    const siteMatch = path.match(/^\/sites\/(\d+)(\/.*)?$/);
    if (siteMatch) {
      const siteId = Number(siteMatch[1]);
      const sub = siteMatch[2] || "";

      // Site CRUD
      if (sub === "" || sub === "/") {
        if (method === "GET") {
          const payload = await adminAuth(request, env);
          if (!payload) return err("Unauthorized", 401);
          const site = cam(await DB.prepare("SELECT * FROM sites WHERE id = ?").bind(siteId).first());
          return site ? json(site) : err("Site not found", 404);
        }
        if (method === "PATCH") {
          const payload = await adminAuth(request, env);
          if (!payload) return err("Unauthorized", 401);
          const cols = { clientName: "client_name", projectName: "project_name", clientEmail: "client_email", description: "description", tech: "tech", projectType: "project_type", domain: "domain", status: "status", liveUrl: "live_url", previewUrl: "preview_url" };
          const sets = [], vals = [];
          for (const [k, col] of Object.entries(cols)) {
            if (body[k] !== undefined) { sets.push(`${col} = ?`); vals.push(body[k]); }
          }
          if (!sets.length) return err("Nothing to update");
          sets.push("updated_at = ?"); vals.push(now()); vals.push(siteId);
          const site = cam(await DB.prepare(`UPDATE sites SET ${sets.join(", ")} WHERE id = ? RETURNING *`).bind(...vals).first());
          if (!site) return err("Site not found", 404);
          await DB.prepare("INSERT INTO activity_log (type, message, entity_id, entity_type, created_at) VALUES (?, ?, ?, ?, ?)")
            .bind("site_updated", `Site "${site.projectName}" updated`, site.id, "site", now()).run();
          return json(site);
        }
        if (method === "DELETE") {
          const payload = await adminAuth(request, env);
          if (!payload) return err("Unauthorized", 401);
          await DB.prepare("DELETE FROM site_pages WHERE site_id = ?").bind(siteId).run();
          const d = await DB.prepare("DELETE FROM sites WHERE id = ? RETURNING id").bind(siteId).first();
          return d ? new Response(null, { status: 204 }) : err("Site not found", 404);
        }
      }

      // Launch
      if (sub === "/launch" && method === "POST") {
        const payload = await adminAuth(request, env);
        if (!payload) return err("Unauthorized", 401);
        const site = cam(await DB.prepare("UPDATE sites SET status = 'live', launched_at = ?, updated_at = ? WHERE id = ? RETURNING *").bind(now(), now(), siteId).first());
        if (!site) return err("Site not found", 404);
        await DB.prepare("INSERT INTO activity_log (type, message, entity_id, entity_type, created_at) VALUES (?, ?, ?, ?, ?)")
          .bind("site_launched", `Site "${site.projectName}" for ${site.clientName} is now live!`, site.id, "site", now()).run();
        return json(site);
      }

      // Publish (custom domain)
      if (sub === "/publish" && method === "POST") {
        const payload = await adminAuth(request, env);
        if (!payload) return err("Unauthorized", 401);
        const rawDomain = (body?.customDomain || "").trim().toLowerCase().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
        const existing = cam(await DB.prepare("SELECT * FROM sites WHERE id = ?").bind(siteId).first());
        if (!existing) return err("Site not found", 404);
        const slug = existing.projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const publishedUrl = rawDomain ? `https://${rawDomain}` : `https://${url.hostname}/api/s/${slug}/`;
        const site = cam(await DB.prepare("UPDATE sites SET status = 'live', domain = ?, live_url = ?, launched_at = ?, updated_at = ? WHERE id = ? RETURNING *")
          .bind(rawDomain || null, publishedUrl, now(), now(), siteId).first());
        await DB.prepare("INSERT INTO activity_log (type, message, entity_id, entity_type, created_at) VALUES (?, ?, ?, ?, ?)")
          .bind("site_launched", `Site "${site.projectName}" published at ${publishedUrl}`, site.id, "site", now()).run();
        return json({ ...site, publishedUrl, customDomain: rawDomain || null });
      }

      // Pages
      if (sub === "/pages") {
        if (method === "GET") {
          const payload = await adminAuth(request, env);
          if (!payload) return err("Unauthorized", 401);
          const pages = camAll((await DB.prepare("SELECT * FROM site_pages WHERE site_id = ? ORDER BY \"order\" ASC").bind(siteId).all()).results);
          return json(pages);
        }
        if (method === "POST") {
          const payload = await adminAuth(request, env);
          if (!payload) return err("Unauthorized", 401);
          const { title, slug, content, order } = body;
          if (!title || !slug) return err("title and slug are required");
          const page = cam(await DB.prepare(
            "INSERT INTO site_pages (site_id, title, slug, content, \"order\", created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *"
          ).bind(siteId, title, slug, content || "", order ?? 0, now(), now()).first());
          return json(page, 201);
        }
      }

      // Individual page: /sites/:id/pages/:pageId
      const pageMatch = sub.match(/^\/pages\/(\d+)$/);
      if (pageMatch) {
        const pageId = Number(pageMatch[1]);
        if (method === "PATCH") {
          const payload = await adminAuth(request, env);
          if (!payload) return err("Unauthorized", 401);
          const sets = [], vals = [];
          if (body.title   !== undefined) { sets.push("title = ?");    vals.push(body.title); }
          if (body.slug    !== undefined) { sets.push("slug = ?");     vals.push(body.slug); }
          if (body.content !== undefined) { sets.push("content = ?");  vals.push(body.content); }
          if (body.order   !== undefined) { sets.push('"order" = ?');  vals.push(body.order); }
          if (!sets.length) return err("Nothing to update");
          sets.push("updated_at = ?"); vals.push(now());
          vals.push(pageId); vals.push(siteId);
          const page = cam(await DB.prepare(`UPDATE site_pages SET ${sets.join(", ")} WHERE id = ? AND site_id = ? RETURNING *`).bind(...vals).first());
          return page ? json(page) : err("Page not found", 404);
        }
        if (method === "DELETE") {
          const payload = await adminAuth(request, env);
          if (!payload) return err("Unauthorized", 401);
          const d = await DB.prepare("DELETE FROM site_pages WHERE id = ? AND site_id = ? RETURNING id").bind(pageId, siteId).first();
          return d ? new Response(null, { status: 204 }) : err("Page not found", 404);
        }
      }
    }

    // ── Site Serving (public) ─────────────────────────────────────────────────
    const siteServeMatch = path.match(/^\/s\/([^/]+)(\/(.+))?$/);
    if (siteServeMatch) {
      const siteRef = siteServeMatch[1];
      const filename = siteServeMatch[3] || "index.html";
      const MIME = { html: "text/html;charset=utf-8", css: "text/css;charset=utf-8", js: "application/javascript;charset=utf-8", json: "application/json", svg: "image/svg+xml" };
      let site;
      const numId = Number(siteRef);
      if (!isNaN(numId)) {
        site = cam(await DB.prepare("SELECT * FROM sites WHERE id = ?").bind(numId).first());
      } else {
        const all = camAll((await DB.prepare("SELECT * FROM sites").all()).results);
        site = all.find(s => s.projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === siteRef);
      }
      if (!site) return new Response("<h1>Site not found</h1>", { status: 404, headers: { "Content-Type": "text/html" } });
      const pages = camAll((await DB.prepare("SELECT * FROM site_pages WHERE site_id = ?").bind(site.id).all()).results);
      if (!pages.length) return new Response("<h1>No pages published yet</h1>", { status: 404, headers: { "Content-Type": "text/html" } });
      const page = pages.find(p => p.slug === filename) ?? (filename === "index.html" ? pages[0] : null);
      if (!page) return new Response(`<h1>Not found: ${filename}</h1>`, { status: 404, headers: { "Content-Type": "text/html" } });
      const ext = page.slug.split(".").pop()?.toLowerCase() || "html";
      return new Response(page.content, { headers: { "Content-Type": MIME[ext] || "text/plain", "Cache-Control": "public, max-age=60" } });
    }

    // ── AI Builder ────────────────────────────────────────────────────────────
    if (path === "/admin/ai/generate" && method === "POST") {
      const payload = await adminAuth(request, env);
      if (!payload) return err("Unauthorized", 401);

      const { message, existingFiles, history, projectType } = body;
      if (!message) return err("message is required");

      const systemPrompt = SYSTEM_PROMPTS[projectType] || WEBSITE_PROMPT;
      const isQA = projectType === "qa";

      const messages = [];
      if (Array.isArray(history)) {
        for (const h of history) {
          if (h.role === "user" || h.role === "assistant") messages.push({ role: h.role, content: h.content });
        }
      }

      let userText = message;
      if (!isQA && existingFiles?.length > 0) {
        const fileList = existingFiles.map(f => f.name).join(", ");
        const filesText = existingFiles.map(f => `<<<EXISTING:${f.name}>>>\n${f.content}`).join("\n\n");
        userText = `EXISTING FILES (${existingFiles.length} files: ${fileList}):\n\n${filesText}\n\n---\nUSER REQUEST: ${message}`;
      }
      messages.push({ role: "user", content: userText });

      const apiKey = env.OPENAI_API_KEY;
      if (!apiKey) return err("OpenAI API key not configured. Set OPENAI_API_KEY in Cloudflare environment variables.", 500);

      const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "gpt-4o",
          max_tokens: 16000,
          messages: [{ role: "system", content: systemPrompt }, ...messages],
        }),
      });

      if (!aiRes.ok) {
        const errText = await aiRes.text();
        return err(`AI error: ${errText}`, 500);
      }

      const aiData = await aiRes.json();
      const content = aiData.choices?.[0]?.message?.content ?? "";
      if (!content) return err("AI returned an empty response. Please try again.", 500);

      if (isQA) {
        return json({ success: true, mode: "chat", text: content.replace(/<<<END>>>\s*$/g, "").trim(), files: [] });
      }

      // Parse <<<FILE:name>>> blocks
      const firstFile = content.indexOf("<<<FILE:");
      if (firstFile === -1) {
        return json({ success: true, mode: "chat", text: content.replace(/<<<END>>>\s*$/g, "").trim(), files: [] });
      }
      const text = content.slice(0, firstFile).trim();
      const filesPart = content.slice(firstFile);
      const files = [];
      const regex = /<<<FILE:([^>]+)>>>([\s\S]*?)(?=<<<FILE:|<<<END>>>)/g;
      let m;
      while ((m = regex.exec(filesPart)) !== null) {
        const name = m[1].trim(), c = m[2].trim();
        if (name && c) files.push({ name, content: c });
      }
      return json({ success: true, mode: files.length > 0 ? "build" : "chat", text, files });
    }

    // ── 404 ───────────────────────────────────────────────────────────────────
    return err(`API route not found: ${method} /api${path}`, 404);

  } catch (e) {
    console.error("API error:", e);
    return err(e?.message || "Internal server error", 500);
  }
}
