import { NextResponse } from "next/server";
import { readStore } from "@/lib/cms-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const store = readStore();
    const landingPages = (store.landingPages || []).filter(
      (p) => p.status === "Published"
    );
    return NextResponse.json(landingPages, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching landing pages:", error);
    return NextResponse.json({ error: "Failed to fetch landing pages" }, { status: 500 });
  }
}
