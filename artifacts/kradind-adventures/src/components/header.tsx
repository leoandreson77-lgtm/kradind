"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, PhoneCall } from "lucide-react";

export function Header({ onBookClick }: { onBookClick?: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [treksDropdownOpen, setTreksDropdownOpen] = useState(false);

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
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-700">
          <Link href="/" className="text-[#0F3A2E] font-bold hover:text-[#FF6B35] transition">
            Home
          </Link>
          
          <div
            className="relative"
            onMouseEnter={() => setTreksDropdownOpen(true)}
            onMouseLeave={() => setTreksDropdownOpen(false)}
          >
            <button className="hover:text-[#0F3A2E] flex items-center gap-1 py-2">
              Treks <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {treksDropdownOpen && (
              <div className="absolute top-full left-0 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <Link href="/treks?type=Himalayas" className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0F3A2E]">
                  🏔️ Himalayan Expeditions
                </Link>
                <Link href="/treks?type=Weekend" className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0F3A2E]">
                  ⛺ Weekend Treks
                </Link>
                <Link href="/treks?type=Monsoon" className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0F3A2E]">
                  🌧️ Monsoon & Valley Blooms
                </Link>
                <Link href="/treks" className="block px-4 py-2 text-xs font-bold text-[#FF6B35] hover:bg-slate-50 border-t border-slate-100 mt-1">
                  View All Treks →
                </Link>
              </div>
            )}
          </div>

          <Link href="/treks?category=Domestic" className="hover:text-[#0F3A2E] transition">
            Domestic Trips
          </Link>
          <Link href="/treks?category=International" className="hover:text-[#0F3A2E] transition">
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
            <span className="tracking-tight font-bold">+91 7500222141</span>
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
          <Link
            href="/treks"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-700 hover:text-[#0F3A2E] py-2"
          >
            All Treks & Expeditions
          </Link>
          <Link
            href="/treks?type=Weekend"
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
