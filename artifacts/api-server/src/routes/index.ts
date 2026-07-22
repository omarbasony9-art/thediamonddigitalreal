import { Router, type IRouter } from "express";
import healthRouter from "./health";
import quotesRouter from "./quotes";
import sitesRouter from "./sites";
import adminStatsRouter from "./adminStats";
import clientAuthRouter from "./clientAuth";
import adminAuthRouter from "./adminAuth";
import aiBuilderRouter from "./aiBuilder";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminAuthRouter);
router.use(aiBuilderRouter);
router.use(quotesRouter);
router.use(sitesRouter);
router.use(adminStatsRouter);
router.use(clientAuthRouter);

export default router;
