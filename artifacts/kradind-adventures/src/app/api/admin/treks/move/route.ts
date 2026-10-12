import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
  targetType: "Domestic" | "International" | "Fixed" | "Trek";
  targetRegion?: string;
  targetCollection?: string;
  transferToDestinations?: boolean;
}

/**
 * POST /api/admin/treks/move
 * Moves or converts a package between the 4 sections: Domestic, International, Fixed Departure, and Trek.
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
        { error: "Trek ID and targetType ('Domestic' | 'International' | 'Fixed' | 'Trek') are required" },
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
      // Clean ALL trek-specific, international and fixed tags
      const conflictingKeywords = ["trek", "treks", "summit", "high pass", "expedition", "himalayas", "himalayan", "alpine", "international", "fixed departure"];
      const filteredCategories = prevCategories.filter(
        (c) =>
          !conflictingKeywords.includes(c.toLowerCase().trim()) &&
          c.toLowerCase().trim() !== "domestic" &&
          c.toLowerCase().trim() !== "holiday package"
      );

      const newCategories = ["Domestic", "Holiday Package", ...filteredCategories];
      if (targetRegion && !newCategories.some((c) => c.toLowerCase() === targetRegion.toLowerCase())) {
        newCategories.push(targetRegion);
      }

      updatedTrek = {
        ...currentTrek,
        category: "Domestic",
        categories: newCategories,
        difficulty:
          currentTrek.difficulty.includes("Difficult") || currentTrek.difficulty.includes("Challenging")
            ? "Leisure / Scenic"
            : currentTrek.difficulty || "Moderate",
        imageAlt: currentTrek.imageAlt || getImageAlt(currentTrek, "domesticTour"),
      };
    } else if (targetType === "International") {
      const conflictingKeywords = ["domestic", "himalayas", "himalayan", "summit", "high pass", "expedition", "alpine"];
      const filteredCategories = prevCategories.filter(
        (c) =>
          !conflictingKeywords.includes(c.toLowerCase().trim()) &&
          c.toLowerCase().trim() !== "international"
      );

      const newCategories = ["International", "Holiday Package", ...filteredCategories];
      if (targetRegion && !newCategories.some((c) => c.toLowerCase() === targetRegion.toLowerCase())) {
        newCategories.push(targetRegion);
      }

      updatedTrek = {
        ...currentTrek,
        category: "International",
        categories: newCategories,
        difficulty:
          currentTrek.difficulty.includes("Difficult") || currentTrek.difficulty.includes("Challenging")
            ? "Leisure / Global"
            : currentTrek.difficulty || "Moderate",
        imageAlt: currentTrek.imageAlt || getImageAlt(currentTrek, "domesticTour"),
      };
    } else if (targetType === "Fixed") {
      const conflictingKeywords = ["international"];
      const filteredCategories = prevCategories.filter(
        (c) =>
          !conflictingKeywords.includes(c.toLowerCase().trim()) &&
          c.toLowerCase().trim() !== "fixed departure"
      );

      const newCategories = ["Fixed Departure", ...filteredCategories];
      if (targetRegion && !newCategories.some((c) => c.toLowerCase() === targetRegion.toLowerCase())) {
        newCategories.push(targetRegion);
      }

      updatedTrek = {
        ...currentTrek,
        category: "Fixed Departure",
        categories: newCategories,
        imageAlt: currentTrek.imageAlt || getImageAlt(currentTrek, "trekking"),
      };
    } else {
      // targetType === "Trek"
      const chosenCollection = targetCollection || "Himalayas";

      const conflictingKeywords = ["domestic", "holiday package", "road trip", "domestic tour", "domestic tours", "international"];
      const filteredCategories = prevCategories.filter(
        (c) =>
          !conflictingKeywords.includes(c.toLowerCase().trim()) &&
          c.toLowerCase().trim() !== "trek" &&
          c.toLowerCase().trim() !== chosenCollection.toLowerCase()
      );

      const newCategories = [chosenCollection, "Trek", ...filteredCategories];
      if (targetRegion && !newCategories.some((c) => c.toLowerCase() === targetRegion.toLowerCase())) {
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

    try {
      revalidatePath("/");
      revalidatePath("/treks");
      revalidatePath("/domestic-trips");
      revalidatePath("/international-trips");
      revalidatePath("/destinations");
      revalidatePath(`/treks/${updatedTrek.slug}`);
      revalidatePath("/", "layout");
    } catch {}

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
