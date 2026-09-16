"use client";

import React, { useState } from "react";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Compass,
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  Send,
  Star,
  Mountain,
} from "lucide-react";

export default function PlanYourTripPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [destination, setDestination] = useState("Uttarakhand");
  const [travelStyle, setTravelStyle] = useState("Himalayan Trekking");
  const [duration, setDuration] = useState("4–6 Days");
  const [groupSize, setGroupSize] = useState("Small Group (2–5 People)");
  const [travelMonth, setTravelMonth] = useState("Upcoming Month");
  const [budget, setBudget] = useState("Comfort Standard");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          service: "Plan Your Trip Customizer",
          message: `[Custom Trip Plan]\nDestination: ${destination}\nStyle: ${travelStyle}\nDuration: ${duration}\nGroup Size: ${groupSize}\nMonth: ${travelMonth}\nBudget: ${budget}\nNotes: ${notes}`,
          source: "Plan Your Trip Page",
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to submit plan. Please call +91 7500222141 directly.");
      }
    } catch {
      setErrorMsg("Network error. Please try again or call our operations desk at +91 7500222141.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Custom Holiday & Trek Builder
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 brand-font">
            Plan Your Dream Trip With KRADIND
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Tell us where and how you want to travel. Our certified Himalayan specialists and ground operations team in Dehradun will craft a customized, transparent quote within hours.
          </p>
        </div>

        {/* Form or Confirmation Card */}
        {submitted ? (
          <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-14 shadow-xl text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 brand-font">
                Trip Request Received!
              </h2>
              <p className="text-slate-600 text-sm max-w-lg mx-auto">
                Thank you, <span className="font-bold text-slate-900">{name}</span>. One of our dedicated mountain trip advisors is reviewing your itinerary details for <span className="font-bold text-emerald-700">{destination}</span> and will contact you via WhatsApp/phone at <span className="font-bold text-slate-900">{phone}</span> shortly.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4">
              <a
                href="tel:+917500222141"
                className="inline-flex items-center gap-2 bg-[#0F3A2E] hover:bg-emerald-950 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400 animate-phone-vibrate" />
                <span>Call Ground Desk Now: +91 7500222141</span>
              </a>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
              >
                Plan Another Trip
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg space-y-8"
          >
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-800 text-xs font-medium text-center">
                {errorMsg}
              </div>
            )}

            {/* Step 1: Destination */}
            <div className="space-y-3">
              <label className="block text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>1. Where would you like to go?</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  "Uttarakhand",
                  "Himachal Pradesh",
                  "Kashmir",
                  "Ladakh",
                  "Rajasthan",
                  "Kerala",
                  "Goa",
                  "Nepal / International",
                ].map((dest) => (
                  <button
                    type="button"
                    key={dest}
                    onClick={() => setDestination(dest)}
                    className={`text-xs font-bold p-3 rounded-xl border text-left transition cursor-pointer ${
                      destination === dest
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs ring-1 ring-emerald-500"
                        : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Travel Style */}
            <div className="space-y-3">
              <label className="block text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#FF6B35]" />
                <span>2. What is your preferred travel style?</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  "Himalayan Trekking",
                  "Family Leisure Vacation",
                  "Road Trip & 4x4 Safari",
                  "Weekend Camping Escape",
                  "Romantic Honeymoon",
                  "Corporate / Group Retreat",
                ].map((style) => (
                  <button
                    type="button"
                    key={style}
                    onClick={() => setTravelStyle(style)}
                    className={`text-xs font-bold p-3 rounded-xl border text-left transition cursor-pointer ${
                      travelStyle === style
                        ? "bg-amber-50 border-amber-500 text-amber-950 shadow-xs ring-1 ring-amber-500"
                        : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Duration & Group Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">Trip Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="2–3 Days (Weekend)">2–3 Days (Weekend)</option>
                  <option value="4–6 Days">4–6 Days (Standard)</option>
                  <option value="7–9 Days">7–9 Days (Extended)</option>
                  <option value="10+ Days">10+ Days (Grand Circuit)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">Group Size</label>
                <select
                  value={groupSize}
                  onChange={(e) => setGroupSize(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="Solo Explorer (1 Person)">Solo Explorer (1 Person)</option>
                  <option value="Couple (2 People)">Couple (2 People)</option>
                  <option value="Small Group (3–5 People)">Small Group (3–5 People)</option>
                  <option value="Large Group (6–15 People)">Large Group (6–15 People)</option>
                  <option value="Corporate / College (15+ People)">Corporate / College (15+ People)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">Travel Timing</label>
                <select
                  value={travelMonth}
                  onChange={(e) => setTravelMonth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="Immediately (Within 2 Weeks)">Immediately (Within 2 Weeks)</option>
                  <option value="Upcoming Month">Upcoming Month</option>
                  <option value="Next 2–3 Months">Next 2–3 Months</option>
                  <option value="Exploring for later">Exploring for later</option>
                </select>
              </div>
            </div>

            {/* Step 4: Contact Details */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <label className="block text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>3. Where should we send your customized quote?</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 font-medium mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 font-medium mb-1">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="priya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 font-medium mb-1">
                  Specific Requests, Hotel Preferences or Physical Fitness Level
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. We want 4-star hotels, child-friendly sightseeing, and pickup from Dehradun airport..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#FF6B35] to-[#f0551d] hover:from-[#e05a26] hover:to-[#df4913] text-white font-extrabold text-sm py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Generating Custom Quote..." : "Get My Free Customized Trip Plan & Quote →"}</span>
              </button>
              <p className="text-center text-[11px] text-slate-400 pt-2 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                No spam. Direct quotation from certified ground operators in Dehradun.
              </p>
            </div>
          </form>
        )}

        {/* Assurance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-slate-900">Safety First Certified</h3>
              <p className="text-[11px] text-slate-500">NIM-certified mountain guides & verified hill vehicles</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-slate-900">4.9 ★ Rated Hospitality</h3>
              <p className="text-[11px] text-slate-500">5,000+ satisfied travelers & small batch care</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-slate-900">24/7 Ground Ops Desk</h3>
              <p className="text-[11px] text-slate-500">Direct hotline support: +91 7500222141</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
