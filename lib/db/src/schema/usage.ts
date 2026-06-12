import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usageTable = pgTable("calculator_usage", {
  id: serial("id").primaryKey(),
  calculatorSlug: text("calculator_slug").notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }).notNull().defaultNow(),
});

export const usageCountsTable = pgTable("calculator_usage_counts", {
  calculatorSlug: text("calculator_slug").primaryKey(),
  usageCount: integer("usage_count").notNull().default(0),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUsageSchema = createInsertSchema(usageTable).omit({ id: true, usedAt: true });
export type InsertUsage = z.infer<typeof insertUsageSchema>;
export type UsageRow = typeof usageTable.$inferSelect;
export type UsageCountRow = typeof usageCountsTable.$inferSelect;
