"use client";

import React, { useEffect, useState } from "react";
import {
  Inbox,
  Search,
  Check,
  Mail,
  Phone,
  Trash2,
  AlertCircle,
  Clock,
  CheckCircle2,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { LeadRecord } from "@/lib/cms-store";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/admin/leads");
      if (res.ok) {
        setLeads(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id: string, newStatus: LeadRecord["status"]) => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        showToast(`Lead ${id} status updated to ${newStatus}`);
        fetchLeads();
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Lead record removed");
        setDeleteConfirmId(null);
        fetchLeads();
      }
    } catch {
      alert("Failed to delete lead");
    }
  };

  const filtered = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      l.message.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const newCount = leads.filter((l) => l.status === "New").length;
  const contactedCount = leads.filter((l) => l.status === "Contacted").length;
  const qualifiedCount = leads.filter((l) => l.status === "Qualified").length;

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F3A2E] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in border border-emerald-500/40">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <span>Customer Inquiries & Leads</span>
          {newCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
              {newCount} New
            </span>
          )}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Follow up with customer trek inquiries, private batch requests, and custom itinerary questions.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Leads</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{leads.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">New Inquiries</span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">{newCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">In Progress</span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">{contactedCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Qualified / Booked</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{qualifiedCount}</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, email, query..."
            className="w-full text-xs bg-transparent outline-none text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-semibold text-slate-700"
          >
            <option value="All">All Inquiries</option>
            <option value="New">🔵 New</option>
            <option value="Contacted">🟡 Contacted</option>
            <option value="Qualified">🟢 Qualified</option>
            <option value="Closed">⚪ Closed</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Lead Ref & Date</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Interest / Source</th>
                <th className="px-5 py-3.5">Inquiry Message</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Connect / Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900 align-top">
                    <div>{l.id}</div>
                    <div className="text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                      {new Date(l.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="px-5 py-3.5 align-top">
                    <div className="font-bold text-slate-900">{l.name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <a href={`mailto:${l.email}`} className="hover:underline text-blue-600">
                        {l.email}
                      </a>
                    </div>
                    {l.phone && l.phone !== "Not provided" && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{l.phone}</span>
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-3.5 align-top">
                    <div className="font-semibold text-slate-800">{l.trekInterest || "General"}</div>
                    <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {l.source}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 align-top max-w-xs">
                    <p className="text-slate-700 text-xs bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 whitespace-pre-wrap">
                      "{l.message}"
                    </p>
                  </td>

                  <td className="px-5 py-3.5 align-top">
                    <select
                      value={l.status}
                      onChange={(e) =>
                        handleStatusChange(l.id, e.target.value as LeadRecord["status"])
                      }
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                        l.status === "New"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : l.status === "Contacted"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : l.status === "Qualified"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      <option value="New">🔵 New</option>
                      <option value="Contacted">🟡 Contacted</option>
                      <option value="Qualified">🟢 Qualified</option>
                      <option value="Closed">⚪ Closed</option>
                    </select>
                  </td>

                  <td className="px-5 py-3.5 text-right align-top space-x-1">
                    <a
                      href={`mailto:${l.email}?subject=Regarding your inquiry with KRADIND Adventures (${l.id})`}
                      className="inline-block p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                      title="Send Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    {l.phone && l.phone !== "Not provided" && (
                      <a
                        href={`https://wa.me/${l.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                        title="WhatsApp Chat"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => setDeleteConfirmId(l.id)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400 text-xs">
                    {loading ? "Loading inquiries..." : "No leads found matching criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Remove inquiry record?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to delete lead #{deleteConfirmId}?
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
