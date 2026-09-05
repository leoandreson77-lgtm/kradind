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
      <TopBar />
      <Header onBookClick={() => setBookingOpen(true)} />

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

      </main>

      <Footer />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
