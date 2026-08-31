import { Router, type IRouter } from "express";
import { GetTrailRadarResponse } from "@workspace/api-zod";
import { trailReports } from "../lib/travel-data";

const router: IRouter = Router();

router.get("/radar", (_req, res): void => {
  res.json(GetTrailRadarResponse.parse(trailReports));
});

export default router;