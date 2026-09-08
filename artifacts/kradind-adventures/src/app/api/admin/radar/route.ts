import { NextRequest, NextResponse } from "next/server";
import {
  readStore,
  writeStore,
  TrailRadarReport,
  getTrailReportsAsync,
  syncTrailReportsToMongo,
} from "@/lib/cms-store";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const reports = await getTrailReportsAsync();
    return NextResponse.json(reports || [], {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (err) {
    console.error("Error in GET /api/admin/radar:", err);
    const store = readStore();
    return NextResponse.json(store.trailReports || [], {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  }
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
    if (!store.trailReports) store.trailReports = [];

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

    await syncTrailReportsToMongo(store.trailReports);

    return NextResponse.json(newReport, { status: 201 });
  } catch (error: any) {
    console.error("Failed to add trail report:", error);
    return NextResponse.json({ error: error?.message || "Failed to add trail report" }, { status: 500 });
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
    if (!store.trailReports) store.trailReports = [];

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

    await syncTrailReportsToMongo(store.trailReports);

    return NextResponse.json(store.trailReports[index]);
  } catch (error: any) {
    console.error("Failed to update trail report:", error);
    return NextResponse.json({ error: error?.message || "Failed to update trail report" }, { status: 500 });
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
      return NextResponse.json({ error: "Missing report id" }, { status: 400 });
    }

    const store = readStore();
    if (!store.trailReports) store.trailReports = [];

    const initialLength = store.trailReports.length;
    store.trailReports = store.trailReports.filter((r) => String(r.id) !== String(id));

    if (store.trailReports.length === initialLength) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    writeStore(store);

    await syncTrailReportsToMongo(store.trailReports);

    return NextResponse.json({ success: true, message: "Trail report deleted" });
  } catch (error: any) {
    console.error("Failed to delete trail report:", error);
    return NextResponse.json({ error: error?.message || "Failed to delete trail report" }, { status: 500 });
  }
}
