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
  Waves,
  Ship,
  Coffee,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export function KeralaTourClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadDate, setLeadDate] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const price = 60000;
  const pricePerPerson = 30000;

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
          trekInterest: "Kerala Tour Package – 5 Nights / 6 Days (₹60,000 for 2 Adults)",
          message: `Travel Date: ${leadDate || "Flexible"}. Route: Kochi → Munnar → Thekkady → Alleppey Houseboat → Kochi. Notes: ${leadMessage || "None"}`,
          source: "Kerala 5N/6D Package Page",
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
    `Hi KRADIND Adventures! I'm interested in booking the Kerala Tour Package (5 Nights / 6 Days: Kochi → Munnar → Thekkady → Alleppey Houseboat → Kochi) for ₹60,000 total for 2 adults. Please share availability and booking details.`
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-600 selection:text-white">
      <TopBar />
      <Header />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <ol className="flex items-center space-x-2 text-xs text-slate-500">
            <li>
              <Link href="/" className="hover:text-emerald-700 transition">
                Home
              </Link>
            </li>
            <li>•</li>
            <li>
              <Link href="/domestic-trips" className="hover:text-emerald-700 transition">
                Domestic Trips
              </Link>
            </li>
            <li>•</li>
            <li>
              <Link href="/destinations/kerala" className="hover:text-emerald-700 transition">
                Kerala
              </Link>
            </li>
            <li>•</li>
            <li className="font-bold text-emerald-900 truncate">Kerala Tour Package (5N/6D)</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        {/* Background Cover Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2000&q=85"
            alt="Traditional Alleppey Houseboat Backwaters - Kerala Tour Package by KRADIND"
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
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-300 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>PRIVATE COUPLE TOUR • KOCHI - MUNNAR - THEKKADY - ALLEPPEY</span>
              </div>

              {/* H1 Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white brand-font leading-[1.15]">
                Kerala Tour Package – 5 Nights / 6 Days
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                A well-planned Kerala holiday for couples who want to see the hills, tea gardens, wildlife, spices and famous backwaters in one trip. Stay in comfortable 3-star hotels, travel in a private Swift Dzire and spend one peaceful night on a traditional Alleppey houseboat.
              </p>

              {/* Quick Spec Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-left">
                  <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" /> Duration
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">6D / 5N</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-left">
                  <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider flex items-center gap-1">
                    <Car className="w-3 h-3 text-emerald-400" /> Vehicle
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">Private Swift Dzire</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-left">
                  <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider flex items-center gap-1">
                    <Building className="w-3 h-3 text-emerald-400" /> Hotel
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">3-Star + Houseboat</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-left">
                  <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider flex items-center gap-1">
                    <Users className="w-3 h-3 text-emerald-400" /> Occupancy
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">2 Adults / 1 Couple</div>
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
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                >
                  <span>Get Your Kerala Tour Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Hero Pricing Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 text-slate-900 border border-white/30 shadow-2xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 block">
                      All-Inclusive Couple Package
                    </span>
                    <h3 className="text-xl font-black text-slate-900">Guaranteed Transparent Price</h3>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    For 2 Adults
                  </span>
                </div>

                {/* Price Display */}
                <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-2xl space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-slate-600 font-bold ml-1.5">total for 2 adults</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center justify-between pt-1 border-t border-emerald-200/60 font-medium">
                    <span>Per person price:</span>
                    <span className="font-bold text-emerald-800">₹{pricePerPerson.toLocaleString("en-IN")} / person</span>
                  </div>
                </div>

                {/* What's Included Bullets */}
                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>5 Nights</strong>: 2N Munnar + 1N Thekkady + 1N Alleppey Houseboat + 1N Kochi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Dedicated Private Swift Dzire</strong> for the full 6-day tour</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Daily Breakfast & Dinner</strong> at 3-star hotel stays</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Houseboat Full Board</strong>: Lunch + Evening Tea/Snacks + Dinner + Breakfast</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Kochi Airport / Station pickup & drop + Driver, tolls & parking</span>
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
                  <span>Get Quote & Dates on WhatsApp</span>
                </a>

                <p className="text-[11px] text-center text-slate-500 leading-tight">
                  No hidden booking fees • Official written booking voucher upon confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Package Highlights Grid */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
              Trip Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Kerala Tour Package Highlights
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              A comprehensive holiday tailored for couples seeking beauty, comfort, and peaceful discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "5 nights / 6 days Kerala holiday for 2 adults",
              "Private Swift Dzire reserved for the complete tour",
              "2 nights in Munnar at verified 3-star hotel",
              "1 night in Thekkady amidst spice plantations",
              "1 night on a traditional Alleppey houseboat",
              "1 night in Kochi with heritage sightseeing",
              "Daily delicious breakfast included",
              "Daily dinner at hotel stays included in meal plan",
              "Houseboat lunch, evening tea/snacks and dinner",
              "Kochi Airport / Railway Station pickup",
              "Kochi Airport / Railway Station drop",
              "Munnar tea gardens, Cheeyappara and Valara waterfalls",
              "Mattupetty Dam, Echo Point and Kundala Lake",
              "Thekkady spice plantations & optional Periyar lake activities",
              "Alleppey backwater cruise & Fort Kochi heritage tour",
            ].map((highlight, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-emerald-300 transition"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose This Kerala Trip? */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
              Why KRADIND Adventures
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Why Choose This Kerala Trip?
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Designed around privacy, comfort, and transparent planning without surprise costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Private Travel for Two</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                This package is planned for one couple, so you travel in your own private Swift Dzire. There is no shared sightseeing vehicle or group timetable.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Three Different Settings</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Munnar for cool hills and tea gardens; Thekkady for forests, spices and wildlife; Alleppey for slow backwaters; finishing in historic Fort Kochi.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                <Ship className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">One Night on Houseboat</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The Alleppey houseboat is a premier highlight. Your stay includes the tranquil backwater cruise, welcome drink, lunch, evening snacks, dinner and breakfast.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Clear Optional Costs</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Boating, wildlife activities, shows, and entry fees are kept outside basic package unless requested, helping you decide what you actually want to pay for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kerala Tour Route & Night Stay Plan Table */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
              Circuit & Stays
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Kerala Tour Route & Night Stay Plan
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Kochi → Munnar → Thekkady → Alleppey → Kochi
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900 text-white uppercase text-[11px] tracking-wider font-extrabold">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Night</th>
                  <th className="py-3.5 px-4 sm:px-6">Destination</th>
                  <th className="py-3.5 px-4 sm:px-6">Accommodation Type</th>
                  <th className="py-3.5 px-4 sm:px-6">Meals Included</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">Night 1</td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-emerald-800">Munnar</td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-700">3-Star Hotel / Resort</td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600">Dinner included</td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">Night 2</td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-emerald-800">Munnar</td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-700">3-Star Hotel / Resort</td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600">Breakfast & Dinner</td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">Night 3</td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-emerald-800">Thekkady</td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-700">3-Star Hotel / Resort</td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600">Breakfast & Dinner</td>
                </tr>
                <tr className="hover:bg-slate-50 transition bg-emerald-50/50">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">Night 4</td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-emerald-800">Alleppey</td>
                  <td className="py-3.5 px-4 sm:px-6 text-emerald-950 font-bold">Traditional Houseboat</td>
                  <td className="py-3.5 px-4 sm:px-6 text-emerald-900 font-semibold">Lunch + Tea/Snacks + Dinner</td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">Night 5</td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-emerald-800">Kochi</td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-700">3-Star Hotel</td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600">Breakfast & Dinner</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Day-by-Day Detailed Itinerary */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
              Day by Day
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Kerala Tour Itinerary – 6 Days / 5 Nights
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              A balanced sequence of scenic drives, tea hills, wildlife encounters, backwater cruising and colonial port heritage.
            </p>
          </div>

          <div className="space-y-8">
            {/* Day 1 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Day 1
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Approx. 125–140 km • 4–5 hrs drive
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Kochi to Munnar – Waterfalls, Tea Hills & Scenic Drive
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Arrive at Kochi International Airport or Ernakulam Railway Station. Meet your driver and begin the drive towards Munnar. The scenery changes as you leave Kochi behind. The road gradually moves towards the Western Ghats, with greener hills, plantations and winding stretches.
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                <div className="text-xs font-bold text-slate-800">En-route Stops:</div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Cheeyappara Waterfalls</span>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Valara Waterfalls</span>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Spice Plantation</span>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Mountain Viewpoints</span>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Tea Plantation Areas</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Reach Munnar and check in to your 3-star hotel. Spend the evening at a relaxed pace. Take a short walk around the hotel or explore the local market if you still have energy.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                  <span className="font-bold text-emerald-900">Meal Plan:</span> Dinner included
                </div>
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900">Stay:</span> 3-Star Hotel – Munnar
                </div>
              </div>
              <div className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200/80 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-amber-600" />
                <span><strong>Insider Tip:</strong> Keep a light jacket or shawl in your day bag. Munnar can feel much cooler than Kochi, especially after sunset.</span>
              </div>
            </div>

            {/* Day 2 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Day 2
                </span>
                <span className="text-xs font-semibold text-slate-500">Munnar Local Sightseeing</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Munnar Full-Day Sightseeing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Start your day with breakfast and leave for a full day around Munnar:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block mb-1">Eravikulam National Park / Rajamalai</strong>
                  Known for mountain landscapes and Nilgiri tahr. Subject to seasonal calving closure (Feb-Mar).
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block mb-1">Tea Museum</strong>
                  Learn about Munnar’s tea-growing history and see authentic processing machinery.
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block mb-1">Mattupetty Dam & Echo Point</strong>
                  Panoramic reservoir views; popular echo phenomenon created by the surrounding hills.
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block mb-1">Kundala Lake & Tea Gardens</strong>
                  Serene lake scenery with pedal/shikara boating and lush photo stops among tea bushes.
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                  <span className="font-bold text-emerald-900">Meal Plan:</span> Breakfast & Dinner included
                </div>
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900">Stay:</span> 3-Star Hotel – Munnar
                </div>
              </div>
              <div className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200/80 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-amber-600" />
                <span><strong>Insider Tip:</strong> Wear comfortable walking shoes. Munnar sightseeing involves several outdoor stops and pleasant strolls.</span>
              </div>
            </div>

            {/* Day 3 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Day 3
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Approx. 110–125 km • ~4 hrs drive
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Munnar to Thekkady – Hills, Spices & Wildlife
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                After breakfast, check out from the Munnar hotel. Drive towards Thekkady through green mountain roads where tea gardens give way to cardamom, pepper and clove plantations. Reach Thekkady, check in to your hotel, and explore afternoon & evening highlights.
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                <div className="text-xs font-bold text-slate-800">Optional Experiences:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>• <strong>Periyar Lake Boat Ride:</strong> Look for wildlife along the forested reserve shoreline.</div>
                  <div>• <strong>Spice Plantation Tour:</strong> Learn how cardamom, pepper, cinnamon & nutmeg are grown.</div>
                  <div>• <strong>Kathakali Classical Dance:</strong> Traditional cultural performance in the evening.</div>
                  <div>• <strong>Kalaripayattu Martial Arts & Ayurveda:</strong> Ancient martial arts demonstration or relaxing massage.</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                  <span className="font-bold text-emerald-900">Meal Plan:</span> Breakfast & Dinner included
                </div>
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900">Stay:</span> 3-Star Hotel – Thekkady
                </div>
              </div>
              <div className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200/80 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-amber-600" />
                <span><strong>Insider Tip:</strong> If you want a Periyar boat ride, ask about ticket availability as early as possible. Popular departures can fill up during busy periods.</span>
              </div>
            </div>

            {/* Day 4 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 bg-gradient-to-br from-white to-emerald-50/40">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Day 4 • Houseboat Night
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Approx. 140–160 km • 4.5–5 hrs drive
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Thekkady to Alleppey – Overnight Houseboat Experience
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Have breakfast and check out from your Thekkady hotel. Drive towards Alleppey (Alappuzha) as the landscape transitions from forested hills to waterways and lush canals. Reach the boarding jetty around noon and check in to your traditional Kerala houseboat.
              </p>
              <div className="bg-emerald-50 p-4 rounded-2xl space-y-2 border border-emerald-200/70 text-xs text-slate-700">
                <div className="font-bold text-emerald-950">Houseboat Cruise & Meal Inclusions:</div>
                <p>Cruise through Vembanad Lake, narrow canals, paddy fields, and coconut plantations. Settle on the front deck and observe rustic village life.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-semibold text-emerald-900">
                  <span>✓ Welcome Drink</span>
                  <span>✓ Kerala Lunch</span>
                  <span>✓ Evening Tea/Snacks</span>
                  <span>✓ Candlelight Dinner</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-emerald-100/70 rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-950">Meal Plan:</span> Breakfast + Lunch + Evening Tea/Snacks + Dinner
                </div>
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900">Stay:</span> Overnight Traditional Houseboat – Alleppey
                </div>
              </div>
              <div className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200/80 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-amber-600" />
                <span><strong>Insider Tip:</strong> Carry a small overnight bag for the houseboat. You do not need to haul all your luggage onto the boat; the main bags can stay safely in the vehicle boot.</span>
              </div>
            </div>

            {/* Day 5 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Day 5
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Approx. 55–65 km • 1.5–2 hrs drive
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Alleppey to Kochi – Backwaters to Fort Kochi Heritage
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Wake up to the calm waters of Alleppey. Enjoy breakfast on the houseboat as it completes its final morning cruise. Check out around 9:00 AM and drive towards Kochi. Check in to your Kochi 3-star hotel, freshen up, and proceed for sightseeing.
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                <div className="text-xs font-bold text-slate-800">Kochi Sightseeing Highlights:</div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Fort Kochi</span>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Chinese Fishing Nets</span>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">St. Francis Church</span>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Santa Cruz Basilica</span>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Mattancherry Palace</span>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Jew Town & Synagogue</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The area is a wonderful place to shop for spices, handicrafts, antiques and local souvenirs, or unwind at a heritage cafe.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                  <span className="font-bold text-emerald-900">Meal Plan:</span> Breakfast & Dinner included
                </div>
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900">Stay:</span> 3-Star Hotel – Kochi
                </div>
              </div>
              <div className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200/80 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-amber-600" />
                <span><strong>Insider Tip:</strong> Dress respectfully when visiting churches, temples, and synagogues. Comfortable footwear is handy for walking old cobbled streets.</span>
              </div>
            </div>

            {/* Day 6 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Day 6 • Tour Completion
                </span>
                <span className="text-xs font-semibold text-slate-500">Departure Transfers</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Kochi Sightseeing & Departure
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Enjoy your final breakfast at the hotel. Check out according to your onward departure flight or train schedule. If you have spare time before departure, visit Marine Drive or Lulu Mall for last-minute shopping.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your driver will transfer you to Cochin International Airport (COK) or Ernakulam Railway Station for your onward journey, concluding your memorable 6-day Kerala holiday.
              </p>
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-xs">
                <span className="font-bold text-emerald-900">Meal Plan:</span> Breakfast included
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explicit Conversion Focus Card: What Does ₹60,000 Include? */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                  Transparent Pricing
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  What Does ₹60,000 Include?
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm mt-1">
                  ₹60,000 Total for 2 Adults (₹30,000 per person)
                </p>
              </div>
              <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20 text-center">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">₹60,000</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wider font-bold">Couple Total</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-3">
                <div className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Your Package 100% Includes:</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-200">
                  <li className="flex items-start gap-2">✓ 5 Nights / 6 Days complete holiday</li>
                  <li className="flex items-start gap-2">✓ 3-Star accommodation (Munnar, Thekkady, Kochi)</li>
                  <li className="flex items-start gap-2">✓ Private air-conditioned Swift Dzire for the full tour</li>
                  <li className="flex items-start gap-2">✓ Daily breakfast and daily dinner at hotels</li>
                  <li className="flex items-start gap-2">✓ 1 Night Alleppey Houseboat stay</li>
                  <li className="flex items-start gap-2">✓ Houseboat Lunch + Tea/Snacks + Dinner + Breakfast</li>
                  <li className="flex items-start gap-2">✓ Kochi Airport/Railway Station pickup & drop</li>
                  <li className="flex items-start gap-2">✓ Munnar + Thekkady + Alleppey + Kochi sightseeing</li>
                  <li className="flex items-start gap-2">✓ Fuel, driver allowance, tolls and standard parking</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-3">
                <div className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Info className="w-5 h-5 text-amber-400" />
                  <span>Costs You Should Plan Separately:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Attraction entry tickets + optional Periyar lake boating + wildlife reserve activities + Kathakali / martial arts shows + personal expenses + flight / train tickets.
                </p>
                <div className="p-3 bg-amber-400/10 rounded-xl border border-amber-400/20 text-xs text-amber-200">
                  This crystal-clear separation makes the final trip cost 100% predictable without surprises.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Package Inclusions & Exclusions */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
              Full Breakdown
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Package Inclusions & Exclusions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Inclusions */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-black text-lg border-b border-slate-100 pb-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <h3>Package Inclusions</h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Accommodation:</strong> 5 nights total (2N Munnar, 1N Thekkady, 1N Alleppey Houseboat, 1N Kochi) in 3-star verified properties on double/twin sharing for 2 adults.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Private Transportation:</strong> Air-conditioned Swift Dzire available for the complete 6-day itinerary from Kochi pickup to Kochi drop.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Vehicle Overheads:</strong> Fuel charges, driver allowance, state permits, road taxes, tolls, and standard parking included.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Daily Hotel Meals:</strong> Daily wholesome breakfast and daily dinners at hotels.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Houseboat Full Meal Plan:</strong> Traditional Kerala lunch, evening tea with banana fritters/snacks, dinner, and breakfast on the boat.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Assistance & Taxes:</strong> Dedicated driver assistance throughout and applicable hotel service charges.</span>
                </li>
              </ul>
            </div>

            {/* Exclusions */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-rose-800 font-black text-lg border-b border-slate-100 pb-3">
                <XCircle className="w-6 h-6 text-rose-600" />
                <h3>Package Exclusions</h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Airfare or train tickets to and from Kochi.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Monument, park, museum, and attraction entry fees.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Boating tickets (Mattupetty Dam, Kundala Lake, Periyar Lake).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Periyar Tiger Reserve fees, jeep safari, elephant activities.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Kathakali or Kalaripayattu cultural performance tickets.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Ayurveda massage, spa treatments, camera/video permits.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Lunches outside the scheduled houseboat stay.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Personal expenses, laundry, tips, travel insurance.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Best Time to Visit & Important Munnar Note */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
              Seasonality & Weather
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Best Time to Visit Kerala
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                October to February
              </div>
              <div className="font-bold text-slate-900 mb-2">Peak & Pleasant</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Most comfortable weather for a Kerala road trip. Munnar and Thekkady are delightfully cool, and backwater conditions are optimal.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                March to May
              </div>
              <div className="font-bold text-slate-900 mb-2">Summer & Warm</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Plains and coast can be warm and humid. Munnar remains cooler, making it a great mountain retreat away from plains heat.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
                June to September
              </div>
              <div className="font-bold text-slate-900 mb-2">Southwest Monsoon</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lush green vegetation, gushing waterfalls and Ayurveda wellness season. Itineraries should allow flexibility for rain.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
                Houseboat Season
              </div>
              <div className="font-bold text-slate-900 mb-2">October to February</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Best period for smooth cruising across Vembanad Lake and calm canal sailing with pleasant breezes.
              </p>
            </div>
          </div>

          {/* Important Munnar Eravikulam Notice */}
          <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Info className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Important Munnar Note Regarding Eravikulam National Park</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
              Eravikulam National Park is subject to seasonal closure during the Nilgiri tahr calving season, generally between February and March, as well as local forest department operating rules. If closed on your travel date, our driver and tour manager will adjust the day’s plan with other attractive Munnar viewpoints and tea garden spots.
            </p>
          </div>
        </div>
      </section>

      {/* What to Pack & Food You Should Try */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Packing List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-black text-lg border-b border-slate-100 pb-3">
                <Luggage className="w-6 h-6 text-emerald-600" />
                <h3>What to Pack for Kerala</h3>
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-700">
                <span className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">✓ Comfortable walking shoes</span>
                <span className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">✓ Breathable cotton clothes</span>
                <span className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">✓ Light jacket/shawl for Munnar</span>
                <span className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">✓ Small umbrella or raincoat</span>
                <span className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">✓ Sunscreen & sunglasses</span>
                <span className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">✓ Hat or cap</span>
                <span className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">✓ Insect repellent</span>
                <span className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">✓ Personal medicines</span>
                <span className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">✓ Small day backpack</span>
                <span className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">✓ Power bank</span>
                <span className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">✓ Valid photo ID</span>
                <span className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">✓ Small overnight bag for boat</span>
              </div>
            </div>

            {/* Food You Should Try */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-black text-lg border-b border-slate-100 pb-3">
                <Coffee className="w-6 h-6 text-emerald-600" />
                <h3>Kerala Food You Should Try</h3>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Munnar & Thekkady:</strong>
                  Fresh local Kerala breakfast with hot appam, vegetable stew, crispy ghee roast dosa, and spice-infused curries.
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Alleppey Houseboat:</strong>
                  Authentic Kerala Sadhya served on banana leaf with red rice, avial, thoran, and fresh Karimeen (pearl spot fish) fry or chicken curry prepared live on boat.
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Kochi Cafes & Seafood:</strong>
                  Fort Kochi offers heritage coastal dining, freshly caught grilled fish by the Chinese nets, and charming colonial bakery cafes.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Tips & Comparison Table */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Practical Tips */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
                Smart Traveler Guide
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Kerala Travel Tips
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 text-xs sm:text-sm block mb-1">Start Early on Transfer Days</strong>
                <p className="text-xs text-slate-600">Munnar, Thekkady and Alleppey involve scenic hill curves. Starting early maximizes your relaxation time at each stop.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 text-xs sm:text-sm block mb-1">Keep Houseboat Luggage Light</strong>
                <p className="text-xs text-slate-600">Your main suitcases can safely stay locked in your private Dzire boot; just take a small duffle onto the boat.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 text-xs sm:text-sm block mb-1">Book Popular Activities Early</strong>
                <p className="text-xs text-slate-600">Periyar lake boating and evening Kathakali shows sell out fast during peak months. Ask your driver on Day 1.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 text-xs sm:text-sm block mb-1">Keep Rain Protection Handy</strong>
                <p className="text-xs text-slate-600">Kerala can receive brief passing showers even outside the monsoon. A lightweight umbrella is handy.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 text-xs sm:text-sm block mb-1">Do Not Rush Sightseeing</strong>
                <p className="text-xs text-slate-600">Munnar alone has dozens of scenic spots. A calm, relaxed itinerary makes for a far more memorable trip.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 text-xs sm:text-sm block mb-1">Customization Available</strong>
                <p className="text-xs text-slate-600">Want to add Kumarakom, Kovalam, Varkala or Athirappilly? We can tailor your days and vehicle seamlessly.</p>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
                Value Comparison
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Kerala Package Comparison
              </h2>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900 text-white uppercase text-[11px] tracking-wider font-extrabold">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Feature</th>
                    <th className="py-3.5 px-4 sm:px-6 bg-emerald-800 text-white">KRAD Private Kerala</th>
                    <th className="py-3.5 px-4 sm:px-6">Typical Budget Package</th>
                    <th className="py-3.5 px-4 sm:px-6">Group Kerala Tour</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-bold text-slate-800">Duration</td>
                    <td className="py-3 px-4 sm:px-6 font-bold text-emerald-800 bg-emerald-50/50">5N / 6D</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600">Varies</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600">6 Days</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-bold text-slate-800">Vehicle</td>
                    <td className="py-3 px-4 sm:px-6 font-bold text-emerald-800 bg-emerald-50/50">Private Swift Dzire</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600">Depends on package</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600">Shared / Group Bus</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-bold text-slate-800">Hotels</td>
                    <td className="py-3 px-4 sm:px-6 font-bold text-emerald-800 bg-emerald-50/50">3-Star Verified</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600">Category varies</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600">Fixed group hotels</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-bold text-slate-800">Breakfast & Dinner</td>
                    <td className="py-3 px-4 sm:px-6 font-bold text-emerald-800 bg-emerald-50/50">Included Daily</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600">Varies / Optional</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600">Buffet set menu</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-bold text-slate-800">Alleppey Houseboat</td>
                    <td className="py-3 px-4 sm:px-6 font-bold text-emerald-800 bg-emerald-50/50">1 Night Included</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600">Shikara ride only</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600">Optional extra cost</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-bold text-slate-800">Houseboat Meals</td>
                    <td className="py-3 px-4 sm:px-6 font-bold text-emerald-800 bg-emerald-50/50">Lunch + Tea/Snacks + Dinner</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600">Excluded</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600">Depends on tour</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 sm:px-6 font-bold text-slate-800">Couple Privacy</td>
                    <td className="py-3 px-4 sm:px-6 font-bold text-emerald-800 bg-emerald-50/50">100% Private</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600">Mixed</td>
                    <td className="py-3 px-4 sm:px-6 text-slate-600">None (Large Group)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Booking, Payment & Cancellation Policies */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
              Terms & Flexibility
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Booking & Cancellation Policies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Booking & Payment */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Booking & Payment Terms
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To confirm your booking, you receive an official KRADIND Adventures booking voucher stating your travel dates, 3-star hotel names, private vehicle details, meal plan, inclusions and payment breakdown.
              </p>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <strong className="text-emerald-900 block">30% Advance:</strong>
                  Pay 30% advance upon booking to secure hotel rooms and private houseboat slot.
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block">70% Balance:</strong>
                  Remaining balance payable before the trip as specified in the booking voucher.
                </div>
              </div>
            </div>

            {/* Cancellation Schedule */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Cancellation & Refund Framework
              </h3>
              <div className="overflow-hidden rounded-2xl border border-slate-200 text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 font-bold text-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Notice Before Arrival</th>
                      <th className="py-2.5 px-3">Cancellation Charge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-600">
                    <tr>
                      <td className="py-2 px-3 font-medium">30+ Days</td>
                      <td className="py-2 px-3 text-slate-900 font-bold">10% of package cost</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">21–29 Days</td>
                      <td className="py-2 px-3 text-slate-900 font-bold">25% of package cost</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">15–20 Days</td>
                      <td className="py-2 px-3 text-slate-900 font-bold">40% of package cost</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">8–14 Days</td>
                      <td className="py-2 px-3 text-slate-900 font-bold">60% of package cost</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">4–7 Days</td>
                      <td className="py-2 px-3 text-slate-900 font-bold">75% of package cost</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">0–3 Days / No-show</td>
                      <td className="py-2 px-3 text-rose-700 font-bold">100% (No refund)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Peak festive dates (Christmas, New Year) may have separate supplier policies as highlighted in your quotation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Everything you need to know about the Kerala 5N/6D private couple holiday.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "1. What is the cost of this 5 nights 6 days Kerala tour package?",
                a: "The package costs ₹60,000 total for 2 adults, which works out to ₹30,000 per person. It includes 3-star accommodation, private Swift Dzire transportation, daily breakfast and dinner at hotels, plus one night in an Alleppey houseboat with full houseboat meals (lunch, evening tea/snacks, dinner, and breakfast).",
              },
              {
                q: "2. What places are covered in this Kerala tour package?",
                a: "The route covers Kochi, Munnar, Thekkady and Alleppey. You get two nights in Munnar, one night in Thekkady, one night on an Alleppey houseboat, and one night in Kochi.",
              },
              {
                q: "3. Is the Kerala tour package private for couples?",
                a: "Yes. This package is planned for 2 adults travelling in a private Swift Dzire. The vehicle is not shared with another tourist group.",
              },
              {
                q: "4. Is Periyar boating included in the package?",
                a: "No. Periyar Lake boating is an optional activity and is not included in the standard ₹60,000 package. Tickets and applicable charges can be paid separately, subject to availability.",
              },
              {
                q: "5. Is the Alleppey houseboat stay included?",
                a: "Yes. The package includes one night on an Alleppey houseboat. The houseboat plan includes lunch, evening tea/snacks and dinner, along with breakfast as specified in the itinerary.",
              },
              {
                q: "6. What is the best time to visit Kerala?",
                a: "October to February is generally a comfortable period for this route, with pleasant conditions in Munnar and Thekkady and suitable weather for backwater travel. Kerala can also be visited during the monsoon (June to September) for lush greenery, though travelers should expect passing showers.",
              },
              {
                q: "7. Are Eravikulam National Park and other entry tickets included?",
                a: "No. Attraction entry fees are excluded unless specifically mentioned in your booking confirmation. Eravikulam National Park is also subject to seasonal closure during the Nilgiri tahr calving season (generally around February and March), so an alternative sightseeing stop may be used when required.",
              },
              {
                q: "8. Can I customize this Kerala tour package?",
                a: "Yes. You can request changes to the hotel category, meal plan, destinations, sightseeing and number of nights. Popular additions include Kumarakom, Kovalam, Varkala, Marari, Vagamon and Athirappilly.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50 transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-emerald-800 transition"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Your Kerala Holiday / Lead Inquiry Form */}
      <section id="book-now" className="py-14 sm:py-20 bg-slate-900 text-white scroll-mt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3.5 py-1.5 rounded-full">
              Get Your Kerala Tour Quote
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Book Your Private Kerala Holiday
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              From Munnar’s tea-covered hills to Thekkady’s spice country and Alleppey’s slow-moving backwaters. Send your details for instant quotation & date check.
            </p>
          </div>

          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/20">
            {submitSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Quote Request Received!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Thank you! Our Kerala destination specialist will review your travel dates and send your customized quotation and voucher via WhatsApp & Email within 30 minutes.
                </p>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/917500222141?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    <span>Chat With Specialist Now</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tentative Travel Date
                    </label>
                    <input
                      type="date"
                      value={leadDate}
                      onChange={(e) => setLeadDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Special Requests / Customization Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us if you want room upgrades, specific honeymoon arrangements, or add-on destinations like Kovalam or Kumarakom..."
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting inquiry...</span>
                  ) : (
                    <>
                      <span>Get Free Custom Quote & Check Availability</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <span className="text-xs text-slate-500">
                    Prefer direct chat?{" "}
                    <a
                      href={`https://wa.me/917500222141?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      Click here to message our Kerala team on WhatsApp
                    </a>
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Sticky Mobile Bottom CTA Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 p-3 shadow-2xl flex items-center gap-2">
        <div className="flex-1">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Kerala 5N/6D Package</div>
          <div className="text-sm font-black text-slate-900">₹60,000 <span className="text-[10px] font-normal text-slate-500">for 2</span></div>
        </div>

        <a
          href={`https://wa.me/917500222141?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-[#25D366] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold shadow shrink-0"
        >
          <FaWhatsapp className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>

        <a
          href="#book-now"
          className="bg-emerald-600 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold shadow shrink-0"
        >
          Get Quote
        </a>
      </div>

      <Footer />
    </div>
  );
}
