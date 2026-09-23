"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  Users,
  Utensils,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  PhoneCall,
  ArrowRight,
  Send,
  Check,
  HelpCircle,
  Luggage,
  Sun,
  Compass,
  Building,
  Info,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export function RajasthanTourClient() {
  const [selectedPlan, setSelectedPlan] = useState<"breakfast" | "both">("both");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadDate, setLeadDate] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const price = selectedPlan === "both" ? 49999 : 42999;
  const pricePerPerson = Math.round(price / 2);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail || `${leadPhone}@guest.kradind.com`,
          phone: leadPhone,
          trekInterest: `Rajasthan Tour Package – 6 Days / 5 Nights (${
            selectedPlan === "both" ? "Breakfast + Dinner" : "Breakfast Only"
          })`,
          message: `Travel Date: ${leadDate || "Flexible"}. Plan: ₹${price.toLocaleString(
            "en-IN"
          )} for 2 adults. Notes: ${leadMessage || "None"}`,
          source: "Rajasthan 6-Day Package Page",
        }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setLeadName("");
        setLeadEmail("");
        setLeadPhone("");
        setLeadMessage("");
      } else {
        alert("Unable to send inquiry. Please contact us via WhatsApp.");
      }
    } catch {
      alert("Network error. Please reach us directly via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi KRADIND Adventures! I'm interested in booking the Rajasthan Tour Package (6 Days / 5 Nights: Jaipur → Jodhpur → Udaipur) for ₹${price.toLocaleString(
      "en-IN"
    )} (${
      selectedPlan === "both" ? "Breakfast + Dinner Plan" : "Breakfast Plan"
    }). Please share availability and details.`
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-[#FF6B35] selection:text-white">
      {/* Fixed Sticky Top Navigation Header */}
      <div className="sticky top-0 z-50 w-full shadow-xs">
        <TopBar />
        <Header />
      </div>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <ol className="flex items-center space-x-2 text-xs text-slate-500">
            <li>
              <Link href="/" className="hover:text-[#0F3A2E] transition">
                Home
              </Link>
            </li>
            <li>•</li>
            <li>
              <Link href="/domestic-trips" className="hover:text-[#0F3A2E] transition">
                Domestic Trips
              </Link>
            </li>
            <li>•</li>
            <li>
              <Link href="/destinations/rajasthan" className="hover:text-[#0F3A2E] transition">
                Rajasthan
              </Link>
            </li>
            <li>•</li>
            <li className="font-bold text-[#0F3A2E] truncate">Rajasthan Tour Package – 6 Days / 5 Nights</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        {/* Background Cover Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2000&q=85"
            alt="Amber Fort Jaipur - Rajasthan Tour Package by KRADIND"
            fill
            className="object-cover object-center opacity-35 scale-105 transition-transform duration-1000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-16 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-300 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>PRIVATE COUPLE TOUR • JAIPUR - JODHPUR - UDAIPUR</span>
              </div>

              {/* H1 Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white brand-font leading-[1.15]">
                Rajasthan Tour Package – 6 Days / 5 Nights
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                See the royal side of Rajasthan on a private 6-day journey through Jaipur, Jodhpur and Udaipur. Stay in comfortable 3-star hotels, travel in a private Swift Dzire and explore forts, palaces, old markets, lakes and historic streets at a relaxed pace.
              </p>

              {/* Quick Spec Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-left">
                  <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#FF6B35]" /> Duration
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">6D / 5N</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-left">
                  <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider flex items-center gap-1">
                    <Car className="w-3 h-3 text-[#FF6B35]" /> Vehicle
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">Private Swift Dzire</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-left">
                  <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider flex items-center gap-1">
                    <Building className="w-3 h-3 text-[#FF6B35]" /> Hotel
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">3-Star Verified</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-left">
                  <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#FF6B35]" /> Occupancy
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">2 Adults / Couple</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`https://wa.me/917500222141?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  <span>Check Availability on WhatsApp</span>
                </a>

                <a
                  href="#book-now"
                  className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e05320] text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                >
                  <span>Book / Request Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Hero Pricing Card with Interactive Plan Switcher */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 text-slate-900 border border-white/30 shadow-2xl space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF6B35] block">
                      Guaranteed Transparent Price
                    </span>
                    <h3 className="text-xl font-black text-slate-900">Choose Your Meal Plan</h3>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    For 2 Adults
                  </span>
                </div>

                {/* Plan Selector Buttons */}
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan("both")}
                    className={`py-3 px-3 rounded-xl text-xs font-extrabold transition-all text-center ${
                      selectedPlan === "both"
                        ? "bg-[#0F3A2E] text-white shadow-md"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <div>Breakfast + Dinner</div>
                    <div className="text-[10px] opacity-85 font-semibold">Recommended</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan("breakfast")}
                    className={`py-3 px-3 rounded-xl text-xs font-extrabold transition-all text-center ${
                      selectedPlan === "breakfast"
                        ? "bg-[#0F3A2E] text-white shadow-md"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <div>Breakfast Only</div>
                    <div className="text-[10px] opacity-85 font-semibold">Flexible Dinner</div>
                  </button>
                </div>

                {/* Price Display */}
                <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-2xl space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-slate-500 font-medium ml-1.5">total for 2 adults</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center justify-between pt-1 border-t border-slate-200/60 font-medium">
                    <span>Approx. per person:</span>
                    <span className="font-bold text-slate-900">₹{pricePerPerson.toLocaleString("en-IN")} / person</span>
                  </div>
                </div>

                {/* What's Included Bullets */}
                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>5 Nights</strong> in selected 3-star hotels (Jaipur, Jodhpur, Udaipur)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Dedicated Private Swift Dzire</strong> throughout the trip</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {selectedPlan === "both"
                        ? "Daily wholesome Breakfast + Dinner included"
                        : "Daily wholesome Breakfast included at hotel"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Jaipur pickup + Udaipur drop + Driver allowance, tolls & parking</span>
                  </div>
                </div>

                {/* Direct CTA */}
                <a
                  href={`https://wa.me/917500222141?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md transition"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  <span>Get Trip Quotation on WhatsApp</span>
                </a>

                <p className="text-[11px] text-center text-slate-500 leading-tight">
                  No hidden platform charges • Instant confirmation with written voucher
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Section 1: Quick Trip Snapshot */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Trip Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Jaipur – Jodhpur – Udaipur Rajasthan Tour
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
              This Rajasthan package is designed for one couple, not a large shared group. You get a private vehicle for the complete journey, hotel stays in the selected 3-star category, daily breakfast and the option to add dinner to your package. The route connects three very different sides of Rajasthan — the Pink City, the Blue City and the City of Lakes.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Duration</span>
              <span className="text-sm sm:text-base font-black text-slate-900 mt-1 block">6 Days / 5 Nights</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Cities Covered</span>
              <span className="text-sm sm:text-base font-black text-slate-900 mt-1 block">Jaipur, Jodhpur, Udaipur</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Pickup / Drop</span>
              <span className="text-sm sm:text-base font-black text-slate-900 mt-1 block">Jaipur In / Udaipur Out</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Vehicle</span>
              <span className="text-sm sm:text-base font-black text-slate-900 mt-1 block">Private Swift Dzire</span>
            </div>
          </div>
        </section>

        {/* Section 2: Why This Rajasthan Trip Hits Differently */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF6B35] bg-[#FF6B35]/10 px-3 py-1 rounded-full">
              The KRAD Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Why This Rajasthan Trip Hits Differently
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Tailored for couples seeking authentic culture without the chaos of crowded tour buses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Three Major Rajasthan Cities in One Route</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Instead of spending the entire holiday in one destination, this route connects Jaipur, Jodhpur and Udaipur. You get forts and bazaars in Jaipur, the blue lanes and Mehrangarh area in Jodhpur, followed by serene lakes and palaces in Udaipur.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Private Travel for Just Two People</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The Swift Dzire is reserved exclusively for your couple throughout the tour. You do not have to follow a large group&apos;s timetable or wait for other travellers before leaving for the next sightseeing stop.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="font-extrabold text-base text-slate-900">A Practical 3-Star Stay Option</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The package focuses on comfortable, verified 3-star accommodation rather than charging for luxury hotels that you may not need. This keeps the trip focused on sightseeing, private transport, cleanliness, and a restful stay.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-lg">
                4
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Two Transparent Meal Plans</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Choose the plan that fits your vacation style: ₹42,999 for Breakfast Only or ₹49,999 for Breakfast + Dinner. No complicated tier comparisons—just a simple ₹7,000 meal upgrade option.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Day-by-Day Interactive Itinerary */}
        <section className="space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Detailed Day-By-Day Schedule
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Rajasthan Tour Itinerary
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Carefully timed driving hours and thoughtful buffer intervals to avoid travel fatigue.
            </p>
          </div>

          <div className="space-y-5">
            
            {/* Day 1 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-slate-300 transition space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-extrabold text-sm">
                    D1
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Day 1 – Jaipur Arrival & Local Sightseeing
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>Overnight: Jaipur</span>
                  <span>•</span>
                  <span>Transfer: Swift Dzire</span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  Your Rajasthan holiday starts in Jaipur. Meet the driver at Jaipur Airport or Railway Station and transfer to your hotel. After check-in and some time to freshen up, begin your first look at the Pink City.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>City Palace:</strong> Explore courtyards, royal halls and museum displays offering a glimpse into Jaipur&apos;s former royal life.</li>
                  <li><strong>Jantar Mantar:</strong> Visit the historic astronomical site known for its large stone instruments.</li>
                  <li><strong>Hawa Mahal:</strong> Short photo stop at the iconic Palace of Winds.</li>
                  <li><strong>Old City Bazaars:</strong> Spend the late afternoon wandering through Johari Bazaar or Bapu Bazaar for textiles, handicrafts, and lac bangles.</li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900 font-medium">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Insider Tip:</strong> Keep your first evening flexible. Jaipur&apos;s markets are much more enjoyable when you are not rushing between sightseeing points.</span>
              </div>
            </div>

            {/* Day 2 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-slate-300 transition space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-extrabold text-sm">
                    D2
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Day 2 – Jaipur Forts & Sightseeing
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>Overnight: Jaipur</span>
                  <span>•</span>
                  <span>Meals: Breakfast / +Dinner</span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  Start the morning with breakfast and head towards the majestic hilltop forts overlooking Jaipur.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>Amber Fort:</strong> Allow around 2 to 3 hours for the fort. The hilltop setting, large courtyards, and detailed Sheesh Mahal architecture make this one of the key highlights of the trip.</li>
                  <li><strong>Jaigarh Fort:</strong> Continue to Jaigarh, known for military fortifications and panoramic views.</li>
                  <li><strong>Jal Mahal:</strong> Short scenic photo stop at the palace standing in the middle of Man Sagar Lake.</li>
                  <li><strong>Nahargarh Fort:</strong> Late afternoon visit for sweeping sunset panoramas over Jaipur city.</li>
                  <li><strong>Birla Mandir:</strong> Visit the white marble temple if time permits.</li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900 font-medium">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Insider Tip:</strong> Leave for Amber Fort early. Jaipur&apos;s major forts can take several hours, and an early start gives you more time for Jaigarh and Nahargarh before peak crowds.</span>
              </div>
            </div>

            {/* Day 3 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-slate-300 transition space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm">
                    D3
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Day 3 – Jaipur to Jodhpur
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>Distance: ~330–350 km (6–7 hrs)</span>
                  <span>•</span>
                  <span>Overnight: Jodhpur</span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  After breakfast, check out from your Jaipur hotel and begin the scenic highway drive towards Jodhpur, the historic Blue City.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>Comfortable road journey in your private air-conditioned vehicle with lunch stop on the highway.</li>
                  <li>Arrive in Jodhpur, check in at your 3-star hotel, and relax.</li>
                  <li>In the evening, visit the lively <strong>Clock Tower</strong> and <strong>Sardar Market</strong> with vibrant spice, tea, and handicraft stalls.</li>
                  <li>Take a short walk through the blue-painted lanes around the old city before returning to the hotel.</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-blue-900 font-medium">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Insider Tip:</strong> This is the longest driving day of the tour. Keep evening sightseeing light after reaching Jodhpur instead of trying to fit in too many attractions.</span>
              </div>
            </div>

            {/* Day 4 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-slate-300 transition space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm">
                    D4
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Day 4 – Jodhpur Sightseeing
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>Overnight: Jodhpur</span>
                  <span>•</span>
                  <span>Meals: Breakfast / +Dinner</span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  Spend the full day exploring the heritage, architecture, and royal treasures of Jodhpur.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>Mehrangarh Fort:</strong> Explore the mighty clifftop fort courtyards, armory, palanquins, and museum galleries.</li>
                  <li><strong>Jaswant Thada:</strong> A peaceful white marble royal cenotaph memorial near Mehrangarh lake.</li>
                  <li><strong>Umaid Bhawan Palace:</strong> Explore the museum displaying clocks, royal cars, and art deco artifacts.</li>
                  <li><strong>Mandore Gardens:</strong> Stroll through historic cenotaphs, high rock terraces, and landscaped grounds.</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-blue-900 font-medium">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Insider Tip:</strong> Wear comfortable walking footwear for Mehrangarh Fort. There is considerable walking and several steps around heritage corridors.</span>
              </div>
            </div>

            {/* Day 5 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-slate-300 transition space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-extrabold text-sm">
                    D5
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Day 5 – Jodhpur to Udaipur via Ranakpur
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>Distance: ~250–260 km (5–6 hrs)</span>
                  <span>•</span>
                  <span>Overnight: Udaipur</span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  Check out around 8:00 AM after breakfast and embark on the journey toward Udaipur, the City of Lakes.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>Ranakpur Jain Temple:</strong> Stop en route to explore the world-renowned 15th-century marble temple supported by 1,444 uniquely carved pillars.</li>
                  <li>Arrive in Udaipur and check in at your 3-star hotel.</li>
                  <li>Head towards <strong>Lake Pichola</strong> in the late afternoon. Enjoy the evening ambiance at <strong>Gangaur Ghat</strong> or <strong>Ambrai Ghat</strong> watching the golden reflection on the lake palaces.</li>
                  <li>Optional Lake Pichola boat ride (ticket payable locally).</li>
                </ul>
              </div>

              <div className="bg-teal-50 border border-teal-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-teal-900 font-medium">
                <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Insider Tip:</strong> Keep the Ranakpur stop comfortable rather than rushing through it. The road journey plus temple visit already makes this a full travel day.</span>
              </div>
            </div>

            {/* Day 6 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-slate-300 transition space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-extrabold text-sm">
                    D6
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Day 6 – Udaipur Sightseeing & Departure
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>Transfer: Udaipur Airport / Railway Drop</span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  After breakfast, check out from the hotel and explore Udaipur&apos;s celebrated monuments.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>Udaipur City Palace:</strong> Grand lakeside palace complex with intricate mirror work, royal balconies, and panoramic lake views.</li>
                  <li><strong>Jagdish Temple:</strong> 17th-century Indo-Aryan temple dedicated to Lord Vishnu.</li>
                  <li><strong>Saheliyon Ki Bari:</strong> Royal maiden gardens with marble fountains and lotus pools.</li>
                  <li><strong>Fateh Sagar Lake:</strong> Relaxed final stroll along the scenic promenade.</li>
                  <li>Transfer to Udaipur Airport or Railway Station for your departure flight or train.</li>
                </ul>
              </div>

              <div className="bg-teal-50 border border-teal-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-teal-900 font-medium">
                <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Optional:</strong> If your departure flight is late in the evening, Monsoon Palace (Sajjangarh) can be added depending on time and local weather.</span>
              </div>
            </div>

          </div>
        </section>

        {/* Section 4: Inclusions vs Exclusions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Inclusions */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 text-emerald-800">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-black tracking-tight">Rajasthan Tour Package Inclusions</h2>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-700">
              <div>
                <span className="font-extrabold text-slate-900 block">✓ 3-Star Accommodations</span>
                <p className="text-slate-600 text-xs mt-0.5">
                  5 nights accommodation in selected 3-star hotels (Jaipur 2N, Jodhpur 2N, Udaipur 1N) on double/twin sharing for 2 adults.
                </p>
              </div>

              <div>
                <span className="font-extrabold text-slate-900 block">✓ Meal Plan</span>
                <p className="text-slate-600 text-xs mt-0.5">
                  Daily breakfast included at hotel (plus dinner if selecting the ₹49,999 plan).
                </p>
              </div>

              <div>
                <span className="font-extrabold text-slate-900 block">✓ Private Air-Conditioned Swift Dzire</span>
                <p className="text-slate-600 text-xs mt-0.5">
                  Dedicated vehicle reserved solely for your couple for all intercity transfers and local sightseeing.
                </p>
              </div>

              <div>
                <span className="font-extrabold text-slate-900 block">✓ All Driver & Vehicle Expenses</span>
                <p className="text-slate-600 text-xs mt-0.5">
                  Includes driver allowances, fuel, state highway road taxes, tolls, and standard parking fees.
                </p>
              </div>

              <div>
                <span className="font-extrabold text-slate-900 block">✓ Airport / Station Transfers</span>
                <p className="text-slate-600 text-xs mt-0.5">
                  Jaipur pickup + Udaipur drop included.
                </p>
              </div>
            </div>
          </div>

          {/* Exclusions */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 text-rose-800">
              <XCircle className="w-6 h-6 text-rose-600" />
              <h2 className="text-xl font-black tracking-tight">Rajasthan Tour Package Exclusions</h2>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-700">
              <div>
                <span className="font-extrabold text-slate-900 block">✕ Flights / Train Tickets</span>
                <p className="text-slate-600 text-xs mt-0.5">
                  Airfare or railway tickets to Jaipur and from Udaipur.
                </p>
              </div>

              <div>
                <span className="font-extrabold text-slate-900 block">✕ Monument & Fort Entry Tickets</span>
                <p className="text-slate-600 text-xs mt-0.5">
                  Entry fees for forts, palaces, museums, and camera/video fees payable directly at ticket counters.
                </p>
              </div>

              <div>
                <span className="font-extrabold text-slate-900 block">✕ Lake Pichola Boat Ride</span>
                <p className="text-slate-600 text-xs mt-0.5">
                  Boat ride charges in Udaipur are optional and payable locally.
                </p>
              </div>

              <div>
                <span className="font-extrabold text-slate-900 block">✕ Lunches & Personal Expenses</span>
                <p className="text-slate-600 text-xs mt-0.5">
                  Mid-day meals, laundry, shopping, tips, and drinks outside the selected meal plan.
                </p>
              </div>

              <div>
                <span className="font-extrabold text-slate-900 block">✕ Tourist Guides</span>
                <p className="text-slate-600 text-xs mt-0.5">
                  Government certified heritage guides can be hired locally on demand.
                </p>
              </div>
            </div>
          </div>

        </section>

        {/* Section 5: Transparent Price Comparison vs Competitors */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Transparent Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Rajasthan Tour Price
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Your package is designed specifically for 2 adults travelling privately. Competitor starting prices often represent large shared bus tours, budget guest houses, or hidden transport exclusions. Here is how KRADIND compares:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Operator / Package</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Advertised Price</th>
                  <th className="py-3 px-4">Approx. Price / Day</th>
                  <th className="py-3 px-4">Trip Style</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold">eTripto Jaipur–Udaipur</td>
                  <td className="py-3 px-4">4N / 5D</td>
                  <td className="py-3 px-4">₹19,500 starting</td>
                  <td className="py-3 px-4">₹3,900</td>
                  <td className="py-3 px-4 text-slate-500">Shared / Budget starting price</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold">Thomas Cook Golden Triangle</td>
                  <td className="py-3 px-4">5N / 6D</td>
                  <td className="py-3 px-4">₹28,900</td>
                  <td className="py-3 px-4">₹4,817</td>
                  <td className="py-3 px-4 text-slate-500">Large group tour</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold">Thomas Cook Rajasthan</td>
                  <td className="py-3 px-4">6N / 7D</td>
                  <td className="py-3 px-4">₹47,000</td>
                  <td className="py-3 px-4">₹6,714</td>
                  <td className="py-3 px-4 text-slate-500">Longer group tour</td>
                </tr>
                <tr className="bg-emerald-50/70 text-emerald-950 font-bold border-l-4 border-l-emerald-600">
                  <td className="py-3.5 px-4 font-extrabold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    KRADIND Rajasthan – Breakfast Plan
                  </td>
                  <td className="py-3.5 px-4">5N / 6D</td>
                  <td className="py-3.5 px-4 font-black text-emerald-700">₹42,999 / couple</td>
                  <td className="py-3.5 px-4">₹7,167 / day</td>
                  <td className="py-3.5 px-4 text-emerald-800">Private couple tour with dedicated car</td>
                </tr>
                <tr className="bg-amber-50/70 text-amber-950 font-bold border-l-4 border-l-amber-600">
                  <td className="py-3.5 px-4 font-extrabold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    KRADIND Rajasthan – Breakfast + Dinner
                  </td>
                  <td className="py-3.5 px-4">5N / 6D</td>
                  <td className="py-3.5 px-4 font-black text-[#FF6B35]">₹49,999 / couple</td>
                  <td className="py-3.5 px-4">₹8,333 / day</td>
                  <td className="py-3.5 px-4 text-amber-800">Private couple tour + hotel dinners</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            Note: Competitor starting prices represent advertised starting rates. KRADIND quotes include dedicated private AC Swift Dzire for all 6 days, verified 3-star stays, tolls, parking, and driver charges with zero hidden vehicle extras.
          </p>
        </section>

        {/* Section 6: Who Is This Rajasthan Tour For */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" />
              Who Is This Rajasthan Tour For?
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                Couples looking for a private, romantic Rajasthan holiday.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                First-time visitors wanting to see Rajasthan&apos;s 3 most famous cities.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                Travellers who prioritize private car travel over group buses.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                Couples who want verified 3-star comfort without paying luxury palace markups.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                Travellers arriving by flight or train from Delhi, Mumbai, Bengaluru, etc.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-600" />
              Who May Prefer a Customized Route?
            </h2>
            <p className="text-xs text-slate-500">
              If you have specific preferences, we can customize your itinerary to include:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <strong>Jaisalmer:</strong> Thar Desert camel safaris and Swiss tent luxury camping.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <strong>Ranthambore:</strong> Bengal tiger jeep safaris.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <strong>Pushkar & Ajmer:</strong> Sacred Brahma temple and Ajmer Sharif Dargah.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <strong>Mount Abu:</strong> Rajasthan&apos;s sole hill station and Dilwara Jain temples.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 7: Travel Advice: Best Time, Packing, and Travel Tips */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Best Time */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Sun className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-base text-slate-900">Best Time to Visit Rajasthan</h2>
            <div className="space-y-2 text-xs text-slate-600">
              <p><strong>October to March (Peak):</strong> Pleasant daytime sightseeing weather with cool evenings. Highly recommended.</p>
              <p><strong>July to September (Monsoon):</strong> Lighter crowds and lush Aravalli hills around Udaipur.</p>
              <p><strong>April to June (Summer):</strong> Hot afternoons; early morning and evening sightseeing recommended.</p>
            </div>
          </div>

          {/* Packing */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Luggage className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-base text-slate-900">What to Pack for Rajasthan</h2>
            <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
              <li>Comfortable walking shoes for fort cobblestones</li>
              <li>Light cotton clothes for daytime travel</li>
              <li>Light warm jacket for winter evenings (Nov–Feb)</li>
              <li>Sunglasses, sunscreen & hat for fort walks</li>
              <li>Reusable water bottle and power bank</li>
              <li>Government photo ID for hotel check-ins</li>
            </ul>
          </div>

          {/* Travel Tips */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-base text-slate-900">Rajasthan Travel Tips</h2>
            <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
              <li><strong>Start fort visits early:</strong> Amber and Mehrangarh are vast; early visits avoid heat and tour buses.</li>
              <li><strong>Carry cash for old markets:</strong> Small bangle shops and street vendors may prefer cash.</li>
              <li><strong>Ask before optional activities:</strong> Confirm boating and camera charges in advance.</li>
            </ul>
          </div>

        </section>

        {/* Section 8: Transparent Booking Policy & Guarantee */}
        <section className="bg-gradient-to-br from-[#0F3A2E] to-[#164e3f] rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
              Booking Guarantee
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Booking & Cancellation Policy
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Before making your payment, receive an official booking confirmation voucher detailing your hotels, private vehicle, meal plan, driver contact, and payment receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <span className="text-xs font-bold text-emerald-300 block">30% Advance Deposit</span>
              <p className="text-xs text-white/80 mt-1">Reserve your car and hotel rooms with an initial advance.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <span className="text-xs font-bold text-emerald-300 block">Balance Upon Arrival</span>
              <p className="text-xs text-white/80 mt-1">Pay the remaining balance as scheduled in your voucher.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <span className="text-xs font-bold text-emerald-300 block">Transparent Invoicing</span>
              <p className="text-xs text-white/80 mt-1">Includes GST invoice and 24/7 on-call coordinator support.</p>
            </div>
          </div>
        </section>

        {/* Section 9: Frequently Asked Questions (Accordion) */}
        <section className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "1. What is included in the 6-day Rajasthan tour package?",
                a: "The package includes 5 nights of 3-star accommodation (Jaipur 2N, Jodhpur 2N, Udaipur 1N), private Swift Dzire transportation for the full route, Jaipur Airport/Railway Station pickup, Udaipur Airport/Railway Station drop, all intercity transfers, sightseeing mentioned in the itinerary, driver allowance, fuel, tolls, and standard parking. Daily breakfast is included in both options, while the ₹49,999 option also includes daily hotel dinners.",
              },
              {
                q: "2. Is this Rajasthan tour package private for couples?",
                a: "Yes. The package is planned specifically for 2 adults / one couple with a dedicated private Swift Dzire vehicle. You do not have to share the car with any other tourist group. The vehicle remains exclusively at your service for the scheduled itinerary.",
              },
              {
                q: "3. Are fort entry tickets included in the Rajasthan package?",
                a: "No. Entry tickets for forts, palaces, museums, monuments, and other tourist attractions are not included unless specifically requested in your final quotation. This includes attractions such as Amber Fort, Mehrangarh Fort, and Udaipur City Palace. Entry tickets can be purchased directly at government counters or online.",
              },
              {
                q: "4. Is the Lake Pichola boat ride included?",
                a: "No. The Lake Pichola boat ride in Udaipur is an optional activity and its cost is separate. You can opt for it according to your preferred timing (sunset or afternoon), boat type, and applicable local ticket charges.",
              },
              {
                q: "5. Can I customize this Jaipur Jodhpur Udaipur tour package?",
                a: "Yes, absolutely! The route can be customized to your preferred travel dates and interests. You can add extra days for Jaisalmer desert camps, Ranthambore tiger safari, Mount Abu, or Pushkar, with adjusted vehicle requirements and revised pricing.",
              },
            ].map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-shadow shadow-xs hover:shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 10: Conversion CTA Section & Lead Form */}
        <section id="book-now" className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF6B35] bg-[#FF6B35]/10 px-3 py-1 rounded-full">
                Instant Quotation
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Ready for Jaipur, Jodhpur & Udaipur?
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Three historic cities. One private vehicle. Five comfortable 3-star nights. A planned Rajasthan holiday crafted for two. Choose your meal plan and let us handle all the logistics.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Transparent Price: ₹42,999 (Breakfast) / ₹49,999 (Breakfast + Dinner)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Custom dates available daily with verified hotel vouchers</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/917500222141?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md transition"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  <span>WhatsApp Us: +91 7500222141</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200/80">
              {submitSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900">Inquiry Received!</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you! Our Rajasthan travel specialist will review your dates and WhatsApp you the full day-by-day dossier and hotel options within 15 minutes.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="text-xs font-bold text-[#FF6B35] hover:underline pt-2 inline-block"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3.5">
                  <h3 className="font-black text-base text-slate-900">
                    Get Free Rajasthan Dossier & Quote
                  </h3>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#FF6B35]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Phone / WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#FF6B35]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Preferred Travel Month / Date</label>
                      <input
                        type="text"
                        placeholder="e.g. November 2026"
                        value={leadDate}
                        onChange={(e) => setLeadDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#FF6B35]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Meal Plan Preference</label>
                    <select
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value as "breakfast" | "both")}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
                    >
                      <option value="both">Breakfast + Dinner Plan (₹49,999 / 2 Adults)</option>
                      <option value="breakfast">Breakfast Only Plan (₹42,999 / 2 Adults)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Special Notes or Custom Requests</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Traveling from Mumbai, want to add Pushkar..."
                      value={leadMessage}
                      onChange={(e) => setLeadMessage(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#FF6B35]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-[#0F3A2E] hover:bg-[#154d3d] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? "Sending Request..." : "Request Rajasthan Quote & Itinerary"}</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>

      </main>

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase block">
            {selectedPlan === "both" ? "Breakfast + Dinner" : "Breakfast Only"}
          </span>
          <span className="text-base font-black text-slate-900">
            ₹{price.toLocaleString("en-IN")}{" "}
            <span className="text-[10px] text-slate-500 font-medium">/ 2 Adults</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/917500222141?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-[#25D366] text-white"
            aria-label="WhatsApp Us"
          >
            <FaWhatsapp className="w-5 h-5" />
          </a>
          <a
            href="#book-now"
            className="bg-[#FF6B35] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md"
          >
            Book Trip →
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
