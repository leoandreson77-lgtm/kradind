"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, PhoneCall } from "lucide-react";

export function Header({ onBookClick }: { onBookClick?: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [treksDropdownOpen, setTreksDropdownOpen] = useState(false);
  const [domesticDropdownOpen, setDomesticDropdownOpen] = useState(false);
  const [mobileTreksOpen, setMobileTreksOpen] = useState(false);
  const [mobileDomesticOpen, setMobileDomesticOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group py-1">
          <Image
            src="/logo-horizontal.png"
            alt="KRADIND - Explore, Trek, Travel"
            width={195}
            height={50}
            className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-slate-700">
          <Link href="/" className="text-[#0F3A2E] font-bold hover:text-[#FF6B35] transition">
            Home
          </Link>
          
          {/* Treks Full Mega Menu */}
          <div
            className="relative group"
            onMouseEnter={() => setTreksDropdownOpen(true)}
            onMouseLeave={() => setTreksDropdownOpen(false)}
          >
            <button
              onClick={() => setTreksDropdownOpen(!treksDropdownOpen)}
              className="hover:text-[#0F3A2E] flex items-center gap-1 py-2 cursor-pointer transition"
            >
              Treks{" "}
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 group-hover:rotate-180 ${
                  treksDropdownOpen ? "rotate-180 text-[#0F3A2E]" : ""
                }`}
              />
            </button>

            <div
              className={`${
                treksDropdownOpen ? "block" : "hidden lg:group-hover:block"
              } absolute top-full -left-20 lg:-left-24 w-[880px] max-w-[92vw] bg-white border border-slate-200/95 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}
            >
              {/* Mega Menu Top Header */}
              <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    🏔️ Certified Himalayan Trekking — Summits, High Passes & Alpine Trails
                  </span>
                </div>
                <Link
                  href="/treks"
                  onClick={() => setTreksDropdownOpen(false)}
                  className="text-xs font-bold text-[#FF6B35] hover:text-[#e05320] flex items-center gap-1 transition"
                >
                  View All Treks →
                </Link>
              </div>

              {/* 3-Column Categories Grid */}
              <div className="grid grid-cols-3 gap-4">
                {/* Column 1: High Passes & Summit Expeditions */}
                <div className="space-y-3">
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition">
                    <Link
                      href="/treks/category/himalayas"
                      onClick={() => setTreksDropdownOpen(false)}
                      className="group flex items-center justify-between mb-1.5"
                    >
                      <span className="font-bold text-xs text-[#0F3A2E] group-hover:text-[#FF6B35] transition flex items-center gap-1.5">
                        🏔️ High Passes & Summits
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-full">
                        13,000+ Ft
                      </span>
                    </Link>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      <li>
                        <Link
                          href="/treks/hampta-pass"
                          onClick={() => setTreksDropdownOpen(false)}
                          className="hover:text-[#0F3A2E] hover:font-medium transition block truncate"
                        >
                          • Hampta Pass Crossover{" "}
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">14,065 Ft</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/treks/chopta-tungnath-chandrashila"
                          onClick={() => setTreksDropdownOpen(false)}
                          className="hover:text-[#0F3A2E] hover:font-medium transition block truncate"
                        >
                          • Chopta Tungnath Chandrashila{" "}
                          <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1 rounded">13,000 Ft</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/treks/leh-ladakh-tour-package"
                          onClick={() => setTreksDropdownOpen(false)}
                          className="hover:text-[#0F3A2E] hover:font-medium transition block truncate"
                        >
                          • Leh Ladakh High Passes{" "}
                          <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1 rounded">17,500 Ft</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/treks/category/himalayas"
                          onClick={() => setTreksDropdownOpen(false)}
                          className="text-[11px] font-semibold text-[#FF6B35] hover:underline pt-0.5 inline-block"
                        >
                          Explore all High Altitude Treks →
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Trek Difficulty Filter Box */}
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-[#0F3A2E] flex items-center gap-1.5">
                        🧭 By Trail Difficulty
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5 text-xs">
                      <Link
                        href="/treks/category/weekend"
                        onClick={() => setTreksDropdownOpen(false)}
                        className="flex items-center justify-between bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 px-2.5 py-1 rounded-lg transition"
                      >
                        <span className="font-medium">🟢 Easy / Beginner</span>
                        <span className="text-[10px] text-slate-400 font-bold">Chopta, Nainital</span>
                      </Link>
                      <Link
                        href="/treks/category/himalayas"
                        onClick={() => setTreksDropdownOpen(false)}
                        className="flex items-center justify-between bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 px-2.5 py-1 rounded-lg transition"
                      >
                        <span className="font-medium">🟡 Moderate</span>
                        <span className="text-[10px] text-slate-400 font-bold">Hampta Pass</span>
                      </Link>
                      <Link
                        href="/treks/category/himalayas"
                        onClick={() => setTreksDropdownOpen(false)}
                        className="flex items-center justify-between bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 px-2.5 py-1 rounded-lg transition"
                      >
                        <span className="font-medium">🔴 Challenging</span>
                        <span className="text-[10px] text-slate-400 font-bold">High Passes</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Column 2: Weekend Treks & Regional Trails */}
                <div className="space-y-3">
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition">
                    <Link
                      href="/treks/category/weekend"
                      onClick={() => setTreksDropdownOpen(false)}
                      className="group flex items-center justify-between mb-1.5"
                    >
                      <span className="font-bold text-xs text-[#0F3A2E] group-hover:text-[#FF6B35] transition flex items-center gap-1.5">
                        ⛺ Weekend & Short Treks
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-full">
                        2–3 Days
                      </span>
                    </Link>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      <li>
                        <Link
                          href="/treks/kheerganga-trek"
                          onClick={() => setTreksDropdownOpen(false)}
                          className="hover:text-[#0F3A2E] hover:font-medium transition block truncate"
                        >
                          • Kheerganga Hot Spring Trek{" "}
                          <span className="text-[10px] text-slate-400">Kasol</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/treks/nainital-tour-package"
                          onClick={() => setTreksDropdownOpen(false)}
                          className="hover:text-[#0F3A2E] hover:font-medium transition block truncate"
                        >
                          • Nainital Nature & Ridge Walk{" "}
                          <span className="text-[10px] text-slate-400">Kumaon</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/treks/chopta-tungnath-chandrashila"
                          onClick={() => setTreksDropdownOpen(false)}
                          className="hover:text-[#0F3A2E] hover:font-medium transition block truncate"
                        >
                          • Deoria Tal & Rohini Meadow{" "}
                          <span className="text-[10px] text-slate-400">Garhwal</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/treks/category/weekend"
                          onClick={() => setTreksDropdownOpen(false)}
                          className="text-[11px] font-semibold text-[#FF6B35] hover:underline pt-0.5 inline-block"
                        >
                          View all Weekend Treks →
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Trek States Pills */}
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-[#0F3A2E] flex items-center gap-1.5">
                        📍 Treks By Mountain Region
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Link
                        href="/treks/category/uttarakhand"
                        onClick={() => setTreksDropdownOpen(false)}
                        className="text-[11px] font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 px-2 py-1 rounded-lg transition"
                      >
                        🏔️ Uttarakhand
                      </Link>
                      <Link
                        href="/treks/category/himachal"
                        onClick={() => setTreksDropdownOpen(false)}
                        className="text-[11px] font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 px-2 py-1 rounded-lg transition"
                      >
                        🌲 Himachal Pradesh
                      </Link>
                      <Link
                        href="/treks/category/ladakh"
                        onClick={() => setTreksDropdownOpen(false)}
                        className="text-[11px] font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 px-2 py-1 rounded-lg transition"
                      >
                        ❄️ Ladakh
                      </Link>
                      <Link
                        href="/treks/category/northeast"
                        onClick={() => setTreksDropdownOpen(false)}
                        className="text-[11px] font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 px-2 py-1 rounded-lg transition"
                      >
                        🌿 Northeast
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Column 3: Seasonal Collections & Spotlight Card */}
                <div className="space-y-3">
                  {/* Seasonal Seasons Box */}
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition">
                    <span className="font-bold text-xs text-[#0F3A2E] block mb-2">
                      🌦️ Trekking By Season
                    </span>
                    <div className="space-y-1.5 text-xs">
                      <Link
                        href="/treks/category/monsoon"
                        onClick={() => setTreksDropdownOpen(false)}
                        className="flex items-center justify-between text-slate-700 hover:text-[#0F3A2E] hover:font-semibold transition"
                      >
                        <span>🌧️ Monsoon & Valley Blooms</span>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Jul–Sep</span>
                      </Link>
                      <Link
                        href="/treks/category/autumn"
                        onClick={() => setTreksDropdownOpen(false)}
                        className="flex items-center justify-between text-slate-700 hover:text-[#0F3A2E] hover:font-semibold transition"
                      >
                        <span>🍁 Autumn Clear Skies</span>
                        <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">Oct–Nov</span>
                      </Link>
                      <Link
                        href="/treks/category/winter"
                        onClick={() => setTreksDropdownOpen(false)}
                        className="flex items-center justify-between text-slate-700 hover:text-[#0F3A2E] hover:font-semibold transition"
                      >
                        <span>❄️ Winter Snow Expeditions</span>
                        <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">Dec–Mar</span>
                      </Link>
                    </div>
                  </div>

                  {/* Featured Spotlight Trek Card */}
                  <Link
                    href="/treks/hampta-pass"
                    onClick={() => setTreksDropdownOpen(false)}
                    className="group block relative rounded-xl overflow-hidden border border-emerald-200/80 shadow-xs hover:shadow-md transition duration-300"
                  >
                    <div className="relative h-24 w-full bg-slate-900">
                      <Image
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
                        alt="Hampta Pass Trek"
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500 opacity-85"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <span className="absolute top-2 left-2 bg-[#FF6B35] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        🔥 Bestseller • 4.9 ★
                      </span>
                      <div className="absolute bottom-1.5 left-2.5 right-2.5 text-white">
                        <p className="font-extrabold text-xs leading-tight drop-shadow-sm">
                          Hampta Pass Crossover
                        </p>
                        <p className="text-[10px] text-emerald-300 font-medium">
                          5 Days • 14,065 Ft • Spiti & Kullu
                        </p>
                      </div>
                    </div>
                    <div className="bg-emerald-950 p-2 text-white flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-300 line-through mr-1">₹12,999</span>
                        <span className="font-extrabold text-[#FF6B35]">₹9,999</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-300 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Book Trek →
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Bottom Assurance Banner */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/80 to-teal-50/80 px-3.5 py-2.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🛡️</span>
                  <span className="text-xs font-semibold text-[#0F3A2E]">
                    Certified Himalayan Guides (WFR / BMC) • Small Batches (Max 15) • Medical Kit & O2 Cylinders
                  </span>
                </div>
                <a
                  href="tel:+917500222141"
                  className="inline-flex items-center gap-1.5 bg-[#0F3A2E] hover:bg-emerald-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-sm whitespace-nowrap"
                >
                  <PhoneCall className="w-3 h-3 text-emerald-400" />
                  <span>Call Trek Desk: 7500222141</span>
                </a>
              </div>
            </div>
          </div>

          {/* Domestic Trips State-Wise Mega Menu */}
          <div
            className="relative group"
            onMouseEnter={() => setDomesticDropdownOpen(true)}
            onMouseLeave={() => setDomesticDropdownOpen(false)}
          >
            <button
              onClick={() => setDomesticDropdownOpen(!domesticDropdownOpen)}
              className="hover:text-[#0F3A2E] flex items-center gap-1 py-2 cursor-pointer transition"
            >
              Domestic Trips{" "}
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 group-hover:rotate-180 ${
                  domesticDropdownOpen ? "rotate-180 text-[#0F3A2E]" : ""
                }`}
              />
            </button>

            <div
              className={`${
                domesticDropdownOpen ? "block" : "hidden lg:group-hover:block"
              } absolute top-full -left-44 w-[860px] max-w-[92vw] bg-white border border-slate-200/95 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}
            >
              {/* Mega Menu Top Header */}
                <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      🇮🇳 Explore India By State — Handpicked Escapes
                    </span>
                  </div>
                  <Link
                    href="/treks/category/domestic"
                    onClick={() => setDomesticDropdownOpen(false)}
                    className="text-xs font-bold text-[#FF6B35] hover:text-[#e05320] flex items-center gap-1 transition"
                  >
                    View All Domestic Trips →
                  </Link>
                </div>

                {/* State Wise Categories Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Column 1: Uttarakhand & Himachal */}
                  <div className="space-y-3">
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition">
                      <Link
                        href="/treks/category/uttarakhand"
                        onClick={() => setDomesticDropdownOpen(false)}
                        className="group flex items-center justify-between mb-1.5"
                      >
                        <span className="font-bold text-xs text-[#0F3A2E] group-hover:text-[#FF6B35] transition flex items-center gap-1.5">
                          🏔️ Uttarakhand
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-full">
                          6 Trips
                        </span>
                      </Link>
                      <ul className="space-y-1 text-xs text-slate-600">
                        <li>
                          <Link
                            href="/treks/chopta-tungnath-chandrashila"
                            onClick={() => setDomesticDropdownOpen(false)}
                            className="hover:text-[#0F3A2E] hover:font-medium transition block truncate"
                          >
                            • Chopta Tungnath Chandrashila
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/treks/nainital-tour-package"
                            onClick={() => setDomesticDropdownOpen(false)}
                            className="hover:text-[#0F3A2E] hover:font-medium transition block truncate"
                          >
                            • Nainital & Kumaon Lakes
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/treks/category/uttarakhand"
                            onClick={() => setDomesticDropdownOpen(false)}
                            className="text-[11px] font-semibold text-[#FF6B35] hover:underline pt-0.5 inline-block"
                          >
                            View all in Uttarakhand →
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition">
                      <Link
                        href="/treks/category/himachal"
                        onClick={() => setDomesticDropdownOpen(false)}
                        className="group flex items-center justify-between mb-1.5"
                      >
                        <span className="font-bold text-xs text-[#0F3A2E] group-hover:text-[#FF6B35] transition flex items-center gap-1.5">
                          🌲 Himachal Pradesh
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-full">
                          4 Trips
                        </span>
                      </Link>
                      <ul className="space-y-1 text-xs text-slate-600">
                        <li>
                          <Link
                            href="/treks/hampta-pass"
                            onClick={() => setDomesticDropdownOpen(false)}
                            className="hover:text-[#0F3A2E] hover:font-medium transition block truncate"
                          >
                            • Hampta Pass Crossover
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/treks/kheerganga-trek"
                            onClick={() => setDomesticDropdownOpen(false)}
                            className="hover:text-[#0F3A2E] hover:font-medium transition block truncate"
                          >
                            • Kheerganga Hot Springs
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/treks/category/himachal"
                            onClick={() => setDomesticDropdownOpen(false)}
                            className="text-[11px] font-semibold text-[#FF6B35] hover:underline pt-0.5 inline-block"
                          >
                            View all in Himachal →
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Column 2: Ladakh & Rajasthan */}
                  <div className="space-y-3">
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 hover:border-blue-200 transition">
                      <Link
                        href="/treks/category/ladakh"
                        onClick={() => setDomesticDropdownOpen(false)}
                        className="group flex items-center justify-between mb-1.5"
                      >
                        <span className="font-bold text-xs text-[#0F3A2E] group-hover:text-[#FF6B35] transition flex items-center gap-1.5">
                          ❄️ Ladakh & Kashmir
                        </span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-1.5 py-0.5 rounded-full">
                          Alpine
                        </span>
                      </Link>
                      <ul className="space-y-1 text-xs text-slate-600">
                        <li>
                          <Link
                            href="/treks/ladakh-tour-package"
                            onClick={() => setDomesticDropdownOpen(false)}
                            className="hover:text-[#0F3A2E] hover:font-medium transition block truncate"
                          >
                            • Leh, Nubra & Pangong Tso
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/treks/category/ladakh"
                            onClick={() => setDomesticDropdownOpen(false)}
                            className="text-[11px] font-semibold text-[#FF6B35] hover:underline pt-0.5 inline-block"
                          >
                            View all in Ladakh & Kashmir →
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 hover:border-amber-200 transition">
                      <Link
                        href="/treks/category/rajasthan"
                        onClick={() => setDomesticDropdownOpen(false)}
                        className="group flex items-center justify-between mb-1.5"
                      >
                        <span className="font-bold text-xs text-[#0F3A2E] group-hover:text-[#FF6B35] transition flex items-center gap-1.5">
                          🏰 Rajasthan Heritage
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-full">
                          Desert & Forts
                        </span>
                      </Link>
                      <ul className="space-y-1 text-xs text-slate-600">
                        <li>
                          <Link
                            href="/treks/jaisalmer-tour-package"
                            onClick={() => setDomesticDropdownOpen(false)}
                            className="hover:text-[#0F3A2E] hover:font-medium transition block truncate"
                          >
                            • Jaisalmer Dunes & Camp
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/treks/jaipur-tour-package"
                            onClick={() => setDomesticDropdownOpen(false)}
                            className="hover:text-[#0F3A2E] hover:font-medium transition block truncate"
                          >
                            • Jaipur Forts & Palaces
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/treks/category/rajasthan"
                            onClick={() => setDomesticDropdownOpen(false)}
                            className="text-[11px] font-semibold text-[#FF6B35] hover:underline pt-0.5 inline-block"
                          >
                            View all in Rajasthan →
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Column 3: Kerala & Northeast / Coast */}
                  <div className="space-y-3">
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 hover:border-teal-200 transition">
                      <Link
                        href="/treks/category/kerala"
                        onClick={() => setDomesticDropdownOpen(false)}
                        className="group flex items-center justify-between mb-1.5"
                      >
                        <span className="font-bold text-xs text-[#0F3A2E] group-hover:text-[#FF6B35] transition flex items-center gap-1.5">
                          🌴 Kerala
                        </span>
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200/60 px-1.5 py-0.5 rounded-full">
                          Backwaters
                        </span>
                      </Link>
                      <ul className="space-y-1 text-xs text-slate-600">
                        <li>
                          <Link
                            href="/treks/kerala-tour-package"
                            onClick={() => setDomesticDropdownOpen(false)}
                            className="hover:text-[#0F3A2E] hover:font-medium transition block truncate"
                          >
                            • Munnar & Alleppey Backwaters
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/treks/category/kerala"
                            onClick={() => setDomesticDropdownOpen(false)}
                            className="text-[11px] font-semibold text-[#FF6B35] hover:underline pt-0.5 inline-block"
                          >
                            View all in Kerala →
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-[#0F3A2E] flex items-center gap-1.5">
                          🌿 Other Popular States
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <Link
                          href="/treks/category/meghalaya"
                          onClick={() => setDomesticDropdownOpen(false)}
                          className="text-[11px] font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 px-2 py-1 rounded-lg transition"
                        >
                          Meghalaya
                        </Link>
                        <Link
                          href="/treks/category/sikkim"
                          onClick={() => setDomesticDropdownOpen(false)}
                          className="text-[11px] font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 px-2 py-1 rounded-lg transition"
                        >
                          Sikkim
                        </Link>
                        <Link
                          href="/treks/category/assam"
                          onClick={() => setDomesticDropdownOpen(false)}
                          className="text-[11px] font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 px-2 py-1 rounded-lg transition"
                        >
                          Assam
                        </Link>
                        <Link
                          href="/treks/category/goa"
                          onClick={() => setDomesticDropdownOpen(false)}
                          className="text-[11px] font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 px-2 py-1 rounded-lg transition"
                        >
                          Goa Beach
                        </Link>
                        <Link
                          href="/treks/category/maharashtra"
                          onClick={() => setDomesticDropdownOpen(false)}
                          className="text-[11px] font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 px-2 py-1 rounded-lg transition"
                        >
                          Maharashtra
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Assistance Banner */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/80 to-teal-50/80 px-3.5 py-2.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">✨</span>
                    <span className="text-xs font-semibold text-[#0F3A2E]">
                      Custom corporate offsites or private family tours across India?
                    </span>
                  </div>
                  <a
                    href="tel:+917500222141"
                    className="inline-flex items-center gap-1.5 bg-[#0F3A2E] hover:bg-emerald-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-sm whitespace-nowrap"
                  >
                    <PhoneCall className="w-3 h-3 text-emerald-400" />
                    <span>Call Ground Desk: 7500222141</span>
                  </a>
                </div>
              </div>
            </div>

          <Link href="/treks/category/international" className="hover:text-[#0F3A2E] transition">
            International Trips
          </Link>
          <Link href="/contact" className="hover:text-[#0F3A2E] transition">
            Trekker Forum & Blog
          </Link>
          <Link href="/about" className="hover:text-[#0F3A2E] transition">
            About Us
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="tel:+917500222141"
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#0F3A2E] border border-emerald-200/80 text-xs sm:text-sm font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full transition shadow-sm group whitespace-nowrap"
            title="Direct Ground Desk: +91 7500222141"
          >
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 animate-phone-vibrate shrink-0" />
            <span className="tracking-tight font-bold hidden sm:inline">+91 7500222141</span>
            <span className="tracking-tight font-bold sm:hidden">Call</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#0F3A2E] hover:bg-slate-100 rounded-xl transition shrink-0"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <a
            href="tel:+917500222141"
            className="flex items-center justify-center gap-2 bg-emerald-50 text-[#0F3A2E] border border-emerald-200 font-bold text-sm py-2.5 rounded-xl"
          >
            <PhoneCall className="w-4 h-4 text-emerald-600 animate-phone-vibrate shrink-0" />
            <span>+91 7500222141</span>
          </a>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-[#0F3A2E] py-2"
          >
            Home
          </Link>
          {/* Mobile Treks Accordion */}
          <div className="border-t border-slate-100 py-1">
            <button
              onClick={() => setMobileTreksOpen(!mobileTreksOpen)}
              className="flex items-center justify-between w-full text-sm font-semibold text-[#0F3A2E] py-2"
            >
              <span>🏔️ Treks & Expeditions</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileTreksOpen ? "rotate-180 text-emerald-600" : ""
                }`}
              />
            </button>
            {mobileTreksOpen && (
              <div className="pl-3 py-1 space-y-1.5 border-l-2 border-emerald-500 ml-1 text-xs">
                <Link
                  href="/treks/hampta-pass"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-600 hover:text-[#0F3A2E] py-1"
                >
                  🏔️ Hampta Pass Crossover (14,065 Ft)
                </Link>
                <Link
                  href="/treks/chopta-tungnath-chandrashila"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-600 hover:text-[#0F3A2E] py-1"
                >
                  🛕 Chopta Tungnath Chandrashila (13,000 Ft)
                </Link>
                <Link
                  href="/treks/kheerganga-trek"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-600 hover:text-[#0F3A2E] py-1"
                >
                  ♨️ Kheerganga Hot Spring Trek (Weekend)
                </Link>
                <Link
                  href="/treks/leh-ladakh-tour-package"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-600 hover:text-[#0F3A2E] py-1"
                >
                  ❄️ Leh Ladakh High Passes
                </Link>
                <Link
                  href="/treks/category/weekend"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-600 hover:text-[#0F3A2E] py-1"
                >
                  ⛺ Weekend & Beginner Treks
                </Link>
                <Link
                  href="/treks/category/monsoon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-600 hover:text-[#0F3A2E] py-1"
                >
                  🌧️ Monsoon & Valley Blooms
                </Link>
                <Link
                  href="/treks"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-bold text-[#FF6B35] py-1 pt-1.5"
                >
                  View All Treks & Expeditions →
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Domestic Trips Accordion */}
          <div className="border-y border-slate-100 py-1">
            <button
              onClick={() => setMobileDomesticOpen(!mobileDomesticOpen)}
              className="flex items-center justify-between w-full text-sm font-semibold text-[#0F3A2E] py-2"
            >
              <span>🇮🇳 Domestic Trips (By State)</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileDomesticOpen ? "rotate-180 text-emerald-600" : ""
                }`}
              />
            </button>
            {mobileDomesticOpen && (
              <div className="pl-3 py-1 space-y-1.5 border-l-2 border-emerald-500 ml-1 text-xs">
                <Link
                  href="/treks/category/uttarakhand"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-600 hover:text-[#0F3A2E] py-1"
                >
                  🏔️ Uttarakhand (Chopta, Kedarkantha, Nainital)
                </Link>
                <Link
                  href="/treks/category/himachal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-600 hover:text-[#0F3A2E] py-1"
                >
                  🌲 Himachal Pradesh (Hampta, Kheerganga)
                </Link>
                <Link
                  href="/treks/category/ladakh"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-600 hover:text-[#0F3A2E] py-1"
                >
                  ❄️ Ladakh & Kashmir (Leh, Pangong Tso)
                </Link>
                <Link
                  href="/treks/category/rajasthan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-600 hover:text-[#0F3A2E] py-1"
                >
                  🏰 Rajasthan (Jaipur, Jaisalmer Desert)
                </Link>
                <Link
                  href="/treks/category/kerala"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-600 hover:text-[#0F3A2E] py-1"
                >
                  🌴 Kerala (Munnar, Alleppey Backwaters)
                </Link>
                <Link
                  href="/treks/category/northeast"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-600 hover:text-[#0F3A2E] py-1"
                >
                  🌿 Northeast (Meghalaya, Sikkim, Assam)
                </Link>
                <Link
                  href="/treks/category/goa"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-600 hover:text-[#0F3A2E] py-1"
                >
                  🌊 Goa Beaches & Maharashtra Ghats
                </Link>
                <Link
                  href="/treks/category/domestic"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-bold text-[#FF6B35] py-1 pt-1.5"
                >
                  View All Domestic Trips →
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/treks/category/weekend"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-700 hover:text-[#0F3A2E] py-2"
          >
            Weekend Getaways
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-700 hover:text-[#0F3A2E] py-2"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-700 hover:text-[#0F3A2E] py-2"
          >
            Contact & Support
          </Link>
        </div>
      )}
    </header>
  );
}
