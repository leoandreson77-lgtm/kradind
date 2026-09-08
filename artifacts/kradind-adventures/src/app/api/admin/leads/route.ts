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
    const { id, status }: { id: string; status: LeadRecord["status"] } = await request.json();
    const store = readStore();
    if (!store.leads) store.leads = [];

    const index = store.leads.findIndex((l) => l.id === id);
    if (index !== -1) {
      store.leads[index].status = status;
      writeStore(store);
    }

    try {
      const db = await getDb();
      await db.collection("kradind_leads").updateOne({ id }, { $set: { status } });
    } catch (mongoErr) {
      console.warn("MongoDB lead update warning:", mongoErr);
    }

    if (index === -1) {
      return NextResponse.json({ id, status });
    }

    return NextResponse.json(store.leads[index]);
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
