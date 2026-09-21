"use client";

import React, { useState } from "react";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookingModal } from "@/components/booking-modal";
import {
  Hotel,
  Plane,
  Car,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  Users,
  Sparkles,
  Compass,
  Clock,
  Send,
  MapPin,
} from "lucide-react";

export default function TravelServicesPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceType, setServiceType] = useState("Customized Tour");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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
          service: serviceType,
          message: `[Service Inquiry: ${serviceType}] ${message}`,
          source: "Travel Services Page",
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to submit request. Please call us directly.");
      }
    } catch {
      setErrorMsg("Network error. Please try again or call +91 7500222141.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      id: "hotels",
      title: "Hotels & Mountain Resorts Booking",
      icon: Hotel,
      badge: "Verified Stays",
      color: "bg-teal-50 text-teal-700 border-teal-200/80",
      desc: "Curated boutique stays, high-altitude alpine dome camps, heritage Havelis in Rajasthan, and five-star luxury resorts across India with verified sanitation standards.",
      points: [
        "Handpicked alpine glamping & Swiss tents",
        "Heritage Havelis & palace properties",
        "Best guaranteed B2B partner rates",
        "Flexible cancellation options",
      ],
    },
    {
      id: "flights",
      title: "Domestic & International Flight Ticketing",
      icon: Plane,
      badge: "Fast Turnaround",
      color: "bg-blue-50 text-blue-700 border-blue-200/80",
      desc: "Hassle-free airline bookings for domestic sectors (Delhi, Dehradun, Leh, Srinagar, Goa) and international destinations (Nepal, Bali, Thailand, Dubai, Vietnam) with 24/7 rescheduling support.",
      points: [
        "Corporate & group fare discounts",
        "Zero-stress web check-in & boarding passes",
        "Quick date change & reissuance desk",
        "Excess baggage allowance assistance",
      ],
    },
    {
      id: "transfers",
      title: "Airport & Outstation Transfers",
      icon: Car,
      badge: "Punctual Drivers",
      color: "bg-amber-50 text-amber-700 border-amber-200/80",
      desc: "Seamless pick-up and drop services from Jolly Grant Dehradun, IGI Delhi, Chandigarh, Srinagar, and Leh airports straight to your hotel or trek basecamp.",
      points: [
        "Air-conditioned sedans, SUVs & Tempo Travelers",
        "Pre-verified hill-certified commercial drivers",
        "Flight delay tracking for guaranteed pickup",
        "Transparent fixed pricing with no hidden tolls",
      ],
    },
    {
      id: "transport",
      title: "Mountain 4x4 & Expedition Transport",
      icon: Compass,
      badge: "Himalayan Fleet",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      desc: "Specialized high-ground-clearance 4x4 Bolero Campers, Toyota Innova Crysta, and Force Urbania vans customized for treacherous mountain roads in Spiti, Ladakh, and Garhwal.",
      points: [
        "Experienced high-altitude snow & gravel drivers",
        "Roof carriers for expedition rucksacks",
        "First-aid kits & vehicle emergency tools on board",
        "Spiti & Ladakh circuit specialized chauffeurs",
      ],
    },
    {
      id: "customized",
      title: "Customized Family Tours & Corporate Retreats",
      icon: Users,
      badge: "Tailormade",
      color: "bg-purple-50 text-purple-700 border-purple-200/80",
      desc: "Design your personalized dream itinerary with our mountain travel experts. Whether a private family holiday, college adventure batch, or corporate wellness retreat, we handle end-to-end execution.",
      points: [
        "Personalized day-by-day travel schedules",
        "Dedicated on-ground tour manager",
        "Custom campfire & stargazing sessions",
        "Flexible pacing suited for kids & elders",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Fixed Sticky Top Navigation Header */}
      <div className="sticky top-0 z-50 w-full shadow-xs">
        <TopBar />
        <Header onBookClick={() => setBookingOpen(true)} />
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            End-to-End Travel Logistics
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 brand-font">
            Comprehensive Travel Services
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            From mountain-ready 4x4 cabs and certified airport transfers to handpicked luxury hotels and flights, KRADIND Adventures ensures a smooth journey from start to finish.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="tel:+917500222141"
              className="inline-flex items-center gap-2 bg-[#0F3A2E] hover:bg-emerald-950 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition shadow-sm"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400 animate-phone-vibrate" />
              <span>Call Ground Desk: +91 7500222141</span>
            </a>
            <button
              onClick={() => setBookingOpen(true)}
              className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e05a26] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition shadow-sm"
            >
              <span>Instant Trip Quote →</span>
            </button>
          </div>
        </div>

        {/* Services List Grid */}
        <div className="space-y-8">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                id={svc.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-md transition scroll-mt-28"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border ${svc.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          {svc.badge}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 brand-font">
                          {svc.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed pt-1">
                      {svc.desc}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3">
                      {svc.points.map((pt, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Action Box */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-[#0F3A2E]">Need {svc.title}?</span>
                      <p className="text-[11px] text-slate-500">
                        Get verified availability and customized pricing within 15 minutes.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <a
                        href="tel:+917500222141"
                        className="w-full flex items-center justify-center gap-2 bg-[#0F3A2E] hover:bg-emerald-900 text-white font-bold text-xs py-2.5 rounded-lg transition"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Direct Call: 7500222141</span>
                      </a>
                      <button
                        onClick={() => {
                          setServiceType(svc.title);
                          const el = document.getElementById("inquiry-form");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs py-2.5 rounded-lg transition"
                      >
                        <span>Send Booking Inquiry →</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Unified Service Inquiry Form */}
        <div id="inquiry-form" className="bg-gradient-to-br from-emerald-950 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-6 text-center">
            <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
              Fast Response Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold brand-font">
              Book Your Service Or Request A Custom Plan
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Fill out your details below and our Dehradun operations team will get back to you with rates and vehicle/hotel confirmations.
            </p>

            {submitted ? (
              <div className="bg-emerald-900/60 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Inquiry Received!</h3>
                <p className="text-xs text-slate-200">
                  Thank you! Our travel logistics coordinator will call you shortly on the provided number.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {errorMsg && (
                  <div className="bg-rose-950/80 border border-rose-500/60 p-3 rounded-xl text-rose-200 text-xs text-center">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Service Required</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Customized Tour">Customized Tour & Holiday</option>
                      <option value="Hotels & Resorts">Hotels & Camps Booking</option>
                      <option value="Flight Ticketing">Flight Tickets</option>
                      <option value="Airport Transfers">Airport Pick-up / Drop</option>
                      <option value="Mountain 4x4 Transportation">Mountain 4x4 Transportation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Travel Dates & Requirements</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your travel dates, number of people, routes, or specific preferences..."
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF6B35] hover:bg-[#e05a26] text-white font-extrabold text-sm py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting Inquiry..." : "Submit Logistics Inquiry"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} initialTrek="Customized Travel Services" />
    </div>
  );
}
