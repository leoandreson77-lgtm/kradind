import { NextResponse } from "next/server";
import {
  readStore,
  getHomeSectionsAsync,
  getTreksAsync,
  getTrailReportsAsync,
  getLandingPagesAsync,
} from "@/lib/cms-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [homeSections, treks, trailReports, landingPages] = await Promise.all([
      getHomeSectionsAsync(),
      getTreksAsync(),
      getTrailReportsAsync(),
      getLandingPagesAsync(),
    ]);

    const publishedTreks = (treks || []).filter((t) => t.status === "Published");
    const publishedCampaigns = (landingPages || []).filter((p) => p.status === "Published");

    return NextResponse.json(
      {
        homeSections,
        treks: publishedTreks,
        trailReports,
        landingPages: publishedCampaigns,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("Error in /api/content:", error);
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
}
