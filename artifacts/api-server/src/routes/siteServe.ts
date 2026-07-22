/**
 * Public site serving — no auth required.
 * GET /s/:siteId/            → serves index.html
 * GET /s/:siteId/:filename   → serves any page by slug
 */
import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
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

// GET /s/:siteId/:filename  (filename optional — defaults to index.html)
router.get("/s/:siteId/:filename", async (req: any, res: any): Promise<void> => {
  await serveFile(req, res, req.params.filename || "index.html");
});

// GET /s/:siteId  → redirect to trailing slash so relative links resolve correctly
router.get("/s/:siteId", async (req: any, res: any): Promise<void> => {
  const siteId = Number(req.params.siteId);
  if (!siteId) { res.status(404).send("<h1>Not found</h1>"); return; }
  res.redirect(301, `/api/s/${siteId}/`);
});

// GET /s/:siteId/  (trailing slash served by express default — explicit route)
router.get("/s/:siteId/", async (req: any, res: any): Promise<void> => {
  await serveFile(req, res, "index.html");
});

async function serveFile(req: any, res: any, filename: string) {
  const siteId = Number(req.params.siteId);
  if (!siteId) { res.status(404).send("<h1>Site not found</h1>"); return; }

  try {
    const [site] = await db.select().from(sitesTable).where(eq(sitesTable.id, siteId));
    if (!site) { res.status(404).send("<h1>Site not found</h1>"); return; }

    const pages = await db
      .select()
      .from(sitePagesTable)
      .where(eq(sitePagesTable.siteId, siteId));

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
