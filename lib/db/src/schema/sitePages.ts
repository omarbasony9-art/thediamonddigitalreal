import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sitePagesTable = pgTable("site_pages", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  content: text("content").notNull().default(""),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSitePageSchema = createInsertSchema(sitePagesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSitePage = z.infer<typeof insertSitePageSchema>;
export type SitePage = typeof sitePagesTable.$inferSelect;
