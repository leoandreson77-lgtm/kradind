import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore, LeadRecord } from "@/lib/cms-store";
import { getDb } from "@/lib/mongodb";
import { z } from "zod";

const LeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().optional().default("Not provided"),
  trekInterest: z.string().optional(),
  message: z.string().min(5, "Message must be at least 5 characters"),
  source: z.string().optional().default("Contact Page"),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = LeadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const { name, email, phone, trekInterest, message, source } = parsed.data;
    const store = readStore();

    const leadId = `LD-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newLead: LeadRecord = {
      id: leadId,
      name,
      email,
      phone: phone || "Not provided",
      trekInterest: trekInterest || "General Inquiry",
      message,
      source: source || "Contact Page",
      status: "New",
      createdAt: new Date().toISOString(),
    };

    if (!store.leads) store.leads = [];
    store.leads.unshift(newLead);
    writeStore(store);

    // Save to MongoDB collection
    try {
      const db = await getDb();
      await db.collection("kradind_leads").insertOne({ ...newLead });
    } catch (mongoErr) {
      console.warn("MongoDB write skipped:", mongoErr);
    }

    return NextResponse.json(
      {
        success: true,
        id: leadId,
        message: `Thank you, ${name}! Your inquiry (Ref #${leadId}) has been assigned to our certified trek coordinator. We will reply within 2 hours.`,
      },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error submitting inquiry." },
      { status: 500 },
    );
  }
}
