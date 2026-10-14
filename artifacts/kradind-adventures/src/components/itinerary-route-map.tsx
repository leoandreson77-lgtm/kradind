"use client";

import React, { useMemo } from "react";
import {
  MapPin,
  Navigation,
  Compass,
  ArrowRight,
  Mountain,
  Bed,
  Car,
  Flag,
  Sparkles,
} from "lucide-react";
import { TrekItineraryDay } from "@/lib/cms-store";

interface ItineraryRouteMapProps {
  itinerary: TrekItineraryDay[];
  destination?: string;
  pickupLocation?: string;
  dropLocation?: string;
  className?: string;
  compact?: boolean;
}

interface RouteStop {
  dayNum: number;
  name: string;
  stay?: string;
  altitude?: string;
  distance?: string;
  action?: string;
}

export function ItineraryRouteMap({
  itinerary,
  destination,
  pickupLocation,
  dropLocation,
  className = "",
  compact = false,
}: ItineraryRouteMapProps) {
  // Extract clean route stops from day titles, descriptions, and stays
  const stops: RouteStop[] = useMemo(() => {
    if (!itinerary || itinerary.length === 0) {
      if (destination) {
        return [
          { dayNum: 1, name: pickupLocation || "Arrival Point", action: "Pickup Hub" },
          { dayNum: 2, name: destination, action: "Expedition Core" },
          { dayNum: 3, name: dropLocation || "Departure Hub", action: "Return" },
        ];
      }
      return [];
    }

    return itinerary.map((d, idx) => {
      let raw = d.title || `Day ${idx + 1}`;
      // Clean typical prefixes
      let cleaned = raw
        .replace(/^day\s*\d+[:\-–\s]*/i, "")
        .replace(/^(arrival\s+(at|in)|drive\s+(to|from)|trek\s+(to|from)|transfer\s+to|sightseeing\s+in|explore)\s+/i, "")
        .trim();

      // If title has "to" or "→" or "->", take the destination of the day
      if (cleaned.includes(" to ")) {
        const parts = cleaned.split(" to ");
        cleaned = parts[parts.length - 1].trim();
      } else if (cleaned.includes(" → ")) {
        const parts = cleaned.split(" → ");
        cleaned = parts[parts.length - 1].trim();
      } else if (cleaned.includes(" - ")) {
        const parts = cleaned.split(" - ");
        cleaned = parts[parts.length - 1].trim();
      }

      // Shorten overly long stop titles
      if (cleaned.length > 28) {
        cleaned = cleaned.slice(0, 26) + "...";
      }

      return {
        dayNum: d.day || idx + 1,
        name: cleaned || d.title || `Day ${idx + 1}`,
        stay: d.stay,
        altitude: d.altitude,
        distance: d.distance,
        action: idx === 0 ? "Start" : idx === itinerary.length - 1 ? "Finish" : undefined,
      };
    });
  }, [itinerary, destination, pickupLocation, dropLocation]);

  if (!stops || stops.length === 0) return null;

  return (
    <div
      className={`rounded-2xl border border-emerald-900/15 bg-gradient-to-br from-emerald-50/70 via-white to-slate-50/60 p-4 sm:p-5 shadow-xs page-break-avoid print:bg-white print:border-slate-300 print:shadow-none ${className}`}
    >
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-emerald-900/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#0F3A2E] text-emerald-400 flex items-center justify-center shadow-xs shrink-0 print:bg-slate-900">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight">
                Itinerary Route Flow &amp; Trail Map
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 print:bg-slate-100 print:text-slate-800">
                {stops.length} Stops
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Sequential route checkpoints, night stays &amp; transit corridors
            </p>
          </div>
        </div>

        {/* Quick Route Summary String */}
        <div className="text-[11px] font-bold text-slate-600 bg-white/90 border border-slate-200/90 rounded-xl px-3 py-1.5 self-start sm:self-auto flex items-center gap-1.5 max-w-full overflow-x-auto shadow-2xs print:border-slate-300">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">
            {stops.map((s) => s.name).join(" ➔ ")}
          </span>
        </div>
      </div>

      {/* Visual Journey Flow Nodes */}
      <div className="relative">
        {/* Horizontal scroll container with custom scrollbar */}
        <div className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">
          {stops.map((stop, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === stops.length - 1;
            const hasStay = Boolean(stop.stay);
            const hasAlt = Boolean(stop.altitude);

            return (
              <React.Fragment key={idx}>
                <div className="flex flex-col justify-between shrink-0 w-44 sm:w-48 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs hover:shadow-md hover:border-emerald-600/50 transition-all group page-break-avoid print:border-slate-300 print:shadow-none">
                  <div>
                    {/* Step pill & Day badge */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${
                          isFirst
                            ? "bg-emerald-600 text-white border-emerald-700"
                            : isLast
                            ? "bg-slate-900 text-white border-slate-950"
                            : "bg-slate-100 text-slate-800 border-slate-200"
                        }`}
                      >
                        Day {stop.dayNum}
                      </span>

                      {stop.action && (
                        <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/80">
                          {stop.action}
                        </span>
                      )}
                    </div>

                    {/* Stop Title */}
                    <div className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                      {stop.name}
                    </div>
                  </div>

                  {/* Footnote details: Stay, Alt, Distance */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[10px] text-slate-500 font-medium">
                    {hasStay && (
                      <div className="flex items-center gap-1.5 truncate text-slate-700">
                        <Bed className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{stop.stay}</span>
                      </div>
                    )}
                    {hasAlt && (
                      <div className="flex items-center gap-1.5 truncate text-slate-600">
                        <Mountain className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="truncate">{stop.altitude}</span>
                      </div>
                    )}
                    {stop.distance && (
                      <div className="flex items-center gap-1.5 truncate text-slate-500">
                        <Car className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate">{stop.distance}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow connector between stops */}
                {!isLast && (
                  <div className="flex items-center justify-center shrink-0 text-slate-300 print:text-slate-400">
                    <div className="w-6 sm:w-8 h-0.5 bg-dashed border-b-2 border-emerald-500/40" />
                    <ArrowRight className="w-4 h-4 text-emerald-600 -ml-1 shrink-0" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
