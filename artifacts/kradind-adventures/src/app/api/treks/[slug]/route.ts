import { NextRequest, NextResponse } from "next/server";
import { readStore } from "@/lib/cms-store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const store = readStore();
  const trek = store.treks.find((t) => t.slug === slug);

  if (!trek) {
    return NextResponse.json(
      { error: `Trek with slug '${slug}' not found` },
      { status: 404 },
    );
  }

  return NextResponse.json(trek);
}
