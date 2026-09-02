import { NextResponse } from "next/server";
import { readStore } from "@/lib/cms-store";

export async function GET() {
  const store = readStore();
  return NextResponse.json({
    updatedAt: "Live Ground Feed",
    reports: store.trailReports,
  });
}
