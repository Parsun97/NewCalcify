import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, favoritesTable } from "@workspace/db";
import {
  AddFavoriteBody,
  RemoveFavoriteParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/favorites", async (req, res) => {
  try {
    const rows = await db.select().from(favoritesTable);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list favorites");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/favorites", async (req, res) => {
  try {
    const parseResult = AddFavoriteBody.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: "Invalid body", details: parseResult.error });
      return;
    }

    const existing = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.calculatorSlug, parseResult.data.calculatorSlug))
      .limit(1);

    if (existing.length > 0) {
      res.status(201).json(existing[0]);
      return;
    }

    const [row] = await db
      .insert(favoritesTable)
      .values(parseResult.data)
      .returning();

    res.status(201).json(row);
  } catch (err) {
    req.log.error({ err }, "Failed to add favorite");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/favorites/:calculatorSlug", async (req, res) => {
  try {
    const parseResult = RemoveFavoriteParams.safeParse(req.params);
    if (!parseResult.success) {
      res.status(400).json({ error: "Invalid params" });
      return;
    }

    await db
      .delete(favoritesTable)
      .where(eq(favoritesTable.calculatorSlug, parseResult.data.calculatorSlug));

    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to remove favorite");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
