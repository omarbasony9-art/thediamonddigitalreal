import jwt from "jsonwebtoken";
import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";

import { db, quotesTable, sitesTable, activityLogTable } from "@workspace/db";

const router: IRouter = Router();
const JWT_SECRET = process.env.SESSION_SECRET || "dev-secret";

const requireAdminAuth = (req: any, res: any, next: any) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) { res.status(401).json({ error: "Unauthorized" }); return; }
  try { jwt.verify(auth.slice(7), JWT_SECRET); next(); }
  catch { res.status(401).json({ error: "Invalid or expired token" }); }
};

// Admin dashboard stats
router.get("/admin/stats", requireAdminAuth, async (req, res): Promise<void> => {
  const [sites, quotes] = await Promise.all([
    db.select().from(sitesTable),
    db.select().from(quotesTable),
  ]);

  const recentSites = await db
    .select()
    .from(sitesTable)
    .orderBy(desc(sitesTable.updatedAt))
    .limit(5);

  const stats = {
    totalSites: sites.length,
    liveSites: sites.filter((s) => s.status === "live").length,
    buildingSites: sites.filter((s) => s.status === "building").length,
    pendingQuotes: quotes.filter((q) => q.status === "pending").length,
    totalQuotes: quotes.length,
    recentSites,
  };

  res.json(stats);
});

// Recent activity feed
router.get("/admin/activity", requireAdminAuth, async (req, res): Promise<void> => {
  const activity = await db
    .select()
    .from(activityLogTable)
    .orderBy(desc(activityLogTable.createdAt))
    .limit(20);

  res.json(activity);
});

export default router;
