"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, ChevronLeft, ChevronRight, Sparkles, ArrowRight, MapPin, Compass } from "lucide-react";
import { MountainAtmosphere, AtmosphereMode } from "@/components/mountain-atmosphere";
import { FormattedText } from "@/components/formatted-text";

interface CarouselSlide {
  id: string;
  image: string;
  badge: string;
  title: string;
  tagline: string;
  altText: string;
  weatherMode: AtmosphereMode;
}

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: "ocean-sunrise",
    image: "/ocean-sunrise.webp", // Modern optimized WebP (136KB vs 838KB)
    badge: "🌅 Ocean Sunrise • Goa & Kerala Sea",
    title: "Golden Ocean Sunrise",
    tagline: "Golden sun rising over open sea waters with shimmering wave reflections",
    altText: "Domestic and international tour packages by KRAD Global in Dehradun",
    weatherMode: "sunrise",
  },
  {
    id: "himalayan-snow",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85",
    badge: "❄️ Alpine Snow • Kedarkantha & Chopta",
    title: "Himalayan Snow Peaks",
    tagline: "High-altitude frosty alpine summits & certified winter mountaineering",
    altText: "Himalayan trekking package by KRAD Global",
    weatherMode: "snow",
  },
  {
    id: "monsoon-rain",
    image: "/monsoon-rain.webp", // Modern optimized WebP (189KB vs 962KB)
    badge: "🌧️ Monsoon Rain • Storm Clouds & Falls",
    title: "Monsoon Rain & Mist",
    tagline: "Authentic monsoon rainfall, stormy mountain ridges & lush misty valleys",
    altText: "Popular India holiday destination featured by KRAD Global",
    weatherMode: "rain",
  },
  {
    id: "kerala-backwaters",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=85",
    badge: "🌴 Clear Skies • Alleppey & Munnar",
    title: "Backwaters & Palms",
    tagline: "Peaceful houseboat cruises, sunny palm groves & clear emerald tea gardens",
    altText: "Customized holiday package by KRAD Global",
    weatherMode: "clear",
  },
];

