import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore, LeadRecord } from "@/lib/cms-store";
import { getAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const docs = await db.collection("kradind_leads").find({}).sort({ createdAt: -1 }).toArray();
    if (docs && docs.length > 0) {
      const cleanLeads = docs.map((doc: any) => {
        const { _id, ...rest } = doc;
        return rest as LeadRecord;
      });
      return NextResponse.json(cleanLeads, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });
    }
  } catch (err) {
    console.warn("MongoDB leads fetch warning:", err);
  }

  const store = readStore();
  return NextResponse.json(store.leads || [], {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    const store = readStore();
    if (!store.leads) store.leads = [];

    const index = store.leads.findIndex((l) => l.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const current = store.leads[index];
    const existingInteractions = Array.isArray(current.interactions) ? [...current.interactions] : [];

    // If a new interaction is being logged
    if (body.newInteraction) {
      const interaction = {
        id: `int-${Date.now().toString().slice(-6)}`,
        type: body.newInteraction.type || "Call",
        summary: body.newInteraction.summary || "",
        agentName: body.newInteraction.agentName || session.user?.name || "Staff Agent",
        agentId: body.newInteraction.agentId || session.user?.id || "",
        outcome: body.newInteraction.outcome || "Follow-up Required",
        timestamp: new Date().toISOString(),
      };
      existingInteractions.unshift(interaction);
    }

    const updated: LeadRecord = {
      ...current,
      ...(body.status !== undefined && { status: body.status }),
      ...(body.assignedTo !== undefined && { assignedTo: body.assignedTo }),
      ...(body.assignedToId !== undefined && { assignedToId: body.assignedToId }),
      ...(body.budget !== undefined && { budget: Number(body.budget) }),
      ...(body.pax !== undefined && { pax: Number(body.pax) }),
      ...(body.quotedAmount !== undefined && { quotedAmount: Number(body.quotedAmount) }),
      interactions: body.interactions || existingInteractions,
      interactionCount: body.interactions ? body.interactions.length : existingInteractions.length,
      lastInteractedAt: body.newInteraction ? new Date().toISOString() : (body.lastInteractedAt || current.lastInteractedAt),
    };

    store.leads[index] = updated;
    writeStore(store);

    try {
      const db = await getDb();
      await db.collection("kradind_leads").updateOne({ id }, { $set: updated }, { upsert: true });
    } catch (mongoErr) {
      console.warn("MongoDB lead update warning:", mongoErr);
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Failed to update lead status:", error);
    return NextResponse.json({ error: error?.message || "Failed to update lead status" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing lead id" }, { status: 400 });
    }

    const store = readStore();
    if (!store.leads) store.leads = [];

    store.leads = store.leads.filter((l) => l.id !== id);
    writeStore(store);

    try {
      const db = await getDb();
      await db.collection("kradind_leads").deleteOne({ id });
    } catch (mongoErr) {
      console.warn("MongoDB lead delete warning:", mongoErr);
    }

    return NextResponse.json({ success: true, message: "Lead removed" });
  } catch (error: any) {
    console.error("Failed to remove lead:", error);
    return NextResponse.json({ error: error?.message || "Failed to remove lead" }, { status: 500 });
  }
}
