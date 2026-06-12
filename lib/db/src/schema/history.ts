import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const historyTable = pgTable("calculation_history", {
  id: serial("id").primaryKey(),
  calculatorSlug: text("calculator_slug").notNull(),
  calculatorName: text("calculator_name").notNull(),
  inputs: jsonb("inputs").notNull(),
  result: jsonb("result").notNull(),
  label: text("label"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertHistorySchema = createInsertSchema(historyTable).omit({ id: true, createdAt: true });
export type InsertHistory = z.infer<typeof insertHistorySchema>;
export type HistoryRow = typeof historyTable.$inferSelect;
