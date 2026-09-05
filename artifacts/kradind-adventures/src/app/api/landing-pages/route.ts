import { NextResponse } from "next/server";
import { readStore } from "@/lib/cms-store";

export async function GET() {
  try {
    const store = readStore();
    const landingPages = (store.landingPages || []).filter(
      (p) => p.status === "Published"
    );
    return NextResponse.json(landingPages);
  } catch (error) {
    console.error("Error fetching landing pages:", error);
    return NextResponse.json({ error: "Failed to fetch landing pages" }, { status: 500 });
  }
}
