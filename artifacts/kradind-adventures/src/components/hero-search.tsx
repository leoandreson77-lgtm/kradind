"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";

export function HeroSearch({
  config,
}: {
  config?: { badge?: string; title?: string; subtitle?: string; bgImage?: string };
}) {
  const router = useRouter();
  const [tripType, setTripType] = useState("Trek");
  const [destination, setDestination] = useState("All");
  const [season, setSeason] = useState("All");

  const badge = config?.badge || "Certified Himalayan Guides • Small Safe Batches";
  const title = config?.title || "Find Your Next Adventure...";
  const subtitle = config?.subtitle || "Explore handpicked Himalayan treks, tropical road trips, and international backpacking circuits.";
  const bgImage = config?.bgImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (tripType !== "All") params.set("type", tripType);
    if (destination !== "All") params.set("destination", destination);
    if (season !== "All") params.set("season", season);

    router.push(`/treks?${params.toString()}`);
  };

  const handleCategoryClick = (cat: string) => {
    router.push(`/treks?type=${encodeURIComponent(cat)}`);
  };

  return (
    <section className="relative text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Optimized preloaded background image for mobile LCP */}
      <Image
        src={bgImage}
        alt="Himalayan Adventure Trekking"
        fill
        priority
        quality={75}
        sizes="100vw"
        className="object-cover object-center -z-10"
      />
      {/* Brand emerald overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F3A2E]/85 via-[#0F3A2E]/80 to-[#0F3A2E]/90 -z-10" />

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        
        {/* Badge */}
        <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
          {badge}
        </span>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight brand-font">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal">
          {subtitle}
        </p>

        {/* Search Widget Container */}
        <form
          onSubmit={handleSearch}
          className="mt-8 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-2xl text-slate-800 max-w-4xl mx-auto border border-white/30 text-left"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Field 1: Trip Type */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Trip Type
              </label>
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                className="w-full mt-1 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0F3A2E] outline-none"
              >
                <option value="Trek">🏔️ Trek / High Altitude</option>
                <option value="Road Trip">🚗 Domestic Road Trip</option>
                <option value="International">✈️ International Backpacking</option>
                <option value="Weekend">⛺ Weekend Getaway</option>
              </select>
            </div>

            {/* Field 2: Destination */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full mt-1 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0F3A2E] outline-none"
              >
                <option value="All">All Regions & States</option>
                <option value="Uttarakhand">Uttarakhand (Chopta & Nainital)</option>
                <option value="Himachal">Himachal (Hampta & Kheerganga)</option>
                <option value="Ladakh">Leh Ladakh (Pangong & Nubra)</option>
                <option value="Kerala">Kerala (Munnar & Backwaters)</option>
                <option value="Meghalaya">Meghalaya (Root Bridges & Cherrapunji)</option>
                <option value="Rajasthan">Rajasthan (Jaipur & Jaisalmer)</option>
                <option value="Goa">Goa (Beaches & Forts)</option>
                <option value="Sikkim">Sikkim & Gangtok</option>
                <option value="Assam">Assam & Kaziranga</option>
              </select>
            </div>

            {/* Field 3: Season */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Month / Season
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full mt-1 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#0F3A2E] outline-none"
              >
                <option value="All">All Months / Any Time</option>
                <option value="Weekend">Quick Weekend Breaks</option>
                <option value="Monsoon">July - Sept (Monsoon & Blooms)</option>
                <option value="Autumn">Oct - Nov (Clear Peaks)</option>
                <option value="Winter">Dec - Feb (Winter & Snow)</option>
              </select>
            </div>

            {/* Field 4: Search Button */}
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
        <div className="pt-6 flex justify-center items-center gap-5 sm:gap-8 overflow-x-auto scrollbar-none">
          
          <div
            onClick={() => handleCategoryClick("Himalayas")}
            className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-white/80 p-0.5 overflow-hidden group-hover:scale-105 transition shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=150&q=80"
                alt="Himalayas"
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
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
