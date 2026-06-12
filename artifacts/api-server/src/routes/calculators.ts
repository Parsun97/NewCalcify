import { Router } from "express";
import { CALCULATORS, CATEGORIES } from "../lib/calculators-registry";
import { ListCalculatorsQueryParams, GetCalculatorParams } from "@workspace/api-zod";

const router = Router();

router.get("/calculators", (req, res) => {
  const parseResult = ListCalculatorsQueryParams.safeParse(req.query);
  const params = parseResult.success ? parseResult.data : {};
  const { category, q } = params;

  let results = CALCULATORS;

  if (category) {
    results = results.filter((c) => c.categorySlug === category);
  }

  if (q) {
    const query = q.toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.tags.some((t) => t.toLowerCase().includes(query)) ||
        c.category.toLowerCase().includes(query),
    );
  }

  res.json(results);
});

router.get("/calculators/categories", (_req, res) => {
  const withCounts = CATEGORIES.map((cat) => ({
    ...cat,
    calculatorCount: CALCULATORS.filter((c) => c.categorySlug === cat.slug).length,
  }));
  res.json(withCounts);
});

router.get("/calculators/:slug", (req, res) => {
  const parseResult = GetCalculatorParams.safeParse(req.params);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid slug" });
    return;
  }

  const calc = CALCULATORS.find((c) => c.slug === parseResult.data.slug);
  if (!calc) {
    res.status(404).json({ error: "Calculator not found" });
    return;
  }

  res.json(calc);
});

export default router;
