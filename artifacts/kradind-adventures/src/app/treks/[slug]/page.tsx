"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookingModal } from "@/components/booking-modal";
import {
  Clock,
  Mountain,
  MapPin,
  Star,
  CheckCircle2,
  Calendar,
  ShieldAlert,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

const TREK_DETAILS_MAPPING: Record<
  string,
  {
    name: string;
    location: string;
    duration: string;
    altitude: string;
    difficulty: string;
    price: number;
    originalPrice: number;
    rating: number;
    image: string;
    description: string;
    itinerary: { day: number; title: string; desc: string; alt: string }[];
  }
> = {
  "nag-tibba": {
    name: "Kedarkantha Summit Trek",
    location: "Sankri, Garhwal Himalayas",
    duration: "6 Days / 5 Nights",
    altitude: "12,500 Ft",
    difficulty: "Moderate",
    price: 8999,
    originalPrice: 10999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
    description:
      "Kedarkantha is famous for its dramatic 360-degree summit views of Swargarohini, Bandarpoonch, and Black Peak. Dense pine forests, snow clearings, and pristine campsites make it an all-time classic.",
    itinerary: [
      { day: 1, title: "Drive from Dehradun to Sankri (6,400 ft)", desc: "Scenic drive along Yamuna and Tons rivers.", alt: "6,400 Ft" },
      { day: 2, title: "Trek from Sankri to Juda Ka Talab", desc: "Climb through pine and maple forests to a frozen lake camp.", alt: "9,100 Ft" },
      { day: 3, title: "Juda Ka Talab to Kedarkantha Base Camp", desc: "Short climb into wide snow glades surrounded by Himalayan peaks.", alt: "11,250 Ft" },
      { day: 4, title: "Summit Push & Descend to Hargaon", desc: "Early 4:00 AM climb to the summit ridge for sunrise.", alt: "12,500 Ft" },
      { day: 5, title: "Hargaon to Sankri & Return to Dehradun", desc: "Descend back into Sankri village.", alt: "6,400 Ft" },
    ],
  },
  "hampta-pass": {
    name: "Hampta Pass Crossover",
    location: "Manali, Himachal Pradesh",
    duration: "5 Days / 4 Nights",
    altitude: "14,100 Ft",
    difficulty: "Moderate",
    price: 11199,
    originalPrice: 13999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
    description:
      "Cross from the emerald valleys of Kullu into the stark moonscape of Spiti in just 5 days.",
    itinerary: [
      { day: 1, title: "Drive from Manali to Jobra & Trek to Chika", desc: "Pine forest trail opening into wide meadows.", alt: "10,100 Ft" },
      { day: 2, title: "Trek from Chika to Balu Ka Ghera", desc: "Walk along the roaring riverbed.", alt: "12,900 Ft" },
      { day: 3, title: "Cross Hampta Pass (14,100 ft) to Shea Goru", desc: "Cross snow bridges into Spiti Valley.", alt: "14,100 Ft" },
      { day: 4, title: "Shea Goru to Chatru & Visit Chandratal Lake", desc: "Drive to the blue crescent lake.", alt: "14,000 Ft" },
    ],
  },
  "valley-of-flowers": {
    name: "Valley of Flowers & Hemkund",
    location: "Govindghat, Uttarakhand",
    duration: "6 Days / 5 Nights",
    altitude: "14,107 Ft",
    difficulty: "Moderate",
    price: 9999,
    originalPrice: 12499,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1600&q=80",
    description:
      "A UNESCO World Heritage sanctuary blooming with hundreds of rare Himalayan wildflower species.",
    itinerary: [
      { day: 1, title: "Drive from Haridwar to Govindghat", desc: "Drive along the holy Alaknanda river.", alt: "6,200 Ft" },
      { day: 2, title: "Govindghat to Ghangaria", desc: "Scenic trail following the Pushpawati stream.", alt: "10,000 Ft" },
      { day: 3, title: "Explore Valley of Flowers", desc: "Carpeted meadows filled with Blue Poppies and Brahmakamal.", alt: "12,700 Ft" },
      { day: 4, title: "Climb to Hemkund Sahib (14,107 ft)", desc: "High-altitude glacial lake and holy shrine.", alt: "14,107 Ft" },
    ],
  },
  triund: {
    name: "Triund Ridge & Snowline",
    location: "McLeod Ganj, Himachal Pradesh",
    duration: "2 Days / 1 Night",
    altitude: "9,350 Ft",
    difficulty: "Easy",
    price: 1999,
    originalPrice: 2990,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
    description:
      "An easy weekend trek under the towering Dhauladhar mountains with panoramic sunset views.",
    itinerary: [
      { day: 1, title: "McLeod Ganj to Triund Top", desc: "Oak & rhododendron trail up to the ridge camp.", alt: "9,350 Ft" },
      { day: 2, title: "Sunrise at Triund & Descend", desc: "Morning view of Kangra valley and descent.", alt: "5,800 Ft" },
    ],
  },
};

export default function TrekDetailPage() {
  const params = useParams();
  const slug = (params.slug as string) || "nag-tibba";
  const trek = TREK_DETAILS_MAPPING[slug] || TREK_DETAILS_MAPPING["nag-tibba"];

  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar />
      <Header onBookClick={() => setBookingOpen(true)} />

      {/* Hero Banner */}
      <div
        className="relative bg-cover bg-center py-20 px-4 sm:px-8 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(11, 36, 29, 0.85), rgba(11, 36, 29, 0.9)), url('${trek.image}')`,
        }}
      >
        <div className="max-w-7xl mx-auto space-y-4">
          <Link
            href="/treks"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all treks
          </Link>
          
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
              ⭐ {trek.rating}/5
            </span>
            <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-slate-200">
              📍 {trek.location}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold brand-font text-white">
            {trek.name}
          </h1>

          <div className="flex flex-wrap gap-6 text-xs text-slate-200 pt-2 border-t border-white/10 max-w-xl">
            <div>
              <span className="text-slate-400 block">Duration</span>
              <strong className="text-white text-sm">{trek.duration}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Max Altitude</span>
              <strong className="text-white text-sm">{trek.altitude}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Difficulty</span>
              <strong className="text-white text-sm">{trek.difficulty}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Breakdown */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Itinerary & Inclusions */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Overview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xl font-bold text-slate-900 brand-font">Trek Overview</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {trek.description}
            </p>
          </div>

          {/* Day by Day Itinerary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 brand-font">Day-by-Day Itinerary</h2>
            <div className="space-y-4">
              {trek.itinerary.map((item) => (
                <div
                  key={item.day}
                  className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0F3A2E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    Day {item.day}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                    <span className="inline-block text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
                      Altitude: {item.alt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Included Features */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 brand-font">What's Included</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Certified & Emergency Trained Trek Leader</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All Meals (Breakfast, Packed Lunch, Dinner)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All Dome Tents, Sleeping Bags & Mattresses</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>First Aid Kit, Oxygen Cylinder & Pulse Oximeter</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Booking Card */}
        <div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl sticky top-24 space-y-6">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Fixed Departure Batch Price</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-slate-900 brand-font">
                  ₹{trek.price.toLocaleString("en-IN")}
                </span>
                <span className="text-sm text-slate-400 line-through">
                  ₹{trek.originalPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-xs text-emerald-600 font-bold mt-1">
                🔥 Includes all permits, tents & meals
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Upcoming Departure Batches
              </h3>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <strong className="block text-slate-900">Jun 14 - Jun 18, 2026</strong>
                  <span className="text-emerald-700 font-bold">6 Slots Remaining</span>
                </div>
                <button
                  onClick={() => setBookingOpen(true)}
                  className="bg-[#0F3A2E] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-900"
                >
                  Select
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <strong className="block text-slate-900">Jun 28 - Jul 02, 2026</strong>
                  <span className="text-emerald-700 font-bold">12 Slots Remaining</span>
                </div>
                <button
                  onClick={() => setBookingOpen(true)}
                  className="bg-[#0F3A2E] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-900"
                >
                  Select
                </button>
              </div>
            </div>

            <button
              onClick={() => setBookingOpen(true)}
              className="w-full bg-[#FF6B35] hover:bg-[#e8590c] text-white text-sm font-bold py-3 rounded-full transition shadow-lg text-center block"
            >
              Book Departure Now
            </button>
          </div>
        </div>

      </main>

      <Footer />
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialTrek={trek.name}
      />
    </div>
  );
}
