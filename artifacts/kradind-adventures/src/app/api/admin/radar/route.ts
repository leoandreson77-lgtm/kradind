import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore, TrailRadarReport } from "@/lib/cms-store";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const store = readStore();
  return NextResponse.json(store.trailReports);
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body: Partial<TrailRadarReport> = await request.json();
    if (!body.trail || !body.region) {
      return NextResponse.json({ error: "Trail name and region are required" }, { status: 400 });
    }

    const store = readStore();
    const newReport: TrailRadarReport = {
      id: Date.now(),
      trail: body.trail,
      region: body.region,
      status: body.status || "open",
      temperature: body.temperature || "4°C",
      weather: body.weather || "Clear Skies",
      updatedAt: "Just now",
      note: body.note || "Trail inspected and verified by trek leaders.",
    };

    store.trailReports.unshift(newReport);
    writeStore(store);

    return NextResponse.json(newReport, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add trail report" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body: TrailRadarReport = await request.json();
    const store = readStore();
    const index = store.trailReports.findIndex((r) => String(r.id) === String(body.id));

    if (index === -1) {
      return NextResponse.json({ error: "Trail report not found" }, { status: 404 });
    }

    store.trailReports[index] = {
      ...store.trailReports[index],
      ...body,
      updatedAt: "Just now",
    };
    writeStore(store);

    return NextResponse.json(store.trailReports[index]);
  } catch {
    return NextResponse.json({ error: "Failed to update trail report" }, { status: 500 });
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
    return NextResponse.json({ error: "Missing report id" }, { status: 400 });
  }

  const store = readStore();
  const initialLength = store.trailReports.length;
  store.trailReports = store.trailReports.filter((r) => String(r.id) !== String(id));

  if (store.trailReports.length === initialLength) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  writeStore(store);
  return NextResponse.json({ success: true, message: "Trail report deleted" });
}
