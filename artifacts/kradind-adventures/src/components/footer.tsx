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
import { Phone, Mail, MapPin, ShieldCheck, HeartHandshake, Compass } from "lucide-react";
import { HomeSectionsConfig } from "@/lib/cms-store";

export function Footer({ config }: { config?: HomeSectionsConfig["contactAndFooter"] }) {
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
    <footer className="bg-slate-950 text-white pt-16 pb-10 border-t border-white/10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Brand Info (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-emblem.png"
                alt="KRAD Global tour and travel company logo"
                width={44}
                height={44}
                loading="lazy"
                quality={75}
                className="w-10 h-10 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl text-white brand-font leading-tight">
                  KRAD<span className="text-emerald-400">IND</span>
                </span>
                <span className="text-[10px] tracking-[0.2em] font-bold text-slate-400 uppercase">
                  Explore ▲ Trek ▲ Travel
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              KRAD Global is a Dehradun-based tour and travel company offering domestic and international tour packages, customized holidays, treks and memorable travel experiences.
            </p>

            <address
              className="not-italic space-y-2.5 pt-2 text-slate-300 text-xs"
            >
              <a
                href={`tel:${(config?.supportPhone || "+917500222141").replace(/\s+/g, "")}`}
                className="flex items-center gap-2.5 hover:text-emerald-400 transition"
                itemProp="telephone"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{config?.supportPhone || "+91 75002 22141"} (24/7 Helpline &amp; WhatsApp)</span>
              </a>
              <a
                href={`mailto:${config?.supportEmail || "support@kradind.com"}`}
                className="flex items-center gap-2.5 hover:text-emerald-400 transition"
                itemProp="email"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{config?.supportEmail || "support@kradind.com"}</span>
              </a>
              <div
                className="flex items-start gap-2.5 text-slate-400"
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {config?.address || "Rajpur Road, Jakhan, Dehradun, Uttarakhand – 248001, India"}
                </span>
              </div>
            </address>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Navigation
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link href="/treks" className="hover:text-white transition">Himalayan Treks</Link>
              </li>
              <li>
                <Link href="/treks/category/domestic" className="hover:text-white transition">Domestic Trips</Link>
              </li>
              <li>
                <Link href="/treks/category/international" className="hover:text-white transition">International Trips</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">About KRADIND</Link>
              </li>
              <li>
                <Link href="/#live-radar" className="hover:text-white transition">Live Ground Radar</Link>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF6B35]">
              Top Routes
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/treks/category/uttarakhand" className="hover:text-white transition">Kedarkantha Summit</Link>
              </li>
              <li>
                <Link href="/treks/chopta-tungnath-chandrashila" className="hover:text-white transition">Chopta Tungnath</Link>
              </li>
              <li>
                <Link href="/treks/hampta-pass" className="hover:text-white transition">Hampta Pass</Link>
              </li>
              <li>
                <Link href="/treks/category/ladakh" className="hover:text-white transition">Kashmir Great Lakes</Link>
              </li>
              <li>
                <Link href="/treks/category/ladakh" className="hover:text-white transition">Leh Ladakh Passes</Link>
              </li>
              <li>
                <Link href="/treks/category/rajasthan" className="hover:text-white transition">Jaisalmer Desert</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF6B35]">
              Legal &amp; Policies
            </h4>
            <ul className="space-y-2 text-slate-400">
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
                  Cancellation &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/booking-and-payment-policy" className="hover:text-white transition">
                  Booking &amp; Payment Policy
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
              <li>
                <Link href="/visa-and-international-travel-disclaimer" className="hover:text-white transition">
                  Visa &amp; International Travel Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/editorial-and-safety-policy" className="hover:text-white transition">
                  Editorial &amp; Safety Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Social Media Community */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF6B35]">
                Connect With Us
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Follow our official social community for trail photos, expedition reels &amp; live batch updates.
              </p>
            </div>

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
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-sm ${s.bg} ${s.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* Safety & Environmental Badges */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left text-slate-400">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px]">Wilderness First Aid (WFA) Certified Leads</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px]">Strict Leave No Trace (LNT) Clean Trails</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <Compass className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-[11px]">Eco-Conscious Alpine Expedition Standards</span>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
          <p>{config?.copyrightText || "© 2026 KRADIND Adventures / KRAD Global. All rights reserved."}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-slate-400">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms-and-conditions" className="hover:text-white transition">Terms &amp; Conditions</Link>
            <span>•</span>
            <Link href="/cancellation-and-refund-policy" className="hover:text-white transition">Cancellation &amp; Refund Policy</Link>
            <span>•</span>
            <Link href="/booking-and-payment-policy" className="hover:text-white transition">Booking &amp; Payment Policy</Link>
            <span>•</span>
            <Link href="/cookie-policy" className="hover:text-white transition">Cookie Policy</Link>
            <span>•</span>
            <Link href="/website-disclaimer" className="hover:text-white transition">Website Disclaimer</Link>
            <span>•</span>
            <Link href="/visa-and-international-travel-disclaimer" className="hover:text-white transition">Visa &amp; International Travel Disclaimer</Link>
            <span>•</span>
            <Link href="/editorial-and-safety-policy" className="hover:text-white transition">Editorial &amp; Safety Policy</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition">Contact Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
