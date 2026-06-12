import { Router } from "express";
import { desc, eq, sql, count } from "drizzle-orm";
import { db, historyTable, favoritesTable, usageTable, usageCountsTable } from "@workspace/db";
import { CALCULATORS } from "../lib/calculators-registry";
import { GetTrendingQueryParams, GetRecentlyUsedQueryParams, TrackUsageBody } from "@workspace/api-zod";

const router = Router();

router.get("/stats/trending", async (req, res) => {
  try {
    const parseResult = GetTrendingQueryParams.safeParse(req.query);
    const limit = parseResult.success ? (parseResult.data.limit ?? 8) : 8;

    const rows = await db
      .select()
      .from(usageCountsTable)
      .orderBy(desc(usageCountsTable.usageCount))
      .limit(limit);

    const trending = rows
      .map((row, idx) => {
        const calc = CALCULATORS.find((c) => c.slug === row.calculatorSlug);
        if (!calc) return null;
        return {
          calculator: calc,
          usageCount: row.usageCount,
          rank: idx + 1,
        };
      })
      .filter(Boolean);

    res.json(trending);
  } catch (err) {
    req.log.error({ err }, "Failed to get trending");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats/recently-used", async (req, res) => {
  try {
    const parseResult = GetRecentlyUsedQueryParams.safeParse(req.query);
    const limit = parseResult.success ? (parseResult.data.limit ?? 6) : 6;

    const rows = await db
      .select({ calculatorSlug: usageCountsTable.calculatorSlug })
      .from(usageCountsTable)
      .orderBy(desc(usageCountsTable.lastUsedAt))
      .limit(limit);

    const calcs = rows
      .map((row) => CALCULATORS.find((c) => c.slug === row.calculatorSlug))
      .filter(Boolean);

    res.json(calcs);
  } catch (err) {
    req.log.error({ err }, "Failed to get recently used");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats/platform", async (req, res) => {
  try {
    const [{ totalCalculations }] = await db
      .select({ totalCalculations: count() })
      .from(historyTable);

    const [{ totalFavorites }] = await db
      .select({ totalFavorites: count() })
      .from(favoritesTable);

    res.json({
      totalCalculators: CALCULATORS.length,
      totalCategories: 6,
      totalCalculations: Number(totalCalculations),
      totalFavorites: Number(totalFavorites),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get platform stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/stats/track", async (req, res) => {
  try {
    const parseResult = TrackUsageBody.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: "Invalid body" });
      return;
    }

    const { calculatorSlug } = parseResult.data;

    await db.insert(usageCountsTable)
      .values({ calculatorSlug, usageCount: 1, lastUsedAt: new Date() })
      .onConflictDoUpdate({
        target: usageCountsTable.calculatorSlug,
        set: {
          usageCount: sql`${usageCountsTable.usageCount} + 1`,
          lastUsedAt: new Date(),
        },
      });

    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to track usage");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
