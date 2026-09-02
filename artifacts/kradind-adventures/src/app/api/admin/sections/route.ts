import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore, HomeSectionsConfig } from "@/lib/cms-store";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const store = readStore();
  return NextResponse.json(store.homeSections);
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body: Partial<HomeSectionsConfig> = await request.json();
    const store = readStore();

    store.homeSections = {
      hero: {
        ...store.homeSections.hero,
        ...(body.hero || {}),
      },
      monsoon: {
        ...store.homeSections.monsoon,
        ...(body.monsoon || {}),
      },
      topBar: {
        ...store.homeSections.topBar,
        ...(body.topBar || {}),
      },
    };

    writeStore(store);
    return NextResponse.json(store.homeSections);
  } catch {
    return NextResponse.json({ error: "Failed to update home sections" }, { status: 500 });
  }
}
