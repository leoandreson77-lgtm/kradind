"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaXTwitter,
  FaPinterestP,
  FaThreads,
} from "react-icons/fa6";
import { Phone, Mail, MapPin, ShieldCheck, HeartHandshake, Compass } from "lucide-react";

export function Footer() {
  const socialLinks = [
    {
      name: "WhatsApp",
      url: "https://wa.link/n3u8c0",
      icon: FaWhatsapp,
      color: "hover:bg-[#25D366] hover:text-white hover:border-[#25D366]",
      bg: "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/kradglobal/",
      icon: FaInstagram,
      color: "hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-600 hover:to-purple-600 hover:text-white hover:border-transparent",
      bg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/share/189E2RUcH4/",
      icon: FaFacebookF,
      color: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
      bg: "bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/30",
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@kradglobaltravels?si=jZDwhsl-h42P_YZW",
      icon: FaYoutube,
      color: "hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]",
      bg: "bg-[#FF0000]/10 text-rose-400 border-[#FF0000]/30",
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/KradGlobalTour",
      icon: FaXTwitter,
      color: "hover:bg-white hover:text-black hover:border-white",
      bg: "bg-slate-800 text-slate-300 border-slate-700",
    },
    {
      name: "Threads",
      url: "https://www.threads.com/@kradglobal",
      icon: FaThreads,
      color: "hover:bg-white hover:text-black hover:border-white",
      bg: "bg-slate-800 text-slate-300 border-slate-700",
    },
    {
      name: "Pinterest",
      url: "https://in.pinterest.com/KradGlobalTravels/",
      icon: FaPinterestP,
      color: "hover:bg-[#BD081C] hover:text-white hover:border-[#BD081C]",
      bg: "bg-[#BD081C]/10 text-rose-500 border-[#BD081C]/30",
    },
  ];

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-10 border-t border-white/10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-emblem.png"
                alt="KRADIND"
                width={44}
                height={44}
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
              India's premier certified high-altitude expedition operator. Specializing in small-batch eco-treks, Himalayan alpine circuits, and tailored experiential travel with certified wilderness leaders.
            </p>

            <div className="space-y-2 pt-2 text-slate-300 text-xs">
              <a
                href="tel:+917500222141"
                className="flex items-center gap-2.5 hover:text-emerald-400 transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>+91 7500222141 (24/7 Expedition Helpline)</span>
              </a>
              <a
                href="mailto:support@kradind.com"
                className="flex items-center gap-2.5 hover:text-emerald-400 transition"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>support@kradind.com</span>
              </a>
              <div className="flex items-center gap-2.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Dehradun • Manali • Srinagar Base Operations</span>
              </div>
            </div>
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
                <Link href="/treks?state=Uttarakhand" className="hover:text-white transition">Domestic Trips</Link>
              </li>
              <li>
                <Link href="/treks?state=International" className="hover:text-white transition">International Trips</Link>
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
              Top Treks & Routes
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/treks?state=Uttarakhand" className="hover:text-white transition">Kedarkantha Summit</Link>
              </li>
              <li>
                <Link href="/treks?state=Uttarakhand" className="hover:text-white transition">Chopta Tungnath Chandrashila</Link>
              </li>
              <li>
                <Link href="/treks?state=Himachal" className="hover:text-white transition">Hampta Pass Crossover</Link>
              </li>
              <li>
                <Link href="/treks?state=Ladakh" className="hover:text-white transition">Kashmir Great Lakes</Link>
              </li>
              <li>
                <Link href="/treks?state=Ladakh" className="hover:text-white transition">Leh Ladakh High Passes</Link>
              </li>
              <li>
                <Link href="/treks?state=Rajasthan" className="hover:text-white transition">Jaisalmer Desert Safari</Link>
              </li>
            </ul>
          </div>

          {/* Official Social Media Community */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Connect With Us
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Follow our official social community for daily trail photos, expedition reels & live batch updates.
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

            {/* Direct WhatsApp Pill */}
            <div className="pt-2">
              <a
                href="https://wa.link/n3u8c0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-white text-xs font-bold transition duration-200"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
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

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <p>© 2026 KRADIND Adventures Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-400 transition">About Us</Link>
            <span>•</span>
            <a href="https://wa.link/n3u8c0" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition">Contact Support</a>
            <span>•</span>
            <Link href="/treks" className="hover:text-slate-400 transition">Expeditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
