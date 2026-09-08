"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TrailRadarReport } from "@/lib/cms-store";
import {
  X,
  ExternalLink,
  ChevronRight,
  Thermometer,
  CloudSun,
  ShieldCheck,
  MessageCircle,
  MapPin,
  Clock,
  Radio,
} from "lucide-react";

function getTrailLink(trailName: string): string {
  const lower = (trailName || "").toLowerCase();
  if (lower.includes("kedarkantha")) return "/lp/kedarkantha-winter-summit";
  if (lower.includes("hampta")) return "/treks/hampta-pass";
  if (lower.includes("chopta") || lower.includes("tungnath") || lower.includes("chandrashila")) {
    return "/treks/chopta-tungnath-chandrashila";
  }
  if (lower.includes("kheerganga") || lower.includes("kasol")) return "/treks/kheerganga-trek";
  if (lower.includes("kerala")) return "/treks/kerala-tour-package";
  if (lower.includes("ladakh") || lower.includes("leh")) return "/treks/leh-ladakh-tour-package";
  if (lower.includes("rajasthan") || lower.includes("jaipur")) return "/treks/jaipur-tour-package";
  if (lower.includes("goa")) return "/treks/goa-tour-package";
  if (lower.includes("meghalaya")) return "/treks/meghalaya-tour-package";
  if (lower.includes("sikkim")) return "/treks/sikkim-tour-package";
  if (lower.includes("nainital")) return "/treks/nainital-tour-package";
  if (lower.includes("jaisalmer")) return "/treks/jaisalmer-tour-package";

  const clean = trailName.split("(")[0].trim();
  return `/treks?search=${encodeURIComponent(clean)}`;
}

export function LiveRadar({ initialReports }: { initialReports?: TrailRadarReport[] }) {
  const [reports, setReports] = useState<TrailRadarReport[]>(initialReports || []);
  const [selectedReport, setSelectedReport] = useState<TrailRadarReport | null>(null);

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

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedReport(null);
    };
    if (selectedReport) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedReport]);

  return (
    <section id="live-radar" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {/* Radar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 brand-font tracking-tight">
              Live Trail Ground Radar & Base Camp Updates
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-400">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Updated in real-time by Expedition Leaders • Click any card for details</span>
          </div>
        </div>

        {/* Trail Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {reports.map((r) => {
            const statusConfig =
              r.status === "open"
                ? { label: "🟢 Open", bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80" }
                : r.status === "active"
                ? { label: "🌧️ Active", bg: "bg-teal-50 text-teal-700 border-teal-200/80" }
                : r.status === "caution"
                ? { label: "🟡 Caution", bg: "bg-amber-50 text-amber-700 border-amber-200/80" }
                : { label: "🔴 Closed", bg: "bg-rose-50 text-rose-700 border-rose-200/80" };

            return (
              <div
                key={r.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedReport(r)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedReport(r);
                  }
                }}
                className="group relative p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200/80 hover:border-[#0F3A2E]/60 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 text-left outline-none focus:ring-2 focus:ring-[#0F3A2E]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <strong className="block text-slate-900 font-bold text-sm group-hover:text-[#0F3A2E] transition-colors">
                      {r.trail}
                    </strong>
                    <span className="text-slate-500 text-[11px] block mt-0.5">
                      {r.weather} • {r.temperature}
                    </span>
                  </div>
                  <span
                    className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] border shrink-0 ${statusConfig.bg}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/50 text-slate-400 group-hover:text-slate-600">
                  <span className="truncate max-w-[180px]">
                    {r.region || "Verified by Expedition Lead"}
                  </span>
                  <span className="text-[#0F3A2E] font-semibold flex items-center gap-1 group-hover:text-[#FF6B35] transition-colors shrink-0">
                    <span>Advisory</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}

          {reports.length === 0 && (
            <div className="col-span-3 text-center py-6 text-slate-400 text-xs">
              Live trail ground radar syncing with mountain base camps...
            </div>
          )}
        </div>
      </div>

      {/* Live Advisory Detail Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedReport(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#0F3A2E] text-white p-5 sm:p-6 relative">
              <button
                onClick={() => setSelectedReport(null)}
                aria-label="Close live advisory"
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span className="text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                  Live Ground Radar Advisory
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight brand-font">
                {selectedReport.trail}
              </h3>

              {selectedReport.region && (
                <p className="text-xs text-slate-200 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{selectedReport.region}</span>
                </p>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 text-xs text-slate-700">
              {/* Status Banner */}
              <div className="p-3.5 rounded-xl border flex items-center justify-between gap-3 bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">
                    {selectedReport.status === "open"
                      ? "🟢"
                      : selectedReport.status === "active"
                      ? "🌧️"
                      : selectedReport.status === "caution"
                      ? "🟡"
                      : "🔴"}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs capitalize">
                      Trail Status: {selectedReport.status}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {selectedReport.status === "open"
                        ? "Optimal weather and safe route conditions"
                        : selectedReport.status === "active"
                        ? "Expedition active with certified mountain staff"
                        : selectedReport.status === "caution"
                        ? "High altitude caution advised; safety ropes stationed"
                        : "Temporary hold; awaiting weather window"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Environmental Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
                    <CloudSun className="w-3.5 h-3.5 text-[#FF6B35]" />
                    Weather Condition
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5 text-sm">{selectedReport.weather}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
                    Ambient Temperature
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5 text-sm">
                    {selectedReport.temperature}
                  </p>
                </div>
              </div>

              {/* Leader Advisory Note */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 space-y-1.5">
                <span className="text-[#0F3A2E] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Expedition Leader Ground Report
                </span>
                <p className="text-xs leading-relaxed text-slate-800 font-medium">
                  {selectedReport.note ||
                    "Trail inspected and verified by NIM/HMI certified mountaineers. All central gear and emergency medical oxygen deployed on route."}
                </p>
                <div className="pt-1 flex items-center gap-1 text-[10px] text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Reported {selectedReport.updatedAt || "recently"} from base camp</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href={getTrailLink(selectedReport.trail)}
                  onClick={() => setSelectedReport(null)}
                  className="w-full sm:flex-1 py-3 px-4 bg-[#0F3A2E] hover:bg-[#164e3f] text-white font-bold rounded-xl text-center transition flex items-center justify-center gap-2 shadow-sm text-xs tracking-wide"
                >
                  <span>Explore Trek & Available Batches</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <a
                  href={`https://wa.me/917500222141?text=${encodeURIComponent(
                    `Hi KRADIND! I am checking the live trail ground radar update for ${selectedReport.trail}. Can you share available batch dates and difficulty preparation?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center transition flex items-center justify-center gap-2 text-xs shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Coordinator</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
