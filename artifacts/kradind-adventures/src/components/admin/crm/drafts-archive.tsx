"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Sparkles,
  Clock,
  Trash2,
  Edit3,
  Search,
  Plus,
  Printer,
  Share2,
  CheckCircle2,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Copy,
  RotateCcw,
  Shield,
  Layers,
  ChevronRight,
} from "lucide-react";
import { CustomerItineraryProposal } from "@/lib/cms-store";

const DRAFT_STORAGE_KEY = "kradind_crm_itinerary_studio_draft";
const DRAFT_TIMESTAMP_KEY = "kradind_crm_itinerary_studio_draft_time";

interface DraftsArchiveProps {
  proposals: CustomerItineraryProposal[];
  onPreview: (proposal: CustomerItineraryProposal) => void;
  onWhatsApp: (proposal: CustomerItineraryProposal) => void;
  onResume: (proposal: CustomerItineraryProposal) => void;
  onDelete: (id: string, title: string) => Promise<void>;
  onPromoteToSent: (id: string) => Promise<void>;
  onCreateNew: () => void;
}

export function DraftsArchive({
  proposals,
  onPreview,
  onWhatsApp,
  onResume,
  onDelete,
  onPromoteToSent,
  onCreateNew,
}: DraftsArchiveProps) {
  const [search, setSearch] = useState("");
  const [localDraft, setLocalDraft] = useState<CustomerItineraryProposal | null>(null);
  const [localDraftTime, setLocalDraftTime] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string>("");

  // Load the active local studio auto-save draft from localStorage
  const refreshLocalDraft = () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      const time = localStorage.getItem(DRAFT_TIMESTAMP_KEY) || "";
      if (raw) {
        const parsed: CustomerItineraryProposal = JSON.parse(raw);
        if (
          parsed.customerName?.trim() ||
          parsed.packageTitle?.trim() ||
          (parsed.itinerary && parsed.itinerary.length > 0)
        ) {
          setLocalDraft(parsed);
          setLocalDraftTime(time);
          return;
        }
      }
      setLocalDraft(null);
      setLocalDraftTime("");
    } catch {
      setLocalDraft(null);
    }
  };

  useEffect(() => {
    refreshLocalDraft();
    const interval = setInterval(refreshLocalDraft, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleClearLocalDraft = () => {
    if (
      confirm(
        "Are you sure you want to discard the active auto-saved draft from browser storage? This cannot be undone."
      )
    ) {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
      } catch {}
      setLocalDraft(null);
      setLocalDraftTime("");
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // Filter server-saved proposals where status === "Draft"
  const serverDrafts = useMemo(() => {
    return proposals.filter((p) => p.status === "Draft");
  }, [proposals]);

  const filteredDrafts = useMemo(() => {
    return serverDrafts.filter((p) => {
      const q = search.toLowerCase();
      if (!q) return true;
      return (
        p.id.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.packageTitle.toLowerCase().includes(q) ||
        (p.customerPhone && p.customerPhone.includes(q)) ||
        p.destination.toLowerCase().includes(q)
      );
    });
  }, [serverDrafts, search]);

  const totalDraftsCount = serverDrafts.length + (localDraft ? 1 : 0);
  const totalDraftsValue =
    serverDrafts.reduce((sum, p) => sum + (p.totalQuotedPrice || 0), 0) +
    (localDraft?.totalQuotedPrice || 0);

  const handleCopyLink = (prop: CustomerItineraryProposal) => {
    const text = `Travel Proposal for ${prop.customerName} - ${prop.packageTitle} (${prop.duration || `${prop.itinerary?.length || 0} Days`}) - Quoted: ${formatCurrency(prop.totalQuotedPrice || 0)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(prop.id);
      setTimeout(() => setCopiedId(""), 2500);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner / KPI Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0F3A2E] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                <span>Proposal Drafts Hub</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-200 border border-white/15">
                {totalDraftsCount} In-Progress Draft{totalDraftsCount !== 1 ? "s" : ""}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Itinerary & Proposal Drafts
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-2xl">
              Access real-time auto-saved drafts and pending proposal quotes. Resume editing seamlessly
              in the Itinerary Studio without losing custom dates, hotels, or client notes.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={onCreateNew}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl text-xs font-black flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>New Proposal Draft</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-[11px] text-emerald-300 font-medium">Total Drafts</div>
            <div className="text-lg font-black text-white mt-0.5">{totalDraftsCount}</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-[11px] text-emerald-300 font-medium">Pipeline In Drafts</div>
            <div className="text-lg font-black text-amber-300 mt-0.5">
              {formatCurrency(totalDraftsValue)}
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-[11px] text-emerald-300 font-medium">Active Studio Auto-Save</div>
            <div className="text-xs font-bold text-white mt-1 flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  localDraft ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                }`}
              />
              <span>{localDraft ? "Active in Memory" : "No Unsaved Edits"}</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-[11px] text-emerald-300 font-medium">Cloud Saved Drafts</div>
            <div className="text-lg font-black text-white mt-0.5">{serverDrafts.length}</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: ACTIVE REAL-TIME AUTO-SAVED DRAFT (FROM STUDIO BROWSER STORAGE) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Real-Time Browser Auto-Save
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Instant Session Recovery
            </span>
          </div>
          {localDraft && (
            <button
              onClick={handleClearLocalDraft}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Discard Auto-Save</span>
            </button>
          )}
        </div>

        {localDraft ? (
          <div className="bg-gradient-to-br from-amber-50/90 via-amber-50/40 to-white border-2 border-amber-300/80 rounded-3xl p-5 sm:p-6 shadow-md transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                    Active Session Draft
                  </span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="font-mono text-xs font-bold text-slate-600">
                    {localDraft.id || "KRAD-DRAFT-CURRENT"}
                  </span>
                  {localDraftTime && (
                    <>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-[11px] text-amber-900/80 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Saved at {localDraftTime}</span>
                      </span>
                    </>
                  )}
                  {localDraft.version && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                      v{localDraft.version}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                  {localDraft.packageTitle || "Untitled Custom Itinerary"}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                  <div className="flex items-center gap-1 font-semibold text-emerald-900">
                    <Users className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Traveler: {localDraft.customerName || "Unassigned Client"}</span>
                    {localDraft.customerPhone && (
                      <span className="text-slate-400">({localDraft.customerPhone})</span>
                    )}
                  </div>
                  {localDraft.destination && (
                    <div className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{localDraft.destination}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {localDraft.itinerary?.length || 0} Day
                      {(localDraft.itinerary?.length || 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-medium pt-1">
                  Quoted:{" "}
                  <strong className="text-slate-900 font-extrabold text-sm">
                    {formatCurrency(localDraft.totalQuotedPrice || 0)}
                  </strong>
                  {localDraft.advanceDepositRequired ? (
                    <span className="ml-2 text-[11px] text-emerald-700 font-bold">
                      (Advance required: {formatCurrency(localDraft.advanceDepositRequired)})
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Action Buttons for active local draft */}
              <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => onResume(localDraft)}
                  className="px-4 py-2.5 bg-[#0F3A2E] hover:bg-[#0A261E] text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resume in Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
                <button
                  type="button"
                  onClick={() => onPreview(localDraft)}
                  className="px-3.5 py-2.5 bg-white hover:bg-amber-50 text-slate-800 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-amber-300/80 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-700" />
                  <span>Preview PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearLocalDraft}
                  className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                  title="Discard Draft"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-200/60 text-slate-500 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-bold text-slate-700">No active unsaved studio session</span>
                <p className="text-[11px] text-slate-400">
                  Whenever you customize an itinerary in Studio, your edits are automatically cached here in real-time.
                </p>
              </div>
            </div>
            <button
              onClick={onCreateNew}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Open Studio</span>
            </button>
          </div>
        )}
      </div>

      {/* SECTION 2: SAVED DRAFT PROPOSALS LIST */}
      <div className="space-y-4 pt-2">
        {/* Toolbar & Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search drafts by traveler, package, phone, destination, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
              Showing <strong className="text-slate-800">{filteredDrafts.length}</strong> Draft
              {filteredDrafts.length !== 1 ? "s" : ""}
            </div>
            <button
              onClick={onCreateNew}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Draft</span>
            </button>
          </div>
        </div>

        {/* Draft Cards Grid */}
        {filteredDrafts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {search ? "No Drafts Match Your Search" : "No Saved Proposal Drafts Found"}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {search
                ? "Try clearing your search query or searching for a different client name or destination."
                : "All finalized proposals have been sent or accepted! You can start a new custom itinerary draft at any time using the Itinerary Studio."}
            </p>
            <button
              onClick={onCreateNew}
              className="px-4 py-2 bg-[#0F3A2E] text-white rounded-xl text-xs font-bold hover:bg-[#0A261E] transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Start New Proposal Draft</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDrafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-amber-400/80 hover:shadow-lg transition-all p-5 flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                {/* Top Draft Tag Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-500 to-amber-400" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] font-bold text-slate-500">{draft.id}</span>
                    <div className="flex items-center gap-1.5">
                      {draft.version && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                          v{draft.version}
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        Draft
                      </span>
                    </div>
                  </div>

                  <h3 className="font-black text-sm text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                    {draft.packageTitle}
                  </h3>

                  <div className="text-xs font-semibold text-slate-700 mt-1.5 flex items-center gap-1.5">
                    <span className="text-slate-400">Traveler:</span>
                    <span className="text-emerald-900 font-extrabold">{draft.customerName}</span>
                    {draft.customerPhone && (
                      <span className="text-slate-400 text-[11px]">({draft.customerPhone})</span>
                    )}
                  </div>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{draft.destination || "Custom Route"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{draft.duration || `${draft.itinerary?.length || 0} Days`}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{draft.adultsCount || 1} Adults</span>
                      {Boolean(draft.childrenCount) && (
                        <span className="text-slate-400">, {draft.childrenCount} Kids</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{draft.hotelCategory || "Standard 3★"}</span>
                    </div>
                  </div>

                  {/* Pricing Overview */}
                  <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        Quoted Price
                      </div>
                      <div className="text-base font-black text-slate-900">
                        {formatCurrency(draft.totalQuotedPrice || 0)}
                      </div>
                    </div>
                    {draft.advanceDepositRequired ? (
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                          Advance
                        </div>
                        <div className="text-xs font-extrabold text-emerald-700">
                          {formatCurrency(draft.advanceDepositRequired)}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Timestamp & Author */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
                    <span>Author: {draft.author || "Sales Agent"}</span>
                    <span>
                      {draft.updatedAt
                        ? new Date(draft.updatedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Recent Draft"}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onResume(draft)}
                      title="Resume & Edit in Studio"
                      className="h-8 px-2.5 rounded-xl bg-[#0F3A2E] hover:bg-[#0A261E] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Resume</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onPreview(draft)}
                      title="Preview PDF Voucher"
                      className="h-8 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onWhatsApp(draft)}
                      title="Share Quote on WhatsApp"
                      className="h-8 w-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onPromoteToSent(draft.id)}
                      title="Mark as Sent to Client"
                      className="h-8 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                      <span>Mark Sent</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(draft.id, draft.packageTitle)}
                      title="Move to Recycle Bin"
                      className="h-8 w-8 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
