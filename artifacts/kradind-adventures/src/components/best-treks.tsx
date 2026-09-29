"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Star, MapPin, Clock, ArrowRight, Mountain, Car, Sparkles, Compass, Globe } from "lucide-react";
import { treks as defaultTreks } from "@/lib/travel-data";
import { getImageAlt } from "@/lib/image-alt";
import { HomeSectionsConfig, TrekData } from "@/lib/cms-store";

function getTopTrekAlt(trek: any) {
  return getImageAlt(trek, "trekking");
}

function isDomesticPackage(t: any): boolean {
  if (!t) return false;
  return (
    (t.category || "").toLowerCase() === "domestic" ||
    (t.categories || []).some((c: string) => c.toLowerCase() === "domestic")
  );
}

function isWeekendPackage(t: any): boolean {
  if (!t) return false;
  return (
    (t.categories || []).some((c: string) => c.toLowerCase().includes("weekend")) ||
    (t.duration || "").includes("2 Days") ||
    (t.duration || "").includes("3 Days")
  );
}

function isInternationalPackage(t: any): boolean {
  if (!t) return false;
  return (
    (t.category || "").toLowerCase() === "international" ||
    (t.categories || []).some((c: string) => c.toLowerCase() === "international") ||
    ["bali", "dubai", "thailand", "vietnam", "singapore", "maldives", "nepal"].some((country) =>
      (t.slug || "").includes(country) || (t.location || "").toLowerCase().includes(country)
    )
  );
}

