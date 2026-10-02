"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { TrekData, HomeSectionsConfig } from "@/lib/cms-store";
import { TrekDatesModal } from "@/components/trek-dates-modal";

interface SeasonalTreksCarouselProps {
  treks: TrekData[];
  config?: HomeSectionsConfig["seasonalCollection"];
  onBookTrek?: (trekName: string, batchDate?: string) => void;
}

export function SeasonalTreksCarousel({
  treks: allTreks,
  config,
  onBookTrek,
}: SeasonalTreksCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedTrekForDates, setSelectedTrekForDates] = useState<TrekData | null>(null);
  const [datesModalOpen, setDatesModalOpen] = useState(false);

  // Load wishlist from localStorage on client
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kradind_wishlist");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const toggleFavorite = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = { ...prev, [slug]: !prev[slug] };
      try {
        localStorage.setItem("kradind_wishlist", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Filter and prioritize featured treks according to config
  const featuredSlugs = config?.featuredSlugs && config.featuredSlugs.length > 0
    ? config.featuredSlugs
    : [
        "kuari-pass-trek",
        "dayara-bugyal-trek",
        "chopta-tungnath-chandrashila",
        "pench-tiger-trail",
        "hampta-pass",
      ];

  const featuredTreks = React.useMemo(() => {
    if (!allTreks || allTreks.length === 0) return [];

    // Match in specified order
    const ordered: TrekData[] = [];
    featuredSlugs.forEach((slug) => {
      const found = allTreks.find(
        (t) => t.slug === slug || t.slug.includes(slug) || slug.includes(t.slug)
      );
      if (found && !ordered.some((item) => item.id === found.id)) {
        ordered.push(found);
      }
    });

    // If less than 4, fill with remaining published treks
    if (ordered.length < 5) {
      allTreks.forEach((t) => {
        if (!ordered.some((item) => item.id === t.id) && t.status === "Published") {
          ordered.push(t);
        }
      });
    }

    return ordered.slice(0, 8);
  }, [allTreks, featuredSlugs]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleOpenDates = (trek: TrekData, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTrekForDates(trek);
    setDatesModalOpen(true);
  };

  if (config?.enabled === false || featuredTreks.length === 0) {
    return null;
  }

  const title = config?.title || "Top 5 Treks for October-November";
  const subtitle =
    config?.subtitle ||
    "Oct-Nov is the best window for doing the high-altitude treks in our country with the clearest views. Here are the Top 5.";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 select-none">
      {/* Header matching Indiahikes exactly */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-3 pb-3">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight brand-font">
            {title}
          </h2>
        </div>
        <div className="flex-1 lg:max-w-md text-xs sm:text-sm text-slate-700 leading-snug">
          {subtitle}
        </div>
      </div>

      {/* Yellow / Amber horizontal divider bar */}
      <div className="w-full h-1 bg-[#F59E0B] rounded-full mb-6" />

      {/* Carousel Wrapper with Side Arrow Controls */}
      <div className="relative group">
        {/* Left Arrow Button */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 text-slate-800 shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer hover:scale-105"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={() => handleScroll("right")}
          className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 text-slate-800 shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer hover:scale-105"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-5 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 px-1"
        >
          {featuredTreks.map((trek) => {
            const isFav = Boolean(favorites[trek.slug]);

            // Format metadata string e.g. "6 Days ■ Moderate ■ 12,516 ft"
            const durationPart = trek.duration?.split("/")[0]?.trim() || "6 Days";
            const difficultyPart = trek.difficulty || "Moderate";
            const altitudePart = trek.altitude || "12,500 ft";

            return (
              <div
                key={trek.id}
                className="w-[280px] sm:w-[310px] shrink-0 bg-white rounded-xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo with Wishlist Heart */}
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-900 group/img">
                    <img
                      src={
                        trek.image ||
                        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={trek.imageAlt || trek.name}
                      width={600}
                      height={400}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    />

                    {/* Top Right Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(trek.slug, e)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md hover:bg-white transition cursor-pointer"
                      title={isFav ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart
                        className={`w-5 h-5 transition ${
                          isFav
                            ? "fill-rose-500 text-rose-500 scale-110"
                            : "text-slate-700 hover:text-rose-500"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Top Yellow Accent Line on card body */}
                  <div className="w-full h-1 bg-[#F59E0B]" />

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 space-y-2.5">
                    {/* Meta info string: "6 Days ■ Moderate ■ 12,516 ft" */}
                    <div className="text-[11px] sm:text-xs font-semibold text-slate-500 flex items-center gap-1.5 flex-wrap">
                      <span>{durationPart}</span>
                      <span className="text-[#F59E0B] text-[8px]">■</span>
                      <span>{difficultyPart}</span>
                      <span className="text-[#F59E0B] text-[8px]">■</span>
                      <span>{altitudePart}</span>
                    </div>

                    {/* Large Uppercase Trek Title */}
                    <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight line-clamp-1 leading-snug">
                      <Link
                        href={`/treks/${trek.slug}`}
                        className="hover:text-emerald-800 transition"
                      >
                        {trek.name}
                      </Link>
                    </h3>

                    {/* Subtitle / Tagline */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]">
                      {trek.tagline || "Authentic Himalayan trail with certified guides and scenic alpine views."}
                    </p>
                  </div>
                </div>

                {/* Two Action Buttons matching reference screenshot */}
                <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2.5 mt-2">
                  {/* Green "Get Trek Info" button */}
                  <Link
                    href={`/treks/${trek.slug}`}
                    className="w-full py-2.5 px-3 rounded-lg bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-extrabold text-center transition shadow-2xs flex items-center justify-center cursor-pointer"
                  >
                    Get Trek Info
                  </Link>

                  {/* Yellow "View Dates" button */}
                  <button
                    type="button"
                    onClick={(e) => handleOpenDates(trek, e)}
                    className="w-full py-2.5 px-3 rounded-lg bg-[#EAB308] hover:bg-[#CA8A04] text-slate-950 text-xs font-black text-center transition shadow-2xs flex items-center justify-center cursor-pointer"
                  >
                    View Dates
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Trek Dates Modal */}
      <TrekDatesModal
        isOpen={datesModalOpen}
        onClose={() => setDatesModalOpen(false)}
        trek={selectedTrekForDates}
        onBookBatch={(trekObj, batch) => {
          if (onBookTrek) {
            onBookTrek(trekObj.name, `${batch.startDate} - ${batch.endDate}`);
          }
        }}
      />
    </section>
  );
}
