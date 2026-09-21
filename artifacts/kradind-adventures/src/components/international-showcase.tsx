"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe, ArrowRight, Plane, Clock, ShieldCheck, Star } from "lucide-react";
import { DestinationData, HomeSectionsConfig } from "@/lib/cms-store";

export function InternationalShowcase({
  config,
  initialDestinations,
}: {
  config?: HomeSectionsConfig["international"];
  initialDestinations?: DestinationData[];
}) {
  const [destinations, setDestinations] = useState<DestinationData[]>(
    initialDestinations && initialDestinations.length > 0 ? initialDestinations : []
  );

  useEffect(() => {
    if (destinations.length === 0) {
      async function loadIntl() {
        try {
          const res = await fetch("/api/destinations");
          if (res.ok) {
            const data: DestinationData[] = await res.json();
            const intl = data.filter((d) => d.category?.toLowerCase() === "international" && d.status === "Published");
            if (intl.length > 0) {
              setDestinations(intl);
            }
          }
        } catch {}
      }
      loadIntl();
    }
  }, [destinations.length]);

  if (config && config.enabled === false) {
    return null;
  }

  // Filter or sort by featured slugs if configured
  const featuredSlugs = config?.featuredSlugs || [];
  let displayList = destinations;
  if (featuredSlugs.length > 0) {
    const matched = featuredSlugs
      .map((slug) => destinations.find((d) => d.slug.toLowerCase() === slug.toLowerCase()))
      .filter(Boolean) as DestinationData[];
    if (matched.length > 0) {
      displayList = matched;
    }
  }

  if (displayList.length === 0) {
    return null;
  }

  return (
    <section id="international-tours" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-3">
        <div>
          <span className="text-blue-600 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>{config?.badge || "World Expeditions & Island Escapes"}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 brand-font">
            {config?.title || "International Holiday Packages"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {config?.subtitle ||
              "Explore handpicked global destinations with complete visa assistance, verified stays, and private transfers across Bali, Thailand, Dubai, Nepal, Vietnam, Singapore, and Maldives."}
          </p>
        </div>

        <Link
          href="/international-trips"
          className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 shrink-0"
        >
          <span>All International Trips</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid of International Destinations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {displayList.slice(0, 8).map((dest) => (
          <Link
            key={dest.id}
            href={`/international-trips/${dest.slug}`}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Photo Banner with Flag Emoji */}
              <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Country Flag Badge on top left */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-black flex items-center gap-1 border border-white/20">
                    <span>{dest.icon || "✈️"}</span>
                    <span>{dest.name}</span>
                  </span>
                </div>

                {/* Promo Badge on top right */}
                {dest.badge && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-blue-600/90 text-white text-[10px] font-bold shadow-xs">
                      {dest.badge}
                    </span>
                  </div>
                )}

                {/* Duration & Price on bottom */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white z-10">
                  <div className="flex items-center gap-1 text-[11px] text-slate-200 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{dest.duration || "5 Nights / 6 Days"}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-300">from</span>{" "}
                    <span className="text-base font-black text-white">
                      ₹{(dest.price || 39999).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Text Info */}
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition line-clamp-1">
                  {dest.name}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {dest.tagline || `Explore customized international holidays in ${dest.name}.`}
                </p>

                {/* Highlights */}
                {dest.highlights && dest.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {dest.highlights.slice(0, 2).map((h, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-medium truncate max-w-[170px]"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Visa Support</span>
              </span>
              <span className="font-bold text-blue-700 group-hover:text-blue-900 flex items-center gap-1 transition">
                <span>View Plan</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
