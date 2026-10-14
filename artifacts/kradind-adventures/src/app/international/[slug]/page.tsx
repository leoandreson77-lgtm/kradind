import React from "react";
import { notFound } from "next/navigation";
import { treks } from "@/lib/travel-data";
import { getTreksAsync, readStore, TrekData } from "@/lib/cms-store";
import { TrekDetailClient } from "../../treks/[slug]/trek-detail-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InternationalTourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rawSlug = (slug || "").replace(/^\/+/, "");
  const normalizedSlug = rawSlug.toLowerCase();

  let dynamicTreks: any[] = [];
  try {
    dynamicTreks = await getTreksAsync();
  } catch {
    const store = readStore();
    dynamicTreks = store.treks || [];
  }

  const trek =
    dynamicTreks.find((t) => t.slug === normalizedSlug) ||
    treks.find((t) => t.slug === normalizedSlug) ||
    dynamicTreks.find((t) => t.slug === rawSlug) ||
    treks.find((t) => t.slug === rawSlug) ||
    dynamicTreks.find((t) => t.slug?.toLowerCase() === normalizedSlug) ||
    treks.find((t) => t.slug?.toLowerCase() === normalizedSlug);

  if (!trek) {
    notFound();
  }

  return <TrekDetailClient initialTrek={trek as unknown as TrekData} slug={normalizedSlug} />;
}
