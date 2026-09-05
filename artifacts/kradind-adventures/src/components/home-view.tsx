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
import { HomeSectionsConfig, TrailRadarReport } from "@/lib/cms-store";

export function HomeView() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTrek, setSelectedTrek] = useState("Kedarkantha Summit Trek");
  const [sections, setSections] = useState<HomeSectionsConfig | null>(null);
  const [radarReports, setRadarReports] = useState<TrailRadarReport[] | undefined>(undefined);

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch("/api/content");
        if (res.ok) {
          const data = await res.json();
          if (data.homeSections) setSections(data.homeSections);
          if (data.trailReports) setRadarReports(data.trailReports);
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
      {/* Top emergency and support bar */}
      <TopBar config={sections?.topBar} />

      {/* Main navigation header */}
      <Header onBookClick={() => handleOpenBooking("Kedarkantha Summit Trek")} />

      {/* Main content */}
      <main className="flex-1">
        {/* Hero Banner with Filter Widget */}
        <HeroSearch config={sections?.hero} />

        {/* Dynamic Campaigns & Landing Pages Section */}
        <CampaignSection />

        {/* 4.9+ Rated Best Treks */}
        <BestTreks onSelectTrek={(slug) => handleOpenBooking(slug)} />

        {/* Monsoon Specials & Valley Blooms Banner */}
        <MonsoonSpecials
          config={sections?.monsoon}
          onClaimCoupon={(code) => handleOpenBooking("Valley of Flowers & Hemkund")}
        />

        {/* Zero Work Leave Weekend Treks */}
        <WeekendTreks />

        {/* Live Ground Radar */}
        <LiveRadar initialReports={radarReports} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialTrek={selectedTrek}
      />
    </div>
  );
}
