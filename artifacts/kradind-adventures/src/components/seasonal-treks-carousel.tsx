"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Calendar,
  Clock,
  Sparkles,
  Timer,
  CheckCircle,
  AlertCircle,
  Flame,
} from "lucide-react";
import { TrekData, HomeSectionsConfig } from "@/lib/cms-store";
import { TrekDatesModal } from "@/components/trek-dates-modal";
import { RegisterNextSessionModal } from "@/components/register-next-session-modal";
import { isDomesticPackage, isInternationalPackage } from "@/lib/package-sections";
import { getOptimizedImageUrl } from "@/lib/utils";

export interface SeasonPreset {
  id: string;
  label: string;
  emoji: string;
  title: string;
  subtitle: string;
  dateRange: string;
  packageDuration?: string;
  endDate?: string;
  status?: "active" | "coming_soon" | "ended";
  featuredSlugs: string[];
}

const DEFAULT_SEASONS: SeasonPreset[] = [
  {
    id: "oct-nov",
    label: "October–November",
    emoji: "🍂",
    title: "Top 5 Treks for October–November",
    subtitle:
      "Oct-Nov is the best window for doing the high-altitude treks in our country with the clearest views. Here are the Top 5.",
    dateRange: "15 Oct 2026 – 30 Nov 2026",
    packageDuration: "2 to 6 Days",
    endDate: "2026-11-30",
    status: "active",
    featuredSlugs: [
      "chopta-tungnath-chandrashila",
      "hampta-pass",
      "kheerganga-trek",
      "kuari-pass-trek",
      "dayara-bugyal-trek",
    ],
  },
  {
    id: "winter",
    label: "Winter (Dec–Feb)",
    emoji: "❄️",
    title: "Top Winter Snow Treks (Dec–Feb)",
    subtitle:
      "Experience magical snow trails, frozen alpine lakes, and clear winter skies across the Himalayas.",
    dateRange: "01 Dec 2026 – 28 Feb 2027",
    packageDuration: "3 to 6 Days",
    endDate: "2027-02-28",
    status: "active",
    featuredSlugs: [
      "chopta-tungnath-chandrashila",
      "kheerganga-trek",
      "hampta-pass",
    ],
  },
  {
    id: "spring",
    label: "Spring (Mar–Apr)",
    emoji: "🌸",
    title: "Top Spring Rhododendron Treks (Mar–Apr)",
    subtitle:
      "Hike through blooming scarlet and pink rhododendron forests with snow-covered peaks in the backdrop.",
    dateRange: "15 Mar 2027 – 30 Apr 2027",
    packageDuration: "3 to 6 Days",
    endDate: "2027-04-30",
    status: "coming_soon",
    featuredSlugs: [
      "chopta-tungnath-chandrashila",
      "kheerganga-trek",
      "hampta-pass",
    ],
  },
  {
    id: "summer",
    label: "Summer (May–Jun)",
    emoji: "☀️",
    title: "Top Summer Alpine Treks (May–Jun)",
    subtitle:
      "Cross high-altitude passes, camp by emerald alpine lakes, and walk over lush green bugyal meadows.",
    dateRange: "01 May 2027 – 30 Jun 2027",
    packageDuration: "4 to 7 Days",
    endDate: "2027-06-30",
    status: "coming_soon",
    featuredSlugs: [
      "hampta-pass",
      "chopta-tungnath-chandrashila",
      "kheerganga-trek",
    ],
  },
  {
    id: "monsoon",
    label: "Monsoon (Jul–Sep)",
    emoji: "🌧️",
    title: "Top Monsoon Himalayan Trails (Jul–Sep)",
    subtitle:
      "Marvel at vibrant floral blooms, lush rainforest valleys, and rain-shadow crossover passes of Spiti.",
    dateRange: "01 Jul 2027 – 15 Sep 2027",
    packageDuration: "5 to 8 Days",
    endDate: "2027-09-15",
    status: "coming_soon",
    featuredSlugs: [
      "hampta-pass",
      "kheerganga-trek",
      "chopta-tungnath-chandrashila",
    ],
  },
  {
    id: "all",
    label: "All Seasons",
    emoji: "🌍",
    title: "All-Season Fixed Departure Treks & Expeditions",
    subtitle:
      "Browse our complete calendar of guaranteed fixed departures throughout the year with certified mountain guides.",
    dateRange: "Year-Round Fixed Departures",
    packageDuration: "2 to 7 Days",
    endDate: "2029-12-31",
    status: "active",
    featuredSlugs: [
      "chopta-tungnath-chandrashila",
      "hampta-pass",
      "kheerganga-trek",
    ],
  },
];

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
  const [selectedTrekForNextSession, setSelectedTrekForNextSession] = useState<TrekData | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Selected season state (defaults to config.activeSeason or "oct-nov")
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(
    config?.activeSeason || "oct-nov"
  );

  // Sync if config.activeSeason changes from CMS
  useEffect(() => {
    if (config?.activeSeason) {
      setSelectedSeasonId(config.activeSeason);
    }
  }, [config?.activeSeason]);

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

  // Compile active list of seasons incorporating config
  const seasons = useMemo<SeasonPreset[]>(() => {
    const baseList = config?.seasons && config.seasons.length > 0
      ? config.seasons
      : DEFAULT_SEASONS;

    return baseList.map((s) => {
      // If this season matches the main config, apply any admin overrides
      if (s.id === (config?.activeSeason || "oct-nov")) {
        return {
          id: s.id,
          label: s.label,
          emoji: s.emoji,
          title: config?.title || s.title,
          subtitle: config?.subtitle || s.subtitle,
          dateRange: config?.departureDuration || s.dateRange,
          packageDuration: config?.packageDuration || s.packageDuration || "2 to 6 Days",
          endDate: config?.seasonEndDate || s.endDate,
          status: (config?.sessionStatus || s.status || "active") as "active" | "coming_soon" | "ended",
          featuredSlugs:
            config?.featuredSlugs && config.featuredSlugs.length > 0
              ? config.featuredSlugs
              : s.featuredSlugs || [],
        };
      }
      return {
        id: s.id,
        label: s.label,
        emoji: s.emoji,
        title: s.title,
        subtitle: s.subtitle,
        dateRange: s.dateRange,
        packageDuration: s.packageDuration || "2 to 6 Days",
        endDate: s.endDate,
        status: (s.status || "active") as "active" | "coming_soon" | "ended",
        featuredSlugs: s.featuredSlugs || [],
      };
    });
  }, [config]);

  // Find the currently selected season
  const currentSeason = useMemo(() => {
    const found = seasons.find((s) => s.id === selectedSeasonId);
    return found || seasons[0] || DEFAULT_SEASONS[0];
  }, [seasons, selectedSeasonId]);

  // Check if current season or session is expired / coming soon
  const isSeasonExpired = useMemo(() => {
    // 1. Explicit status check
    if (currentSeason.status === "coming_soon" || currentSeason.status === "ended") {
      return true;
    }

    // 2. Admin sessionStatus override for active season
    if (
      selectedSeasonId === (config?.activeSeason || "oct-nov") &&
      config?.sessionStatus &&
      config.sessionStatus !== "active"
    ) {
      return true;
    }

    // 3. Date check: if seasonEndDate has passed
    const effectiveEndDate =
      (selectedSeasonId === (config?.activeSeason || "oct-nov") && config?.seasonEndDate)
        ? config.seasonEndDate
        : currentSeason.endDate;

    if (effectiveEndDate) {
      const endTimestamp = new Date(effectiveEndDate).getTime();
      if (!isNaN(endTimestamp) && Date.now() > endTimestamp) {
        return true;
      }
    }

    return false;
  }, [currentSeason, selectedSeasonId, config]);

  // Filter and prioritize treks for current season
  const displayedTreks = useMemo(() => {
    if (!allTreks || allTreks.length === 0) return [];

    const isAllSeason = currentSeason.id === "all";
    const targetSlugs = currentSeason.featuredSlugs || [];

    const ordered: TrekData[] = [];

    // Match slugs specified for this season
    targetSlugs.forEach((slug) => {
      const found = allTreks.find(
        (t) =>
          (t.slug === slug || t.slug.includes(slug) || slug.includes(t.slug)) &&
          !isDomesticPackage(t) &&
          !isInternationalPackage(t)
      );
      if (found && !ordered.some((item) => item.id === found.id)) {
        ordered.push(found);
      }
    });

    // Fill with remaining published pure treks if needed
    allTreks.forEach((t) => {
      if (
        !ordered.some((item) => item.id === t.id) &&
        t.status === "Published" &&
        !isDomesticPackage(t) &&
        !isInternationalPackage(t)
      ) {
        ordered.push(t);
      }
    });

    return isAllSeason ? ordered.slice(0, 6) : ordered.slice(0, 5);
  }, [allTreks, currentSeason]);

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

  const handleOpenRegisterNextSession = (trek: TrekData, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTrekForNextSession(trek);
    setRegisterModalOpen(true);
  };

  if (config?.enabled === false || displayedTreks.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 select-none">
      {/* Header matching Indiahikes exactly with dynamic season content */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-4 pb-2">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
            <span>{currentSeason.emoji}</span>
            <span>{config?.badge || "High Altitude Fixed Departures"}</span>
            {isSeasonExpired ? (
              <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black">
                Next Session Pre-Registration
              </span>
            ) : (
              <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                Bookings Active
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight brand-font leading-tight">
            {currentSeason.title}
          </h2>
        </div>

        <div className="flex-1 lg:max-w-md space-y-1.5 text-xs sm:text-sm text-slate-700 leading-snug">
          <p>{currentSeason.subtitle}</p>

          {/* Quick season departure window indicator */}
          <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/80">
              <Calendar className="w-3 h-3 text-emerald-600" />
              {currentSeason.dateRange}
            </span>
            <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/80">
              <Timer className="w-3 h-3 text-slate-500" />
              {currentSeason.packageDuration}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Season Filter Tabs ("All Season Ka Option") */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 mb-3 pt-1">
        {seasons.map((season) => {
          const isSelected = season.id === selectedSeasonId;
          const isClosed =
            season.status === "coming_soon" ||
            season.status === "ended" ||
            (season.endDate && new Date(season.endDate).getTime() < Date.now());

          return (
            <button
              key={season.id}
              type="button"
              onClick={() => setSelectedSeasonId(season.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#0F3A2E] text-white shadow-md ring-2 ring-emerald-500/30 scale-[1.02]"
                  : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 shadow-2xs"
              }`}
            >
              <span className="text-sm">{season.emoji}</span>
              <span>{season.label}</span>
              {isClosed && (
                <span
                  className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-amber-400 text-slate-950"
                      : "bg-amber-100 text-amber-950 font-bold"
                  }`}
                >
                  Coming Soon
                </span>
              )}
            </button>
          );
        })}
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
          {displayedTreks.map((trek) => {
            const isFav = Boolean(favorites[trek.slug]);

            // Format metadata string e.g. "3 Days ■ Moderate ■ 13,000 Ft"
            const durationPart = trek.duration?.split("/")[0]?.trim() || currentSeason.packageDuration;
            const difficultyPart = trek.difficulty || "Moderate";
            const altitudePart = trek.altitude || "12,500 ft";

            return (
              <div
                key={trek.id}
                className="w-[285px] sm:w-[315px] shrink-0 bg-white rounded-xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo with Wishlist Heart and Status Badge */}
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-900 group/img">
                    <img
                      src={
                        getOptimizedImageUrl(trek.image, 480, 70) ||
                        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=480&q=70"
                      }
                      alt={trek.imageAlt || trek.name}
                      width={480}
                      height={320}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    />

                    {/* Top Left Status Badge (Coming Soon vs Active) */}
                    <div className="absolute top-3 left-3 z-10">
                      {isSeasonExpired ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] sm:text-[11px] shadow-lg flex items-center gap-1 uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5 text-slate-950" />
                          <span>Coming Soon</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-600/95 backdrop-blur-xs text-white font-bold text-[10px] sm:text-[11px] shadow-lg flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                          <span>Fixed Departure Open</span>
                        </span>
                      )}
                    </div>

                    {/* Top Right Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(trek.slug, e)}
                      aria-label={isFav ? `Remove ${trek.name} from wishlist` : `Add ${trek.name} to wishlist`}
                      className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md hover:bg-white transition cursor-pointer"
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
                    {/* Meta info string: "3 Days ■ Moderate ■ 13,000 Ft" with WCAG AA passing contrast */}
                    <div className="text-[11px] sm:text-xs font-bold text-slate-600 flex items-center gap-1.5 flex-wrap">
                      <span>{durationPart}</span>
                      <span className="text-amber-800 text-[8px]" aria-hidden="true">■</span>
                      <span>{difficultyPart}</span>
                      <span className="text-amber-800 text-[8px]" aria-hidden="true">■</span>
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
                      {trek.tagline ||
                        "Alpine meadows, panoramic Himalayan viewpoints, and certified mountain leadership."}
                    </p>

                    {/* Duration & Fixed Departure schedule indicator */}
                    <div className="pt-2 space-y-1.5 border-t border-slate-100">
                      {/* Package Duration Row */}
                      <div className="flex items-center justify-between text-[11px] bg-slate-50 border border-slate-200/70 rounded-lg px-2.5 py-1">
                        <span className="text-slate-600 font-medium flex items-center gap-1.5">
                          <Timer className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>Package Duration:</span>
                        </span>
                        <span className="font-extrabold text-slate-900">
                          {trek.duration || currentSeason.packageDuration}
                        </span>
                      </div>

                      {/* Fixed Departure Schedule Row */}
                      <div
                        className={`flex items-center justify-between text-[11px] rounded-lg px-2.5 py-1 border ${
                          isSeasonExpired
                            ? "bg-amber-50/80 text-amber-900 border-amber-200"
                            : "bg-emerald-50/80 text-emerald-950 border-emerald-200"
                        }`}
                      >
                        <span className="font-medium flex items-center gap-1.5">
                          <Calendar
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isSeasonExpired ? "text-amber-600" : "text-emerald-700"
                            }`}
                          />
                          <span>
                            {isSeasonExpired ? "Next Session:" : "Fixed Departure:"}
                          </span>
                        </span>
                        <span className="font-extrabold truncate max-w-[150px]">
                          {isSeasonExpired ? "Opening Soon" : currentSeason.dateRange}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Two Action Buttons: "Get Trek Info" + ("View Dates" or "Register for Next Session") */}
                <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2 mt-2">
                  {/* Green "Get Trek Info" button */}
                  <Link
                    href={`/treks/${trek.slug}`}
                    className="w-full py-2.5 px-2 rounded-lg bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-extrabold text-center transition shadow-2xs flex items-center justify-center cursor-pointer"
                  >
                    Get Trek Info
                  </Link>

                  {/* Dynamic Action Button: "View Dates" OR "Register for Next Session" */}
                  {isSeasonExpired ? (
                    <button
                      type="button"
                      onClick={(e) => handleOpenRegisterNextSession(trek, e)}
                      aria-label={`Register Next Session for ${trek.name}`}
                      className="w-full py-2.5 px-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-[11px] font-black text-center transition shadow-md flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                      <span className="truncate">Register Next Session</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleOpenDates(trek, e)}
                      className="w-full py-2.5 px-2 rounded-lg bg-[#EAB308] hover:bg-[#CA8A04] text-slate-950 text-xs font-black text-center transition shadow-2xs flex items-center justify-center cursor-pointer"
                    >
                      View Dates
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Trek Dates Modal for Active Sessions */}
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

      {/* Interactive Next Session Registration Modal for Expired / Coming Soon Treks */}
      <RegisterNextSessionModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        trek={selectedTrekForNextSession}
        seasonName={currentSeason.title}
      />
    </section>
  );
}
