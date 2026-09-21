"use client";

import React, { useEffect, useState } from "react";
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

  const handleOpenBooking = (trekName?: string) => {
    if (trekName) setSelectedTrek(trekName);
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
        {/* Hero Banner with Filter Widget */}
        <HeroSearch config={sections?.hero} />

        {/* Dynamic Campaigns & Landing Pages Section */}
        <CampaignSection initialCampaigns={initialCampaigns} />

        {/* 4.9+ Rated Best Treks */}
        <BestTreks
          treks={treks}
          onSelectTrek={(slug) => handleOpenBooking(slug)}
          config={sections?.bestTreks}
        />

        {/* Monsoon Specials & Valley Blooms Banner */}
        <MonsoonSpecials
          config={sections?.monsoon}
          onClaimCoupon={(code) => handleOpenBooking("Valley of Flowers & Hemkund")}
        />

        {/* Zero Work Leave Weekend Treks */}
        <WeekendTreks treks={treks} config={sections?.weekendTreks} />

        {/* International Holidays & World Tours Showcase */}
        <InternationalShowcase config={sections?.international} />

        {/* Live Ground Radar */}
        <LiveRadar initialReports={radarReports} />

        {/* Social Share Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-end">
          <SocialShare title="KRADIND Adventures | Himalayan Treks & Expeditions" />
        </div>

        {/* E-E-A-T Editorial Authority, Founder Credentials & FAQs */}
        <EEATAuthoritySection config={sections?.eeat} />
      </main>

      {/* Footer */}
      <Footer config={sections?.contactAndFooter} />

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialTrek={selectedTrek}
      />
    </div>
  );
}