export function HeroSearch({
  config,
}: {
  config?: { badge?: string; title?: string; subtitle?: string; bgImage?: string; imageAlt?: string };
}) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [tripType, setTripType] = useState("All");
  const [destination, setDestination] = useState("All");
  const [season, setSeason] = useState("All");

  // Ultra-Smooth Unified Carousel Loop (5.0s relaxed cinematic rhythm)
  const [slideIndex, setSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const LOOP_DURATION_MS = 5000;

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, LOOP_DURATION_MS);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const activeSlide = CAROUSEL_SLIDES[slideIndex];

  const handleSelectMode = (mode: AtmosphereMode) => {
    const idx = CAROUSEL_SLIDES.findIndex((s) => s.weatherMode === mode);
    if (idx !== -1) {
      setSlideIndex(idx);
    }
  };

  const handleToggleLoop = () => {
    setIsAutoPlaying((prev) => !prev);
  };

  const badge = config?.badge || activeSlide.badge;
  const title = config?.title || "Experience the Wilderness";
  const subtitle = config?.subtitle || activeSlide.tagline;

  const handleNextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  const handleSelectSlide = (idx: number) => {
    setSlideIndex(idx);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("search", keyword.trim());
    if (tripType !== "All") params.set("type", tripType);
    if (destination !== "All") params.set("destination", destination);
    if (season !== "All") params.set("season", season);

    router.push(`/treks?${params.toString()}`);
  };

  const handleCategoryClick = (cat: string) => {
    router.push(`/treks?type=${encodeURIComponent(cat)}`);
  };

  return (
    <section className="relative bg-[#0F3A2E] text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[620px] group">
      
      {/* 1. REAL PHOTO BACKGROUND CAROUSEL WITH BUTTERY SMOOTH CROSSFADE */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {CAROUSEL_SLIDES.map((slide, idx) => {
          const isActive = slideIndex === idx;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all hero-slide-transition ${
                isActive
                  ? "opacity-100 scale-100 z-1 pointer-events-auto"
                  : "opacity-0 scale-105 z-0 pointer-events-none"
              }`}
            >
              <img
                src={slide.image}
                alt={config?.imageAlt || slide.altText || "Domestic and international tour packages by KRAD Global in Dehradun"}
                width={1376}
                height={768}
                className="w-full h-full object-cover object-center"
                loading={idx < 3 ? "eager" : "lazy"}
                fetchPriority={idx === 0 ? "high" : "low"}
                decoding={idx === 0 ? "sync" : "async"}
              />
            </div>
          );
        })}
        {/* Soft atmospheric gradient allowing real photo details to be crisp, bright & vibrant */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/20 to-[#0b241d]/75 pointer-events-none" />
      </div>

      {/* 2. ATMOSPHERIC PARTICLES SYNCHRONIZED WITH ACTIVE REAL PHOTO */}
      <MountainAtmosphere
        currentMode={activeSlide.weatherMode}
        onSelectMode={handleSelectMode}
        autoLoop={isAutoPlaying}
        onToggleLoop={handleToggleLoop}
        showControls={false}
      />

      {/* 3. CAROUSEL PREV / NEXT ARROW BUTTONS */}
      <button
        type="button"
        onClick={handlePrevSlide}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/50 hover:bg-slate-950/80 backdrop-blur-md border border-white/20 text-white items-center justify-center transition shadow-xl cursor-pointer hover:scale-105 opacity-0 group-hover:opacity-100"
        title="Previous Photo Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={handleNextSlide}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/50 hover:bg-slate-950/80 backdrop-blur-md border border-white/20 text-white items-center justify-center transition shadow-xl cursor-pointer hover:scale-105 opacity-0 group-hover:opacity-100"
        title="Next Photo Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
        
        {/* Animated Text Container with smooth transition */}
        <div key={activeSlide.id} className="transition-all duration-700 ease-out space-y-4 animate-in fade-in zoom-in-95">
          {/* Badge Tagline - Crisp White Frosted Badge with Logo Dark Green Text */}
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border border-white text-[#0F3A2E] text-xs sm:text-sm font-black px-4 sm:px-5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>{badge}</span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight brand-font drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            {title}
          </h1>

          {/* Subtitle */}
          <div className="text-base sm:text-lg text-slate-100 max-w-2xl mx-auto font-normal drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
            <FormattedText text={subtitle} />
          </div>
        </div>

        {/* Modern, Clean & High-Impact Floating Search Bar */}
        <div className="pt-2 max-w-4xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl sm:rounded-full shadow-2xl border border-white/40 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-slate-800"
          >
            {/* 1. Destination / Trek input */}
            <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 w-full sm:w-auto">
              <Search className="w-5 h-5 text-emerald-700 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Where to? (e.g. Kedarkantha, Kerala, Goa, Bali)..."
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-slate-200" />

            {/* 2. Category Dropdown */}
            <div className="w-full sm:w-48 px-3 py-1.5 flex items-center">
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Trek">🏔️ Himalayan Treks</option>
                <option value="Domestic">🚗 Domestic Tours</option>
                <option value="International">✈️ International Trips</option>
                <option value="Weekend">⚡ Weekend Getaways</option>
              </select>
            </div>

            {/* 3. Search Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#FF6B35] hover:bg-[#e8590c] text-white text-xs sm:text-sm font-extrabold rounded-xl sm:rounded-full shadow-lg hover:shadow-orange-500/25 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Explore Trips</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Discovery Pills (Easy 1-Tap Access) */}
          <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="text-white/80 font-medium text-[11px] hidden sm:inline">Popular:</span>
            {[
              { label: "🏔️ Himalayan Treks", query: "Trek", isType: true },
              { label: "🚗 Kerala Backwaters", query: "Kerala", isType: false },
              { label: "🏰 Royal Rajasthan", query: "Rajasthan", isType: false },
              { label: "⚡ Weekend Escapes", query: "Weekend", isType: true },
              { label: "✈️ International Tours", query: "International", isType: true },
            ].map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => {
                  if (tag.isType) {
                    router.push(`/treks?type=${encodeURIComponent(tag.query)}`);
                  } else {
                    router.push(`/treks?search=${encodeURIComponent(tag.query)}`);
                  }
                }}
                className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white font-medium text-xs transition transform hover:scale-105 cursor-pointer shadow-xs"
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Subtle Carousel Dots Indicator */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {CAROUSEL_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => handleSelectSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  slideIndex === idx
                    ? "w-8 h-2 bg-white"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Slide ${idx + 1}: ${slide.title}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
