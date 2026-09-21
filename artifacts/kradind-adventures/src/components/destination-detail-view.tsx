"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookingModal } from "@/components/booking-modal";
import { DestinationData, TrekData } from "@/lib/cms-store";
import {
  Calendar,
  Clock,
  MapPin,
  Utensils,
  Building,
  CheckCircle2,
  XCircle,
  Sparkles,
  Phone,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Compass,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  Sun,
  Navigation,
} from "lucide-react";
import { treks } from "@/lib/travel-data";
import { getImageAlt } from "@/lib/image-alt";

export function DestinationDetailView({
  destination,
}: {
  destination: DestinationData;
}) {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackageName, setSelectedPackageName] = useState(destination.name + " Circuit");
  const [allTreks, setAllTreks] = useState<TrekData[]>(treks as TrekData[]);

  React.useEffect(() => {
    async function loadFreshTreks() {
      try {
        const res = await fetch("/api/treks", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.treks && Array.isArray(data.treks) && data.treks.length > 0) {
            setAllTreks(data.treks);
          }
        }
      } catch (err) {
        console.error("Failed to load fresh treks:", err);
      }
    }
    loadFreshTreks();
  }, []);

  // Filter packages belonging to this destination
  const destinationTreks = useMemo(() => {
    const destSlug = destination.slug.toLowerCase();
    const destName = destination.name.toLowerCase();
    return allTreks.filter((t) => {
      const cat = (t.category || "").toLowerCase();
      const loc = (t.location || "").toLowerCase();
      const reg = (t.region || "").toLowerCase();
      const name = (t.name || "").toLowerCase();
      const cats = (t.categories || []).map((c) => c.toLowerCase());

      return (
        cat.includes(destSlug) ||
        cat.includes(destName) ||
        loc.includes(destSlug) ||
        loc.includes(destName) ||
        reg.includes(destSlug) ||
        reg.includes(destName) ||
        name.includes(destName) ||
        cats.some((c) => c.includes(destSlug) || c.includes(destName))
      );
    });
  }, [allTreks, destination]);

  const whatsappMessage = encodeURIComponent(
    `Hello KRADIND Adventures! I am interested in the ${destination.name} Tour Circuit (${destination.duration || "Custom Days"}). Please share availability and customized pricing.`
  );

  const discountPercent =
    destination.originalPrice && destination.price && destination.originalPrice > destination.price
      ? Math.round(((destination.originalPrice - destination.price) / destination.originalPrice) * 100)
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Fixed Sticky Top Navigation Header */}
      <div className="sticky top-0 z-50 w-full shadow-xs">
        <TopBar />
        <Header />
      </div>

      {/* HERO SECTION */}
      <section className="relative w-full min-h-[460px] sm:min-h-[520px] bg-slate-950 text-white flex flex-col justify-end overflow-hidden">
        <Image
          src={destination.image}
          alt={`${destination.name} tour destination - KRADIND Adventures`}
          fill
          priority
          className="object-cover opacity-60 scale-105 animate-in fade-in duration-1000"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-4">
          {/* Breadcrumbs & Badge */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link href="/" className="text-slate-300 hover:text-white transition">Home</Link>
            <span className="text-slate-500">/</span>
            <Link href="/destinations" className="text-slate-300 hover:text-white transition">Destinations</Link>
            <span className="text-slate-500">/</span>
            <span className="text-emerald-400 font-semibold">{destination.name}</span>

            {destination.badge && (
              <span className="ml-2 bg-[#FF6B35] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                {destination.badge}
              </span>
            )}
            <span className="bg-white/10 text-white backdrop-blur-xs text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              {destination.category || "Domestic Tour"}
            </span>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black brand-font tracking-tight drop-shadow-md text-white flex items-center gap-3">
              <span>{destination.icon || "📍"}</span>
              <span>{destination.name}</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-200 font-medium leading-relaxed drop-shadow-sm">
              {destination.tagline}
            </p>
          </div>

          {/* Logistics Chips Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-4xl">
            {destination.duration && (
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Duration
                </span>
                <span className="text-xs sm:text-sm font-black text-white block mt-0.5">
                  {destination.duration}
                </span>
              </div>
            )}

            {destination.price && (
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Starting Price
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-sm sm:text-base font-black text-white">
                    ₹{destination.price.toLocaleString("en-IN")}
                  </span>
                  {destination.originalPrice && (
                    <span className="text-[11px] text-slate-400 line-through">
                      ₹{destination.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="text-[9px] font-black bg-emerald-500 text-white px-1.5 py-0.2 rounded-md">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>
            )}

            {destination.bestSeason && (
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                <span className="text-[10px] uppercase font-bold text-sky-400 flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5" /> Best Season
                </span>
                <span className="text-xs sm:text-sm font-black text-white block mt-0.5 truncate">
                  {destination.bestSeason}
                </span>
              </div>
            )}

            {destination.pickupDrop && (
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                <span className="text-[10px] uppercase font-bold text-purple-400 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5" /> Pick-up & Drop
                </span>
                <span className="text-xs sm:text-sm font-black text-white block mt-0.5 truncate">
                  {destination.pickupDrop}
                </span>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => {
                setSelectedPackageName(`${destination.name} Tour Circuit (${destination.duration || "Complete"})`);
                setIsBookingOpen(true);
              }}
              className="px-6 py-3.5 bg-[#FF6B35] hover:bg-[#e85c27] text-white text-xs sm:text-sm font-black rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Book / Customize Circuit</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/919456789012?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-black rounded-2xl shadow-md transition flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            {destination.itinerary && destination.itinerary.length > 0 && (
              <a
                href="#day-by-day-itinerary"
                className="px-5 py-3.5 bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs text-xs sm:text-sm font-bold rounded-2xl transition flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>View {destination.itinerary.length}-Day Itinerary</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* OVERVIEW & HIGHLIGHTS */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span>About {destination.name}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 brand-font">
                Destination Overview & Travel Guide
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                {destination.overview ||
                  `${destination.name} is one of India's most cherished holiday and adventure getaways. Discover timeless landmarks, serene natural settings, verified stays, and private transfers curated by KRADIND Adventures.`}
              </p>
            </div>

            {/* Highlights Box */}
            {destination.highlights && destination.highlights.length > 0 && (
              <div className="w-full md:w-80 bg-slate-50 p-5 rounded-2xl border border-slate-200/90 space-y-3 shrink-0">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                  <span>Key Attractions & Highlights</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {destination.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-xs bg-white text-slate-800 border border-slate-200/80 font-bold px-2.5 py-1 rounded-lg shadow-2xs"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200/80 space-y-2 text-[11px] text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% Certified & Verified Stays</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Private Dedicated AC Cabs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>24/7 On-Tour Ground Support</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* DAY-BY-DAY ITINERARY SECTION */}
        {destination.itinerary && destination.itinerary.length > 0 && (
          <section id="day-by-day-itinerary" className="space-y-6 scroll-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full mb-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Suggested Circuit Itinerary</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 brand-font">
                  Day-by-Day Travel Plan ({destination.duration || `${destination.itinerary.length} Days`})
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Carefully paced itinerary covering top viewpoints, comfortable road transfers, and cultural experiences.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedPackageName(`${destination.name} ${destination.itinerary?.length}-Day Tour`);
                  setIsBookingOpen(true);
                }}
                className="px-4 py-2 bg-[#0F3A2E] hover:bg-[#154d3d] text-white text-xs font-black rounded-xl shadow-xs transition self-start sm:self-auto flex items-center gap-1.5"
              >
                <span>Inquire for this Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Timeline Cards */}
            <div className="space-y-4">
              {destination.itinerary.map((day, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all space-y-3 relative overflow-hidden group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-[#0F3A2E] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                        Day {day.day || idx + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-900 transition">
                        {day.title}
                      </h3>
                    </div>

                    {/* Quick Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {day.distance && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-semibold text-[11px]">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span>{day.distance} {day.duration ? `(${day.duration})` : ""}</span>
                        </span>
                      )}
                      {day.altitude && (
                        <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 px-2.5 py-1 rounded-lg font-semibold text-[11px]">
                          <MapPin className="w-3 h-3 text-sky-600" />
                          <span>{day.altitude}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Activities Tags */}
                  {day.activities && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Activities:
                      </span>
                      <span className="text-xs font-semibold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                        {day.activities}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                    {day.description}
                  </p>

                  {/* Meals & Stay Badges */}
                  {(day.meal || day.stay) && (
                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs border-t border-slate-100">
                      {day.meal && (
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                          <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Meal: <strong className="text-slate-900">{day.meal}</strong></span>
                        </div>
                      )}
                      {day.stay && (
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                          <Building className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Stay: <strong className="text-slate-900">{day.stay}</strong></span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* INCLUSIONS & EXCLUSIONS SECTION */}
        {((destination.inclusions && destination.inclusions.length > 0) ||
          (destination.exclusions && destination.exclusions.length > 0)) && (
          <section className="space-y-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                Transparent Tour Policies
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 brand-font">
                What&apos;s Included & Excluded
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions Card */}
              {destination.inclusions && destination.inclusions.length > 0 && (
                <div className="bg-emerald-50/50 rounded-3xl p-6 sm:p-7 border border-emerald-200/80 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-900 font-black text-sm uppercase tracking-wider">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Inclusions in this Package</span>
                  </div>

                  <ul className="space-y-2.5">
                    {destination.inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exclusions Card */}
              {destination.exclusions && destination.exclusions.length > 0 && (
                <div className="bg-rose-50/50 rounded-3xl p-6 sm:p-7 border border-rose-200/80 space-y-4">
                  <div className="flex items-center gap-2 text-rose-900 font-black text-sm uppercase tracking-wider">
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Exclusions / Extra Expenses</span>
                  </div>

                  <ul className="space-y-2.5">
                    {destination.exclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* TRAVEL TIPS & GUIDELINES */}
        {destination.travelTips && destination.travelTips.length > 0 && (
          <section className="bg-amber-50/60 rounded-3xl p-6 sm:p-7 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-black text-sm uppercase tracking-wider">
              <Info className="w-5 h-5 text-amber-600" />
              <span>Important Travel Tips & Advice for {destination.name}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {destination.travelTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-white/80 p-3 rounded-xl border border-amber-200/50 font-medium">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQS SECTION */}
        {destination.faqs && destination.faqs.length > 0 && (
          <section className="space-y-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                Traveler Help Center
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 brand-font">
                Frequently Asked Questions ({destination.name})
              </h2>
            </div>

            <div className="space-y-3 max-w-4xl">
              {destination.faqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs transition"
                  >
                    <button
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-800 transition"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{faq.question}</span>
                      </span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed font-normal border-t border-slate-100 bg-slate-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TOUR PACKAGES CATALOG IN THIS DESTINATION */}
        <section className="space-y-6 pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full mb-1">
                <span>🎒</span>
                <span>Verified Packages & Departures</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 brand-font">
                Popular Tour Packages & Treks in {destination.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Explore handpicked fixed departure batches with certified tour leads and transparent pricing.
              </p>
            </div>
          </div>

          {destinationTreks.length === 0 ? (
            <div className="p-10 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
              <Compass className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">Custom packages available on request for {destination.name}</p>
              <button
                onClick={() => {
                  setSelectedPackageName(`${destination.name} Custom Package`);
                  setIsBookingOpen(true);
                }}
                className="px-4 py-2 bg-[#0F3A2E] text-white text-xs font-bold rounded-xl"
              >
                Inquire for Custom Quote
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinationTreks.slice(0, 6).map((trek) => (
                <div
                  key={trek.slug}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={trek.image}
                      alt={getImageAlt(trek, "domesticTour")}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500 opacity-90"
                      sizes="(max-width: 768px) 100vw, 350px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {trek.badge && (
                      <span className="absolute top-3 left-3 bg-[#FF6B35] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                        {trek.badge}
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-bold text-emerald-300 block uppercase tracking-wider">
                        {trek.duration} • {trek.difficulty}
                      </span>
                      <h3 className="text-base font-black truncate drop-shadow-sm">
                        {trek.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {trek.tagline || trek.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Starting from</span>
                        <span className="text-base font-black text-slate-900">
                          ₹{trek.price?.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/trek/${trek.slug}`}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedPackageName(trek.name);
                            setIsBookingOpen(true);
                          }}
                          className="px-3.5 py-1.5 bg-[#0F3A2E] hover:bg-[#154d3d] text-white text-xs font-black rounded-xl transition shadow-2xs"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Quick Booking / Lead Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialTrek={selectedPackageName}
      />
    </div>
  );
}
