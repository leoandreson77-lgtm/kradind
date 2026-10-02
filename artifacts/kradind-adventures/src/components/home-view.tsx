"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  CheckCircle2,
  Headphones,
  Mountain,
  Car,
  Globe,
  Zap,
  ArrowRight,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { HeroSearch } from "@/components/hero-search";
import { CampaignSection } from "@/components/campaign-section";
import { BestTreks } from "@/components/best-treks";
import { MonsoonSpecials } from "@/components/monsoon-specials";
import { WeekendTreks } from "@/components/weekend-treks";
import { LiveRadar } from "@/components/live-radar";
import { Footer } from "@/components/footer";
import { BookingModal } from "@/components/booking-modal";
import { SeasonalTreksCarousel } from "@/components/seasonal-treks-carousel";
import { EEATAuthoritySection } from "@/components/eeat-authority-section";
import { InternationalShowcase } from "@/components/international-showcase";
import { SocialShare } from "@/components/social-share";
import { HomeSectionsConfig, TrailRadarReport, TrekData } from "@/lib/cms-store";

export function HomeView({
  initialSections,
  initialReports,
  initialCampaigns,
  initialTreks,
}: {
  initialSections?: HomeSectionsConfig | null;
  initialReports?: TrailRadarReport[];
  initialCampaigns?: any[];
  initialTreks?: TrekData[];
}) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTrek, setSelectedTrek] = useState("Kedarkantha Summit Trek");
  const [selectedBatchDate, setSelectedBatchDate] = useState<string | undefined>(undefined);
  const [sections, setSections] = useState<HomeSectionsConfig | null>(
    initialSections || null
  );
  const [radarReports, setRadarReports] = useState<TrailRadarReport[] | undefined>(
    initialReports
  );
  const [treks, setTreks] = useState<TrekData[]>(initialTreks || []);

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch("/api/content", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.homeSections) setSections(data.homeSections);
          if (data.trailReports) setRadarReports(data.trailReports);
          if (data.treks && Array.isArray(data.treks)) setTreks(data.treks);
        }
      } catch (err) {
        console.error("Failed to load CMS content", err);
      }
    }
    loadContent();
  }, []);

  const handleOpenBooking = (trekName?: string, batchDate?: string) => {
    if (trekName) setSelectedTrek(trekName);
    if (batchDate) setSelectedBatchDate(batchDate);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Fixed Sticky Top Navigation Header */}
      <div className="sticky top-0 z-50 w-full shadow-xs">
        <TopBar config={sections?.topBar} />
        <Header onBookClick={() => handleOpenBooking("Kedarkantha Summit Trek")} />
      </div>

      {/* Main content */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* 1. Hero Banner with Modern Clean Search Widget */}
        <HeroSearch config={sections?.hero} />

        {/* 2. Trust & Excellence Highlights Strip */}
        <section className="relative -mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/80 p-4 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="flex items-center gap-3.5 pt-2 sm:pt-0">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <span className="font-extrabold text-xs sm:text-sm text-slate-900 block leading-tight">Govt. Certified Leaders</span>
                <span className="text-[11px] text-slate-500">NIM &amp; IMF trained guides</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <span className="font-extrabold text-xs sm:text-sm text-slate-900 block leading-tight">4.9/5 Star Rating</span>
                <span className="text-[11px] text-slate-500">15,000+ Happy Explorers</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <span className="font-extrabold text-xs sm:text-sm text-slate-900 block leading-tight">Transparent Pricing</span>
                <span className="text-[11px] text-slate-500">All permits &amp; meals included</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-800 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <div>
                <span className="font-extrabold text-xs sm:text-sm text-slate-900 block leading-tight">24/7 Trip Support</span>
                <span className="text-[11px] text-slate-500">Real-time ground assistance</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Four Core Travel Categories (Clear Visual Portals) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-extrabold text-[#0F3A2E] uppercase tracking-wider block">
                Tailored Travel Portals
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-0.5 brand-font">
                Choose Your Travel Style
              </h2>
            </div>
            <Link
              href="/treks"
              className="text-xs sm:text-sm font-bold text-[#FF6B35] hover:text-[#e8590c] flex items-center gap-1 transition"
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* 1. Himalayan Treks */}
            <Link
              href="/treks?type=Trek"
              className="group relative rounded-2xl overflow-hidden h-44 sm:h-52 p-5 flex flex-col justify-end text-white shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1"
            >
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
                alt="Himalayan Treks"
                width={600}
                height={400}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 group-hover:from-black/90 transition" />
              <div className="relative z-10 space-y-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/90 text-white uppercase tracking-wider backdrop-blur-xs">
                  <Mountain className="w-3 h-3" /> 20+ Summits
                </span>
                <h3 className="text-lg font-black brand-font leading-snug">
                  Himalayan Treks
                </h3>
                <p className="text-[11px] text-slate-200 line-clamp-1">
                  Kedarkantha, Chopta, Hampta Pass &amp; snow trails
                </p>
              </div>
            </Link>

            {/* 2. Domestic Tours */}
            <Link
              href="/treks?type=Domestic"
              className="group relative rounded-2xl overflow-hidden h-44 sm:h-52 p-5 flex flex-col justify-end text-white shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1"
            >
              <img
                src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80"
                alt="Domestic Tours"
                width={600}
                height={400}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 group-hover:from-black/90 transition" />
              <div className="relative z-10 space-y-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/90 text-white uppercase tracking-wider backdrop-blur-xs">
                  <Car className="w-3 h-3" /> India Circuits
                </span>
                <h3 className="text-lg font-black brand-font leading-snug">
                  Domestic Tours
                </h3>
                <p className="text-[11px] text-slate-200 line-clamp-1">
                  Kerala backwaters, Rajasthan palaces, Goa &amp; Ladakh
                </p>
              </div>
            </Link>

            {/* 3. International Holidays */}
            <Link
              href="/international-trips"
              className="group relative rounded-2xl overflow-hidden h-44 sm:h-52 p-5 flex flex-col justify-end text-white shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1"
            >
              <img
                src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80"
                alt="International Holidays"
                width={600}
                height={400}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 group-hover:from-black/90 transition" />
              <div className="relative z-10 space-y-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/90 text-white uppercase tracking-wider backdrop-blur-xs">
                  <Globe className="w-3 h-3" /> Global Escapes
                </span>
                <h3 className="text-lg font-black brand-font leading-snug">
                  International Trips
                </h3>
                <p className="text-[11px] text-slate-200 line-clamp-1">
                  Bali beaches, Dubai desert, Thailand &amp; Vietnam
                </p>
              </div>
            </Link>

            {/* 4. Weekend Getaways */}
            <Link
              href="/treks?type=Weekend"
              className="group relative rounded-2xl overflow-hidden h-44 sm:h-52 p-5 flex flex-col justify-end text-white shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1"
            >
              <img
                src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80"
                alt="Weekend Getaways"
                width={600}
                height={400}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 group-hover:from-black/90 transition" />
              <div className="relative z-10 space-y-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/90 text-white uppercase tracking-wider backdrop-blur-xs">
                  <Zap className="w-3 h-3" /> 2-3 Days Fast Break
                </span>
                <h3 className="text-lg font-black brand-font leading-snug">
                  Weekend Escapes
                </h3>
                <p className="text-[11px] text-slate-200 line-clamp-1">
                  Zero leave needed • Chopta, Nainital &amp; Rishikesh
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* 4. Seasonal Handpicked Expeditions Carousel (Indiahikes-style) */}
        <SeasonalTreksCarousel
          treks={treks}
          config={sections?.seasonalCollection}
          onBookTrek={(trekName, batchDate) => handleOpenBooking(trekName, batchDate)}
        />

        {/* 5. Top Trending Expeditions & Flagship Packages */}
        <BestTreks
          treks={treks}
          onSelectTrek={(slug) => handleOpenBooking(slug)}
          config={sections?.bestTreks}
        />

        {/* 5. Monsoon Specials & Promotional Offer */}
        <MonsoonSpecials
          config={sections?.monsoon}
          onClaimCoupon={(code) => handleOpenBooking("Valley of Flowers & Hemkund")}
        />

        {/* 6. Zero Work Leave Weekend Treks */}
        <WeekendTreks treks={treks} config={sections?.weekendTreks} />

        {/* 7. Dynamic Campaigns & Landing Pages Section */}
        <CampaignSection initialCampaigns={initialCampaigns} />

        {/* 8. International Holidays & World Tours Showcase */}
        <InternationalShowcase config={sections?.international} />

        {/* 9. Live Ground Radar */}
        <LiveRadar initialReports={radarReports} />

        {/* 10. Editorial Philosophy & Traveler Guide (Boosts Text-to-HTML ratio, balances Link Density) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                About KRADIND Adventures
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 brand-font tracking-tight">
                Authentic Mountain Journeys and Thoughtful Holiday Escapes
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Founded in Dehradun at the foothills of the Himalayas, KRADIND Adventures brings together passionate explorers, certified trek leaders, and local mountain communities. We believe travel should be safe, refreshing, and respectful of nature. Whether you are climbing your first Himalayan peak or setting off on a relaxed family tour, our team takes care of every detail so you can focus on the experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Small Group Safety
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We keep group sizes small so every traveler receives personal attention. Our leaders monitor daily health, carry emergency medical supplies, and follow trusted acclimatization routines on high mountain routes.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  Eco-Friendly Expeditions
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We practice clean trail habits across all Himalayan routes. We carry all non-biodegradable waste back to basecamps, partner with local homestays, and protect fragile alpine meadows for generations to come.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                  Transparent Travel
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every package includes verified stays, nutritious meals, expert guides, and clear pricing with no surprise charges. From booking to summit day, our Dehradun basecamp team supports you 24 hours a day.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Social Share Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-end">
          <SocialShare title="KRADIND Adventures | Himalayan Treks & Expeditions" />
        </div>

        {/* 12. E-E-A-T Editorial Authority, Founder Credentials & FAQs */}
        <EEATAuthoritySection config={sections?.eeat} />
      </main>

      {/* Footer */}
      <Footer config={sections?.contactAndFooter} />

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialTrek={selectedTrek}
        initialBatchDate={selectedBatchDate}
      />
    </div>
  );
}
