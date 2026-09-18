import { NextRequest, NextResponse } from "next/server";
import {
  readStore,
  writeStore,
  HomeSectionsConfig,
  getHomeSectionsAsync,
  syncHomeSectionsToMongo,
} from "@/lib/cms-store";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const sections = await getHomeSectionsAsync();
    return NextResponse.json(sections, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (err) {
    console.error("Error fetching home sections:", err);
    const store = readStore();
    return NextResponse.json(store.homeSections, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body: Partial<HomeSectionsConfig> = await request.json();
    const currentSections = await getHomeSectionsAsync();

    const updatedSections: HomeSectionsConfig = {
      hero: {
        badge: body.hero?.badge ?? currentSections?.hero?.badge ?? "Certified Himalayan Guides • Small Safe Batches",
        title: body.hero?.title ?? currentSections?.hero?.title ?? "Experience the Himalayas",
        subtitle: body.hero?.subtitle ?? currentSections?.hero?.subtitle ?? "",
        bgImage: body.hero?.bgImage ?? currentSections?.hero?.bgImage ?? "",
        imageAlt: body.hero?.imageAlt ?? currentSections?.hero?.imageAlt ?? "",
        searchPlaceholder: body.hero?.searchPlaceholder ?? currentSections?.hero?.searchPlaceholder ?? "Search by trek name, state, pass or elevation...",
        popularTags: body.hero?.popularTags ?? currentSections?.hero?.popularTags ?? ["Kedarkantha", "Chopta Tungnath", "Hampta Pass"],
      },
      monsoon: {
        enabled: body.monsoon?.enabled ?? currentSections?.monsoon?.enabled ?? true,
        title: body.monsoon?.title ?? currentSections?.monsoon?.title ?? "Monsoon Specials & Valley Blooms",
        subtitle: body.monsoon?.subtitle ?? currentSections?.monsoon?.subtitle ?? "",
        promoCode: (body.monsoon?.promoCode ?? currentSections?.monsoon?.promoCode ?? "MONSOON2026").toUpperCase(),
        discountPercent: Number(body.monsoon?.discountPercent ?? currentSections?.monsoon?.discountPercent ?? 15),
        badge: body.monsoon?.badge ?? currentSections?.monsoon?.badge ?? "Limited Season Offer",
      },
      topBar: {
        supportPhone: body.topBar?.supportPhone ?? currentSections?.topBar?.supportPhone ?? "+91 75002 22141",
        leaveNoTrace: body.topBar?.leaveNoTrace ?? currentSections?.topBar?.leaveNoTrace ?? "🌱 Leave No Trace Certified Operator",
        whatsappNumber: body.topBar?.whatsappNumber ?? currentSections?.topBar?.whatsappNumber ?? "+91 75002 22141",
        announcementText: body.topBar?.announcementText ?? currentSections?.topBar?.announcementText ?? "",
        announcementLink: body.topBar?.announcementLink ?? currentSections?.topBar?.announcementLink ?? "/treks",
      },
      bestTreks: {
        badge: body.bestTreks?.badge ?? currentSections?.bestTreks?.badge ?? "4.9+ Rated Flagship Expeditions",
        title: body.bestTreks?.title ?? currentSections?.bestTreks?.title ?? "Top Himalayan Treks & High Passes",
        subtitle: body.bestTreks?.subtitle ?? currentSections?.bestTreks?.subtitle ?? "Highest rated high-altitude alpine routes led by NIM-certified leaders.",
        featuredSlugs: body.bestTreks?.featuredSlugs ?? currentSections?.bestTreks?.featuredSlugs ?? [
          "chopta-tungnath-chandrashila",
          "hampta-pass",
          "kheerganga-trek",
          "leh-ladakh-tour-package",
        ],
      },
      weekendTreks: {
        badge: body.weekendTreks?.badge ?? currentSections?.weekendTreks?.badge ?? "Zero Work Leave Needed",
        title: body.weekendTreks?.title ?? currentSections?.weekendTreks?.title ?? "Weekend Escapes & Short Breaks",
        subtitle: body.weekendTreks?.subtitle ?? currentSections?.weekendTreks?.subtitle ?? "Quick Himalayan recharges designed to fit comfortably into Friday to Sunday departures.",
        featuredSlugs: body.weekendTreks?.featuredSlugs ?? currentSections?.weekendTreks?.featuredSlugs ?? [
          "chopta-tungnath-chandrashila",
          "kheerganga-trek",
          "nainital-tour-package",
          "jaipur-tour-package",
        ],
      },
      eeat: {
        badge: body.eeat?.badge ?? currentSections?.eeat?.badge ?? "Expedition Authority & Curation",
        title: body.eeat?.title ?? currentSections?.eeat?.title ?? "Curated by KRADIND Expedition Team",
        role: body.eeat?.role ?? currentSections?.eeat?.role ?? "Chief Expedition Directorate • Nehru Institute of Mountaineering (NIM) Certified Leaders • WFA Certified",
        description: body.eeat?.description ?? currentSections?.eeat?.description ?? "",
        lastReviewed: body.eeat?.lastReviewed ?? currentSections?.eeat?.lastReviewed ?? "14 September 2026",
        policyLinkText: body.eeat?.policyLinkText ?? currentSections?.eeat?.policyLinkText ?? "Read Our Editorial & Safety Policy",
        policyLinkUrl: body.eeat?.policyLinkUrl ?? currentSections?.eeat?.policyLinkUrl ?? "/editorial-policy",
        auditBadgeText: body.eeat?.auditBadgeText ?? currentSections?.eeat?.auditBadgeText ?? "Fact-Checked & NIM/HMI Audited",
        trustCards: body.eeat?.trustCards ?? currentSections?.eeat?.trustCards ?? [],
        faqs: body.eeat?.faqs ?? currentSections?.eeat?.faqs ?? [],
      },
      contactAndFooter: {
        supportEmail: body.contactAndFooter?.supportEmail ?? currentSections?.contactAndFooter?.supportEmail ?? "support@kradind.com",
        supportPhone: body.contactAndFooter?.supportPhone ?? currentSections?.contactAndFooter?.supportPhone ?? "+91 75002 22141",
        whatsappLink: body.contactAndFooter?.whatsappLink ?? currentSections?.contactAndFooter?.whatsappLink ?? "https://wa.link/n3u8c0",
        address: body.contactAndFooter?.address ?? currentSections?.contactAndFooter?.address ?? "Rajpur Road, Jakhan, Dehradun, Uttarakhand – 248001, India",
        officeHours: body.contactAndFooter?.officeHours ?? currentSections?.contactAndFooter?.officeHours ?? "Open 24/7 for Expedition & Ground Support",
        instagramUrl: body.contactAndFooter?.instagramUrl ?? currentSections?.contactAndFooter?.instagramUrl ?? "https://www.instagram.com/kradglobal/",
        facebookUrl: body.contactAndFooter?.facebookUrl ?? currentSections?.contactAndFooter?.facebookUrl ?? "https://www.facebook.com/share/189E2RUcH4/",
        youtubeUrl: body.contactAndFooter?.youtubeUrl ?? currentSections?.contactAndFooter?.youtubeUrl ?? "https://youtube.com/@kradglobaltravels?si=jZDwhsl-h42P_YZW",
        twitterUrl: body.contactAndFooter?.twitterUrl ?? currentSections?.contactAndFooter?.twitterUrl ?? "https://x.com/KradGlobalTour",
        threadsUrl: body.contactAndFooter?.threadsUrl ?? currentSections?.contactAndFooter?.threadsUrl ?? "https://www.threads.net/@kradglobal",
        pinterestUrl: body.contactAndFooter?.pinterestUrl ?? currentSections?.contactAndFooter?.pinterestUrl ?? "https://in.pinterest.com/KradGlobalTravels/",
        copyrightText: body.contactAndFooter?.copyrightText ?? currentSections?.contactAndFooter?.copyrightText ?? "© 2026 KRADIND Adventures Private Limited. All rights reserved.",
      },
    };

    // 1. Sync to MongoDB Atlas
    await syncHomeSectionsToMongo(updatedSections);

    // 2. Sync to local memory and cache store
    const store = readStore();
    store.homeSections = updatedSections;
    try {
      writeStore(store);
    } catch (fsErr) {
      console.warn("Local filesystem write skipped:", fsErr);
    }

    return NextResponse.json(updatedSections);
  } catch (error: any) {
    console.error("Failed to update home sections:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update home sections" },
      { status: 500 }
    );
  }
}
