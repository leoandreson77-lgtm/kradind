import { NextResponse } from "next/server";
import { getDestinationsAsync, getDefaultDestinations } from "@/lib/cms-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const destinations = await getDestinationsAsync();
    const published = (destinations || getDefaultDestinations()).filter(
      (d) => d.status === "Published"
    );
    return NextResponse.json(published, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching public destinations:", error);
    return NextResponse.json(getDefaultDestinations(), {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
