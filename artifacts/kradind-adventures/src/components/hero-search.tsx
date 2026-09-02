"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
    <section
      className="relative bg-cover bg-center text-white py-24 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 58, 46, 0.75), rgba(15, 58, 46, 0.85)), url('${bgImage}')`,
      }}
    >
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
                <option value="All">All Himalayan Regions</option>
                <option value="Uttarakhand">Uttarakhand (Garhwal)</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Kashmir">Kashmir Valley</option>
                <option value="International">Bali & Vietnam</option>
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
                <option value="All">All Months</option>
                <option value="Monsoon">July - Aug (Monsoon Blooms)</option>
                <option value="Autumn">Sept - Nov (Autumn Clear)</option>
                <option value="Snow">Dec - Feb (Snow Treks)</option>
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
        <div className="pt-6 flex justify-center items-center gap-6 overflow-x-auto">
          
          <div
            onClick={() => handleCategoryClick("Himalayas")}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-white/60 p-0.5 overflow-hidden group-hover:scale-105 transition shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=150&q=80"
                alt="Himalayas"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-xs font-medium text-slate-200 group-hover:text-white">
              Himalayas
            </span>
          </div>

          <div
            onClick={() => handleCategoryClick("Kerala")}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-white/60 p-0.5 overflow-hidden group-hover:scale-105 transition shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=150&q=80"
                alt="Kerala"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-xs font-medium text-slate-200 group-hover:text-white">
              Kerala
            </span>
          </div>

          <div
            onClick={() => handleCategoryClick("Vietnam")}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-white/60 p-0.5 overflow-hidden group-hover:scale-105 transition shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=150&q=80"
                alt="Vietnam"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-xs font-medium text-slate-200 group-hover:text-white">
              Vietnam
            </span>
          </div>

          <div
            onClick={() => handleCategoryClick("Weekend")}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-white/60 p-0.5 overflow-hidden group-hover:scale-105 transition shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=150&q=80"
                alt="Weekend"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-xs font-medium text-slate-200 group-hover:text-white">
              Weekend
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
