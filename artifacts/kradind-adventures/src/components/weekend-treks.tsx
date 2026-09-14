"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, MapPin, Clock, ArrowRight } from "lucide-react";
import { treks } from "@/lib/travel-data";

function getWeekendAlt(trek: { slug?: string; name?: string }) {
  const s = (trek.slug || "").toLowerCase();
  const n = (trek.name || "").toLowerCase();
  if (s.includes("chopta") || n.includes("chopta")) {
    return "Chopta weekend trekking getaway in Uttarakhand";
  }
  if (s.includes("kheerganga") || n.includes("kheerganga")) {
    return "Kheerganga weekend trek and hot spring experience";
  }
  if (s.includes("nainital") || n.includes("nainital")) {
    return "Nainital and Kumaon weekend holiday tour";
  }
  if (s.includes("jaipur") || n.includes("jaipur")) {
    return "Jaipur royal heritage weekend tour";
  }
  return `${trek.name} weekend getaway by KRADIND`;
}

export function WeekendTreks({ treks: treksProp }: { treks?: any[] }) {
  const availableTreks = treksProp && treksProp.length > 0 ? treksProp : treks;

  const weekendSlugs = [
    "chopta-tungnath-chandrashila",
    "kheerganga-trek",
    "nainital-tour-package",
    "jaipur-tour-package",
  ];

  let weekendTrips = weekendSlugs
    .map((slug) => availableTreks.find((t: any) => t.slug === slug))
    .filter(Boolean);

  if (weekendTrips.length === 0) {
    weekendTrips = availableTreks.filter((t: any) =>
      t.categories?.some((c: string) => c.toLowerCase() === "weekend")
    );
    if (weekendTrips.length === 0) {
      weekendTrips = availableTreks.slice(0, 4);
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-3">
        <div>
          <span className="text-amber-600 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500" /> Zero Work Leave Needed
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 brand-font">
            Weekend Escapes &amp; Short Breaks
          </h2>
        </div>
        <Link href="/treks/category/weekend" className="text-xs sm:text-sm font-bold text-[#0F3A2E] hover:underline flex items-center gap-1">
          <span>View All Weekend Getaways</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {weekendTrips.map((trek) => {
          if (!trek) return null;
          return (
            <Link
              key={trek.id}
              href={`/treks/${trek.slug}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition duration-300 flex flex-col justify-between group hover:-translate-y-1 cursor-pointer"
            >
              <div>
                <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={trek.image}
                    alt={getWeekendAlt(trek)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                    quality={70}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{trek.location}</span>
                    </span>
                    <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded text-[10px]">
                      {trek.duration}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0F3A2E] transition brand-font line-clamp-1">
                    {trek.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {trek.tagline}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 mt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">From</span>
                  <span className="text-sm sm:text-base font-extrabold text-slate-900 brand-font">
                    ₹{trek.price.toLocaleString("en-IN")}
                  </span>
                </div>

                <span
                  className="bg-slate-900 group-hover:bg-[#0F3A2E] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm inline-block"
                >
                  View Details
                </span>
              </div>
            </Link>
          );
        })}
      </div>

    </section>
  );
}
