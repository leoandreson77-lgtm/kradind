"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Navigation,
  ExternalLink,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  ShieldCheck,
  Compass,
} from "lucide-react";

interface GoogleMapLocatorProps {
  className?: string;
  showTitle?: boolean;
}

export function GoogleMapLocator({ className = "", showTitle = true }: GoogleMapLocatorProps) {
  const [activeTab, setActiveTab] = useState<"map" | "satellite">("map");

  const place = {
    title: "KRAD GLOBAL",
    businessName: "KRADIND Adventures Private Limited",
    addressLine1: "Hall No. H -04, 410 PRATAP PALACE, INDIRANAGAR COLONY",
    addressLine2: "Vasant Vihar, Dehradun, Uttarakhand 248001, India",
    coords: { lat: 30.3190771, lng: 78.0017444 },
    placeId: "ChIJ9VntEfArCTkRhMH-ZPcikyc",
    phone: "+91 9797941414",
    email: "info@kradind.com",
    hours: "Open 24/7 (Mon – Sun) for Ground Support & Booking Inquiries",
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=KRAD+GLOBAL&query_place_id=${place.placeId}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.coords.lat},${place.coords.lng}&destination_place_id=${place.placeId}`;
  const embedUrl = `https://maps.google.com/maps?q=${place.coords.lat},${place.coords.lng}&hl=en&z=16&t=${activeTab === "satellite" ? "k" : "m"}&output=embed`;

  return (
    <section className={`w-full ${className}`} aria-labelledby="google-map-heading">
      {showTitle && (
        <div className="mb-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
            <Compass className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
            <span>Official Office &amp; Basecamp Location</span>
          </div>
          <h2 id="google-map-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Us on Google Maps
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Visit our registered headquarters in Dehradun or connect with our expedition coordinators before departure.
          </p>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Information Card (4 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-900 to-[#0F3A2E] text-white">
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 inline-block mb-2">
                  Verified Google Business
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {place.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {place.businessName}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Headquarters Address
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                {place.addressLine1}
                <br />
                {place.addressLine2}
              </p>
              <div className="text-[10px] font-mono text-emerald-400/90">
                GPS: {place.coords.lat}° N, {place.coords.lng}° E
              </div>
            </div>

            {/* Office Hours */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Operating Desk</span>
              </div>
              <p className="text-xs text-slate-300">
                {place.hours}
              </p>
            </div>

            {/* Trust badge */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-[11px] text-slate-300">
                Nehru Institute of Mountaineering (NIM) certified trip operators.
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 mt-6 border-t border-slate-800 space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Google Maps</span>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
              <Link
                href="/booking"
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 transition text-[11px] font-semibold"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Book Visit</span>
              </Link>

              <a
                href={`tel:${place.phone.replace(/\s+/g, "")}`}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 transition text-[11px] font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Call Desk</span>
              </a>

              <a
                href={`https://wa.me/919797941414?text=${encodeURIComponent(
                  "Hello KRAD GLOBAL! I want to visit your Dehradun office or plan an expedition."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 transition text-[11px] font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Map View (7 cols) */}
        <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[460px] bg-slate-100 flex flex-col">
          {/* Map Controls Floating Bar */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-xl shadow-lg border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("map")}
              className={`px-3 py-1 rounded-lg transition ${
                activeTab === "map"
                  ? "bg-[#0F3A2E] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Map
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("satellite")}
              className={`px-3 py-1 rounded-lg transition ${
                activeTab === "satellite"
                  ? "bg-[#0F3A2E] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Embedded Google Map Iframe */}
          <iframe
            key={activeTab}
            title="KRAD GLOBAL Google Maps Location"
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full flex-1 min-h-[380px] sm:min-h-[460px]"
          />

          {/* Bottom Bar overlay with direct Google Maps link */}
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
            <span className="truncate">
              📍 Place ID: <span className="font-mono text-[11px] text-slate-800">{place.placeId}</span>
            </span>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 shrink-0 ml-2"
            >
              <span>View Larger Map</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
