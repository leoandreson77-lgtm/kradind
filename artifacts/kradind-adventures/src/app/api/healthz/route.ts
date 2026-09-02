import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "kradind-adventures-nextjs-backend",
    timestamp: new Date().toISOString(),
  });
}
