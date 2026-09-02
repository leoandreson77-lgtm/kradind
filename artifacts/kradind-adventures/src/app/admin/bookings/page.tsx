"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle, Trash2, Search, Check, AlertCircle, Phone, Mail, Calendar } from "lucide-react";
import { BookingRecord } from "@/lib/cms-store";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      if (res.ok) {
        setBookings(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string, newStatus: BookingRecord["status"]) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        showToast(`Booking ${id} status updated to ${newStatus}`);
        fetchBookings();
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Booking record removed");
        setDeleteConfirmId(null);
        fetchBookings();
      }
    } catch {
      alert("Failed to delete booking");
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.trekName.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search);
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F3A2E] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in border border-emerald-500/40">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Customer Bookings & Departures
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage reservation confirmations, batch dates, and ground payment statuses.
        </p>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, ID, phone..."
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
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Booking Ref</th>
                <th className="px-5 py-3.5">Customer Info</th>
                <th className="px-5 py-3.5">Trek & Batch</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                    <div>{b.id}</div>
                    <div className="text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{b.customerName}</div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {b.email}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {b.phone}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-800">{b.trekName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" /> {b.batchDate}
                    </div>
                    <div className="text-[11px] text-[#0F3A2E] font-semibold mt-0.5">
                      {b.travelers} Trekkers
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900 text-sm">
                      ₹{b.totalAmount.toLocaleString("en-IN")}
                    </div>
                    {b.discountApplied && (
                      <span className="inline-block text-[10px] text-emerald-700 bg-emerald-50 font-bold px-1.5 py-0.5 rounded mt-0.5">
                        Promo Applied
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={b.status}
                      onChange={(e) =>
                        handleStatusChange(b.id, e.target.value as BookingRecord["status"])
                      }
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                        b.status === "Confirmed"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : b.status === "Pending"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : b.status === "Completed"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : "bg-rose-50 text-rose-800 border-rose-200"
                      }`}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setDeleteConfirmId(b.id)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Booking Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400 text-xs">
                    {loading ? "Loading bookings..." : "No bookings match criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete booking record?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to delete reservation record #{deleteConfirmId}?
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
