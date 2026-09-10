"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookingModal } from "@/components/booking-modal";
import { treks } from "@/lib/travel-data";
import { TrekData } from "@/lib/cms-store";
import { Search, Filter, Mountain, Star, ArrowRight, MapPin, Clock, Compass, X } from "lucide-react";

function normalizeType(val?: string | null): string {
  if (!val || val === "All") return "All";
  const l = val.toLowerCase().trim();
  if (l === "road trip" || l === "domestic" || l === "domestic road trip" || l === "domestic trips") {
    return "Domestic";
  }
  return val;
}

export function TreksContent({
  initialCategory,
  initialTreks,
  titleOverride,
  subtitleOverride,
}: {
  initialCategory?: string;
  initialTreks?: TrekData[];
  titleOverride?: string;
  subtitleOverride?: string;
}) {
  const [allTreks, setAllTreks] = useState<TrekData[]>(
    initialTreks && initialTreks.length > 0 ? initialTreks : (treks as TrekData[])
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramCategory = searchParams ? (searchParams.get("type") || searchParams.get("category")) : null;
  const paramDestination = searchParams ? searchParams.get("destination") : null;
  const paramSearch = searchParams ? (searchParams.get("search") || searchParams.get("q")) : null;

  const initialType = normalizeType(initialCategory || paramCategory || "All");

  const [selectedCategory, setSelectedCategory] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState(
    paramSearch || (paramDestination && paramDestination !== "All" ? paramDestination : "")
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTrek, setSelectedTrek] = useState<TrekData>(allTreks[0] || (treks[0] as TrekData));

  React.useEffect(() => {
    async function loadFreshTreks() {
      try {
        const res = await fetch("/api/treks", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.treks && Array.isArray(data.treks) && data.treks.length > 0) {
            setAllTreks(data.treks);
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic treks:", err);
      }
    }
    loadFreshTreks();
  }, []);

  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(normalizeType(initialCategory));
    } else if (paramCategory) {
      setSelectedCategory(normalizeType(paramCategory));
    }
    if (paramSearch) {
      setSearchQuery(paramSearch);
    } else if (paramDestination && paramDestination !== "All") {
      setSearchQuery(paramDestination);
    }
  }, [initialCategory, paramCategory, paramSearch, paramDestination]);

  const CATEGORIES = [
    { label: "All Trips", value: "All" },
    { label: "🚗 Domestic Tours", value: "Domestic" },
    { label: "🏔️ Himalayan Treks", value: "Himalayas" },
    { label: "🌲 Uttarakhand", value: "Uttarakhand" },
    { label: "🌲 Himachal", value: "Himachal" },
    { label: "❄️ Ladakh & Kashmir", value: "Ladakh" },
    { label: "🏰 Rajasthan", value: "Rajasthan" },
    { label: "🌴 Kerala", value: "Kerala" },
    { label: "🌿 Northeast", value: "Northeast" },
    { label: "🌊 Goa & Coast", value: "Goa" },
    { label: "⛺ Weekend Treks", value: "Weekend" },
  ];

  const filteredTreks = useMemo(() => {
    return allTreks.filter((trek) => {
      const catLower = selectedCategory.toLowerCase();
      const isDomesticCat =
        catLower === "domestic" ||
        catLower.includes("road trip") ||
        catLower === "domestic trips";

      const isDomesticTrek =
        (trek.category || "").toLowerCase() === "domestic" ||
        trek.categories.some((c) => c.toLowerCase() === "domestic");

      const matchesCategory =
        selectedCategory === "All" ||
        (isDomesticCat && isDomesticTrek) ||
        (trek.category || "").toLowerCase().includes(catLower) ||
        trek.categories.some((c) => c.toLowerCase().includes(catLower)) ||
        trek.location.toLowerCase().includes(catLower) ||
        trek.region.toLowerCase().includes(catLower);

      const queryLower = searchQuery.toLowerCase().trim();
      const isDomesticQuery = queryLower === "domestic" || queryLower.includes("domestic");

      const matchesSearch =
        queryLower === "" ||
        (isDomesticQuery && isDomesticTrek) ||
        trek.name.toLowerCase().includes(queryLower) ||
        (trek.category || "").toLowerCase().includes(queryLower) ||
        trek.categories.some((c) => c.toLowerCase().includes(queryLower)) ||
        trek.location.toLowerCase().includes(queryLower) ||
        trek.region.toLowerCase().includes(queryLower) ||
        (trek.tagline || "").toLowerCase().includes(queryLower) ||
        (trek.overview || "").toLowerCase().includes(queryLower);

      const matchesDifficulty =
        selectedDifficulty === "All" ||
        trek.difficulty.toLowerCase().includes(selectedDifficulty.toLowerCase());

      return matchesCategory && matchesSearch && matchesDifficulty;
    });
  }, [allTreks, selectedCategory, searchQuery, selectedDifficulty]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <TopBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-10">
        {/* Title */}
        <div className="mb-4 sm:mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-orange-50 text-[#FF6B35] font-extrabold text-[10px] sm:text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-orange-200/60 shadow-2xs mb-1">
              <span>🎒</span>
              <span>Official Packages & Expeditions</span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 brand-font tracking-tight capitalize leading-tight">
              {titleOverride || (selectedCategory !== "All" ? `${selectedCategory} Treks & Tour Packages` : "Indian Treks & Tour Packages")}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none">
              {subtitleOverride || "Handpicked Himalayan treks, peaceful backwaters, heritage desert tours, and Northeast escapes with certified tour leads and transparent pricing."}
            </p>
          </div>
          <div className="hidden sm:block shrink-0 text-right">
            <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-2xs">
              <strong>{filteredTreks.length}</strong> Trips Available
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs mb-4 sm:mb-7 space-y-2.5 sm:space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by trek, state or region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#0F3A2E] focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center justify-between sm:justify-start gap-2 bg-slate-50 px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200/80 shrink-0">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-xs font-bold text-slate-600 shrink-0">Difficulty:</span>
              </div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#0F3A2E] cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="Easy">Easy / Beginner</option>
                <option value="Moderate">Moderate</option>
                <option value="Road Trip">High Pass Road Trip</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none pb-0.5 -mx-1 px-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.value.toLowerCase()
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3 sm:mb-4 px-1">
          <span>
            Showing <strong>{filteredTreks.length}</strong> verified trips
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-[#FF6B35] font-bold hover:underline cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 min-h-[45vh]">
          {filteredTreks.map((trek) => (
            <div
              key={trek.id}
              role="link"
              tabIndex={0}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest("button[data-action='quick-book']")) {
                  return;
                }
                router.push(`/treks/${trek.slug}`);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/treks/${trek.slug}`);
                }
              }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 cursor-pointer"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={trek.image}
                    alt={trek.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    <span className="bg-[#0F3A2E]/90 backdrop-blur-md text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs border border-white/20">
                      {trek.badge || "Verified"}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md text-slate-900 font-black text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{trek.rating}</span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-white/15">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span className="truncate max-w-[200px]">{trek.location}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 sm:p-5 space-y-2 sm:space-y-2.5">
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-[#0F3A2E] transition line-clamp-1 brand-font leading-snug">
                    {trek.name}
                  </h3>

                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                    {trek.tagline}
                  </p>

                  {/* Highlights Pill */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 pt-1.5 border-t border-slate-100">
                    <span className="inline-flex items-center gap-1 bg-amber-50/80 border border-amber-200/70 text-amber-900 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                      <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>{trek.duration}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-sky-50/80 border border-sky-200/70 text-sky-900 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                      <Compass className="w-3 h-3 text-sky-600 shrink-0" />
                      <span>{trek.altitude}</span>
                    </span>
                    <span className="inline-flex items-center bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                      {trek.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-3.5 sm:p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Starting From
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <strong className="text-base sm:text-xl font-extrabold text-[#0F3A2E] brand-font">
                      ₹{trek.price.toLocaleString("en-IN")}
                    </strong>
                    {trek.originalPrice && (
                      <span className="text-[11px] text-slate-400 line-through">
                        ₹{trek.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    data-action="quick-book"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTrek(trek);
                      setBookingOpen(true);
                    }}
                    className="bg-emerald-50 hover:bg-emerald-100 text-[#0F3A2E] font-bold text-xs px-2.5 sm:px-3 py-2 rounded-xl transition border border-emerald-200/80 relative z-10 whitespace-nowrap min-h-[36px] flex items-center justify-center cursor-pointer"
                  >
                    Quick Book
                  </button>

                  <Link
                    href={`/treks/${trek.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#0F3A2E] hover:bg-[#164e3f] text-white font-bold text-xs px-3 sm:px-3.5 py-2 rounded-xl transition flex items-center justify-center gap-1 group/btn shadow-xs relative z-10 whitespace-nowrap min-h-[36px]"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTreks.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 mt-6 space-y-3">
            <Mountain className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700">
              No destinations match your filter
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try changing your category selection or clearing the search query to explore all available expeditions.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                setSelectedDifficulty("All");
              }}
              className="bg-[#0F3A2E] text-white text-xs font-bold px-4 py-2 rounded-xl mt-2"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        initialTrek={selectedTrek.name}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
