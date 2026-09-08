import { NextRequest, NextResponse } from "next/server";
import { readStore, getTreksAsync } from "@/lib/cms-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  let treks;
  try {
    treks = await getTreksAsync();
  } catch {
    const store = readStore();
    treks = store.treks || [];
  }

  const trek = treks.find((t) => t.slug === slug);

  if (!trek) {
    return NextResponse.json(
      { error: `Trek with slug '${slug}' not found` },
      { status: 404 },
    );
  }

  return NextResponse.json(trek, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}
