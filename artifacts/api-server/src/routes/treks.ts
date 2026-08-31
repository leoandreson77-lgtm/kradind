import { Router, type IRouter } from "express";
import { GetTrekParams, ListTreksQueryParams, ListTreksResponse, GetTrekResponse } from "@workspace/api-zod";
import { treks } from "../lib/travel-data";

const router: IRouter = Router();

router.get("/treks", (req, res): void => {
  const parsed = ListTreksQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { type, season } = parsed.data;
  const filtered = treks.filter((trek) => {
    const matchesType = !type || trek.categories.some((category) => category.toLowerCase().includes(type.toLowerCase()));
    const matchesSeason = !season || trek.categories.some((category) => category.toLowerCase().includes(season.toLowerCase()));
    return matchesType && matchesSeason;
  });

  res.json(ListTreksResponse.parse(filtered));
});

router.get("/treks/:slug", (req, res): void => {
  const parsed = GetTrekParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const trek = treks.find((item) => item.slug === parsed.data.slug);
  if (!trek) {
    res.status(404).json({ error: "Trek not found" });
    return;
  }

  res.json(GetTrekResponse.parse(trek));
});

export default router;