"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { MountainAtmosphere, AtmosphereMode } from "@/components/mountain-atmosphere";

interface CarouselSlide {
  id: string;
  image: string;
  badge: string;
  title: string;
  tagline: string;
  weatherMode: AtmosphereMode;
}

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: "ocean-sunrise",
    image: "/ocean-sunrise.jpg", // Real ultra-photorealistic ocean sunrise photo
    badge: "🌅 Ocean Sunrise • Goa & Kerala Sea",
    title: "Golden Ocean Sunrise",
    tagline: "Golden sun rising over open sea waters with shimmering wave reflections",
    weatherMode: "sunrise", // ONLY ocean sunrise gets ocean sunrise effects!
  },
  {
    id: "himalayan-snow",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85",
    badge: "❄️ Alpine Snow • Kedarkantha & Chopta",
    title: "Himalayan Snow Peaks",
    tagline: "High-altitude frosty alpine summits & certified winter mountaineering",
    weatherMode: "snow", // ONLY snow mountains get snowfall!
  },
  {
    id: "monsoon-rain",
    image: "/monsoon-rain.jpg", // Real dramatic stormy monsoon rain clouds & misty mountains!
    badge: "🌧️ Monsoon Rain • Storm Clouds & Falls",
    title: "Monsoon Rain & Mist",
    tagline: "Authentic monsoon rainfall, stormy mountain ridges & lush misty valleys",
    weatherMode: "rain", // ONLY stormy clouds get rain! No rain on clear sunny sky!
  },
  {
    id: "kerala-backwaters",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=85",
    badge: "🌴 Clear Skies • Alleppey & Munnar",
    title: "Backwaters & Palms",
    tagline: "Peaceful houseboat cruises, sunny palm groves & clear emerald tea gardens",
    weatherMode: "clear", // CLEAR WEATHER! Mausam Saaf - NO rain, NO sunrise rays over palms!
  },
];

