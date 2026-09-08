import { NextResponse } from "next/server";
import { readStore } from "@/lib/cms-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const store = readStore();
  return NextResponse.json(
    {
      updatedAt: "Live Ground Feed",
      reports: store.trailReports || [],
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    },
  );
}
