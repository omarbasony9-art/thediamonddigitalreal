/**
 * Public site serving — no auth required.
 * GET /s/:siteSlug/            → serves index.html  (slug or numeric id both work)
 * GET /s/:siteSlug/:filename   → serves any page by filename
 */
import { Router, type IRouter } from "express";
import { eq, or } from "drizzle-orm";
import { db, sitesTable, sitePagesTable } from "@workspace/db";

const router: IRouter = Router();

const MIME: Record<string, string> = {
  html: "text/html; charset=utf-8",
  css:  "text/css; charset=utf-8",
  js:   "application/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  svg:  "image/svg+xml",
  txt:  "text/plain; charset=utf-8",
};

function mime(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "txt";
  return MIME[ext] ?? "text/plain; charset=utf-8";
}

/** "My Coffee Shop" → "my-coffee-shop" */
export function toSiteSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function resolveSite(siteRef: string) {
  const numericId = Number(siteRef);
  if (!isNaN(numericId) && numericId > 0) {
    const [s] = await db.select().from(sitesTable).where(eq(sitesTable.id, numericId));
    return s ?? null;
  }
  // slug lookup — match against slugified projectName
  const all = await db.select().from(sitesTable);
  return all.find((s) => toSiteSlug(s.projectName) === siteRef) ?? null;
}

// GET /s/:siteRef/:filename
router.get("/s/:siteRef/:filename", async (req: any, res: any): Promise<void> => {
  await serveFile(req, res, req.params.filename);
});

// GET /s/:siteRef  → redirect to trailing slash so relative links resolve correctly
router.get("/s/:siteRef", async (req: any, res: any): Promise<void> => {
  res.redirect(301, `/api/s/${req.params.siteRef}/`);
});

// GET /s/:siteRef/
router.get("/s/:siteRef/", async (req: any, res: any): Promise<void> => {
  await serveFile(req, res, "index.html");
});

async function serveFile(req: any, res: any, filename: string) {
  try {
    const site = await resolveSite(req.params.siteRef);
    if (!site) { res.status(404).send("<h1>Site not found</h1>"); return; }

    const pages = await db
      .select()
      .from(sitePagesTable)
      .where(eq(sitePagesTable.siteId, site.id));

    if (pages.length === 0) { res.status(404).send("<h1>No pages published yet</h1>"); return; }

    const page = pages.find((p) => p.slug === filename) ?? (filename === "index.html" ? pages[0] : null);
    if (!page) { res.status(404).send(`<h1>File not found: ${filename}</h1>`); return; }

    res.setHeader("Content-Type", mime(page.slug));
    res.setHeader("Cache-Control", "public, max-age=60");
    res.send(page.content);
  } catch (err: any) {
    console.error("siteServe error:", err);
    res.status(500).send("<h1>Server error</h1>");
  }
}

export default router;
