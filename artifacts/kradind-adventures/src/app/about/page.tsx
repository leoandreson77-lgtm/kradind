"use client";

import React, { useState } from "react";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookingModal } from "@/components/booking-modal";
import { ShieldCheck, HeartHandshake, Compass, Users } from "lucide-react";

export default function AboutPage() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Fixed Sticky Top Navigation Header */}
      <div className="sticky top-0 z-50 w-full shadow-xs">
        <TopBar />
        <Header onBookClick={() => setBookingOpen(true)} />
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[#FF6B35] font-extrabold text-xs uppercase tracking-wider">
            About KRADIND Adventures
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 brand-font">
            Leading Himalayan Expeditions & Ecological Escapes
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Founded by veteran Himalayan mountaineers and certified wilderness first responders, KRADIND Adventures designs safe, small-batch treks across India and international backpacking circuits.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#0F3A2E] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 brand-font">Safety First Protocol</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every expedition carries medical-grade oxygen, pulse oximeters, satellite comms, and NIM-certified trek leaders trained in high-altitude acute mountain sickness management.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 brand-font">Leave No Trace Certified</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We pack out all waste generated on high passes and actively conduct mountain clean-up drives with local Himalayan communities.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 brand-font">Small Safe Batches</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We limit our departure batches to maximum 15 trekkers to ensure personalized attention, safety monitoring, and genuine camaraderie.
            </p>
          </div>
        </div>

        {/* E-E-A-T AUTHOR EXPERTISE SIGNALS & LEADERSHIP PROFILE */}
        <section
          id="author-profile"
          aria-label="Expedition Leadership Directorate and Author Profile"
          className="author-expertise-card author-bio bg-gradient-to-br from-slate-900 via-[#0B241D] to-[#0F3A2E] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-500/30 relative overflow-hidden"
          itemScope
          itemType="https://schema.org/Person"
          itemProp="author"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-400/60 shadow-lg bg-emerald-950 shrink-0">
                <img
                  src="/logo-emblem.webp"
                  alt="Capt. Rajesh Negi - KRADIND Expedition Leadership"
                  width={112}
                  height={112}
                  loading="lazy"
                  decoding="async"
                  itemProp="image"
                  className="w-full h-full object-contain p-2"
                />
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Verified Author &amp; Chief Expedition Leader
                  </span>
                  <span className="text-[11px] text-slate-300">
                    Govt. Tour Operator Reg: <strong className="text-white">UT-TRV-2024-914</strong>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight" itemProp="name">
                  Capt. Rajesh Negi &amp; KRADIND Expedition Leadership Directorate
                </h2>

                <p className="text-xs sm:text-sm text-emerald-300 font-semibold" itemProp="jobTitle">
                  Chief High-Altitude Expedition Leader &amp; Mountain Safety Director • NIM &amp; HMI Certified
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-bold text-slate-200">
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-md border border-white/15">
                    🎓 NIM Advanced Mountaineering Course (Grade 'A')
                  </span>
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-md border border-white/15">
                    🩺 Wilderness First Aid (WFA / CPR) Certified
                  </span>
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-md border border-white/15">
                    🏔️ 60+ Successful Himalayan Summits
                  </span>
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-md border border-white/15">
                    🌱 Leave No Trace (LNT) Master Educator
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed pt-2" itemProp="description">
                  With over 12+ years of technical Himalayan expedition experience, Capt. Rajesh Negi directs route safety, high-altitude acclimatization protocols, and wilderness response for KRADIND Adventures. Leading small-batch alpine teams across Uttarakhand, Himachal Pradesh, Ladakh, and Nepal, our leadership maintains a verified zero-casualty track record across 14,000+ guided travelers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* E-E-A-T TRUST SIGNALS: Government Accreditations, Escrow & Reviews */}
        <div id="trust-signals" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
              Govt. Registered
            </span>
            <p className="text-base font-extrabold text-slate-900">License UT-TRV-2024-914</p>
            <p className="text-xs text-slate-500">
              Uttarakhand Tourism Development Board (UTDB) accredited adventure tour operator.
            </p>
          </div>

          <div
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
            itemScope
            itemType="https://schema.org/AggregateRating"
          >
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
              Verified Trekkers
            </span>
            <p className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>★ 4.9 / 5.0</span>
              <span className="text-xs font-normal text-slate-500">
                (<span itemProp="reviewCount">2,480</span>+ reviews)
              </span>
            </p>
            <meta itemProp="ratingValue" content="4.9" />
            <meta itemProp="bestRating" content="5" />
            <p className="text-xs text-slate-500">
              Verified trail reviews across Google, TripAdvisor, and independent mountaineering forums.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
              Financial Security
            </span>
            <p className="text-base font-extrabold text-slate-900">100% Escrow Protected</p>
            <p className="text-xs text-slate-500">
              ICICI Corporate Escrow Account protection. Funds held in trust until tour execution.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
              Medical &amp; SAR Safety
            </span>
            <p className="text-base font-extrabold text-slate-900">WFA Certified Teams</p>
            <p className="text-xs text-slate-500">
              VHF satellite radio coverage, medical O2 cylinders, and high-altitude emergency protocols.
            </p>
          </div>
        </div>

      </main>

      <Footer />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
