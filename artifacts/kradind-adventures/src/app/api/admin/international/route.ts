import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  readStore,
  writeStore,
  DestinationData,
  getDestinationsAsync,
  syncDestinationsToMongo,
  getDefaultDestinations,
} from "@/lib/cms-store";
import { getAdminSession } from "@/lib/admin-auth";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET: List all international tour packages & destinations
 */
export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const all = await getDestinationsAsync();
    const internationalOnly = (all || getDefaultDestinations()).filter(
      (d) => d.category?.toLowerCase() === "international"
    );

    return NextResponse.json(internationalOnly, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (err) {
    console.error("Error in GET /api/admin/international:", err);
    const store = readStore();
    const fallback = (store.destinations || getDefaultDestinations()).filter(
      (d) => d.category?.toLowerCase() === "international"
    );
    return NextResponse.json(fallback, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  }
}

/**
 * POST: Create a new international tour package
 */
export async function POST(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: "Tour or Country name is required" }, { status: 400 });
    }

    const rawSlug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const slug = rawSlug.trim().replace(/^-+|-+$/g, "");

    const store = readStore();
    if (!store.destinations) {
      store.destinations = getDefaultDestinations();
    }

    const existing = store.destinations.find(
      (d) => d.slug.toLowerCase() === slug.toLowerCase()
    );

    if (existing) {
      return NextResponse.json(
        { error: `An international tour with slug "${slug}" already exists.` },
        { status: 400 }
      );
    }

    const newDest: DestinationData = {
      id: `intl-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      name: body.name.trim(),
      slug,
      category: "International", // Strictly international
      tagline: body.tagline?.trim() || `Explore customized international holidays in ${body.name}.`,
      image: body.image || "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      badge: body.badge || "International Special",
      highlights: Array.isArray(body.highlights)
        ? body.highlights
        : (body.highlights || "").split(",").map((h: string) => h.trim()).filter(Boolean),
      color: body.color || "from-blue-900/80",
      icon: body.icon || "✈️",
      status: body.status === "Published" ? "Published" : "Draft",
      version: 1,
      versionHistory: Array.isArray(body.versionHistory) && body.versionHistory.length > 0
        ? body.versionHistory
        : [
            {
              version: 1,
              timestamp: new Date().toISOString(),
              author: session.user?.name || "Admin Agent",
              note: `Initial ${body.status === "Published" ? "Published" : "Draft"} Snapshot`,
              destinationSnapshot: {
                name: body.name.trim(),
                price: body.price ? Number(body.price) : 39999,
                duration: body.duration || "5 Nights / 6 Days",
                status: body.status === "Published" ? "Published" : "Draft",
                itinerary: body.itinerary || [],
                highlights: body.highlights || [],
              },
            },
          ],
      duration: body.duration || "5 Nights / 6 Days",
      price: body.price ? Number(body.price) : 39999,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : 49999,
      bestSeason: body.bestSeason || "Year-Round",
      pickupDrop: body.pickupDrop || "Designated International Airport",
      suitableFor: body.suitableFor || "Couples, Families & Groups",
      overview: body.overview || "",
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      itinerary: Array.isArray(body.itinerary)
        ? body.itinerary.map((day: any, idx: number) => ({
            day: idx + 1,
            title: day.title || `Day ${idx + 1}`,
            description: day.description || "",
            distance: day.distance || "",
            duration: day.duration || "",
            altitude: day.altitude || "",
            meal: day.meal || "Breakfast included",
            stay: day.stay || "Verified 4-Star Hotel",
            activities: day.activities || "",
          }))
        : [],
      inclusions: Array.isArray(body.inclusions) ? body.inclusions : [],
      exclusions: Array.isArray(body.exclusions) ? body.exclusions : [],
      faqs: Array.isArray(body.faqs) ? body.faqs : [],
      travelTips: Array.isArray(body.travelTips) ? body.travelTips : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.destinations.unshift(newDest);
    writeStore(store);

    await syncDestinationsToMongo(store.destinations);

    try {
      revalidatePath("/");
      revalidatePath("/international-trips");
      revalidatePath("/destinations");
      revalidatePath(`/destinations/${newDest.slug}`);
      revalidatePath(`/international-trips/${newDest.slug}`);
      revalidatePath("/", "layout");
    } catch {}

    return NextResponse.json({ success: true, destination: newDest }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating international tour:", err);
    return NextResponse.json({ error: err.message || "Failed to create international package" }, { status: 500 });
  }
}

/**
 * PUT: Update an existing international tour package
 */
export async function PUT(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.id && !body.slug) {
      return NextResponse.json({ error: "Missing package ID or slug" }, { status: 400 });
    }

    const store = readStore();
    if (!store.destinations) {
      store.destinations = getDefaultDestinations();
    }

    const index = store.destinations.findIndex(
      (d) =>
        (body.id && String(d.id) === String(body.id)) ||
        (body.slug && d.slug.toLowerCase() === body.slug.toLowerCase())
    );

    if (index === -1) {
      return NextResponse.json({ error: "International package not found" }, { status: 404 });
    }

    const existing = store.destinations[index];
    const rawSlug = body.slug || existing.slug;
    const slug = rawSlug.toLowerCase().trim().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");

    const currentVer = existing.version || 1;
    const nextVer = (body.versionHistory && body.versionHistory.length > (existing.versionHistory?.length || 0))
      ? (body.version || currentVer + 1)
      : currentVer + 1;
    const now = new Date().toISOString();

    const existingHistory = Array.isArray(existing.versionHistory) ? existing.versionHistory : [];
    const newSnapshot = {
      version: currentVer,
      timestamp: existing.updatedAt || now,
      author: session.user?.name || "Admin Agent",
      note: body.status === "Draft" ? `Draft snapshot v${currentVer}` : `Published snapshot v${currentVer}`,
      destinationSnapshot: {
        name: existing.name,
        price: existing.price,
        duration: existing.duration,
        status: existing.status,
        itinerary: existing.itinerary,
        highlights: existing.highlights,
        inclusions: existing.inclusions,
        exclusions: existing.exclusions,
      },
    };

    const updated: DestinationData = {
      ...existing,
      status: body.status || existing.status || "Draft",
      version: nextVer,
      versionHistory: body.versionHistory && body.versionHistory.length > existingHistory.length
        ? body.versionHistory
        : [newSnapshot, ...existingHistory].slice(0, 25),
      name: body.name !== undefined ? body.name.trim() : existing.name,
      slug,
      category: "International",
      tagline: body.tagline !== undefined ? body.tagline.trim() : existing.tagline,
      duration: body.duration !== undefined ? body.duration : existing.duration,
      price: body.price !== undefined ? Number(body.price) : existing.price,
      originalPrice: body.originalPrice !== undefined ? Number(body.originalPrice) : existing.originalPrice,
      bestSeason: body.bestSeason !== undefined ? body.bestSeason : existing.bestSeason,
      pickupDrop: body.pickupDrop !== undefined ? body.pickupDrop : existing.pickupDrop,
      suitableFor: body.suitableFor !== undefined ? body.suitableFor : existing.suitableFor,
      image: body.image !== undefined ? body.image : existing.image,
      gallery: Array.isArray(body.gallery) ? body.gallery : existing.gallery || [],
      badge: body.badge !== undefined ? body.badge : existing.badge,
      highlights: Array.isArray(body.highlights)
        ? body.highlights
        : body.highlights !== undefined
        ? String(body.highlights).split(",").map((h) => h.trim()).filter(Boolean)
        : existing.highlights || [],
      color: body.color !== undefined ? body.color : existing.color,
      icon: body.icon !== undefined ? body.icon : existing.icon,
      overview: body.overview !== undefined ? body.overview : existing.overview,
      itinerary: Array.isArray(body.itinerary)
        ? body.itinerary.map((day: any, idx: number) => ({
            day: idx + 1,
            title: day.title || `Day ${idx + 1}`,
            description: day.description || "",
            distance: day.distance || "",
            duration: day.duration || "",
            altitude: day.altitude || "",
            meal: day.meal || "",
            stay: day.stay || "",
            activities: day.activities || "",
          }))
        : existing.itinerary || [],
      inclusions: Array.isArray(body.inclusions) ? body.inclusions : existing.inclusions || [],
      exclusions: Array.isArray(body.exclusions) ? body.exclusions : existing.exclusions || [],
      faqs: Array.isArray(body.faqs) ? body.faqs : existing.faqs || [],
      travelTips: Array.isArray(body.travelTips) ? body.travelTips : existing.travelTips || [],
      updatedAt: new Date().toISOString(),
    };

    store.destinations[index] = updated;
    writeStore(store);

    await syncDestinationsToMongo(store.destinations);

    try {
      revalidatePath("/");
      revalidatePath("/international-trips");
      revalidatePath("/destinations");
      revalidatePath(`/destinations/${updated.slug}`);
      revalidatePath(`/international-trips/${updated.slug}`);
      revalidatePath("/", "layout");
    } catch {}

    return NextResponse.json({ success: true, destination: updated });
  } catch (err: any) {
    console.error("Error updating international package:", err);
    return NextResponse.json({ error: err.message || "Failed to update package" }, { status: 500 });
  }
}

/**
 * DELETE: Remove or recycle an international tour package
 */
export async function DELETE(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const emptyRecycleBin = searchParams.get("emptyRecycleBin") === "true";
    const permanent = searchParams.get("permanent") === "true";
    const restore = searchParams.get("restore") === "true";

    const store = readStore();
    if (!store.destinations) {
      store.destinations = getDefaultDestinations();
    }

    // Operation 1: Empty entire Recycle Bin for international packages
    if (emptyRecycleBin) {
      const beforeCount = store.destinations.length;
      store.destinations = store.destinations.filter(
        (d: any) =>
          !(d.category?.toLowerCase() === "international" && (d.isDeleted || d.status === "Trash"))
      );
      const removedCount = beforeCount - store.destinations.length;
      writeStore(store);
      await syncDestinationsToMongo(store.destinations);
      return NextResponse.json({
        success: true,
        message: `Recycle Bin emptied (${removedCount} international tours purged permanently)`,
      });
    }

    if (!id && !slug) {
      return NextResponse.json({ error: "Missing id or slug parameter" }, { status: 400 });
    }

    const index = store.destinations.findIndex(
      (d) =>
        (id && String(d.id) === String(id)) ||
        (slug && d.slug.toLowerCase() === slug.toLowerCase())
    );

    if (index === -1) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const dest = store.destinations[index];

    // Operation 2: Restore from Recycle Bin
    if (restore) {
      (dest as any).isDeleted = false;
      (dest as any).deletedAt = undefined;
      dest.status = "Draft";
      writeStore(store);
      await syncDestinationsToMongo(store.destinations);
      return NextResponse.json({
        success: true,
        message: `"${dest.name}" restored successfully as Draft!`,
      });
    }

    // Operation 3: Permanent Delete
    if (permanent) {
      store.destinations = store.destinations.filter(
        (d) =>
          !(
            (id && String(d.id) === String(id)) ||
            (slug && d.slug.toLowerCase() === slug.toLowerCase())
          )
      );
      writeStore(store);
      await syncDestinationsToMongo(store.destinations);
      return NextResponse.json({
        success: true,
        message: `"${dest.name}" permanently deleted from database.`,
      });
    }

    // Operation 4: Soft Delete (Move to Recycle Bin)
    (dest as any).isDeleted = true;
    (dest as any).deletedAt = new Date().toISOString();
    dest.status = "Trash";

    writeStore(store);
    await syncDestinationsToMongo(store.destinations);

    try {
      revalidatePath("/");
      revalidatePath("/international-trips");
      revalidatePath("/destinations");
      revalidatePath("/", "layout");
    } catch {}

    return NextResponse.json({
      success: true,
      message: `"${dest.name}" moved to Recycle Bin. You can restore it anytime.`,
    });
  } catch (err: any) {
    console.error("Error deleting international package:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete package" },
      { status: 500 }
    );
  }
}
