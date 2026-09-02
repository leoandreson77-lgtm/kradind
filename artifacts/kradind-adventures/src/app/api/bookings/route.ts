import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore, BookingRecord } from "@/lib/cms-store";
import { getDb } from "@/lib/mongodb";
import { z } from "zod";

const BookingSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(8, "Valid contact number required"),
  trekSlug: z.string().min(1, "Trek selection required"),
  batchDate: z.string().optional(),
  trekkersCount: z.number().int().positive().default(1),
  promoCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = BookingSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const { fullName, email, phone, trekSlug, batchDate, trekkersCount, promoCode } = parsed.data;
    const store = readStore();
    const trek = store.treks.find((t) => t.slug === trekSlug);

    const basePrice = trek ? trek.price : 8999;
    const isPromo = promoCode?.toUpperCase() === store.homeSections.monsoon.promoCode.toUpperCase();
    const discountFactor = isPromo ? (1 - store.homeSections.monsoon.discountPercent / 100) : 1;
    const totalPrice = Math.round(basePrice * trekkersCount * discountFactor);

    const bookingId = `KR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newBooking: BookingRecord = {
      id: bookingId,
      customerName: fullName,
      email,
      phone,
      trekSlug,
      trekName: trek?.name || "Himalayan Expedition",
      batchDate: batchDate || "Upcoming Selected Batch",
      travelers: trekkersCount,
      totalAmount: totalPrice,
      promoCode,
      discountApplied: isPromo,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    };

    store.bookings.unshift(newBooking);
    writeStore(store);

    // Save to MongoDB collection
    try {
      const db = await getDb();
      await db.collection("kradind_bookings").insertOne({ ...newBooking });
    } catch (mongoErr) {
      console.warn("MongoDB write skipped:", mongoErr);
    }

    return NextResponse.json(
      {
        id: bookingId,
        status: "confirmed",
        trekName: newBooking.trekName,
        trekkersCount,
        totalPrice,
        promoDiscountApplied: isPromo,
        message: `Reservation confirmed for ${fullName}! Your departure booking ID is ${bookingId}. Our certified Ground Support officer will contact you shortly with gear guidelines.`,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error processing booking." },
      { status: 500 },
    );
  }
}
