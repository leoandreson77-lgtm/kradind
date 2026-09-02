import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore, TrekData } from "@/lib/cms-store";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const store = readStore();
  return NextResponse.json(store.treks);
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body: Partial<TrekData> = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "Trek name and slug are required" }, { status: 400 });
    }

    const store = readStore();

    // Check slug uniqueness
    if (store.treks.some((t) => t.slug === body.slug)) {
      return NextResponse.json({ error: "A trek with this slug already exists" }, { status: 400 });
    }

    const newTrek: TrekData = {
      id: Date.now(),
      slug: body.slug,
      name: body.name,
      location: body.location || "Uttarakhand",
      region: body.region || "Himalayas",
      image: body.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
      gallery: body.gallery || [body.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"],
      tagline: body.tagline || "",
      description: body.description || "",
      duration: body.duration || "5 Days",
      difficulty: (body.difficulty as "Easy" | "Moderate" | "Challenging") || "Moderate",
      altitude: body.altitude || "12,000 Ft",
      distance: body.distance || "20 km",
      baseCamp: body.baseCamp || "Base Camp",
      rating: body.rating || 4.9,
      reviewCount: body.reviewCount || 1,
      price: Number(body.price) || 8999,
      originalPrice: Number(body.originalPrice) || 10999,
      badge: body.badge || "Featured",
      categories: body.categories || ["Himalayas"],
      status: body.status || "Published",
      batches: body.batches || [
        { id: Date.now() + 1, startDate: "Jun 14", endDate: "Jun 18, 2026", slotsLeft: 12, price: Number(body.price) || 8999 },
      ],
      itinerary: body.itinerary || [
        { day: 1, title: "Arrival & Base Camp", description: "Team assembly and gear briefing.", altitude: "6,000 Ft" },
      ],
    };

    store.treks.unshift(newTrek);
    writeStore(store);

    return NextResponse.json(newTrek, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create trek" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body: TrekData = await request.json();
    const store = readStore();
    const index = store.treks.findIndex((t) => String(t.id) === String(body.id));

    if (index === -1) {
      return NextResponse.json({ error: "Trek not found" }, { status: 404 });
    }

    store.treks[index] = { ...store.treks[index], ...body };
    writeStore(store);

    return NextResponse.json(store.treks[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update trek" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing trek id" }, { status: 400 });
  }

  const store = readStore();
  const initialLength = store.treks.length;
  store.treks = store.treks.filter((t) => String(t.id) !== String(id));

  if (store.treks.length === initialLength) {
    return NextResponse.json({ error: "Trek not found" }, { status: 404 });
  }

  writeStore(store);
  return NextResponse.json({ success: true, message: "Trek deleted successfully" });
}
