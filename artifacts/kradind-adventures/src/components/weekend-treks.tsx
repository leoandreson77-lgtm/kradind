"use client";

import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

export function WeekendTreks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-amber-600 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500" /> Zero Work Leave Needed
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 brand-font">
            Weekend Treks (Friday Night Out)
          </h2>
        </div>
        <Link href="/treks?type=Weekend" className="text-xs font-bold text-[#0F3A2E] hover:underline">
          View all weekend trails →
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold">📍 Dehradun • ⛰️ 9,915 ft</span>
            <h3 className="text-base font-bold text-slate-900 mt-1">Nag Tibba Weekend Summit</h3>
            <p className="text-xs text-slate-600 mt-1">
              Ideal first summit with clear views of the Bandarpoonch range.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">
              ₹2,899 <span className="text-xs font-normal text-slate-500">/ person</span>
            </span>
            <Link
              href="/treks/nag-tibba"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
            >
              Live Batches
            </Link>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold">📍 Himachal • ⛰️ 8,960 ft</span>
            <h3 className="text-base font-bold text-slate-900 mt-1">Prashar Lake & Ridge Camp</h3>
            <p className="text-xs text-slate-600 mt-1">
              Panoramic 360-degree Dhauladhar view with stargazing camping.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">
              ₹3,499 <span className="text-xs font-normal text-slate-500">/ person</span>
            </span>
            <Link
              href="/treks/nag-tibba"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
            >
              Live Batches
            </Link>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold">📍 McLeodGanj • ⛰️ 9,350 ft</span>
            <h3 className="text-base font-bold text-slate-900 mt-1">Triund Ridge Trek</h3>
            <p className="text-xs text-slate-600 mt-1">
              Walk under massive snow walls with cafes and alpine sunsets.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">
              ₹1,999 <span className="text-xs font-normal text-slate-500">/ person</span>
            </span>
            <Link
              href="/treks/triund"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
            >
              Live Batches
            </Link>
          </div>
        </div>

      </div>

    </section>
  );
}
