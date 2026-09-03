import { NextRequest, NextResponse } from "next/server";
import { readStore } from "@/lib/cms-store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase();
  const difficulty = searchParams.get("difficulty");
  const category = searchParams.get("category");
  const type = searchParams.get("type");

  const store = readStore();
  let results = store.treks.filter((t) => t.status === "Published");

  if (search) {
    results = results.filter(
      (t) =>
        t.name.toLowerCase().includes(search) ||
        t.location.toLowerCase().includes(search) ||
        t.region.toLowerCase().includes(search) ||
        (t.description || "").toLowerCase().includes(search) ||
        (t.tagline || "").toLowerCase().includes(search),
    );
  }

  if (difficulty && difficulty !== "All") {
    results = results.filter(
      (t) => t.difficulty.toLowerCase() === difficulty.toLowerCase(),
    );
  }

  if (category && category !== "All") {
    results = results.filter((t) =>
      t.categories.some((c) => c.toLowerCase() === category.toLowerCase()),
    );
  }

  if (type) {
    results = results.filter(
      (t) =>
        t.categories.some((c) => c.toLowerCase().includes(type.toLowerCase())) ||
        t.badge.toLowerCase().includes(type.toLowerCase()),
    );
  }

  return NextResponse.json({
    total: results.length,
    treks: results,
  });
}
