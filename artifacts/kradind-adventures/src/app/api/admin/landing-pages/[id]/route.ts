import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore, syncLandingPagesToMongo } from "@/lib/cms-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const store = readStore();
    if (!store.landingPages) store.landingPages = [];

    const index = store.landingPages.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Landing page not found" }, { status: 404 });
    }

    // Update fields
    store.landingPages[index] = {
      ...store.landingPages[index],
      ...body,
      id, // ensure ID is preserved
      updatedAt: new Date().toISOString(),
    };

    writeStore(store);

    await syncLandingPagesToMongo(store.landingPages);

    return NextResponse.json(store.landingPages[index]);
  } catch (error: any) {
    console.error("Error updating landing page:", error);
    return NextResponse.json({ error: error?.message || "Failed to update landing page" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const store = readStore();
    if (!store.landingPages) store.landingPages = [];

    const initialLen = store.landingPages.length;
    store.landingPages = store.landingPages.filter((p) => p.id !== id);

    if (store.landingPages.length === initialLen) {
      return NextResponse.json({ error: "Landing page not found" }, { status: 404 });
    }

    writeStore(store);

    await syncLandingPagesToMongo(store.landingPages);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting landing page:", error);
    return NextResponse.json({ error: error?.message || "Failed to delete landing page" }, { status: 500 });
  }
}
