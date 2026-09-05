import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore, LandingPageData } from "@/lib/cms-store";
import crypto from "crypto";

export async function GET() {
  try {
    const store = readStore();
    return NextResponse.json(store.landingPages || []);
  } catch (error) {
    console.error("Error fetching admin landing pages:", error);
    return NextResponse.json({ error: "Failed to fetch landing pages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const store = readStore();
    const existing = (store.landingPages || []).find(
      (p) => p.slug.toLowerCase() === body.slug.toLowerCase()
    );

    if (existing) {
      return NextResponse.json({ error: "A landing page with this slug already exists" }, { status: 400 });
    }

    const newPage: LandingPageData = {
      id: `lp-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      slug: body.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-"),
      title: body.title,
      subtitle: body.subtitle || "",
      badge: body.badge || "EXCLUSIVE EXPEDITION",
      heroImage: body.heroImage || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85",
      promoOffer: body.promoOffer || {
        tag: "LIMITED PROMO",
        discountText: "Early Bird Discount",
        code: "ADVENTURE2026",
      },
      highlights: body.highlights || [],
      featuredTrekSlugs: body.featuredTrekSlugs || [],
      inclusions: body.inclusions || [],
      exclusions: body.exclusions || [],
      leadFormConfig: body.leadFormConfig || {
        title: "Get Custom Itinerary & Free Quote",
        subtitle: "Leave your contact details to receive full expedition dossier.",
        ctaText: "Enquire Now",
      },
      whatsappNumber: body.whatsappNumber || "917500222141",
      whatsappMessage: body.whatsappMessage || `Hi KRADIND! I'm interested in the ${body.title} expedition.`,
      faqs: body.faqs || [],
      testimonials: body.testimonials || [],
      status: body.status || "Published",
      sectionsEnabled: body.sectionsEnabled || {
        hero: true,
        countdown: true,
        highlights: true,
        treks: true,
        inclusions: true,
        leadForm: true,
        testimonials: true,
        faqs: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!store.landingPages) store.landingPages = [];
    store.landingPages.unshift(newPage);
    writeStore(store);

    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    console.error("Error creating landing page:", error);
    return NextResponse.json({ error: "Failed to create landing page" }, { status: 500 });
  }
}
