"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Check, X, AlertCircle, Radio, Clock } from "lucide-react";
import { TrailRadarReport } from "@/lib/cms-store";

export default function AdminRadarPage() {
  const [reports, setReports] = useState<TrailRadarReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<TrailRadarReport | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const fetchRadar = async () => {
    try {
      const res = await fetch("/api/admin/radar");
      if (res.ok) {
        setReports(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadar();
  }, []);

  const handleOpenAdd = () => {
    setEditingReport({
      id: "",
      trail: "",
      region: "Uttarakhand",
      status: "open",
      temperature: "5°C",
      weather: "Clear Skies",
      updatedAt: "Just now",
      note: "Trail condition verified by ground camp officer.",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (report: TrailRadarReport) => {
    setEditingReport(report);
    setIsModalOpen(true);
  };

  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport) return;

    setActionLoading(true);
    const isNew = !editingReport.id;
    const url = "/api/admin/radar";
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingReport),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to save trail report");
        setActionLoading(false);
        return;
      }

      showToast(isNew ? "Trail alert published!" : "Trail report updated!");
      setIsModalOpen(false);
      setEditingReport(null);
      fetchRadar();
    } catch {
      alert("Error saving report");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/radar?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Report deleted");
        setDeleteConfirmId(null);
        fetchRadar();
      } else {
        alert("Failed to delete report");
      }
    } catch {
      alert("Error deleting report");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F3A2E] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in border border-emerald-500/40">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Live Trail Radar CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish real-time summit weather, temperature, and ground status alerts.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Post Radar Update</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">📍 {r.region}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    r.status === "open"
                      ? "bg-emerald-100 text-emerald-800"
                      : r.status === "active"
                      ? "bg-blue-100 text-blue-800"
                      : r.status === "caution"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-2">{r.trail}</h3>

              <div className="flex items-center gap-3 text-xs text-slate-600 mt-2 font-medium">
                <span>🌡️ {r.temperature}</span>
                <span>•</span>
                <span>☁️ {r.weather}</span>
              </div>

              <p className="text-xs text-slate-600 mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                "{r.note}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Updated {r.updatedAt}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(r)}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(r.id)}
                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingReport.id ? "Edit Trail Alert" : "Add Trail Radar Alert"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Trail Name *</label>
                <input
                  type="text"
                  required
                  value={editingReport.trail}
                  onChange={(e) => setEditingReport({ ...editingReport, trail: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  placeholder="Kedarkantha (Sankri)"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Region *</label>
                <input
                  type="text"
                  required
                  value={editingReport.region}
                  onChange={(e) => setEditingReport({ ...editingReport, region: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  placeholder="Uttarakhand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingReport.status}
                    onChange={(e) =>
                      setEditingReport({
                        ...editingReport,
                        status: e.target.value as "open" | "active" | "caution" | "closed",
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="open">🟢 Open</option>
                    <option value="active">🌧️ Active</option>
                    <option value="caution">🟡 Caution</option>
                    <option value="closed">🔴 Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Temperature</label>
                  <input
                    type="text"
                    value={editingReport.temperature}
                    onChange={(e) =>
                      setEditingReport({ ...editingReport, temperature: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    placeholder="2°C Night"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Weather Condition</label>
                <input
                  type="text"
                  value={editingReport.weather}
                  onChange={(e) => setEditingReport({ ...editingReport, weather: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  placeholder="Clear Skies / Fresh Snow"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ground Note</label>
                <textarea
                  rows={3}
                  value={editingReport.note}
                  onChange={(e) => setEditingReport({ ...editingReport, note: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  placeholder="Clear summit path, microspikes recommended."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white rounded-xl font-bold transition disabled:opacity-60"
                >
                  {actionLoading ? "Saving..." : "Save Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Remove trail alert?</h3>
            <p className="text-xs text-slate-500 mt-1">
              This will remove the report from the public live radar feed immediately.
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
                disabled={actionLoading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-60"
              >
                {actionLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
