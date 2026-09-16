"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  Menu,
  X,
  PhoneCall,
  Sparkles,
  Mountain,
  Compass,
  Globe2,
  Tent,
  MapPin,
  Briefcase,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Footprints,
} from "lucide-react";

export function Header({ onBookClick }: { onBookClick?: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});

  const toggleMobile = (key: string) => {
    setMobileExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const closeDropdown = () => setActiveDropdown(null);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-[96rem] mx-auto px-3 sm:px-5 lg:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <Link
          href="/"
          aria-label="KRADIND Adventures - Explore, Trek, Travel Homepage"
          className="flex items-center gap-2 shrink-0 group py-1"
        >
          <Image
            src="/logo-horizontal.png"
            alt="KRAD Global tour and travel company logo"
            width={180}
            height={46}
            className="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            priority
          />
          <span className="sr-only">KRADIND Adventures Homepage</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-3 2xl:space-x-5 text-[13px] font-semibold text-slate-700">
          
          {/* 1. Home */}
          <Link
            href="/"
            className="hover:text-[#FF6B35] text-[#0F3A2E] font-bold transition px-1.5 py-2"
          >
            Home
          </Link>

          {/* 2. Treks ▾ */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("treks")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === "treks" ? null : "treks")}
              className={`hover:text-[#0F3A2E] flex items-center gap-1 px-1.5 py-2 cursor-pointer transition ${
                activeDropdown === "treks" ? "text-[#0F3A2E] font-bold" : ""
              }`}
            >
              <span>Treks</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  activeDropdown === "treks" ? "rotate-180 text-[#0F3A2E]" : ""
                }`}
              />
            </button>

            {activeDropdown === "treks" && (
              <div
                className="absolute top-full -left-12 w-[620px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      🏔️ Certified Himalayan Treks & High Passes
                    </span>
                  </div>
                  <Link
                    href="/treks"
                    onClick={closeDropdown}
                    className="text-xs font-bold text-[#FF6B35] hover:text-[#e05320] flex items-center gap-1 transition"
                  >
                    All Treks →
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/treks"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                      🏔️
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">All Treks</span>
                      <span className="text-[11px] text-slate-500">Explore complete catalog</span>
                    </div>
                  </Link>

                  <Link
                    href="/treks/uttarakhand"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                      🛕
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Uttarakhand Treks</span>
                      <span className="text-[11px] text-slate-500">Chopta, Kedarkantha, Tungnath</span>
                    </div>
                  </Link>

                  <Link
                    href="/treks/himachal-pradesh"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
                      🌲
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Himachal Pradesh Treks</span>
                      <span className="text-[11px] text-slate-500">Hampta Pass, Kheerganga, Bhrigu</span>
                    </div>
                  </Link>

                  <Link
                    href="/treks/kashmir"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
                      ❄️
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Kashmir Treks</span>
                      <span className="text-[11px] text-slate-500">Great Lakes, Tarsar Marsar</span>
                    </div>
                  </Link>

                  <Link
                    href="/treks/ladakh"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold shrink-0">
                      🏔️
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Ladakh Treks</span>
                      <span className="text-[11px] text-slate-500">Markha Valley, High Passes</span>
                    </div>
                  </Link>

                  <Link
                    href="/treks/nepal"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold shrink-0">
                      🇳🇵
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Nepal Treks</span>
                      <span className="text-[11px] text-slate-500">Annapurna, Everest Base Camp</span>
                    </div>
                  </Link>

                  <Link
                    href="/treks/high-altitude"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold shrink-0">
                      ⚡
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">High Altitude Treks</span>
                      <span className="text-[11px] text-slate-500">14,000+ Ft Technical trails</span>
                    </div>
                  </Link>

                  <Link
                    href="/treks/weekend"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                      ⛺
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Weekend Treks</span>
                      <span className="text-[11px] text-slate-500">2-3 Days Quick Escapes</span>
                    </div>
                  </Link>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> NIM Certified Guides • Medical Kit & Oxygen
                  </span>
                  <a href="tel:+917500222141" className="font-bold text-[#FF6B35] hover:underline">
                    Call: +91 7500222141
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 3. Domestic Trips ▾ */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("domestic")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === "domestic" ? null : "domestic")}
              className={`hover:text-[#0F3A2E] flex items-center gap-1 px-1.5 py-2 cursor-pointer transition ${
                activeDropdown === "domestic" ? "text-[#0F3A2E] font-bold" : ""
              }`}
            >
              <span>Domestic Trips</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  activeDropdown === "domestic" ? "rotate-180 text-[#0F3A2E]" : ""
                }`}
              />
            </button>

            {activeDropdown === "domestic" && (
              <div
                className="absolute top-full -left-20 w-[620px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      🇮🇳 Curated India Tours By State
                    </span>
                  </div>
                  <Link
                    href="/domestic-trips"
                    onClick={closeDropdown}
                    className="text-xs font-bold text-[#FF6B35] hover:text-[#e05320] flex items-center gap-1 transition"
                  >
                    All Domestic Trips →
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/domestic-trips"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                      🇮🇳
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">All Domestic Trips</span>
                      <span className="text-[11px] text-slate-500">Explore India tour packages</span>
                    </div>
                  </Link>

                  <Link
                    href="/domestic-trips/uttarakhand"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                      🏔️
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Uttarakhand Tours</span>
                      <span className="text-[11px] text-slate-500">Nainital, Mussoorie, Rishikesh</span>
                    </div>
                  </Link>

                  <Link
                    href="/domestic-trips/himachal-pradesh"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
                      🌲
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Himachal Pradesh Tours</span>
                      <span className="text-[11px] text-slate-500">Manali, Shimla, Spiti Valley</span>
                    </div>
                  </Link>

                  <Link
                    href="/domestic-trips/kashmir"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
                      ❄️
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Kashmir Tours</span>
                      <span className="text-[11px] text-slate-500">Srinagar, Gulmarg, Pahalgam</span>
                    </div>
                  </Link>

                  <Link
                    href="/domestic-trips/ladakh"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold shrink-0">
                      🏔️
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Ladakh Tours</span>
                      <span className="text-[11px] text-slate-500">Leh, Pangong Tso, Nubra Valley</span>
                    </div>
                  </Link>

                  <Link
                    href="/domestic-trips/rajasthan"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                      🏰
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Rajasthan Tours</span>
                      <span className="text-[11px] text-slate-500">Jaipur, Udaipur, Jaisalmer dunes</span>
                    </div>
                  </Link>

                  <Link
                    href="/domestic-trips/kerala"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                      🌴
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Kerala Tours</span>
                      <span className="text-[11px] text-slate-500">Munnar, Alleppey Houseboats</span>
                    </div>
                  </Link>

                  <Link
                    href="/domestic-trips/goa"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold shrink-0">
                      🌊
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Goa Tours</span>
                      <span className="text-[11px] text-slate-500">North & South Goa Beaches</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 4. International Trips ▾ */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("international")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === "international" ? null : "international")}
              className={`hover:text-[#0F3A2E] flex items-center gap-1 px-1.5 py-2 cursor-pointer transition ${
                activeDropdown === "international" ? "text-[#0F3A2E] font-bold" : ""
              }`}
            >
              <span>International Trips</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  activeDropdown === "international" ? "rotate-180 text-[#0F3A2E]" : ""
                }`}
              />
            </button>

            {activeDropdown === "international" && (
              <div
                className="absolute top-full -left-28 w-[620px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      🌎 Handpicked International Holidays
                    </span>
                  </div>
                  <Link
                    href="/international-trips"
                    onClick={closeDropdown}
                    className="text-xs font-bold text-[#FF6B35] hover:text-[#e05320] flex items-center gap-1 transition"
                  >
                    All International Trips →
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/international-trips"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-blue-50/80 transition group border border-transparent hover:border-blue-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
                      ✈️
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-blue-900 block">All International Trips</span>
                      <span className="text-[11px] text-slate-500">Global travel packages</span>
                    </div>
                  </Link>

                  <Link
                    href="/international-trips/nepal"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-blue-50/80 transition group border border-transparent hover:border-blue-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                      🇳🇵
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-blue-900 block">Nepal Tours</span>
                      <span className="text-[11px] text-slate-500">Kathmandu, Pokhara, Chitwan</span>
                    </div>
                  </Link>

                  <Link
                    href="/international-trips/bali"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-blue-50/80 transition group border border-transparent hover:border-blue-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
                      🌺
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-blue-900 block">Bali Tours</span>
                      <span className="text-[11px] text-slate-500">Ubud, Seminyak, Nusa Penida</span>
                    </div>
                  </Link>

                  <Link
                    href="/international-trips/thailand"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-blue-50/80 transition group border border-transparent hover:border-blue-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                      🐘
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-blue-900 block">Thailand Tours</span>
                      <span className="text-[11px] text-slate-500">Bangkok, Phuket, Krabi</span>
                    </div>
                  </Link>

                  <Link
                    href="/international-trips/dubai"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-blue-50/80 transition group border border-transparent hover:border-blue-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold shrink-0">
                      🏙️
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-blue-900 block">Dubai Tours</span>
                      <span className="text-[11px] text-slate-500">Burj Khalifa, Desert Safari</span>
                    </div>
                  </Link>

                  <Link
                    href="/international-trips/vietnam"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-blue-50/80 transition group border border-transparent hover:border-blue-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold shrink-0">
                      🏮
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-blue-900 block">Vietnam Tours</span>
                      <span className="text-[11px] text-slate-500">Hanoi, Ha Long Bay, Da Nang</span>
                    </div>
                  </Link>

                  <Link
                    href="/international-trips/singapore"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-blue-50/80 transition group border border-transparent hover:border-blue-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold shrink-0">
                      🦁
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-blue-900 block">Singapore Tours</span>
                      <span className="text-[11px] text-slate-500">Marina Bay, Sentosa, Universal</span>
                    </div>
                  </Link>

                  <Link
                    href="/international-trips/maldives"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-blue-50/80 transition group border border-transparent hover:border-blue-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold shrink-0">
                      🏖️
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-blue-900 block">Maldives Holidays</span>
                      <span className="text-[11px] text-slate-500">Overwater Villas & Private Island</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 5. Adventure Tours ▾ */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("adventure")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === "adventure" ? null : "adventure")}
              className={`hover:text-[#0F3A2E] flex items-center gap-1 px-1.5 py-2 cursor-pointer transition ${
                activeDropdown === "adventure" ? "text-[#0F3A2E] font-bold" : ""
              }`}
            >
              <span>Adventure Tours</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  activeDropdown === "adventure" ? "rotate-180 text-[#0F3A2E]" : ""
                }`}
              />
            </button>

            {activeDropdown === "adventure" && (
              <div
                className="absolute top-full -left-16 w-[540px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      🧗 High Adrenaline Adventures & Expeditions
                    </span>
                  </div>
                  <Link
                    href="/adventure-tours"
                    onClick={closeDropdown}
                    className="text-xs font-bold text-[#FF6B35] hover:text-[#e05320] flex items-center gap-1 transition"
                  >
                    All Adventures →
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/adventure-tours"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50/80 transition group border border-transparent hover:border-amber-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                      🧭
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-amber-900 block">Adventure Tours</span>
                      <span className="text-[11px] text-slate-500">Explore all activities</span>
                    </div>
                  </Link>

                  <Link
                    href="/adventure-tours/camping"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50/80 transition group border border-transparent hover:border-amber-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                      ⛺
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-amber-900 block">Camping</span>
                      <span className="text-[11px] text-slate-500">Riverside & Alpine glamping</span>
                    </div>
                  </Link>

                  <Link
                    href="/adventure-tours/hiking"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50/80 transition group border border-transparent hover:border-amber-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
                      🥾
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-amber-900 block">Hiking</span>
                      <span className="text-[11px] text-slate-500">Scenic forest & ridge walks</span>
                    </div>
                  </Link>

                  <Link
                    href="/adventure-tours/snow-treks"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50/80 transition group border border-transparent hover:border-amber-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold shrink-0">
                      ❄️
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-amber-900 block">Snow Treks</span>
                      <span className="text-[11px] text-slate-500">Winter crampon trails & summits</span>
                    </div>
                  </Link>

                  <Link
                    href="/adventure-tours/expeditions"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50/80 transition group border border-transparent hover:border-amber-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold shrink-0">
                      🚩
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-amber-900 block">Expeditions</span>
                      <span className="text-[11px] text-slate-500">Glacial passes & mountain summits</span>
                    </div>
                  </Link>

                  <Link
                    href="/adventure-tours/high-altitude"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50/80 transition group border border-transparent hover:border-amber-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold shrink-0">
                      🏔️
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-amber-900 block">High Altitude Adventures</span>
                      <span className="text-[11px] text-slate-500">12,000 to 18,000 Ft circuits</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 6. Destinations ▾ */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("destinations")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === "destinations" ? null : "destinations")}
              className={`hover:text-[#0F3A2E] flex items-center gap-1 px-1.5 py-2 cursor-pointer transition ${
                activeDropdown === "destinations" ? "text-[#0F3A2E] font-bold" : ""
              }`}
            >
              <span>Destinations</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  activeDropdown === "destinations" ? "rotate-180 text-[#0F3A2E]" : ""
                }`}
              />
            </button>

            {activeDropdown === "destinations" && (
              <div
                className="absolute top-full -left-20 w-[600px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      📍 Explore Top Destinations
                    </span>
                  </div>
                  <Link
                    href="/destinations"
                    onClick={closeDropdown}
                    className="text-xs font-bold text-[#FF6B35] hover:text-[#e05320] flex items-center gap-1 transition"
                  >
                    All Destinations →
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/destinations/uttarakhand"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                      🏔️
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Uttarakhand</span>
                      <span className="text-[11px] text-slate-500">Land of the Gods & Peaks</span>
                    </div>
                  </Link>

                  <Link
                    href="/destinations/himachal-pradesh"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
                      🌲
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Himachal Pradesh</span>
                      <span className="text-[11px] text-slate-500">Valleys, Passes & Apple Orchards</span>
                    </div>
                  </Link>

                  <Link
                    href="/destinations/kashmir"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
                      ❄️
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Kashmir</span>
                      <span className="text-[11px] text-slate-500">Paradise On Earth & Alpine Lakes</span>
                    </div>
                  </Link>

                  <Link
                    href="/destinations/ladakh"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold shrink-0">
                      🏔️
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Ladakh</span>
                      <span className="text-[11px] text-slate-500">High Altitude Desert & Monasteries</span>
                    </div>
                  </Link>

                  <Link
                    href="/destinations/rajasthan"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                      🏰
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Rajasthan</span>
                      <span className="text-[11px] text-slate-500">Royal Forts, Palaces & Desert Dunes</span>
                    </div>
                  </Link>

                  <Link
                    href="/destinations/kerala"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                      🌴
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Kerala</span>
                      <span className="text-[11px] text-slate-500">God's Own Country & Backwaters</span>
                    </div>
                  </Link>

                  <Link
                    href="/destinations/goa"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold shrink-0">
                      🌊
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Goa</span>
                      <span className="text-[11px] text-slate-500">Sun, Sand, Sea & Portuguese Charm</span>
                    </div>
                  </Link>

                  <Link
                    href="/destinations/nepal"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold shrink-0">
                      🇳🇵
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Nepal</span>
                      <span className="text-[11px] text-slate-500">Himalayan Kingdom & Stupas</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 7. Travel Services ▾ */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("services")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === "services" ? null : "services")}
              className={`hover:text-[#0F3A2E] flex items-center gap-1 px-1.5 py-2 cursor-pointer transition ${
                activeDropdown === "services" ? "text-[#0F3A2E] font-bold" : ""
              }`}
            >
              <span>Travel Services</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  activeDropdown === "services" ? "rotate-180 text-[#0F3A2E]" : ""
                }`}
              />
            </button>

            {activeDropdown === "services" && (
              <div
                className="absolute top-full -left-20 w-[520px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      🛎️ End-to-End Travel Logistics & Bookings
                    </span>
                  </div>
                  <Link
                    href="/travel-services"
                    onClick={closeDropdown}
                    className="text-xs font-bold text-[#FF6B35] hover:text-[#e05320] flex items-center gap-1 transition"
                  >
                    All Services →
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/travel-services#hotels"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-teal-50/80 transition group border border-transparent hover:border-teal-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
                      🏨
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-teal-900 block">Hotels & Resorts</span>
                      <span className="text-[11px] text-slate-500">Handpicked stays & camps</span>
                    </div>
                  </Link>

                  <Link
                    href="/travel-services#flights"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-teal-50/80 transition group border border-transparent hover:border-teal-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
                      🛫
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-teal-900 block">Flight Tickets</span>
                      <span className="text-[11px] text-slate-500">Domestic & International fares</span>
                    </div>
                  </Link>

                  <Link
                    href="/travel-services#transfers"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-teal-50/80 transition group border border-transparent hover:border-teal-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                      🚗
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-teal-900 block">Airport Transfers</span>
                      <span className="text-[11px] text-slate-500">Pick-and-drop outstations</span>
                    </div>
                  </Link>

                  <Link
                    href="/travel-services#transport"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-teal-50/80 transition group border border-transparent hover:border-teal-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                      🚙
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-teal-900 block">Mountain 4x4 Cabs</span>
                      <span className="text-[11px] text-slate-500">Innova, Tempo & Bolero Camper</span>
                    </div>
                  </Link>

                  <Link
                    href="/travel-services#customized"
                    onClick={closeDropdown}
                    className="col-span-2 flex items-center gap-2.5 p-2 rounded-xl hover:bg-teal-50/80 transition group border border-transparent hover:border-teal-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold shrink-0">
                      ✨
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-teal-900 block">Customized & Corporate Tours</span>
                      <span className="text-[11px] text-slate-500">Tailormade family itineraries, corporate retreats & student groups</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 8. Travel Blog ▾ */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("blog")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === "blog" ? null : "blog")}
              className={`hover:text-[#0F3A2E] flex items-center gap-1 px-1.5 py-2 cursor-pointer transition ${
                activeDropdown === "blog" ? "text-[#0F3A2E] font-bold" : ""
              }`}
            >
              <span>Travel Blog</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  activeDropdown === "blog" ? "rotate-180 text-[#0F3A2E]" : ""
                }`}
              />
            </button>

            {activeDropdown === "blog" && (
              <div
                className="absolute top-full -left-20 w-[540px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      ✍️ Trail Guides, Tips & Stories
                    </span>
                  </div>
                  <Link
                    href="/blog"
                    onClick={closeDropdown}
                    className="text-xs font-bold text-[#FF6B35] hover:text-[#e05320] flex items-center gap-1 transition"
                  >
                    All Articles →
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/blog/trekking-guides"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                      🏔️
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Trekking Guides</span>
                      <span className="text-[11px] text-slate-500">Route breakdowns & itineraries</span>
                    </div>
                  </Link>

                  <Link
                    href="/blog/travel-guides"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
                      🗺️
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Travel Guides</span>
                      <span className="text-[11px] text-slate-500">City, beach & cultural escapes</span>
                    </div>
                  </Link>

                  <Link
                    href="/blog/trekking-tips"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                      🎒
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Trekking Tips</span>
                      <span className="text-[11px] text-slate-500">Altitude gear & fitness prep</span>
                    </div>
                  </Link>

                  <Link
                    href="/blog/travel-tips"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
                      💡
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Travel Tips</span>
                      <span className="text-[11px] text-slate-500">Packing hacks & budget tricks</span>
                    </div>
                  </Link>

                  <Link
                    href="/blog/destination-guides"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold shrink-0">
                      📍
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Destination Guides</span>
                      <span className="text-[11px] text-slate-500">Best seasons & local sights</span>
                    </div>
                  </Link>

                  <Link
                    href="/blog/trek-stories"
                    onClick={closeDropdown}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/80 transition group border border-transparent hover:border-emerald-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold shrink-0">
                      📖
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-900 block">Trek Stories</span>
                      <span className="text-[11px] text-slate-500">Summit diaries & experiences</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 9. About Us */}
          <Link
            href="/about-us"
            className="hover:text-[#0F3A2E] text-slate-700 transition px-1.5 py-2"
          >
            About Us
          </Link>

          {/* 10. Contact Us */}
          <Link
            href="/contact-us"
            className="hover:text-[#0F3A2E] text-slate-700 transition px-1.5 py-2"
          >
            Contact Us
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Phone CTA */}
          <a
            href="tel:+917500222141"
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#0F3A2E] border border-emerald-200/80 text-xs sm:text-sm font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full transition shadow-xs group whitespace-nowrap"
            title="Direct Ground Desk: +91 7500222141"
          >
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 animate-phone-vibrate shrink-0" />
            <span className="tracking-tight font-bold hidden sm:inline">+91 7500222141</span>
            <span className="tracking-tight font-bold sm:hidden">Call</span>
          </a>

          {/* Plan Your Trip CTA */}
          <Link
            href="/plan-your-trip"
            onClick={onBookClick}
            className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-[#FF6B35] to-[#f0551d] hover:from-[#e05a26] hover:to-[#df4913] text-white text-xs sm:text-sm font-extrabold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm hover:shadow-md transition duration-200 whitespace-nowrap"
          >
            <span>Plan Your Trip</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-700 hover:text-[#0F3A2E] hover:bg-slate-100 rounded-xl transition shrink-0"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-8 space-y-3 max-h-[85vh] overflow-y-auto">
          
          {/* Quick Actions in Drawer */}
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            <a
              href="tel:+917500222141"
              className="flex items-center justify-center gap-1.5 bg-emerald-50 text-[#0F3A2E] border border-emerald-200 font-bold text-xs py-2.5 rounded-xl shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600 animate-phone-vibrate shrink-0" />
              <span>+91 7500222141</span>
            </a>
            <Link
              href="/plan-your-trip"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onBookClick) onBookClick();
              }}
              className="flex items-center justify-center gap-1.5 bg-[#FF6B35] text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs"
            >
              <span>Plan Your Trip →</span>
            </Link>
          </div>

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-[#0F3A2E] py-2"
          >
            Home
          </Link>

          {/* 1. Mobile Treks Accordion */}
          <div className="border-t border-slate-100 py-1">
            <button
              onClick={() => toggleMobile("treks")}
              className="flex items-center justify-between w-full text-sm font-semibold text-[#0F3A2E] py-2"
            >
              <span>🏔️ Treks</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileExpanded["treks"] ? "rotate-180 text-emerald-600" : ""
                }`}
              />
            </button>
            {mobileExpanded["treks"] && (
              <div className="pl-3 py-1 space-y-1.5 border-l-2 border-emerald-500 ml-1 text-xs">
                <Link href="/treks" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-[#FF6B35] py-1">
                  • All Treks →
                </Link>
                <Link href="/treks/uttarakhand" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Uttarakhand Treks
                </Link>
                <Link href="/treks/himachal-pradesh" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Himachal Pradesh Treks
                </Link>
                <Link href="/treks/kashmir" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Kashmir Treks
                </Link>
                <Link href="/treks/ladakh" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Ladakh Treks
                </Link>
                <Link href="/treks/nepal" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Nepal Treks
                </Link>
                <Link href="/treks/high-altitude" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • High Altitude Treks
                </Link>
                <Link href="/treks/weekend" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Weekend Treks
                </Link>
              </div>
            )}
          </div>

          {/* 2. Mobile Domestic Trips Accordion */}
          <div className="border-t border-slate-100 py-1">
            <button
              onClick={() => toggleMobile("domestic")}
              className="flex items-center justify-between w-full text-sm font-semibold text-[#0F3A2E] py-2"
            >
              <span>🇮🇳 Domestic Trips</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileExpanded["domestic"] ? "rotate-180 text-emerald-600" : ""
                }`}
              />
            </button>
            {mobileExpanded["domestic"] && (
              <div className="pl-3 py-1 space-y-1.5 border-l-2 border-emerald-500 ml-1 text-xs">
                <Link href="/domestic-trips" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-[#FF6B35] py-1">
                  • All Domestic Trips →
                </Link>
                <Link href="/domestic-trips/uttarakhand" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Uttarakhand Tours
                </Link>
                <Link href="/domestic-trips/himachal-pradesh" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Himachal Pradesh Tours
                </Link>
                <Link href="/domestic-trips/kashmir" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Kashmir Tours
                </Link>
                <Link href="/domestic-trips/ladakh" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Ladakh Tours
                </Link>
                <Link href="/domestic-trips/rajasthan" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Rajasthan Tours
                </Link>
                <Link href="/domestic-trips/kerala" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Kerala Tours
                </Link>
                <Link href="/domestic-trips/goa" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Goa Tours
                </Link>
              </div>
            )}
          </div>

          {/* 3. Mobile International Trips Accordion */}
          <div className="border-t border-slate-100 py-1">
            <button
              onClick={() => toggleMobile("international")}
              className="flex items-center justify-between w-full text-sm font-semibold text-[#0F3A2E] py-2"
            >
              <span>🌎 International Trips</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileExpanded["international"] ? "rotate-180 text-emerald-600" : ""
                }`}
              />
            </button>
            {mobileExpanded["international"] && (
              <div className="pl-3 py-1 space-y-1.5 border-l-2 border-blue-500 ml-1 text-xs">
                <Link href="/international-trips" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-[#FF6B35] py-1">
                  • All International Trips →
                </Link>
                <Link href="/international-trips/nepal" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Nepal Tours
                </Link>
                <Link href="/international-trips/bali" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Bali Tours
                </Link>
                <Link href="/international-trips/thailand" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Thailand Tours
                </Link>
                <Link href="/international-trips/dubai" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Dubai Tours
                </Link>
                <Link href="/international-trips/vietnam" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Vietnam Tours
                </Link>
                <Link href="/international-trips/singapore" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Singapore Tours
                </Link>
                <Link href="/international-trips/maldives" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Maldives Holidays
                </Link>
              </div>
            )}
          </div>

          {/* 4. Mobile Adventure Tours Accordion */}
          <div className="border-t border-slate-100 py-1">
            <button
              onClick={() => toggleMobile("adventure")}
              className="flex items-center justify-between w-full text-sm font-semibold text-[#0F3A2E] py-2"
            >
              <span>🧗 Adventure Tours</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileExpanded["adventure"] ? "rotate-180 text-emerald-600" : ""
                }`}
              />
            </button>
            {mobileExpanded["adventure"] && (
              <div className="pl-3 py-1 space-y-1.5 border-l-2 border-amber-500 ml-1 text-xs">
                <Link href="/adventure-tours" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-[#FF6B35] py-1">
                  • All Adventure Tours →
                </Link>
                <Link href="/adventure-tours/camping" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Camping
                </Link>
                <Link href="/adventure-tours/hiking" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Hiking
                </Link>
                <Link href="/adventure-tours/snow-treks" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Snow Treks
                </Link>
                <Link href="/adventure-tours/expeditions" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Expeditions
                </Link>
                <Link href="/adventure-tours/high-altitude" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • High Altitude Adventures
                </Link>
              </div>
            )}
          </div>

          {/* 5. Mobile Destinations Accordion */}
          <div className="border-t border-slate-100 py-1">
            <button
              onClick={() => toggleMobile("destinations")}
              className="flex items-center justify-between w-full text-sm font-semibold text-[#0F3A2E] py-2"
            >
              <span>📍 Destinations</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileExpanded["destinations"] ? "rotate-180 text-emerald-600" : ""
                }`}
              />
            </button>
            {mobileExpanded["destinations"] && (
              <div className="pl-3 py-1 space-y-1.5 border-l-2 border-emerald-500 ml-1 text-xs">
                <Link href="/destinations" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-[#FF6B35] py-1">
                  • All Destinations →
                </Link>
                <Link href="/destinations/uttarakhand" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Uttarakhand
                </Link>
                <Link href="/destinations/himachal-pradesh" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Himachal Pradesh
                </Link>
                <Link href="/destinations/kashmir" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Kashmir
                </Link>
                <Link href="/destinations/ladakh" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Ladakh
                </Link>
                <Link href="/destinations/rajasthan" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Rajasthan
                </Link>
                <Link href="/destinations/kerala" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Kerala
                </Link>
                <Link href="/destinations/goa" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Goa
                </Link>
                <Link href="/destinations/nepal" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Nepal
                </Link>
              </div>
            )}
          </div>

          {/* 6. Mobile Travel Services Accordion */}
          <div className="border-t border-slate-100 py-1">
            <button
              onClick={() => toggleMobile("services")}
              className="flex items-center justify-between w-full text-sm font-semibold text-[#0F3A2E] py-2"
            >
              <span>🛎️ Travel Services</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileExpanded["services"] ? "rotate-180 text-emerald-600" : ""
                }`}
              />
            </button>
            {mobileExpanded["services"] && (
              <div className="pl-3 py-1 space-y-1.5 border-l-2 border-teal-500 ml-1 text-xs">
                <Link href="/travel-services" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-[#FF6B35] py-1">
                  • All Travel Services →
                </Link>
                <Link href="/travel-services#hotels" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Hotels & Resorts
                </Link>
                <Link href="/travel-services#flights" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Flights Booking
                </Link>
                <Link href="/travel-services#transfers" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Airport & Outstation Transfers
                </Link>
                <Link href="/travel-services#transport" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Mountain 4x4 Transportation
                </Link>
                <Link href="/travel-services#customized" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Customized & Corporate Tours
                </Link>
              </div>
            )}
          </div>

          {/* 7. Mobile Travel Blog Accordion */}
          <div className="border-t border-slate-100 py-1">
            <button
              onClick={() => toggleMobile("blog")}
              className="flex items-center justify-between w-full text-sm font-semibold text-[#0F3A2E] py-2"
            >
              <span>✍️ Travel Blog</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileExpanded["blog"] ? "rotate-180 text-emerald-600" : ""
                }`}
              />
            </button>
            {mobileExpanded["blog"] && (
              <div className="pl-3 py-1 space-y-1.5 border-l-2 border-emerald-500 ml-1 text-xs">
                <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-[#FF6B35] py-1">
                  • All Articles & Guides →
                </Link>
                <Link href="/blog/trekking-guides" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Trekking Guides
                </Link>
                <Link href="/blog/travel-guides" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Travel Guides
                </Link>
                <Link href="/blog/trekking-tips" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Trekking Tips
                </Link>
                <Link href="/blog/travel-tips" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Travel Tips
                </Link>
                <Link href="/blog/destination-guides" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Destination Guides
                </Link>
                <Link href="/blog/trek-stories" onClick={() => setMobileMenuOpen(false)} className="block text-slate-600 hover:text-[#0F3A2E] py-1">
                  • Trek Stories
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/about-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-700 hover:text-[#0F3A2E] py-2 border-t border-slate-100"
          >
            About Us
          </Link>

          <Link
            href="/contact-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-700 hover:text-[#0F3A2E] py-2 border-t border-slate-100"
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}
