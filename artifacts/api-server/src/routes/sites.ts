import jwt from "jsonwebtoken";
import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";

import { db, sitesTable, sitePagesTable, activityLogTable } from "@workspace/db";
import {
  CreateSiteBody,
  UpdateSiteBody,
  GetSiteParams,
  UpdateSiteParams,
  DeleteSiteParams,
  LaunchSiteParams,
  ListSitePagesParams,
  CreateSitePageBody,
  CreateSitePageParams,
  UpdateSitePageBody,
  UpdateSitePageParams,
  DeleteSitePageParams,
} from "@workspace/api-zod";

const router: IRouter = Router();
const JWT_SECRET = process.env.SESSION_SECRET || "dev-secret";

const requireAdminAuth = (req: any, res: any, next: any) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) { res.status(401).json({ error: "Unauthorized" }); return; }
  try { jwt.verify(auth.slice(7), JWT_SECRET); next(); }
  catch { res.status(401).json({ error: "Invalid or expired token" }); }
};

// List all sites (admin only)
router.get("/sites", requireAdminAuth, async (req, res): Promise<void> => {
  const { status } = req.query as { status?: string };
  const sites = await db
    .select()
    .from(sitesTable)
    .orderBy(sitesTable.updatedAt);

  if (status) {
    res.json(sites.filter((s) => s.status === status));
    return;
  }
  res.json(sites);
});

// Create a site (admin only)
router.post("/sites", requireAdminAuth, async (req, res): Promise<void> => {
  const parsed = CreateSiteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [site] = await db
    .insert(sitesTable)
    .values({ ...parsed.data, status: "draft" })
    .returning();

  await db.insert(activityLogTable).values({
    type: "site_created",
    message: `New site created: "${site.projectName}" for ${site.clientName}`,
    entityId: site.id,
    entityType: "site",
  });

  res.status(201).json(site);
});

// Get a site (admin only)
router.get("/sites/:id", requireAdminAuth, async (req, res): Promise<void> => {
  const params = GetSiteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [site] = await db
    .select()
    .from(sitesTable)
    .where(eq(sitesTable.id, params.data.id));

  if (!site) {
    res.status(404).json({ error: "Site not found" });
    return;
  }

  res.json(site);
});

// Update a site (admin only)
router.patch("/sites/:id", requireAdminAuth, async (req, res): Promise<void> => {
  const params = UpdateSiteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateSiteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [site] = await db
    .update(sitesTable)
    .set(parsed.data)
    .where(eq(sitesTable.id, params.data.id))
    .returning();

  if (!site) {
    res.status(404).json({ error: "Site not found" });
    return;
  }

  await db.insert(activityLogTable).values({
    type: "site_updated",
    message: `Site "${site.projectName}" updated`,
    entityId: site.id,
    entityType: "site",
  });

  res.json(site);
});

// Delete a site (admin only)
router.delete("/sites/:id", requireAdminAuth, async (req, res): Promise<void> => {
  const params = DeleteSiteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(sitesTable)
    .where(eq(sitesTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Site not found" });
    return;
  }

  res.status(204).send();
});

// Launch a site (admin only)
router.post("/sites/:id/launch", requireAdminAuth, async (req, res): Promise<void> => {
  const params = LaunchSiteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [site] = await db
    .update(sitesTable)
    .set({ status: "live", launchedAt: new Date() })
    .where(eq(sitesTable.id, params.data.id))
    .returning();

  if (!site) {
    res.status(404).json({ error: "Site not found" });
    return;
  }

  await db.insert(activityLogTable).values({
    type: "site_launched",
    message: `Site "${site.projectName}" for ${site.clientName} is now live!`,
    entityId: site.id,
    entityType: "site",
  });

  res.json(site);
});

// List site pages (admin only)
router.get("/sites/:id/pages", requireAdminAuth, async (req, res): Promise<void> => {
  const params = ListSitePagesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const pages = await db
    .select()
    .from(sitePagesTable)
    .where(eq(sitePagesTable.siteId, params.data.id))
    .orderBy(sitePagesTable.order);

  res.json(pages);
});

// Create a site page (admin only)
router.post("/sites/:id/pages", requireAdminAuth, async (req, res): Promise<void> => {
  const params = CreateSitePageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = CreateSitePageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [page] = await db
    .insert(sitePagesTable)
    .values({ ...parsed.data, siteId: params.data.id })
    .returning();

  res.status(201).json(page);
});

// Update a site page (admin only)
router.patch("/sites/:id/pages/:pageId", requireAdminAuth, async (req, res): Promise<void> => {
  const params = UpdateSitePageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateSitePageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [page] = await db
    .update(sitePagesTable)
    .set(parsed.data)
    .where(
      and(
        eq(sitePagesTable.id, params.data.pageId),
        eq(sitePagesTable.siteId, params.data.id),
      ),
    )
    .returning();

  if (!page) {
    res.status(404).json({ error: "Page not found" });
    return;
  }

  res.json(page);
});

// Delete a site page (admin only)
router.delete("/sites/:id/pages/:pageId", requireAdminAuth, async (req, res): Promise<void> => {
  const params = DeleteSitePageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(sitePagesTable)
    .where(
      and(
        eq(sitePagesTable.id, params.data.pageId),
        eq(sitePagesTable.siteId, params.data.id),
      ),
    )
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Page not found" });
    return;
  }

  res.status(204).send();
});

export default router;
