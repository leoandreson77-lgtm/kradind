import { NextRequest, NextResponse } from "next/server";
import { readStore } from "@/lib/cms-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const store = readStore();
    const page = (store.landingPages || []).find(
      (p) => p.slug.toLowerCase() === slug.toLowerCase()
    );

    if (!page) {
      return NextResponse.json({ error: "Landing page not found" }, { status: 404 });
    }

    // Resolve featured treks details
    const featuredTreks = (store.treks || []).filter((t) =>
      (page.featuredTrekSlugs || []).includes(t.slug)
    );

    // Resolve other published campaigns for cross-destination exploration
    const otherCampaigns = (store.landingPages || []).filter(
      (p) => p.status === "Published" && p.slug.toLowerCase() !== slug.toLowerCase()
    );

    return NextResponse.json({ page, featuredTreks, otherCampaigns });
  } catch (error) {
    console.error("Error fetching landing page by slug:", error);
    return NextResponse.json({ error: "Failed to fetch landing page" }, { status: 500 });
  }
}
