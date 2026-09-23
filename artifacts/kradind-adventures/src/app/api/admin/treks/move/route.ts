import { NextRequest, NextResponse } from "next/server";
import {
  readStore,
  writeStore,
  TrekData,
  syncTreksToMongo,
  DestinationData,
  getDestinationsAsync,
  syncDestinationsToMongo,
  getDefaultDestinations,
} from "@/lib/cms-store";
import { getAdminSession } from "@/lib/admin-auth";
import { getImageAlt } from "@/lib/image-alt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export interface MoveTrekRequest {
  id: number | string;
  targetType: "Domestic" | "Trek";
  targetRegion?: string;
  targetCollection?: string;
  transferToDestinations?: boolean;
}

/**
 * POST /api/admin/treks/move
 * Moves or converts a package between Himalayan Trek and Domestic Tour Package.
 * Can also copy/transfer to Destinations CMS if requested.
 */
export async function POST(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body: MoveTrekRequest = await request.json();
    const { id, targetType, targetRegion, targetCollection, transferToDestinations } = body;

    if (!id || !targetType) {
      return NextResponse.json(
        { error: "Trek ID and targetType ('Domestic' | 'Trek') are required" },
        { status: 400 }
      );
    }

    const store = readStore();
    if (!store.treks) store.treks = [];

    const index = store.treks.findIndex((t) => String(t.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ error: "Trek not found in catalog" }, { status: 404 });
    }

    const currentTrek = store.treks[index];
    const prevCategories = currentTrek.categories || [];

    let updatedTrek: TrekData;

    if (targetType === "Domestic") {
      // Clean existing trek-specific tags
      const filteredCategories = prevCategories.filter(
        (c) =>
          !["Trek", "Summit", "High Pass", "Expedition", "Himalayas"].includes(c) &&
          c !== "Domestic" &&
          c !== "Holiday Package"
      );

      const newCategories = ["Domestic", "Holiday Package", ...filteredCategories];
      if (targetRegion && !newCategories.includes(targetRegion)) {
        newCategories.push(targetRegion);
      }

      updatedTrek = {
        ...currentTrek,
        category: "Domestic",
        categories: newCategories,
        // If difficulty was a strenuous trekking grade, soften default to leisure / sightseeing
        difficulty:
          currentTrek.difficulty.includes("Difficult") || currentTrek.difficulty.includes("Challenging")
            ? "Leisure / Scenic"
            : currentTrek.difficulty || "Moderate",
        imageAlt: currentTrek.imageAlt || getImageAlt(currentTrek, "domesticTour"),
      };
    } else {
      // targetType === "Trek"
      const chosenCollection = targetCollection || "Himalayas";

      // Clean existing domestic tags
      const filteredCategories = prevCategories.filter(
        (c) =>
          !["Domestic", "Holiday Package", "Road Trip"].includes(c) &&
          c !== "Trek" &&
          c !== chosenCollection
      );

      const newCategories = [chosenCollection, "Trek", ...filteredCategories];
      if (targetRegion && !newCategories.includes(targetRegion)) {
        newCategories.push(targetRegion);
      }

      updatedTrek = {
        ...currentTrek,
        category: chosenCollection,
        categories: newCategories,
        difficulty:
          currentTrek.difficulty.includes("Leisure") || currentTrek.difficulty.includes("Sightseeing")
            ? "Easy to Moderate"
            : currentTrek.difficulty || "Moderate",
        imageAlt: currentTrek.imageAlt || getImageAlt(currentTrek, "trekking"),
      };
    }

    // Persist to store
    store.treks[index] = updatedTrek;
    writeStore(store);

    // Sync to MongoDB
    await syncTreksToMongo(store.treks);

    // If transferToDestinations is requested, also create/sync a destination entry
    if (transferToDestinations) {
      if (!store.destinations) {
        store.destinations = getDefaultDestinations();
      }

      const destId = `dest-${updatedTrek.slug}`;
      const existingDestIndex = store.destinations.findIndex(
        (d) => String(d.id) === destId || d.slug === updatedTrek.slug
      );

      const newDest: DestinationData = {
        id: destId,
        name: updatedTrek.name,
        slug: updatedTrek.slug,
        category: targetType === "Domestic" ? "Domestic" : "Trek",
        tagline: updatedTrek.tagline || `Explore handpicked tours and holidays in ${updatedTrek.name}`,
        image: updatedTrek.image,
        gallery: updatedTrek.gallery || [updatedTrek.image],
        badge: updatedTrek.badge || (targetType === "Domestic" ? "Domestic Tour" : "Alpine Trek"),
        highlights: updatedTrek.highlights || updatedTrek.defaultHighlights || [],
        duration: updatedTrek.duration,
        price: updatedTrek.price,
        originalPrice: updatedTrek.originalPrice,
        pickupDrop: updatedTrek.baseCamp || updatedTrek.location,
        overview: updatedTrek.overview || updatedTrek.description || "",
        itinerary: updatedTrek.itinerary || [],
        inclusions: updatedTrek.inclusions || [],
        exclusions: updatedTrek.exclusions || [],
        faqs: updatedTrek.faqs || [],
        status: updatedTrek.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (existingDestIndex >= 0) {
        store.destinations[existingDestIndex] = newDest;
      } else {
        store.destinations.push(newDest);
      }

      writeStore(store);
      await syncDestinationsToMongo(store.destinations);
    }

    return NextResponse.json({
      success: true,
      message: `Package "${updatedTrek.name}" successfully moved to ${targetType === "Domestic" ? "Domestic Tours" : "Himalayan Treks"}!`,
      trek: updatedTrek,
    });
  } catch (error: any) {
    console.error("Failed to move trek package:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to move trek package" },
      { status: 500 }
    );
  }
}
