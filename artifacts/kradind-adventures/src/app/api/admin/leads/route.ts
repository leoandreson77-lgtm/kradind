import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore, LeadRecord } from "@/lib/cms-store";
import { getAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getMongoIdFilter(id: string) {
  const cleanId = String(id).trim();
  const filters: any[] = [{ id: cleanId }];
  if (ObjectId.isValid(cleanId) && cleanId.length === 24) {
    try {
      filters.push({ _id: new ObjectId(cleanId) });
    } catch {}
  }
  return { $or: filters };
}

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
        return {
          ...rest,
          id: rest.id || String(_id),
        } as LeadRecord;
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

    const cleanId = String(id).trim();

    // 1. Check local store
    const store = readStore();
    if (!store.leads) store.leads = [];
    const localIndex = store.leads.findIndex((l) => String(l.id).trim() === cleanId);

    // 2. Check MongoDB
    let mongoLead: LeadRecord | null = null;
    let dbInstance: any = null;
    try {
      dbInstance = await getDb();
      const doc = await dbInstance.collection("kradind_leads").findOne(getMongoIdFilter(cleanId));
      if (doc) {
        const { _id, ...rest } = doc;
        mongoLead = {
          ...rest,
          id: rest.id || String(_id),
        } as LeadRecord;
      }
    } catch (mongoErr) {
      console.warn("MongoDB lead find warning:", mongoErr);
    }

    const current = (localIndex !== -1 ? store.leads[localIndex] : null) || mongoLead;
    if (!current) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

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
      id: cleanId,
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

    if (localIndex !== -1) {
      store.leads[localIndex] = updated;
    } else {
      store.leads.unshift(updated);
    }
    writeStore(store);

    try {
      const db = dbInstance || (await getDb());
      await db.collection("kradind_leads").updateOne(
        getMongoIdFilter(cleanId),
        { $set: updated },
        { upsert: true }
      );
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

    const cleanId = String(id).trim();

    const store = readStore();
    if (!store.leads) store.leads = [];

    store.leads = store.leads.filter((l) => String(l.id).trim() !== cleanId);
    writeStore(store);

    try {
      const db = await getDb();
      await db.collection("kradind_leads").deleteOne(getMongoIdFilter(cleanId));
    } catch (mongoErr) {
      console.warn("MongoDB lead delete warning:", mongoErr);
    }

    return NextResponse.json({ success: true, message: "Lead removed" });
  } catch (error: any) {
    console.error("Failed to remove lead:", error);
    return NextResponse.json({ error: error?.message || "Failed to remove lead" }, { status: 500 });
  }
}
