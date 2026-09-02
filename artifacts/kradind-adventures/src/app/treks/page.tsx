"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookingModal } from "@/components/booking-modal";
import { Search, Filter, Mountain, Star, ArrowRight } from "lucide-react";

interface Trek {
  id: string;
  slug: string;
  name: string;
  location: string;
  category: string;
  duration: string;
  altitude: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  price: number;
  rating: number;
  image: string;
  description: string;
}

const ALL_TREKS: Trek[] = [
  {
    id: "1",
    slug: "hampta-pass",
    name: "Hampta Pass Crossover",
    location: "Himachal Pradesh",
    category: "Himalayas",
    duration: "5 Days",
    altitude: "14,100 Ft",
    difficulty: "Moderate",
    price: 11199,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    description: "Dramatic crossover from green Kullu valley into high-altitude Spiti desert.",
  },
  {
    id: "2",
    slug: "nag-tibba",
    name: "Nag Tibba Summit Trek",
    location: "Uttarakhand",
    category: "Weekend",
    duration: "2 Days",
    altitude: "9,915 Ft",
    difficulty: "Easy",
    price: 2899,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
    description: "Quick weekend reset through dense oak forests with 360 Himalayan views.",
  },
  {
    id: "3",
    slug: "valley-of-flowers",
    name: "Valley of Flowers & Hemkund",
    location: "Uttarakhand",
    category: "Monsoon",
    duration: "6 Days",
    altitude: "14,107 Ft",
    difficulty: "Moderate",
    price: 9999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=800&q=80",
    description: "Carpeted alpine flower valleys with 500+ wildflower species in bloom.",
  },
  {
    id: "4",
    slug: "triund",
    name: "Triund Ridge & Snowline",
    location: "Himachal Pradesh",
    category: "Weekend",
    duration: "2 Days",
    altitude: "9,350 Ft",
    difficulty: "Easy",
    price: 1999,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
    description: "Walk under massive Dhauladhar snow walls with cozy mountain cafes.",
  },
  {
    id: "5",
    slug: "kashmir-great-lakes",
    name: "Kashmir Great Lakes",
    location: "Kashmir",
    category: "High Pass",
    duration: "7 Days",
    altitude: "13,800 Ft",
    difficulty: "Challenging",
    price: 15999,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    description: "Seven emerald glacial lakes tucked inside deep Kashmir valleys.",
  },
  {
    id: "6",
    slug: "pin-bhaba",
    name: "Pin Bhaba Pass Expedition",
    location: "Himachal Pradesh",
    category: "High Pass",
    duration: "7 Days",
    altitude: "16,105 Ft",
    difficulty: "Challenging",
    price: 15600,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    description: "Lush Bhaba grasslands transitioning into dramatic Pin Valley canyon.",
  },
];

function TreksContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "All";

  const [selectedCategory, setSelectedCategory] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTrekName, setSelectedTrekName] = useState("Kedarkantha Summit Trek");

  const filteredTreks = useMemo(() => {
    return ALL_TREKS.filter((trek) => {
      const matchesCategory =
        selectedCategory === "All" ||
        trek.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        trek.location.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesSearch =
        trek.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trek.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty =
        selectedDifficulty === "All" || trek.difficulty === selectedDifficulty;

      return matchesCategory && matchesSearch && matchesDifficulty;
    });
  }, [selectedCategory, searchQuery, selectedDifficulty]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar />
      <Header onBookClick={() => setBookingOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-[#FF6B35] font-extrabold text-xs uppercase tracking-wider">
            Explore All Expeditions
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-2 brand-font">
            Curated Himalayan Escapes
          </h1>
          <p className="text-slate-600 text-sm mt-3">
            Handpicked treks led by certified mountain guides with safety guarantees and small batch sizes.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search trek by name or region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#0F3A2E]"
              />
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-600">Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#0F3A2E]"
              >
                <option value="All">All Levels</option>
                <option value="Easy">Easy / Beginner</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
              </select>
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pt-2 border-t border-slate-100">
            {["All", "Himalayas", "Weekend", "Monsoon", "High Pass"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-[#0F3A2E] text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTreks.map((trek) => (
            <div
              key={trek.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={trek.image}
                    alt={trek.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 right-3 bg-white/95 text-slate-900 text-xs font-extrabold px-2.5 py-1 rounded shadow">
                    ⭐ {trek.rating.toFixed(1)}
                  </span>
                  <span className="absolute bottom-3 left-3 bg-[#0F3A2E]/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {trek.difficulty}
                  </span>
                </div>

                <div className="p-5">
                  <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center justify-between">
                    <span>📍 {trek.location}</span>
                    <span>⏱️ {trek.duration} • ⛰️ {trek.altitude}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0F3A2E] transition">
                    {trek.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {trek.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Starting from</span>
                  <span className="text-base font-black text-slate-900">
                    ₹{trek.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedTrekName(trek.name);
                      setBookingOpen(true);
                    }}
                    className="bg-[#FF6B35] hover:bg-[#e8590c] text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow"
                  >
                    Book Now
                  </button>
                  <Link
                    href={`/treks/${trek.slug}`}
                    className="bg-[#0F3A2E] hover:bg-emerald-900 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1"
                  >
                    Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </main>

      <Footer />
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialTrek={selectedTrekName}
      />
    </div>
  );
}

export default function TreksPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading expeditions...</div>}>
      <TreksContent />
    </Suspense>
  );
}
