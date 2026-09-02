import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore, LeadRecord } from "@/lib/cms-store";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const store = readStore();
  return NextResponse.json(store.leads || []);
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
    if (index === -1) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    store.leads[index].status = status;
    writeStore(store);

    return NextResponse.json(store.leads[index]);
  } catch {
    return NextResponse.json({ error: "Failed to update lead status" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing lead id" }, { status: 400 });
  }

  const store = readStore();
  if (!store.leads) store.leads = [];

  const initialCount = store.leads.length;
  store.leads = store.leads.filter((l) => l.id !== id);

  if (store.leads.length === initialCount) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  writeStore(store);
  return NextResponse.json({ success: true, message: "Lead removed" });
}
