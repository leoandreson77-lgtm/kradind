"use client";

import React, { useState, useMemo } from "react";
import { X, Calendar, Sparkles, Star, ChevronDown, ChevronUp, MessageCircle, Phone, AlertCircle, CheckCircle2 } from "lucide-react";
import { TrekBatch, TrekData } from "@/lib/cms-store";

interface TrekDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  trek: TrekData | null;
  onBookBatch?: (trek: TrekData, batch: TrekBatch) => void;
}

export function TrekDatesModal({
  isOpen,
  onClose,
  trek,
  onBookBatch,
}: TrekDatesModalProps) {
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({});
  const [filterType, setFilterType] = useState<"all" | "available" | "stargazing">("all");

  // Group batches by month
  const groupedBatches = useMemo(() => {
    if (!trek || !trek.batches || trek.batches.length === 0) {
      return {};
    }

    const groups: Record<
      string,
      {
        monthLabel: string;
        theme: string;
        batches: TrekBatch[];
      }
    > = {};

    trek.batches.forEach((batch) => {
      // Determine month group name
      let monthKey = batch.monthGroup;
      if (!monthKey) {
        // Fallback: extract month from startDate (e.g. "3rd Oct", "Oct 05", "2026-10-03")
        const lower = (batch.startDate || "").toLowerCase();
        if (lower.includes("oct") || lower.includes("10-")) {
          monthKey = "October 2026";
        } else if (lower.includes("nov") || lower.includes("11-")) {
          monthKey = "November 2026";
        } else if (lower.includes("dec") || lower.includes("12-")) {
          monthKey = "December 2026";
        } else if (lower.includes("jan") || lower.includes("01-")) {
          monthKey = "January 2027";
        } else if (lower.includes("may") || lower.includes("05-")) {
          monthKey = "May 2026";
        } else if (lower.includes("jun") || lower.includes("06-")) {
          monthKey = "June 2026";
        } else if (lower.includes("jul") || lower.includes("07-")) {
          monthKey = "July 2026";
        } else if (lower.includes("aug") || lower.includes("08-")) {
          monthKey = "August 2026";
        } else if (lower.includes("sep") || lower.includes("09-")) {
          monthKey = "September 2026";
        } else {
          monthKey = "Upcoming Departures";
        }
      }

      if (!groups[monthKey]) {
        groups[monthKey] = {
          monthLabel: monthKey,
          theme: batch.seasonTheme || (monthKey.includes("Oct") ? "Vibrant Colours" : monthKey.includes("Nov") ? "Clear Skies & Milky Way" : "Signature Batches"),
          batches: [],
        };
      }
      groups[monthKey].batches.push(batch);
    });

    return groups;
  }, [trek]);

  // Keep first month open by default
  const monthKeys = Object.keys(groupedBatches);
  React.useEffect(() => {
    if (monthKeys.length > 0) {
      const initial: Record<string, boolean> = {};
      monthKeys.forEach((key, i) => {
        initial[key] = i === 0; // First month expanded
      });
      setOpenMonths(initial);
    }
  }, [trek?.slug]);

  if (!isOpen || !trek) return null;

  const toggleMonth = (key: string) => {
    setOpenMonths((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Helper to format status tag
  const getBatchStatusDetails = (batch: TrekBatch) => {
    const rawStatus = (batch.status || "").toUpperCase();

    if (rawStatus === "FULL" || rawStatus === "CLOSED" || batch.slotsLeft === 0 && !batch.waitlistCount && rawStatus !== "WL") {
      return {
        code: "FULL",
        label: "FULL",
        style: "text-slate-400 font-semibold",
        badgeBg: "bg-slate-100 text-slate-500",
        bookable: false,
      };
    }

    if (rawStatus === "WL" || rawStatus === "WAITLIST" || (batch.waitlistCount && batch.waitlistCount > 0)) {
      const count = batch.waitlistCount || 4;
      return {
        code: "WL",
        label: `WL ${count}`,
        style: "text-amber-600 font-extrabold",
        badgeBg: "bg-amber-50 text-amber-700 border border-amber-200",
        bookable: true,
        isWaitlist: true,
      };
    }

    if (rawStatus === "LAST" || rawStatus === "FILLING FAST" || (batch.slotsLeft > 0 && batch.slotsLeft <= 5)) {
      const count = batch.slotsLeft || 1;
      return {
        code: "LAST",
        label: `LAST ${count}`,
        style: "text-rose-600 font-extrabold",
        badgeBg: "bg-rose-50 text-rose-700 border border-rose-200",
        bookable: true,
      };
    }

    return {
      code: "AVBL",
      label: "AVBL",
      style: "text-emerald-600 font-extrabold",
      badgeBg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      bookable: true,
    };
  };

  const handleRowClick = (batch: TrekBatch) => {
    const status = getBatchStatusDetails(batch);
    if (!status.bookable && status.code === "FULL") {
      alert(`The batch for ${batch.startDate} - ${batch.endDate} is fully booked. You can choose another date or connect with our expedition desk for custom group slots.`);
      return;
    }
    if (onBookBatch) {
      onBookBatch(trek, batch);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Departure Dates &amp; Slots
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {trek.duration} • {trek.altitude}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight brand-font">
              {trek.name}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
              {trek.tagline || "Authentic Himalayan trail with experienced guides"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition shrink-0 cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Filter Pills (Optional) */}
        <div className="px-5 sm:px-6 pt-3 pb-2 flex items-center gap-2 border-b border-slate-100 bg-white">
          <span className="text-[11px] font-bold text-slate-400">Filter:</span>
          <button
            onClick={() => setFilterType("all")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              filterType === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Dates
          </button>
          <button
            onClick={() => setFilterType("available")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              filterType === "available" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Available Only
          </button>
          <button
            onClick={() => setFilterType("stargazing")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
              filterType === "stargazing" ? "bg-amber-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Stargazing</span>
          </button>
        </div>

        {/* Batches Content (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {monthKeys.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold">New departures are being scheduled for this trek.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Contact our expedition desk to request custom or private dates.
              </p>
            </div>
          ) : (
            monthKeys.map((mKey) => {
              const group = groupedBatches[mKey];
              const isOpenMonth = openMonths[mKey] ?? true;

              const filteredList = group.batches.filter((b) => {
                if (filterType === "available") {
                  const s = getBatchStatusDetails(b);
                  return s.code === "AVBL" || s.code === "LAST" || s.code === "WL";
                }
                if (filterType === "stargazing") {
                  return (b.experienceTag || "").toLowerCase().includes("stargaz");
                }
                return true;
              });

              if (filteredList.length === 0 && filterType !== "all") {
                return null;
              }

              return (
                <div
                  key={mKey}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs"
                >
                  {/* Month Accordion Header */}
                  <button
                    type="button"
                    onClick={() => toggleMonth(mKey)}
                    className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-left transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                        {group.monthLabel}
                      </span>
                      {group.theme && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                          🍂 {group.theme}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {filteredList.length} departures
                      </span>
                      {isOpenMonth ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </button>

                  {/* Batch rows list */}
                  {isOpenMonth && (
                    <div className="divide-y divide-slate-100">
                      {filteredList.map((batch) => {
                        const status = getBatchStatusDetails(batch);

                        return (
                          <div
                            key={batch.id}
                            onClick={() => handleRowClick(batch)}
                            className={`px-4 py-3 flex items-center justify-between gap-3 transition-colors ${
                              status.bookable
                                ? "hover:bg-emerald-50/50 cursor-pointer group"
                                : "opacity-75 hover:bg-slate-50 cursor-not-allowed"
                            }`}
                          >
                            {/* Date range */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-emerald-900 transition">
                                {batch.startDate} – {batch.endDate}
                              </span>
                            </div>

                            {/* Middle & Right: Tag + Status */}
                            <div className="flex items-center gap-2.5 shrink-0">
                              {batch.experienceTag && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400 bg-amber-50 text-amber-800">
                                  <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                  <span>{batch.experienceTag}</span>
                                </span>
                              )}

                              {/* Status text (FULL, WL 4, AVBL, LAST 1) matching Indiahikes exactly */}
                              <span
                                className={`text-xs sm:text-sm tracking-wide ${status.style}`}
                              >
                                {status.label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Trip Desk Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-[11px] font-bold text-slate-700 block">
              Need custom dates or private group booking?
            </span>
            <span className="text-[10px] text-slate-500">
              Speak directly to our Dehradun basecamp team
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://wa.me/917500222141?text=Hi%20KRADIND%2C%20I%20am%20looking%20for%20trek%20dates%20and%20batches"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <a
              href="tel:+917500222141"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>Call Desk</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
