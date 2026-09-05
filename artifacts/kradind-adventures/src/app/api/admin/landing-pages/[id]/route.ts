import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/cms-store";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const store = readStore();

    const index = (store.landingPages || []).findIndex((p) => p.id === id);
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
    return NextResponse.json(store.landingPages[index]);
  } catch (error) {
    console.error("Error updating landing page:", error);
    return NextResponse.json({ error: "Failed to update landing page" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const store = readStore();

    const initialLen = (store.landingPages || []).length;
    store.landingPages = (store.landingPages || []).filter((p) => p.id !== id);

    if (store.landingPages.length === initialLen) {
      return NextResponse.json({ error: "Landing page not found" }, { status: 404 });
    }

    writeStore(store);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting landing page:", error);
    return NextResponse.json({ error: "Failed to delete landing page" }, { status: 500 });
  }
}
