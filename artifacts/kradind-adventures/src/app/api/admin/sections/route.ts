import { NextRequest, NextResponse } from "next/server";
import {
  readStore,
  writeStore,
  HomeSectionsConfig,
  getHomeSectionsAsync,
  syncHomeSectionsToMongo,
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
    const sections = await getHomeSectionsAsync();
    return NextResponse.json(sections, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (err) {
    console.error("Error fetching home sections:", err);
    const store = readStore();
    return NextResponse.json(store.homeSections, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body: Partial<HomeSectionsConfig> = await request.json();
    const currentSections = await getHomeSectionsAsync();

    const updatedSections: HomeSectionsConfig = {
      hero: {
        badge: body.hero?.badge ?? currentSections?.hero?.badge ?? "Certified Himalayan Guides • Small Safe Batches",
        title: body.hero?.title ?? currentSections?.hero?.title ?? "Experience the Himalayas",
        subtitle: body.hero?.subtitle ?? currentSections?.hero?.subtitle ?? "",
        bgImage: body.hero?.bgImage ?? currentSections?.hero?.bgImage ?? "",
      },
      monsoon: {
        enabled: body.monsoon?.enabled ?? currentSections?.monsoon?.enabled ?? true,
        title: body.monsoon?.title ?? currentSections?.monsoon?.title ?? "Monsoon Specials & Valley Blooms",
        promoCode: (body.monsoon?.promoCode ?? currentSections?.monsoon?.promoCode ?? "MONSOON2026").toUpperCase(),
        discountPercent: Number(body.monsoon?.discountPercent ?? currentSections?.monsoon?.discountPercent ?? 15),
      },
      topBar: {
        supportPhone: body.topBar?.supportPhone ?? currentSections?.topBar?.supportPhone ?? "+91 75002 22141",
        leaveNoTrace: body.topBar?.leaveNoTrace ?? currentSections?.topBar?.leaveNoTrace ?? "🌱 Leave No Trace Certified Operator",
      },
    };

    // 1. Sync to MongoDB Atlas
    await syncHomeSectionsToMongo(updatedSections);

    // 2. Sync to local memory and cache store
    const store = readStore();
    store.homeSections = updatedSections;
    try {
      writeStore(store);
    } catch (fsErr) {
      console.warn("Local filesystem write skipped:", fsErr);
    }

    return NextResponse.json(updatedSections);
  } catch (error: any) {
    console.error("Failed to update home sections:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update home sections" },
      { status: 500 }
    );
  }
}
