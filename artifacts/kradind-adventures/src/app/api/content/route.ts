import { NextResponse } from "next/server";
import { readStore } from "@/lib/cms-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const store = readStore();
  const publishedTreks = (store.treks || []).filter((t) => t.status === "Published");

  return NextResponse.json(
    {
      homeSections: store.homeSections,
      treks: publishedTreks,
      trailReports: store.trailReports,
      landingPages: (store.landingPages || []).filter((p) => p.status === "Published"),
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    },
  );
}
