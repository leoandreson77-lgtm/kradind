import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readStore, writeStore, TrekData, getTreksAsync, syncTreksToMongo } from "@/lib/cms-store";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const treks = await getTreksAsync();
    return NextResponse.json(treks || [], {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (err) {
    console.error("Error in GET /api/admin/treks:", err);
    const store = readStore();
    return NextResponse.json(store.treks || [], {
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
    const body: Partial<TrekData> = await request.json();
    if (!body.name && !body.slug) {
      return NextResponse.json({ error: "Package name is required" }, { status: 400 });
    }

    const currentTreks = await getTreksAsync();
    const store = readStore();
    store.treks = currentTreks;

    const rawName = (body.name || "Draft Package").trim();
    let slug = (body.slug || "").trim().toLowerCase().replace(/^\/+/, "");
    if (!slug) {
      slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `draft-${Date.now()}`;
    }

    // Ensure slug uniqueness (auto-suffix if exists so draft saves smoothly)
    let finalSlug = slug;
    let counter = 1;
    while (store.treks.some((t) => t.slug === finalSlug)) {
      finalSlug = `${slug}-${Date.now().toString().slice(-4)}${counter > 1 ? `-${counter}` : ""}`;
      counter++;
    }

    const isDomestic =
      (body.category || "").toLowerCase() === "domestic" ||
      (body.categories || []).some((c) => c.toLowerCase() === "domestic" || c.toLowerCase() === "holiday package");

    const newTrek: TrekData = {
      id: Date.now(),
      slug: finalSlug,
      name: body.name || "Draft Package",
      location: body.location || (isDomestic ? "India" : "Uttarakhand"),
      region: body.region || (isDomestic ? "Domestic Circuit" : "Himalayas"),
      image: body.image || (isDomestic
        ? "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80"
        : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"),
      imageAlt: body.imageAlt || "",
      gallery: body.gallery || [body.image || (isDomestic
        ? "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80"
        : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80")],
      tagline: body.tagline || (isDomestic ? "Scenic leisure holidays, sightseeing & private travel" : ""),
      description: body.description || "",
      overview: body.overview || "",
      highlights: body.highlights || [],
      duration: body.duration || (isDomestic ? "5 Nights / 6 Days" : "5 Days"),
      difficulty: (body.difficulty as any) || (isDomestic ? "Leisure / Scenic" : "Moderate"),
      altitude: body.altitude || (isDomestic ? "Sightseeing" : "12,000 Ft"),
      distance: body.distance || (isDomestic ? "Sightseeing Circuit" : "20 km"),
      baseCamp: body.baseCamp || (isDomestic ? "Airport / Railway Station" : "Base Camp"),
      rating: body.rating || 4.9,
      reviewCount: body.reviewCount || 1,
      price: Number(body.price) || (isDomestic ? 18999 : 8999),
      originalPrice: Number(body.originalPrice) || (isDomestic ? 22999 : 10999),
      badge: body.badge || (isDomestic ? "Domestic Holiday" : "Featured"),
      category: isDomestic ? "Domestic" : (body.category || body.categories?.[0] || "Himalayas"),
      categories: isDomestic
        ? ["Domestic", "Holiday Package", ...Array.from(new Set((body.categories || []).filter(c => !["trek", "treks", "summit", "high pass", "himalayas", "himalayan", "alpine", "expedition"].includes(c.toLowerCase().trim()))))]
        : (body.categories || ["Himalayas"]),
      status: body.status || "Published",
      batches: body.batches || [
        { id: Date.now() + 1, startDate: "Jun 14", endDate: "Jun 18, 2026", slotsLeft: 12, price: Number(body.price) || 8999 },
      ],
      itinerary: body.itinerary || [
        { day: 1, title: "Arrival & Base Camp", description: "Team assembly and gear briefing.", altitude: "6,000 Ft" },
      ],
      inclusions: body.inclusions || [],
      exclusions: body.exclusions || [],
      faqs: body.faqs || [],
      metaTitle: body.metaTitle || "",
      metaDescription: body.metaDescription || "",
      metaKeywords: body.metaKeywords || "",
      primaryKeyword: body.primaryKeyword || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.treks.unshift(newTrek);
    writeStore(store);

    // Sync to MongoDB
    await syncTreksToMongo(store.treks);

    // Instant Cache Invalidation across all front-facing pages
    try {
      revalidatePath("/");
      revalidatePath("/treks");
      revalidatePath("/domestic-trips");
      revalidatePath("/international-trips");
      revalidatePath("/destinations");
      revalidatePath(`/treks/${newTrek.slug}`);
      revalidatePath("/", "layout");
    } catch (revErr) {
      console.warn("revalidatePath warning:", revErr);
    }

    return NextResponse.json(newTrek, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create trek:", error);
    return NextResponse.json({ error: error?.message || "Failed to create trek" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body: TrekData = await request.json();
    const currentTreks = await getTreksAsync();
    const store = readStore();
    store.treks = currentTreks;

    const index = store.treks.findIndex((t) => String(t.id) === String(body.id));

    if (index === -1) {
      return NextResponse.json({ error: "Trek not found" }, { status: 404 });
    }

    store.treks[index] = {
      ...store.treks[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    writeStore(store);

    // Sync to MongoDB
    await syncTreksToMongo(store.treks);

    // Instant Cache Invalidation across all front-facing pages
    try {
      revalidatePath("/");
      revalidatePath("/treks");
      revalidatePath("/domestic-trips");
      revalidatePath("/international-trips");
      revalidatePath("/destinations");
      revalidatePath(`/treks/${store.treks[index].slug}`);
      revalidatePath("/", "layout");
    } catch (revErr) {
      console.warn("revalidatePath warning:", revErr);
    }

    return NextResponse.json(store.treks[index]);
  } catch (error: any) {
    console.error("Failed to update trek:", error);
    return NextResponse.json({ error: error?.message || "Failed to update trek" }, { status: 500 });
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
      return NextResponse.json({ error: "Missing trek id" }, { status: 400 });
    }

    const currentTreks = await getTreksAsync();
    const store = readStore();
    store.treks = currentTreks;

    const trekToDelete = store.treks.find((t) => String(t.id) === String(id));
    if (!trekToDelete) {
      return NextResponse.json({ error: "Trek not found" }, { status: 404 });
    }

    store.treks = store.treks.filter((t) => String(t.id) !== String(id));

    writeStore(store);

    // Sync to MongoDB
    await syncTreksToMongo(store.treks);

    // Instant Cache Invalidation
    try {
      if (trekToDelete.slug) {
        revalidatePath(`/treks/${trekToDelete.slug}`);
        revalidatePath(`/domestic/${trekToDelete.slug}`);
        revalidatePath(`/international/${trekToDelete.slug}`);
      }
      revalidatePath("/");
      revalidatePath("/treks");
      revalidatePath("/domestic-trips");
      revalidatePath("/international-trips");
      revalidatePath("/destinations");
      revalidatePath("/", "layout");
    } catch (revErr) {
      console.warn("revalidatePath warning:", revErr);
    }

    return NextResponse.json({ success: true, message: "Trek deleted successfully" });
  } catch (error: any) {
    console.error("Failed to delete trek:", error);
    return NextResponse.json({ error: error?.message || "Failed to delete trek" }, { status: 500 });
  }
}
