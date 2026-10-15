"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Search,
  Filter,
  Plus,
  Share2,
  Printer,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";
import { CustomerItineraryProposal } from "@/lib/cms-store";

interface SavedProposalsArchiveProps {
  proposals: CustomerItineraryProposal[];
  onPreview: (proposal: CustomerItineraryProposal) => void;
  onWhatsApp: (proposal: CustomerItineraryProposal) => void;
  onEdit: (proposal: CustomerItineraryProposal) => void;
  onDelete: (id: string, title: string) => Promise<void>;
  onStatusChange: (id: string, newStatus: string) => Promise<void>;
  onCreateNew: () => void;
  onOpenDrafts?: () => void;
  draftCount?: number;
}

export function SavedProposalsArchive({
  proposals,
  onPreview,
  onWhatsApp,
  onEdit,
  onDelete,
  onStatusChange,
  onCreateNew,
  onOpenDrafts,
  draftCount = 0,
}: SavedProposalsArchiveProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.id.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.packageTitle.toLowerCase().includes(q) ||
        (p.customerPhone && p.customerPhone.includes(q)) ||
        p.destination.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [proposals, search, statusFilter]);

  const totalQuotedSum = useMemo(() => {
    return filteredProposals.reduce((sum, p) => sum + (p.totalQuotedPrice || 0), 0);
  }, [filteredProposals]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-amber-100 text-amber-900 border-amber-300 font-bold";
      case "Accepted":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 font-bold";
      case "Sent":
        return "bg-blue-100 text-blue-800 border-blue-200 font-bold";
      case "Under Review":
        return "bg-amber-100 text-amber-800 border-amber-200 font-bold";
      case "Expired":
        return "bg-rose-100 text-rose-800 border-rose-200 font-bold";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 font-bold";
    }
  };

  return (
    <div className="space-y-4">
      {/* Control & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search proposals by client, package, phone, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 transition-all"
          />
        </div>

        {/* Filter & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
          >
            <option value="All">All Statuses ({proposals.length})</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent to Client</option>
            <option value="Accepted">Accepted & Reserved</option>
            <option value="Under Review">Under Review</option>
            <option value="Expired">Expired</option>
          </select>

          {onOpenDrafts && (
            <button
              onClick={onOpenDrafts}
              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              title="Open Proposal Drafts Hub"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Drafts Hub</span>
              {draftCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black">
                  {draftCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={onCreateNew}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Itinerary</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900">
              {filteredProposals.length} Travel Proposal{filteredProposals.length !== 1 ? "s" : ""} Found
            </div>
            <div className="text-[11px] text-slate-500">
              Total pipeline value: <strong className="text-emerald-700">{formatCurrency(totalQuotedSum)}</strong>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          Showing real-time records synced with CRM pipeline.
        </div>
      </div>

      {/* Proposals Grid */}
      {filteredProposals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Proposals Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No proposal records match your search query or filter. Launch the Itinerary Studio to create customized
            travel quotations for your clients.
          </p>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-[#0F3A2E] text-white rounded-xl text-xs font-bold hover:bg-[#0A261E] transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Launch Itinerary Studio</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProposals.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/80 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Header: ID & Status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[11px] font-bold text-slate-500">{prop.id}</span>
                  <select
                    value={prop.status}
                    onChange={(e) => onStatusChange(prop.id, e.target.value)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(
                      prop.status
                    )}`}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                {/* Package & Customer Info */}
                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {prop.packageTitle}
                </h3>
                <div className="text-xs font-semibold text-slate-700 mt-1 flex items-center gap-1.5">
                  <span>Traveler:</span>
                  <span className="text-emerald-800 font-bold">{prop.customerName}</span>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-medium mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{prop.destination}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{prop.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {prop.adultsCount} Adult(s) {prop.childrenCount ? `+ ${prop.childrenCount} Ch` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{prop.startDate || "Date TBD"}</span>
                  </div>
                </div>

                {/* Commercials Box */}
                <div className="bg-slate-50 rounded-xl p-3 mt-3 flex items-center justify-between border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Quoted Price</span>
                    <span className="text-sm font-black text-slate-900">{formatCurrency(prop.totalQuotedPrice)}</span>
                  </div>
                  {prop.advanceDepositRequired ? (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Advance Token</span>
                      <span className="text-xs font-bold text-amber-700">
                        {formatCurrency(prop.advanceDepositRequired)}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onPreview(prop)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="View & Print Voucher"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-800" />
                  </button>
                  <button
                    onClick={() => onWhatsApp(prop)}
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                    title="Share via WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onEdit(prop)}
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                    title="Edit in Itinerary Studio"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onDelete(prop.id, prop.packageTitle)}
                  className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete Proposal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
