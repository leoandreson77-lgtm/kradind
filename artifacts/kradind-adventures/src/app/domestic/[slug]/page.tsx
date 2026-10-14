import React from "react";
import { notFound } from "next/navigation";
import { treks } from "@/lib/travel-data";
import { getTreksAsync, readStore, TrekData } from "@/lib/cms-store";
import { TrekDetailClient } from "../../treks/[slug]/trek-detail-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SLUG_ALIASES: Record<string, string> = {
  "goa-tour-package": "goa-tour-package-4-nights-5-days",
  "goa-trip-package-4-nights-5-days": "goa-tour-package-4-nights-5-days",
  "meghalaya-tour-package": "meghalaya-tour-package-5-nights-6-days",
  "maharashtra-tour-package": "maharashtra-tour-package-4-nights-5-days",
  "kerala-tour-package": "kerala-tour-package-5-nights-6-days",
  "manali-tour-package": "manali-tour-package-4-nights-5-days",
};

export default async function DomesticTourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rawSlug = (slug || "").replace(/^\/+/, "");
  const normalizedSlug = rawSlug.toLowerCase();
  const lookupSlug = SLUG_ALIASES[normalizedSlug] || normalizedSlug;

  let dynamicTreks: any[] = [];
  try {
    dynamicTreks = await getTreksAsync();
  } catch {
    const store = readStore();
    dynamicTreks = store.treks || [];
  }

  const trek =
    dynamicTreks.find((t) => t.slug === lookupSlug) ||
    treks.find((t) => t.slug === lookupSlug) ||
    dynamicTreks.find((t) => t.slug === rawSlug) ||
    treks.find((t) => t.slug === rawSlug) ||
    dynamicTreks.find((t) => t.slug?.toLowerCase() === lookupSlug.toLowerCase()) ||
    treks.find((t) => t.slug?.toLowerCase() === lookupSlug.toLowerCase());

  if (!trek) {
    notFound();
  }

  return <TrekDetailClient initialTrek={trek as unknown as TrekData} slug={lookupSlug} />;
}
