"use client";

import React, { useEffect, useState } from "react";
import { TrailRadarReport } from "@/lib/cms-store";

export function LiveRadar({ initialReports }: { initialReports?: TrailRadarReport[] }) {
  const [reports, setReports] = useState<TrailRadarReport[]>(initialReports || []);

  useEffect(() => {
    async function fetchRadar() {
      try {
        const res = await fetch("/api/radar");
        if (res.ok) {
          const data = await res.json();
          if (data.reports) setReports(data.reports);
        }
      } catch (err) {
        console.error("Failed to load radar", err);
      }
    }
    fetchRadar();
  }, []);

  return (
    <section id="live-radar" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        
        {/* Radar Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h3 className="font-extrabold text-sm text-slate-900 brand-font">
              Live Trail Ground Radar & Base Camp Updates
            </h3>
          </div>
          <span className="text-xs text-slate-400">Updated in real-time by Expedition Leaders</span>
        </div>

        {/* Trail Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {reports.map((r) => {
            const statusConfig =
              r.status === "open"
                ? { label: "🟢 Open", bg: "bg-emerald-100 text-emerald-800" }
                : r.status === "active"
                ? { label: "🌧️ Active", bg: "bg-teal-100 text-teal-800" }
                : r.status === "caution"
                ? { label: "🟡 Caution", bg: "bg-amber-100 text-amber-800" }
                : { label: "🔴 Closed", bg: "bg-rose-100 text-rose-800" };

            return (
              <div
                key={r.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <strong className="block text-slate-900 font-bold">{r.trail}</strong>
                  <span className="text-slate-500 text-[11px]">
                    {r.weather} • {r.temperature}
                  </span>
                </div>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${statusConfig.bg}`}>
                  {statusConfig.label}
                </span>
              </div>
            );
          })}
          {reports.length === 0 && (
            <div className="col-span-3 text-center py-4 text-slate-400 text-xs">
              Live radar syncing...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