export function BestTreks({
  treks: treksProp,
  onSelectTrek,
  config,
}: {
  treks?: any[];
  onSelectTrek?: (slug: string) => void;
  config?: HomeSectionsConfig["bestTreks"];
}) {
  const [activeTab, setActiveTab] = useState<"all" | "treks" | "domestic" | "international" | "weekend">("all");

  const availableTreks = useMemo(() => {
    return treksProp && treksProp.length > 0 ? treksProp : defaultTreks;
  }, [treksProp]);

  const trekList = useMemo(() => {
    return availableTreks.filter((t: any) => !isDomesticPackage(t) && !isInternationalPackage(t));
  }, [availableTreks]);

  const domesticList = useMemo(() => {
    return availableTreks.filter((t: any) => isDomesticPackage(t) && !isInternationalPackage(t));
  }, [availableTreks]);

  const internationalList = useMemo(() => {
    return availableTreks.filter((t: any) => isInternationalPackage(t));
  }, [availableTreks]);

  const weekendList = useMemo(() => {
    return availableTreks.filter((t: any) => isWeekendPackage(t));
  }, [availableTreks]);

  // Curated list based on active tab
  const displayedTreks = useMemo(() => {
    if (activeTab === "treks") return trekList;
    if (activeTab === "domestic") return domesticList.slice(0, 8);
    if (activeTab === "international") return internationalList.slice(0, 8);
    if (activeTab === "weekend") return weekendList.slice(0, 8);

    // "all": Default flagship picks (top Himalayan treks + top domestic packages)
    const flagshipSlugs = [
      "chopta-tungnath-chandrashila",
      "hampta-pass",
      "rajasthan-tour-package-5-nights-6-days",
      "kerala-tour-package-5-nights-6-days",
      "kheerganga-trek",
      "leh-ladakh-tour-package",
      "goa-beach-heritage-tour",
      "meghalaya-abode-of-clouds",
    ];

    const matched = flagshipSlugs
      .map((slug) => availableTreks.find((t: any) => t.slug === slug || t.slug.includes(slug.split("-")[0])))
      .filter(Boolean);

    if (matched.length >= 4) {
      return matched;
    }

    return [...trekList.slice(0, 4), ...domesticList.slice(0, 4)];
  }, [activeTab, availableTreks, trekList, domesticList, weekendList]);

  return (
    <section id="best-treks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      
      {/* Header with Title and Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <span className="text-[#FF6B35] font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-[#FF6B35] text-[#FF6B35]" />
            <span>{config?.badge || "4.9+ Rated Flagship Journeys"}</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-1 tracking-tight brand-font">
            {config?.title || "Featured Treks & Popular Packages"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl">
            {config?.subtitle || "Handpicked Himalayan summit routes, scenic domestic holiday circuits, and weekend escapes with certified trip leaders."}
          </p>
        </div>

        <Link
          href="/treks"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0F3A2E] hover:text-emerald-700 transition group shrink-0"
        >
          <span>View All {availableTreks.length} Packages</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* Simplified, Easy-to-Use Category Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === "all"
              ? "bg-[#0F3A2E] text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>All Top Picks</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === "all" ? "bg-emerald-950 text-emerald-300" : "bg-slate-100 text-slate-600"}`}>
            {Math.min(availableTreks.length, 8)}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("treks")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === "treks"
              ? "bg-[#0F3A2E] text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Mountain className="w-3.5 h-3.5 text-emerald-500" />
          <span>Himalayan Treks</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === "treks" ? "bg-emerald-950 text-emerald-300" : "bg-slate-100 text-slate-600"}`}>
            {trekList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("domestic")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === "domestic"
              ? "bg-[#0F3A2E] text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Car className="w-3.5 h-3.5 text-amber-500" />
          <span>Domestic Tours</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === "domestic" ? "bg-emerald-950 text-emerald-300" : "bg-slate-100 text-slate-600"}`}>
            {domesticList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("international")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === "international"
              ? "bg-[#0F3A2E] text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-blue-500" />
          <span>International Holidays</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === "international" ? "bg-emerald-950 text-emerald-300" : "bg-slate-100 text-slate-600"}`}>
            {internationalList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("weekend")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === "weekend"
              ? "bg-[#0F3A2E] text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>⚡ Weekend Getaways</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === "weekend" ? "bg-emerald-950 text-emerald-300" : "bg-slate-100 text-slate-600"}`}>
            {weekendList.length}
          </span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedTreks.map((trek: any) => {
          if (!trek) return null;
          const isDom = isDomesticPackage(trek);
          const isInter = isInternationalPackage(trek);

          return (
            <Link
              key={trek.id}
              href={`/treks/${trek.slug}`}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 cursor-pointer"
            >
              <div>
                {/* Photo Thumbnail */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-900">
                  <img
                    src={trek.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"}
                    alt={trek.imageAlt || getTopTrekAlt(trek)}
                    width={600}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                  {/* Category Type Badge */}
                  <span className="absolute top-3 left-3 bg-[#0F3A2E]/95 backdrop-blur-md text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    {isInter ? (
                      <>
                        <Globe className="w-3 h-3 text-blue-400" />
                        <span>International</span>
                      </>
                    ) : isDom ? (
                      <>
                        <Car className="w-3 h-3 text-amber-400" />
                        <span>Domestic Tour</span>
                      </>
                    ) : (
                      <>
                        <Mountain className="w-3 h-3 text-emerald-400" />
                        <span>Himalayan Trek</span>
                      </>
                    )}
                  </span>

                  {/* Rating Badge */}
                  <span className="absolute top-3 right-3 bg-white/95 text-slate-900 text-xs font-black px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{trek.rating || 4.9}</span>
                  </span>

                  {/* Location Tag */}
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate max-w-[190px]">{trek.location}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 space-y-2.5">
                  <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-2">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <Clock className="w-3 h-3" />
                      <span>{trek.duration}</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-600 truncate">{trek.altitude || "Scenic Circuit"}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-[#0F3A2E] transition line-clamp-1">
                    {trek.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {trek.tagline || "Authentic Himalayan trail with experienced guides and quality stays."}
                  </p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Starting Price</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base sm:text-lg font-extrabold text-[#0F3A2E]">
                      ₹{trek.price?.toLocaleString("en-IN") || "5,499"}
                    </span>
                    {trek.originalPrice && trek.originalPrice > trek.price && (
                      <span className="text-[11px] text-slate-400 line-through">
                        ₹{trek.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>

                <span className="bg-[#0F3A2E] group-hover:bg-[#164e3f] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1">
                  <span>View Plan</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Simplified Bar */}
      <div className="mt-10 p-5 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Need a custom itinerary or couple/family package?
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              We personalize hotels, private vehicles, meal plans, and trekking gear for any group size.
            </p>
          </div>
        </div>

        <Link
          href="/treks"
          className="px-5 py-2.5 bg-[#FF6B35] hover:bg-[#e8590c] text-white text-xs font-bold rounded-xl transition shadow-xs shrink-0 flex items-center gap-1.5"
        >
          <span>Explore All Packages</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </section>
  );
}
