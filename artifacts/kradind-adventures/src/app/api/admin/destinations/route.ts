import { NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const destinations = await getDestinationsAsync();
    return NextResponse.json(destinations || getDefaultDestinations(), {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (err) {
    console.error("Error in GET /api/admin/destinations:", err);
    const store = readStore();
    return NextResponse.json(store.destinations || getDefaultDestinations(), {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: "Destination name is required" }, { status: 400 });
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
        { error: `A destination with slug "${slug}" already exists.` },
        { status: 400 }
      );
    }

    const newDest: DestinationData = {
      id: `dest-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      name: body.name.trim(),
      slug,
      category: body.category || "Domestic",
      tagline: body.tagline?.trim() || `Explore handpicked tours and holidays in ${body.name}.`,
      image: body.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      badge: body.badge || "Featured",
      highlights: Array.isArray(body.highlights)
        ? body.highlights
        : (body.highlights || "").split(",").map((h: string) => h.trim()).filter(Boolean),
      color: body.color || "from-emerald-900/80",
      icon: body.icon || "📍",
      status: body.status === "Draft" ? "Draft" : "Published",
      duration: body.duration || "",
      price: body.price ? Number(body.price) : undefined,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      bestSeason: body.bestSeason || "",
      pickupDrop: body.pickupDrop || "",
      suitableFor: body.suitableFor || "",
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
            meal: day.meal || "",
            stay: day.stay || "",
            activities: day.activities || "",
          }))
        : [],
      inclusions: Array.isArray(body.inclusions)
        ? body.inclusions
        : (body.inclusions || "").split("\n").map((s: string) => s.trim()).filter(Boolean),
      exclusions: Array.isArray(body.exclusions)
        ? body.exclusions
        : (body.exclusions || "").split("\n").map((s: string) => s.trim()).filter(Boolean),
      travelTips: Array.isArray(body.travelTips)
        ? body.travelTips
        : (body.travelTips || "").split("\n").map((s: string) => s.trim()).filter(Boolean),
      faqs: Array.isArray(body.faqs)
        ? body.faqs.map((f: any) => ({ question: f.question || "", answer: f.answer || "" }))
        : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.destinations.unshift(newDest);
    writeStore(store);

    await syncDestinationsToMongo(store.destinations);

    return NextResponse.json(newDest, { status: 201 });
  } catch (error: any) {
    console.error("Failed to add destination:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to add destination" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body: DestinationData = await request.json();
    if (!body.id || !body.name) {
      return NextResponse.json({ error: "Destination ID and name are required" }, { status: 400 });
    }

    const store = readStore();
    if (!store.destinations) {
      store.destinations = getDefaultDestinations();
    }

    const index = store.destinations.findIndex(
      (d) => String(d.id) === String(body.id) || d.slug === body.slug
    );

    if (index === -1) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }

    const rawSlug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const slug = rawSlug.trim().replace(/^-+|-+$/g, "");

    const duplicateSlug = store.destinations.find(
      (d, i) => i !== index && d.slug.toLowerCase() === slug.toLowerCase()
    );

    if (duplicateSlug) {
      return NextResponse.json(
        { error: `Another destination already uses slug "${slug}".` },
        { status: 400 }
      );
    }

    const updated: DestinationData = {
      ...store.destinations[index],
      ...body,
      name: body.name.trim(),
      slug,
      tagline: body.tagline?.trim() || store.destinations[index].tagline,
      duration: body.duration !== undefined ? body.duration : store.destinations[index].duration,
      price: body.price !== undefined ? (body.price ? Number(body.price) : undefined) : store.destinations[index].price,
      originalPrice: body.originalPrice !== undefined ? (body.originalPrice ? Number(body.originalPrice) : undefined) : store.destinations[index].originalPrice,
      bestSeason: body.bestSeason !== undefined ? body.bestSeason : store.destinations[index].bestSeason,
      pickupDrop: body.pickupDrop !== undefined ? body.pickupDrop : store.destinations[index].pickupDrop,
      suitableFor: body.suitableFor !== undefined ? body.suitableFor : store.destinations[index].suitableFor,
      overview: body.overview !== undefined ? body.overview : store.destinations[index].overview,
      gallery: Array.isArray(body.gallery) ? body.gallery : store.destinations[index].gallery || [],
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
        : store.destinations[index].itinerary || [],
      inclusions: Array.isArray(body.inclusions)
        ? body.inclusions
        : typeof body.inclusions === "string"
        ? (body.inclusions as string).split("\n").map((s) => s.trim()).filter(Boolean)
        : store.destinations[index].inclusions || [],
      exclusions: Array.isArray(body.exclusions)
        ? body.exclusions
        : typeof body.exclusions === "string"
        ? (body.exclusions as string).split("\n").map((s) => s.trim()).filter(Boolean)
        : store.destinations[index].exclusions || [],
      travelTips: Array.isArray(body.travelTips)
        ? body.travelTips
        : typeof body.travelTips === "string"
        ? (body.travelTips as string).split("\n").map((s) => s.trim()).filter(Boolean)
        : store.destinations[index].travelTips || [],
      faqs: Array.isArray(body.faqs)
        ? body.faqs.map((f: any) => ({ question: f.question || "", answer: f.answer || "" }))
        : store.destinations[index].faqs || [],
      highlights: Array.isArray(body.highlights)
        ? body.highlights
        : typeof body.highlights === "string"
        ? (body.highlights as string).split(",").map((h: string) => h.trim()).filter(Boolean)
        : store.destinations[index].highlights,
      updatedAt: new Date().toISOString(),
    };

    store.destinations[index] = updated;
    writeStore(store);

    await syncDestinationsToMongo(store.destinations);

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Failed to update destination:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update destination" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing destination id" }, { status: 400 });
    }

    const store = readStore();
    if (!store.destinations) {
      store.destinations = getDefaultDestinations();
    }

    const initialLength = store.destinations.length;
    store.destinations = store.destinations.filter(
      (d) => String(d.id) !== String(id) && d.slug !== id
    );

    if (store.destinations.length === initialLength) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }

    writeStore(store);

    await syncDestinationsToMongo(store.destinations);

    return NextResponse.json({ success: true, message: "Destination deleted" });
  } catch (error: any) {
    console.error("Failed to delete destination:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete destination" },
      { status: 500 }
    );
  }
}
