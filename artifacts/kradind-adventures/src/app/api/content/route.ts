import { NextResponse } from "next/server";
import { readStore } from "@/lib/cms-store";

export async function GET() {
  const store = readStore();
  const publishedTreks = store.treks.filter((t) => t.status === "Published");

  return NextResponse.json({
    homeSections: store.homeSections,
    treks: publishedTreks,
    trailReports: store.trailReports,
  });
}
