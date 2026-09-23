"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaXTwitter,
  FaPinterestP,
  FaThreads,
} from "react-icons/fa6";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  HeartHandshake,
  Compass,
  MessageCircle,
  Sparkles,
  Shield,
  FileText,
} from "lucide-react";
import { HomeSectionsConfig } from "@/lib/cms-store";

export function Footer({ config }: { config?: HomeSectionsConfig["contactAndFooter"] }) {
  const supportPhone = config?.supportPhone || "+91 75002 22141";
  const cleanPhone = supportPhone.replace(/\s+/g, "");
  const supportEmail = config?.supportEmail || "support@kradind.com";
  const address =
    config?.address || "Rajpur Road, Jakhan, Dehradun, Uttarakhand – 248001, India";
  const whatsappUrl =
    config?.whatsappLink ||
    `https://wa.me/917500222141?text=${encodeURIComponent(
      "Hello KRADIND Adventures! I would like to inquire about upcoming treks and customized travel packages."
    )}`;

  const socialLinks = [
    {
      name: "Instagram",
      url: config?.instagramUrl || "https://www.instagram.com/kradglobal/",
      icon: FaInstagram,
      color: "hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-600 hover:to-purple-600 hover:text-white hover:border-transparent",
      bg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    },
    {
      name: "Facebook",
      url: config?.facebookUrl || "https://www.facebook.com/share/189E2RUcH4/",
      icon: FaFacebookF,
      color: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
      bg: "bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/30",
    },
    {
      name: "YouTube",
      url: config?.youtubeUrl || "https://youtube.com/@kradglobaltravels?si=jZDwhsl-h42P_YZW",
      icon: FaYoutube,
      color: "hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]",
      bg: "bg-[#FF0000]/10 text-rose-400 border-[#FF0000]/30",
    },
    {
      name: "X (Twitter)",
      url: config?.twitterUrl || "https://x.com/KradGlobalTour",
      icon: FaXTwitter,
      color: "hover:bg-white hover:text-black hover:border-white",
      bg: "bg-slate-800 text-slate-300 border-slate-700",
    },
    {
      name: "Threads",
      url: config?.threadsUrl || "https://www.threads.net/@kradglobal",
      icon: FaThreads,
      color: "hover:bg-white hover:text-black hover:border-white",
      bg: "bg-slate-800 text-slate-300 border-slate-700",
    },
    {
      name: "Pinterest",
      url: config?.pinterestUrl || "https://in.pinterest.com/KradGlobalTravels/",
      icon: FaPinterestP,
      color: "hover:bg-[#BD081C] hover:text-white hover:border-[#BD081C]",
      bg: "bg-[#BD081C]/10 text-rose-500 border-[#BD081C]/30",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 via-[#071d17] to-slate-950 text-white border-t border-emerald-500/20 text-xs overflow-hidden">
      {/* Background Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"
      />

      {/* 1. TOP HELPLINE & ASSISTANCE BAR */}
      <div className="border-b border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] sm:text-xs">
              <strong>Dehradun HQ Basecamp Active</strong> — 24/7 Expedition &amp; Ground Support
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 transition text-[11px] font-semibold"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Call Helpline: {supportPhone}</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition text-[11px] shadow-sm shadow-emerald-950"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 space-y-10">
        {/* 2. BALANCED 12-COLUMN MAIN FOOTER GRID (With dedicated, un-cramped Legal column) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          
          {/* Column 1: Brand Profile & Verified Basecamp (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative p-1.5 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                <Image
                  src="/logo-emblem.png"
                  alt="KRADIND Adventures - Official Himalayan Tour & Trek Operator Emblem"
                  width={44}
                  height={44}
                  loading="lazy"
                  quality={85}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl sm:text-2xl text-white brand-font leading-tight tracking-tight">
                  KRAD<span className="text-emerald-400">IND</span>
                </span>
                <span className="text-[10px] tracking-[0.22em] font-extrabold text-emerald-300 uppercase">
                  Explore ▲ Trek ▲ Travel
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed max-w-sm">
              KRAD Global is a Govt. Registered tour and travel company headquartered in Dehradun,
              Uttarakhand. We specialize in high-altitude Himalayan treks, bespoke domestic holidays, and
              curated experiential journeys with certified guides.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
              <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Govt. Registered Adventure Tour Operator • Uttarakhand</span>
            </div>

            <address className="not-italic space-y-2 pt-1 text-slate-300 text-xs">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-2.5 hover:text-emerald-400 transition group"
                itemProp="telephone"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span>{supportPhone} (24/7 Helpline &amp; WhatsApp)</span>
              </a>

              <a
                href={`mailto:${supportEmail}`}
                className="flex items-center gap-2.5 hover:text-emerald-400 transition group"
                itemProp="email"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span>{supportEmail}</span>
              </a>

              <div
                className="flex items-start gap-2.5 text-slate-400"
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="leading-relaxed text-[11px] sm:text-xs">
                  {address}
                </span>
              </div>
            </address>
          </div>

          {/* Column 2: Navigation Links (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Navigation</span>
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/treks" className="hover:text-white transition">
                  Himalayan Treks
                </Link>
              </li>
              <li>
                <Link href="/treks/category/domestic" className="hover:text-white transition">
                  Domestic Trips
                </Link>
              </li>
              <li>
                <Link href="/treks/category/international" className="hover:text-white transition">
                  International Trips
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About KRADIND
                </Link>
              </li>
              <li>
                <Link href="/#live-radar" className="hover:text-white transition">
                  Live Ground Radar
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Routes (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF6B35] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Top Routes</span>
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <Link href="/treks/kedarkantha-trek" className="hover:text-white transition">
                  Kedarkantha Summit
                </Link>
              </li>
              <li>
                <Link href="/treks/chopta-tungnath-chandrashila" className="hover:text-white transition">
                  Chopta Tungnath
                </Link>
              </li>
              <li>
                <Link href="/treks/hampta-pass" className="hover:text-white transition">
                  Hampta Pass
                </Link>
              </li>
              <li>
                <Link href="/treks/category/ladakh" className="hover:text-white transition">
                  Kashmir Great Lakes
                </Link>
              </li>
              <li>
                <Link href="/treks/category/ladakh" className="hover:text-white transition">
                  Leh Ladakh Passes
                </Link>
              </li>
              <li>
                <Link href="/treks/category/rajasthan" className="hover:text-white transition">
                  Jaisalmer Desert
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies (Span 2) - Only place where policies are listed! */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF6B35] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Legal &amp; Policies</span>
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/cancellation-and-refund-policy" className="hover:text-white transition">
                  Cancellation &amp; Refund
                </Link>
              </li>
              <li>
                <Link href="/booking-and-payment-policy" className="hover:text-white transition">
                  Booking &amp; Payments
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-white transition">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/website-disclaimer" className="hover:text-white transition">
                  Website Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Connect With Us (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF6B35]">
              Connect With Us
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Follow our official social community for trail photos, expedition reels &amp; live batch updates.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    title={s.name}
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-sm ${s.bg} ${s.color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* 3. SAFETY, ENVIRONMENT & QUALITY BADGES */}
        <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-white">
                Wilderness First Aid (WFA) Certified
              </span>
              <span className="text-[10px] text-slate-400">
                High-altitude emergency medical &amp; oxygen support
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-white">
                Strict Leave No Trace (LNT)
              </span>
              <span className="text-[10px] text-slate-400">
                Eco-clean trails with zero single-use plastic disposal
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-white">
                Eco-Conscious Standards
              </span>
              <span className="text-[10px] text-slate-400">
                Transparent pricing with verified alpine stays
              </span>
            </div>
          </div>
        </div>

        {/* 4. CLEAN BOTTOM COPYRIGHT BAR (No repetitive policies here!) */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-400 text-center sm:text-left">
          <p className="text-slate-300 font-medium">
            {config?.copyrightText || "© 2026 KRADIND Adventures / KRAD Global. All rights reserved."}
          </p>
          <p className="text-slate-500 text-[10px]">
            Govt. Registered Adventure Tour Operator • Dehradun, Uttarakhand, India
          </p>
        </div>

      </div>
    </footer>
  );
}
