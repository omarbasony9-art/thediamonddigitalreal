import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { db, quotesTable, activityLogTable } from "@workspace/db";
import {
  CreateQuoteBody,
  UpdateQuoteBody,
  GetQuoteParams,
  UpdateQuoteParams,
  DeleteQuoteParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};

// List all quotes (admin only)
router.get("/quotes", requireAuth, async (req, res): Promise<void> => {
  const { status } = req.query as { status?: string };
  let query = db.select().from(quotesTable).orderBy(quotesTable.createdAt);
  const quotes = await db
    .select()
    .from(quotesTable)
    .orderBy(quotesTable.createdAt);

  if (status) {
    const filtered = quotes.filter((q) => q.status === status);
    res.json(filtered);
    return;
  }
  res.json(quotes);
});

// Submit a quote (public)
router.post("/quotes", async (req, res): Promise<void> => {
  const parsed = CreateQuoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [quote] = await db
    .insert(quotesTable)
    .values({ ...parsed.data, status: "pending" })
    .returning();

  await db.insert(activityLogTable).values({
    type: "quote_submitted",
    message: `New quote request from ${quote.name} (${quote.projectType})`,
    entityId: quote.id,
    entityType: "quote",
  });

  res.status(201).json(quote);
});

// Get a single quote (admin only)
router.get("/quotes/:id", requireAuth, async (req, res): Promise<void> => {
  const params = GetQuoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [quote] = await db
    .select()
    .from(quotesTable)
    .where(eq(quotesTable.id, params.data.id));

  if (!quote) {
    res.status(404).json({ error: "Quote not found" });
    return;
  }

  res.json(quote);
});

// Update a quote (admin only)
router.patch("/quotes/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateQuoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateQuoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [quote] = await db
    .update(quotesTable)
    .set(parsed.data)
    .where(eq(quotesTable.id, params.data.id))
    .returning();

  if (!quote) {
    res.status(404).json({ error: "Quote not found" });
    return;
  }

  await db.insert(activityLogTable).values({
    type: "quote_updated",
    message: `Quote from ${quote.name} updated to status: ${quote.status}`,
    entityId: quote.id,
    entityType: "quote",
  });

  res.json(quote);
});

// Delete a quote (admin only)
router.delete("/quotes/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteQuoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(quotesTable)
    .where(eq(quotesTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Quote not found" });
    return;
  }

  res.status(204).send();
});

export default router;
