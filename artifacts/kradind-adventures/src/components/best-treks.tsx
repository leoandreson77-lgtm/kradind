"use client";

import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";

export interface TrekItem {
  id: string | number;
  slug: string;
  name: string;
  location: string;
  duration: string;
  altitude: string;
  description: string;
  price: number;
  rating: number;
  image: string;
}

const BEST_TREKS_DATA: TrekItem[] = [
  {
    id: "kedarkantha",
    slug: "nag-tibba",
    name: "Kedarkantha Summit Trek",
    location: "Uttarakhand",
    duration: "⏱️ 6 Days",
    altitude: "⛰️ 12,500 ft",
    description: "Dense pine forests, snow glades, and dramatic summit ridge.",
    price: 8999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ali-bedni",
    slug: "valley-of-flowers",
    name: "Ali Bedni Bugyal Meadow",
    location: "Uttarakhand",
    duration: "⏱️ 6 Days",
    altitude: "⛰️ 11,500 ft",
    description: "Asia's largest alpine meadows with close views of Mt. Trishul.",
    price: 10499,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "kgl",
    slug: "hampta-pass",
    name: "Kashmir Great Lakes",
    location: "Kashmir",
    duration: "⏱️ 7 Days",
    altitude: "⛰️ 13,800 ft",
    description: "Turquoise glacial waters across seven dramatic alpine valleys.",
    price: 15999,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "kuari-pass",
    slug: "triund",
    name: "The Curzon Trail (Kuari Pass)",
    location: "Uttarakhand",
    duration: "⏱️ 6 Days",
    altitude: "⛰️ 12,516 ft",
    description: "Unmatched vistas of Nanda Devi, Kamet, and Dronagiri peaks.",
    price: 9499,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",
  },
];

export function BestTreks({ onSelectTrek }: { onSelectTrek?: (slug: string) => void }) {
  return (
    <section id="best-treks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[#FF6B35] font-extrabold text-xs uppercase tracking-wider flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#FF6B35] text-[#FF6B35]" /> 4.9+ Rated Legends
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 brand-font">
            Best Himalayan Treks of All Time
          </h2>
        </div>
        <Link href="/treks" className="text-xs font-bold text-[#0F3A2E] hover:underline">
          View all treks →
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {BEST_TREKS_DATA.map((trek) => (
          <div
            key={trek.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition duration-200 flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-44 overflow-hidden">
                <img
                  src={trek.image}
                  alt={trek.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2.5 right-2.5 bg-white/95 text-slate-900 text-[11px] font-extrabold px-2 py-0.5 rounded shadow">
                  ⭐ {trek.rating.toFixed(1)}/5
                </span>
              </div>
              <div className="p-4">
                <div className="text-[11px] text-slate-500 font-semibold mb-1">
                  {trek.duration} • {trek.altitude}
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-snug group-hover:text-[#0F3A2E] transition">
                  {trek.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {trek.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
              <span className="text-sm font-black text-slate-900">
                ₹{trek.price.toLocaleString("en-IN")}
              </span>
              <Link
                href={`/treks/${trek.slug}`}
                className="bg-[#0F3A2E] hover:bg-emerald-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                View Itinerary
              </Link>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
