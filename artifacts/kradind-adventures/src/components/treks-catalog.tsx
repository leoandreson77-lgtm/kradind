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
import { Search, Filter, Mountain, Star, ArrowRight, MapPin, Clock, Compass } from "lucide-react";

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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="text-[#FF6B35] font-extrabold text-xs uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200/60 inline-block">
            Official Packages & Expeditions
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-3 brand-font tracking-tight capitalize">
            {titleOverride || (selectedCategory !== "All" ? `${selectedCategory} Treks & Tour Packages` : "Indian Treks & Tour Packages")}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            {subtitleOverride || "Handpicked Himalayan treks, peaceful backwaters, heritage desert tours, and Northeast escapes with certified tour leads and transparent pricing."}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by name, state or landmark (e.g. Chopta, Kerala, Goa, Ladakh)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#0F3A2E] focus:bg-white transition"
              />
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-xs font-bold text-slate-600 shrink-0">Difficulty / Pace:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#0F3A2E] w-full sm:w-auto"
              >
                <option value="All">All Levels</option>
                <option value="Easy">Easy / Leisure</option>
                <option value="Moderate">Moderate</option>
                <option value="Road Trip">High Altitude Road Trip</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory.toLowerCase() === cat.value.toLowerCase()
                    ? "bg-[#0F3A2E] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
          <span>
            Showing <strong>{filteredTreks.length}</strong> verified trips
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-[#FF6B35] font-bold hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between group hover:-translate-y-1 cursor-pointer"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={trek.image}
                    alt={trek.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-[#0F3A2E]/90 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {trek.badge || "Verified"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{trek.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{trek.location}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-[#0F3A2E] transition line-clamp-1 brand-font">
                    {trek.name}
                  </h3>

                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                    {trek.tagline}
                  </p>

                  {/* Highlights Pill */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <strong>{trek.duration}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{trek.altitude}</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-700 font-medium">
                      {trek.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Starting From
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <strong className="text-lg sm:text-xl font-extrabold text-[#0F3A2E] brand-font">
                      ₹{trek.price.toLocaleString("en-IN")}
                    </strong>
                    {trek.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{trek.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    data-action="quick-book"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTrek(trek);
                      setBookingOpen(true);
                    }}
                    className="bg-emerald-50 hover:bg-emerald-100 text-[#0F3A2E] font-bold text-xs px-3 py-2 rounded-xl transition relative z-10"
                  >
                    Quick Book
                  </button>

                  <Link
                    href={`/treks/${trek.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#0F3A2E] hover:bg-[#164e3f] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1 group/btn shadow-sm relative z-10"
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
