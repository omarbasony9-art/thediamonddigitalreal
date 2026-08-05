import { Router, type IRouter } from "express";
import jwt from "jsonwebtoken";
import healthRouter from "./health";
import quotesRouter from "./quotes";
import sitesRouter from "./sites";
import adminStatsRouter from "./adminStats";
import adminAuthRouter from "./adminAuth";
import aiBuilderRouter from "./aiBuilder";
import siteServeRouter from "./siteServe";

const router: IRouter = Router();
const JWT_SECRET = process.env.SESSION_SECRET || "dev-secret";

const requireAdminAuth = (req: any, res: any, next: any) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) { res.status(401).json({ error: "Unauthorized" }); return; }
  try { jwt.verify(auth.slice(7), JWT_SECRET); next(); }
  catch { res.status(401).json({ error: "Invalid or expired token" }); }
};

/** Returns the platform's public domain so the frontend can show CNAME instructions. */
router.get("/admin/deployment-domain", requireAdminAuth, (_req: any, res: any) => {
  // REPLIT_DOMAINS is comma-separated; take the first (primary) one.
  const domains = process.env.REPLIT_DOMAINS || "";
  const primary = domains.split(",")[0]?.trim() || "";
  res.json({ domain: primary });
});

router.use(healthRouter);
router.use(adminAuthRouter);
router.use(aiBuilderRouter);
router.use(quotesRouter);
router.use(sitesRouter);
router.use(adminStatsRouter);
router.use(siteServeRouter);

export default router;
