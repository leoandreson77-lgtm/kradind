"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  Clock,
  ChevronRight,
  Flame,
  CheckCircle2,
  Users,
} from "lucide-react";
import { LandingPageData } from "@/lib/cms-store";

export function CampaignSection({
  initialCampaigns,
}: {
  initialCampaigns?: LandingPageData[];
}) {
  const [campaigns, setCampaigns] = useState<LandingPageData[]>(
    initialCampaigns || []
  );
  const [loading, setLoading] = useState(!initialCampaigns);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch("/api/landing-pages");
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data || []);
        }
      } catch (err) {
        console.error("Failed to load campaigns", err);
      } finally {
        setLoading(false);
      }
    }
    if (!initialCampaigns) {
      fetchCampaigns();
    }
  }, [initialCampaigns]);

  if (loading || campaigns.length === 0) {
    return null; // Only render when there are published campaigns
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-3 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Exclusive Campaigns</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Signature <span className="text-[#FF6B35]">Expeditions</span> & Limited Slots
            </h2>
            <p className="text-sm md:text-base text-slate-400 mt-2 max-w-xl">
              Hand-crafted alpine summit routes with certified wilderness leaders, chef-cooked high-altitude meals, and limited 15-trekker batches.
            </p>
          </div>

          <Link
            href="/treks"
            className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition group"
          >
            <span>Browse All Domestic & Alpine Treks</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Campaign Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {campaigns.map((camp) => (
            <Link
              key={camp.id}
              href={`/lp/${camp.slug}`}
              className="group relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900/60 backdrop-blur-md hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/50 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Image */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <Image
                  src={camp.heroImage}
                  alt={camp.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={70}
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Badges on Image */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#FF6B35] border border-[#FF6B35]/40 flex items-center gap-1.5 shadow-lg">
                    <Flame className="w-3.5 h-3.5 fill-[#FF6B35]" />
                    {camp.badge || "FEATURED CAMPAIGN"}
                  </span>

                  {camp.promoOffer?.code && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/40 shadow-lg">
                      USE: {camp.promoOffer.code}
                    </span>
                  )}
                </div>

                {/* Promo Strip */}
                {camp.promoOffer?.discountText && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-amber-500/20 backdrop-blur-md border border-amber-500/40 px-3.5 py-1.5 rounded-xl flex items-center justify-between text-xs text-amber-200">
                      <div className="flex items-center gap-2 font-bold truncate">
                        <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{camp.promoOffer.discountText}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 shrink-0">
                        Limited Time
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-400 transition leading-tight">
                    {camp.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {camp.subtitle}
                  </p>
                </div>

                {/* Highlights preview */}
                {camp.highlights && camp.highlights.length > 0 && (
                  <div className="space-y-2 py-3 border-y border-white/5">
                    {camp.highlights.slice(0, 2).map((hl, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">{hl.title}:</strong>{" "}
                          <span className="text-slate-400 line-clamp-1">{hl.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom CTA */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>Max 15 Trekkers/Batch</span>
                  </div>

                  <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white group-hover:text-[#FF6B35] transition">
                    <span>View Expedition Dossier</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/treks"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:underline"
          >
            <span>Browse All Domestic & Alpine Treks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
