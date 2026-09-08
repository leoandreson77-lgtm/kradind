import { NextRequest, NextResponse } from "next/server";
import { readStore, getTreksAsync } from "@/lib/cms-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase().trim();
  const difficulty = searchParams.get("difficulty");
  const category = searchParams.get("category");
  const type = searchParams.get("type");

  let treks;
  try {
    treks = await getTreksAsync();
  } catch {
    const store = readStore();
    treks = store.treks || [];
  }

  let results = (treks || []).filter((t) => t.status === "Published");

  if (search) {
    const isDomesticSearch = search === "domestic" || search.includes("domestic");
    results = results.filter((t) => {
      const isDomesticTrek =
        (t.category || "").toLowerCase() === "domestic" ||
        t.categories.some((c) => c.toLowerCase() === "domestic");

      return (
        (isDomesticSearch && isDomesticTrek) ||
        t.name.toLowerCase().includes(search) ||
        (t.category || "").toLowerCase().includes(search) ||
        t.categories.some((c) => c.toLowerCase().includes(search)) ||
        t.location.toLowerCase().includes(search) ||
        t.region.toLowerCase().includes(search) ||
        (t.description || "").toLowerCase().includes(search) ||
        (t.tagline || "").toLowerCase().includes(search)
      );
    });
  }

  if (difficulty && difficulty !== "All") {
    results = results.filter(
      (t) => t.difficulty.toLowerCase() === difficulty.toLowerCase(),
    );
  }

  if (category && category !== "All") {
    const catLower = category.toLowerCase().trim();
    const isDomestic =
      catLower === "domestic" ||
      catLower.includes("road trip") ||
      catLower === "domestic trips";

    results = results.filter((t) => {
      const isDomesticTrek =
        (t.category || "").toLowerCase() === "domestic" ||
        t.categories.some((c) => c.toLowerCase() === "domestic");

      return (
        (isDomestic && isDomesticTrek) ||
        (t.category || "").toLowerCase().includes(catLower) ||
        t.categories.some((c) => c.toLowerCase().includes(catLower)) ||
        t.location.toLowerCase().includes(catLower) ||
        t.region.toLowerCase().includes(catLower)
      );
    });
  }

  if (type && type !== "All") {
    const typeLower = type.toLowerCase().trim();
    const isDomestic =
      typeLower === "domestic" ||
      typeLower.includes("road trip") ||
      typeLower === "domestic trips";

    results = results.filter((t) => {
      const isDomesticTrek =
        (t.category || "").toLowerCase() === "domestic" ||
        t.categories.some((c) => c.toLowerCase() === "domestic");

      return (
        (isDomestic && isDomesticTrek) ||
        (t.category || "").toLowerCase().includes(typeLower) ||
        t.categories.some((c) => c.toLowerCase().includes(typeLower)) ||
        t.location.toLowerCase().includes(typeLower) ||
        t.region.toLowerCase().includes(typeLower) ||
        t.badge.toLowerCase().includes(typeLower)
      );
    });
  }

  return NextResponse.json(
    {
      total: results.length,
      treks: results,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    },
  );
}
