import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const favoritesTable = pgTable("calculator_favorites", {
  id: serial("id").primaryKey(),
  calculatorSlug: text("calculator_slug").notNull().unique(),
  calculatorName: text("calculator_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFavoriteSchema = createInsertSchema(favoritesTable).omit({ id: true, createdAt: true });
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type FavoriteRow = typeof favoritesTable.$inferSelect;
