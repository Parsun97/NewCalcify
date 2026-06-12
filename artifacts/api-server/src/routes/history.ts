import { Router } from "express";
import { desc, eq, sql } from "drizzle-orm";
import { db, historyTable } from "@workspace/db";
import {
  SaveHistoryBody,
  DeleteHistoryParams,
  ListHistoryQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/history", async (req, res) => {
  try {
    const parseResult = ListHistoryQueryParams.safeParse(req.query);
    const params = parseResult.success ? parseResult.data : {};
    const limit = params.limit ?? 20;
    const calculatorSlug = params.calculatorSlug;

    let query = db
      .select()
      .from(historyTable)
      .orderBy(desc(historyTable.createdAt))
      .limit(limit);

    if (calculatorSlug) {
      query = db
        .select()
        .from(historyTable)
        .where(eq(historyTable.calculatorSlug, calculatorSlug))
        .orderBy(desc(historyTable.createdAt))
        .limit(limit);
    }

    const rows = await query;
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list history");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/history", async (req, res) => {
  try {
    const parseResult = SaveHistoryBody.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: "Invalid body", details: parseResult.error });
      return;
    }

    const [row] = await db
      .insert(historyTable)
      .values(parseResult.data)
      .returning();

    res.status(201).json(row);
  } catch (err) {
    req.log.error({ err }, "Failed to save history");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/history/clear", async (req, res) => {
  try {
    await db.delete(historyTable);
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to clear history");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/history/:id", async (req, res) => {
  try {
    const parseResult = DeleteHistoryParams.safeParse(req.params);
    if (!parseResult.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    await db.delete(historyTable).where(eq(historyTable.id, parseResult.data.id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete history entry" );
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
