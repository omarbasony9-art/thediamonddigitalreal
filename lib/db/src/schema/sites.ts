import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sitesTable = pgTable("sites", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  projectName: text("project_name").notNull(),
  domain: text("domain"),
  status: text("status").notNull().default("draft"),
  tech: text("tech").notNull().default("react"),
  projectType: text("project_type").notNull().default("website"),
  description: text("description"),
  liveUrl: text("live_url"),
  previewUrl: text("preview_url"),
  quoteId: integer("quote_id"),
  clientEmail: text("client_email"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  launchedAt: timestamp("launched_at", { withTimezone: true }),
});

export const insertSiteSchema = createInsertSchema(sitesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  launchedAt: true,
  status: true,
  liveUrl: true,
  previewUrl: true,
});

export type InsertSite = z.infer<typeof insertSiteSchema>;
export type Site = typeof sitesTable.$inferSelect;
