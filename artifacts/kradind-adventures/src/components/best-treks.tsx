"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Clock, ArrowRight } from "lucide-react";
import { treks } from "@/lib/travel-data";

export function BestTreks({ onSelectTrek }: { onSelectTrek?: (slug: string) => void }) {
  // Top 4 flagship expeditions: Chopta, Hampta Pass, Kheerganga, Leh Ladakh
  const featuredSlugs = [
    "chopta-tungnath-chandrashila",
    "hampta-pass",
    "kheerganga-trek",
    "leh-ladakh-tour-package",
  ];

  const featuredTreks = featuredSlugs
    .map((slug) => treks.find((t) => t.slug === slug))
    .filter(Boolean);

  return (
    <section id="best-treks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-3">
        <div>
          <span className="text-[#FF6B35] font-extrabold text-xs uppercase tracking-wider flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#FF6B35] text-[#FF6B35]" /> 4.9+ Rated Flagship Expeditions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 brand-font">
            Top Himalayan Treks & High Passes
          </h2>
        </div>
        <Link
          href="/treks"
          className="text-xs sm:text-sm font-bold text-[#0F3A2E] hover:underline flex items-center gap-1"
        >
          <span>Explore All 13 Packages</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredTreks.map((trek) => {
          if (!trek) return null;
          return (
            <div
              key={trek.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <Image
                    src={trek.image}
                    alt={trek.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                    quality={70}
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#0F3A2E]/90 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                    {trek.badge}
                  </span>
                  <span className="absolute top-3 right-3 bg-white/95 text-slate-900 text-xs font-extrabold px-2 py-0.5 rounded shadow flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{trek.rating}</span>
                  </span>
                  <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{trek.location}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>{trek.duration}</span>
                    <span>•</span>
                    <span>{trek.altitude}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug group-hover:text-[#0F3A2E] transition brand-font line-clamp-1">
                    {trek.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {trek.tagline}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Starting From</span>
                  <span className="text-base sm:text-lg font-extrabold text-[#0F3A2E] brand-font">
                    ₹{trek.price.toLocaleString("en-IN")}
                  </span>
                </div>

                <Link
                  href={`/treks/${trek.slug}`}
                  className="bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm"
                >
                  View Itinerary
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
