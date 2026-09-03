"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookingModal } from "@/components/booking-modal";
import { treks, TrekData } from "@/lib/travel-data";
import {
  Clock,
  Mountain,
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  Calendar,
  ShieldAlert,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  MessageCircle,
  Sparkles,
  Luggage,
  HelpCircle,
  Award,
  Users,
} from "lucide-react";

export default function TrekDetailPage() {
  const params = useParams();
  const slug = (params.slug as string) || "chopta-tungnath-chandrashila";

  // Find matching package or fallback to first one
  const trek: TrekData =
    treks.find((t) => t.slug === slug) ||
    treks.find((t) => t.slug.includes(slug)) ||
    treks[0];

  const [bookingOpen, setBookingOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"itinerary" | "highlights" | "inclusions" | "faqs">("itinerary");

  const whatsappMessage = encodeURIComponent(
    `Hi KRADIND Adventures! I am interested in booking or getting details for "${trek.name}" (${trek.duration}). Please share details.`
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <TopBar />
      <Header />

      {/* Hero Banner */}
      <div
        className="relative bg-cover bg-center py-16 sm:py-24 px-4 sm:px-8 text-white shadow-inner"
        style={{
          backgroundImage: `linear-gradient(rgba(11, 36, 29, 0.85), rgba(11, 36, 29, 0.92)), url('${trek.image}')`,
        }}
      >
        <div className="max-w-7xl mx-auto space-y-4">
          <Link
            href="/treks"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all Treks & Packages
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-3 py-1 rounded-full font-bold">
              ⭐ {trek.rating} / 5.0 ({trek.reviewCount} Verified Reviews)
            </span>
            <span className="bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-slate-200 font-medium">
              📍 {trek.location}
            </span>
            <span className="bg-[#FF6B35]/30 text-orange-200 border border-orange-400/40 px-3 py-1 rounded-full font-semibold">
              {trek.badge || "Verified Tour"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold brand-font text-white max-w-4xl tracking-tight leading-tight">
            {trek.name}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            {trek.tagline}
          </p>

          <div className="flex flex-wrap gap-4 sm:gap-8 text-xs text-slate-200 pt-4 border-t border-white/15 max-w-3xl">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Duration</span>
              <strong className="text-white text-sm sm:text-base font-bold">{trek.duration}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Max Altitude / Type</span>
              <strong className="text-white text-sm sm:text-base font-bold">{trek.altitude}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Grade</span>
              <strong className="text-white text-sm sm:text-base font-bold">{trek.difficulty}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Region</span>
              <strong className="text-white text-sm sm:text-base font-bold">{trek.region}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Breakdown Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Content Sections) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
            <button
              onClick={() => setActiveTab("itinerary")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                activeTab === "itinerary"
                  ? "bg-[#0F3A2E] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              🗓️ Detailed Itinerary ({trek.itinerary?.length || 0} Days)
            </button>
            <button
              onClick={() => setActiveTab("highlights")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                activeTab === "highlights"
                  ? "bg-[#0F3A2E] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              ✨ Highlights
            </button>
            <button
              onClick={() => setActiveTab("inclusions")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                activeTab === "inclusions"
                  ? "bg-[#0F3A2E] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              📋 Inclusions & Exclusions
            </button>
            <button
              onClick={() => setActiveTab("faqs")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                activeTab === "faqs"
                  ? "bg-[#0F3A2E] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              ❓ FAQs ({trek.faqs?.length || 0})
            </button>
          </div>

          {/* Overview Section */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#0F3A2E] font-bold text-sm">
              <Sparkles className="w-5 h-5 text-[#FF6B35]" />
              <span>OVERVIEW</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 brand-font">
              About the Journey
            </h2>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-3">
              {trek.overview}
            </div>
          </div>

          {/* Highlights Section */}
          {(activeTab === "highlights" || activeTab === "itinerary") && trek.highlights && trek.highlights.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#0F3A2E] font-bold text-sm">
                <Star className="w-5 h-5 text-[#FF6B35]" />
                <span>EXPEDITION HIGHLIGHTS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 brand-font">
                Why You Will Love This Trip
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {trek.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-xl text-xs sm:text-sm text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itinerary Section */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#0F3A2E] font-bold text-sm">
                  <Calendar className="w-5 h-5 text-[#FF6B35]" />
                  <span>DAY BY DAY ITINERARY</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 brand-font mt-1">
                  Tour Schedule & Route
                </h2>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold">
                {trek.itinerary?.length} Days Plan
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {trek.itinerary && trek.itinerary.length > 0 ? (
                trek.itinerary.map((dayItem) => (
                  <div
                    key={dayItem.day}
                    className="border border-slate-200 rounded-xl p-5 hover:border-emerald-300 transition bg-slate-50/40"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="bg-[#0F3A2E] text-white text-xs font-extrabold px-3 py-1 rounded-full">
                          Day {dayItem.day}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          {dayItem.title}
                        </h3>
                      </div>
                      {dayItem.distance && (
                        <span className="text-xs bg-white border border-slate-200 px-2.5 py-0.5 rounded-full text-slate-500 font-medium">
                          {dayItem.distance}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-1">
                      {dayItem.description}
                    </p>

                    {(dayItem.meal || dayItem.stay || dayItem.altitude) && (
                      <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-200/60 text-[11px] text-slate-500">
                        {dayItem.meal && (
                          <span className="flex items-center gap-1">
                            🍽️ <strong className="text-slate-700">Meals:</strong> {dayItem.meal}
                          </span>
                        )}
                        {dayItem.stay && (
                          <span className="flex items-center gap-1">
                            🏕️ <strong className="text-slate-700">Stay:</strong> {dayItem.stay}
                          </span>
                        )}
                        {dayItem.altitude && (
                          <span className="flex items-center gap-1">
                            🏔️ <strong className="text-slate-700">Alt:</strong> {dayItem.altitude}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">Itinerary details available upon request.</p>
              )}
            </div>
          </div>

          {/* Photo Gallery */}
          {trek.gallery && trek.gallery.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 brand-font">
                Photo Gallery
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {trek.gallery.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group"
                  >
                    <img
                      src={img}
                      alt={`${trek.name} photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inclusions & Exclusions */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 brand-font">
              Package Inclusions & Exclusions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-[#0F3A2E] text-sm sm:text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  What Is Included
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {trek.inclusions?.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-rose-900 text-sm sm:text-base flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-500" />
                  What Is Not Included
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {trek.exclusions?.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">✗</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* FAQs Accordion */}
          {trek.faqs && trek.faqs.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#0F3A2E] font-bold text-sm">
                <HelpCircle className="w-5 h-5 text-[#FF6B35]" />
                <span>FREQUENTLY ASKED QUESTIONS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 brand-font">
                Everything You Need to Know
              </h2>

              <div className="space-y-3 pt-2">
                {trek.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="border border-slate-200 rounded-xl overflow-hidden transition"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:bg-slate-50"
                    >
                      <span>{faq.question}</span>
                      {openFaqIndex === i ? (
                        <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {openFaqIndex === i && (
                      <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Sticky Booking Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md sticky top-24 space-y-5">
            
            {/* Price Header */}
            <div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">
                Starting From / Person
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0F3A2E] brand-font">
                  ₹{trek.price.toLocaleString("en-IN")}
                </span>
                {trek.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{trek.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full ml-auto">
                  Save ₹{(trek.originalPrice - trek.price).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setBookingOpen(true)}
                className="w-full bg-[#0F3A2E] hover:bg-[#164e3f] text-white font-bold text-sm py-3.5 rounded-xl shadow-md transition transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Adventure Now</span>
              </button>

              <a
                href={`https://wa.me/917500222141?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm py-3 rounded-xl shadow-sm transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (7500222141)</span>
              </a>

              <a
                href="tel:+917500222141"
                className="w-full bg-slate-50 hover:bg-slate-100 text-[#0F3A2E] border border-slate-200 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span>Direct Call Desk: +91 75002 22141</span>
              </a>
            </div>

            {/* Upcoming Batches */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold text-slate-700 block">Upcoming Batches & Slots</span>
              <div className="space-y-2 text-xs">
                {trek.batches?.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <div>
                      <strong className="text-slate-900 block">{b.startDate}</strong>
                      <span className="text-slate-500 text-[11px]">{b.endDate}</span>
                    </div>
                    <span className="text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded text-[11px]">
                      {b.slotsLeft} slots left
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Book With KRADIND */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
              <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                KRADIND Certified Guarantee
              </span>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Certified Himalayan Leaders & Certified Guides</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Small, Safe & Co-Ed Friendly Batches</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>High-Altitude Safety Gear & First Aid</span>
              </div>
            </div>

          </div>
        </div>

      </main>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        initialTrek={trek.name}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
