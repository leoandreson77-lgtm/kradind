import { Router, type IRouter } from "express";
import { CreateBookingBody, CreateBookingResponse } from "@workspace/api-zod";
import { treks } from "../lib/travel-data";

const router: IRouter = Router();

router.post("/bookings", (req, res): void => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid booking request");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const trek = treks.find((item) => item.slug === parsed.data.trekSlug);
  const batch = trek?.batches.find((item) => item.id === parsed.data.batchId);
  if (!trek || !batch) {
    res.status(400).json({ error: "That departure is no longer available." });
    return;
  }

  const bookingId = `KR-${Date.now().toString(36).toUpperCase()}`;
  res.status(201).json(
    CreateBookingResponse.parse({
      id: bookingId,
      status: "received",
      message: `You're on the list for ${trek.name}. Our trip expert will call you shortly.`,
    }),
  );
});

export default router;