export function HeroSearch({
  config,
}: {
  config?: { badge?: string; title?: string; subtitle?: string; bgImage?: string };
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
              className={`absolute inset-0 transition-all ${
                isActive
                  ? "opacity-100 scale-100 z-1 pointer-events-auto"
                  : "opacity-0 scale-105 z-0 pointer-events-none"
              }`}
              style={{
                transitionDuration: "1600ms",
                transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
                willChange: "opacity, transform",
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
                loading={idx === 0 ? "eager" : "lazy"}
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
          {/* Badge & Active Scene Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-2 bg-slate-950/85 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-extrabold px-4 sm:px-5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>{badge}</span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight brand-font drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-100 max-w-2xl mx-auto font-normal drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
            {subtitle}
          </p>
        </div>

        {/* Carousel Slide Switcher Pills with smooth progress */}
        <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
          {CAROUSEL_SLIDES.map((slide, idx) => {
            const isActive = slideIndex === idx;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => handleSelectSlide(idx)}
                className={`relative overflow-hidden transition-all duration-500 rounded-full cursor-pointer px-4 py-1.5 text-xs font-semibold backdrop-blur-md border ${
                  isActive
                    ? "bg-white text-slate-900 border-white shadow-xl scale-105"
                    : "bg-slate-950/60 hover:bg-slate-900/80 text-slate-200 border-white/20 hover:border-white/40"
                }`}
              >
                {/* Smooth GPU-Accelerated Progress Fill inside active pill */}
                {isActive && isAutoPlaying && (
                  <span
                    key={slideIndex}
                    className="absolute inset-0 bg-emerald-500/20 pointer-events-none origin-left"
                    style={{
                      animation: "progressFill 5000ms linear forwards",
                    }}
                  />
                )}
                <span className="relative z-10">{slide.title}</span>
              </button>
            );
          })}
        </div>
        <form
          onSubmit={handleSearch}
          className="mt-8 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-2xl text-slate-800 max-w-5xl mx-auto border border-white/30 text-left"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* Field 1: Keyword Input */}
            <div>
              <label htmlFor="hero-keyword" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Keyword / Search
              </label>
              <input
                id="hero-keyword"
                name="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. Domestic, Kerala, Chopta..."
                className="w-full mt-1 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0F3A2E] outline-none"
              />
            </div>

            {/* Field 2: Trip Type */}
            <div>
              <label htmlFor="hero-trip-type" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Trip Type
              </label>
              <select
                id="hero-trip-type"
                name="tripType"
                aria-label="Trip Type"
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                className="w-full mt-1 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0F3A2E] outline-none"
              >
                <option value="All">🌟 All Trips & Treks</option>
                <option value="Domestic">🚗 Domestic Tours & Road Trips</option>
                <option value="Trek">🏔️ Himalayan & Alpine Treks</option>
                <option value="Weekend">⛺ Weekend Getaways</option>
                <option value="International">✈️ International Backpacking</option>
              </select>
            </div>

            {/* Field 3: Destination */}
            <div>
              <label htmlFor="hero-destination" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Destination
              </label>
              <select
                id="hero-destination"
                name="destination"
                aria-label="Destination Region or State"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full mt-1 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0F3A2E] outline-none"
              >
                <option value="All">All Regions & States</option>
                <option value="Uttarakhand">Uttarakhand (Chopta, Nainital & Kedarnath)</option>
                <option value="Himachal">Himachal (Hampta & Kasol)</option>
                <option value="Ladakh">Leh Ladakh (Pangong & Nubra)</option>
                <option value="Kerala">Kerala (Munnar & Backwaters)</option>
                <option value="Rajasthan">Rajasthan (Jaipur & Jaisalmer)</option>
                <option value="Goa">Goa (Beaches & Forts)</option>
                <option value="Maharashtra">Maharashtra (Hills & Ghats)</option>
                <option value="Meghalaya">Meghalaya (Living Roots & Cherrapunji)</option>
                <option value="Sikkim">Sikkim & Gangtok</option>
                <option value="Assam">Assam & Kaziranga</option>
              </select>
            </div>

            {/* Field 4: Season */}
            <div>
              <label htmlFor="hero-season" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Month / Season
              </label>
              <select
                id="hero-season"
                name="season"
                aria-label="Month or Travel Season"
                value={season}
                onChange={(e) => {
                  const val = e.target.value;
                  setSeason(val);
                  setIsAutoPlaying(false);
                  if (val === "Winter") {
                    setSlideIndex(1); // Himalayan Snow Peaks
                  } else if (val === "Monsoon") {
                    setSlideIndex(2); // Monsoon Rain & Stormy Mountains
                  } else if (val === "Autumn" || val === "Weekend") {
                    setSlideIndex(3); // Clear Backwaters & Palms
                  } else {
                    setSlideIndex(0); // Golden Ocean Sunrise
                  }
                }}
                className="w-full mt-1 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0F3A2E] outline-none"
              >
                <option value="All">All Months / Any Time</option>
                <option value="Weekend">Quick Weekend Breaks</option>
                <option value="Monsoon">July - Sept (Monsoon & Blooms)</option>
                <option value="Autumn">Oct - Nov (Clear Peaks)</option>
                <option value="Winter">Dec - Feb (Winter & Snow)</option>
              </select>
            </div>

            {/* Field 5: Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-[#FF6B35] hover:bg-[#e8590c] text-white font-bold p-2.5 rounded-lg text-xs tracking-wide transition flex items-center justify-center gap-2 shadow-lg transform active:scale-95"
              >
                <Search className="w-4 h-4" /> Search Trips
              </button>
            </div>

          </div>
        </form>

        {/* Region Story Avatars */}
        <div className="pt-6 flex justify-start sm:justify-center items-center gap-4 sm:gap-8 overflow-x-auto scrollbar-none px-2 sm:px-0">
          
          <div
            onClick={() => handleCategoryClick("Domestic")}
            className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-emerald-400 p-0.5 overflow-hidden group-hover:scale-105 transition shadow-lg bg-emerald-800">
              <img
                src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=150&q=80"
                alt="Domestic Tours"
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-xs font-bold text-emerald-300 group-hover:text-white">Domestic</span>
          </div>

          <div
            onClick={() => handleCategoryClick("Himalayas")}
            className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-white/80 p-0.5 overflow-hidden group-hover:scale-105 transition shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=150&q=80"
                alt="Himalayas"
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white">Himalayas</span>
          </div>

          <div
            onClick={() => handleCategoryClick("Kerala")}
            className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-white/80 p-0.5 overflow-hidden group-hover:scale-105 transition shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=150&q=80"
                alt="Kerala"
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white">Kerala</span>
          </div>

          <div
            onClick={() => handleCategoryClick("Ladakh")}
            className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-white/80 p-0.5 overflow-hidden group-hover:scale-105 transition shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=150&q=80"
                alt="Ladakh"
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white">Ladakh</span>
          </div>

          <div
            onClick={() => handleCategoryClick("Meghalaya")}
            className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-white/80 p-0.5 overflow-hidden group-hover:scale-105 transition shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=150&q=80"
                alt="Meghalaya"
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white">Meghalaya</span>
          </div>

          <div
            onClick={() => handleCategoryClick("Rajasthan")}
            className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-white/80 p-0.5 overflow-hidden group-hover:scale-105 transition shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=150&q=80"
                alt="Rajasthan"
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white">Rajasthan</span>
          </div>

          <div
            onClick={() => handleCategoryClick("Goa")}
            className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-white/80 p-0.5 overflow-hidden group-hover:scale-105 transition shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=150&q=80"
                alt="Goa"
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white">Goa</span>
          </div>

        </div>

      </div>
    </section>
  );
}
