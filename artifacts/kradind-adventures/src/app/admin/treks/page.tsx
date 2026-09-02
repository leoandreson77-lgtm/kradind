"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Check, X, Eye, AlertCircle, Mountain } from "lucide-react";
import { TrekData } from "@/lib/cms-store";

export default function AdminTreksPage() {
  const [treks, setTreks] = useState<TrekData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrek, setEditingTrek] = useState<TrekData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const fetchTreks = async () => {
    try {
      const res = await fetch("/api/admin/treks");
      if (res.ok) {
        const data = await res.json();
        setTreks(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreks();
  }, []);

  const handleOpenAdd = () => {
    setEditingTrek({
      id: "",
      slug: "",
      name: "",
      location: "Uttarakhand",
      region: "Garhwal",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
      gallery: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"],
      tagline: "",
      description: "",
      duration: "5 Days",
      difficulty: "Moderate",
      altitude: "12,000 Ft",
      distance: "20 km",
      baseCamp: "Base Camp",
      rating: 4.9,
      reviewCount: 1,
      price: 8999,
      originalPrice: 10999,
      badge: "Featured",
      categories: ["Himalayas"],
      status: "Published",
      batches: [
        { id: 1, startDate: "Jun 14", endDate: "Jun 18, 2026", slotsLeft: 12, price: 8999 },
      ],
      itinerary: [
        { day: 1, title: "Base Camp Arrival", description: "Orientation and briefing", altitude: "6,000 Ft" },
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trek: TrekData) => {
    setEditingTrek(trek);
    setIsModalOpen(true);
  };

  const handleSaveTrek = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrek) return;

    setActionLoading(true);
    const isNew = !editingTrek.id;
    const url = "/api/admin/treks";
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTrek),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to save trek");
        setActionLoading(false);
        return;
      }

      showToast(isNew ? "Trek created successfully!" : "Trek updated successfully!");
      setIsModalOpen(false);
      setEditingTrek(null);
      fetchTreks();
    } catch {
      alert("Error saving trek");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/treks?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Trek deleted successfully");
        setDeleteConfirmId(null);
        fetchTreks();
      } else {
        alert("Failed to delete trek");
      }
    } catch {
      alert("Error deleting trek");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (trek: TrekData) => {
    const newStatus = trek.status === "Published" ? "Draft" : "Published";
    try {
      const res = await fetch("/api/admin/treks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...trek, status: newStatus }),
      });
      if (res.ok) {
        showToast(`Status changed to ${newStatus}`);
        fetchTreks();
      }
    } catch {
      alert("Error updating status");
    }
  };

  const filtered = treks.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F3A2E] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in border border-emerald-500/40">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Treks Management CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, edit itineraries, toggle publish status, and manage prices.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add New Trek</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search trek by name, location, or slug..."
          className="w-full text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-xs text-slate-400 hover:text-slate-600">
            Clear
          </button>
        )}
      </div>

      {/* Treks Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Trek Details</th>
                <th className="px-5 py-3.5">Region</th>
                <th className="px-5 py-3.5">Altitude</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="font-mono">/{t.slug}</span>
                      <span>•</span>
                      <span>{t.duration}</span>
                      <span>•</span>
                      <span className="text-[#FF6B35] font-semibold">{t.badge}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700 font-medium">{t.location}</td>
                  <td className="px-5 py-3.5 text-slate-600">{t.altitude}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">₹{t.price.toLocaleString("en-IN")}</div>
                    {t.originalPrice > t.price && (
                      <div className="text-[10px] text-slate-400 line-through">
                        ₹{t.originalPrice.toLocaleString("en-IN")}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleToggleStatus(t)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                        t.status === "Published"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                      title="Click to toggle publish status"
                    >
                      {t.status === "Published" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{t.status}</span>
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                      title="Edit Trek"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(t.id)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Trek"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400 text-xs">
                    {loading ? "Loading treks catalog..." : "No treks match your search filter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingTrek && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingTrek.id ? "Edit Trek Details" : "Create New Trek"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTrek} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Trek Name *</label>
                  <input
                    type="text"
                    required
                    value={editingTrek.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                      setEditingTrek({
                        ...editingTrek,
                        name,
                        slug: editingTrek.id ? editingTrek.slug : slug,
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A2E]"
                    placeholder="Kedarkantha Summit Trek"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Slug (URL identifier) *</label>
                  <input
                    type="text"
                    required
                    value={editingTrek.slug}
                    onChange={(e) => setEditingTrek({ ...editingTrek, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0F3A2E]"
                    placeholder="kedarkantha-summit"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location / State</label>
                  <input
                    type="text"
                    value={editingTrek.location}
                    onChange={(e) => setEditingTrek({ ...editingTrek, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                    placeholder="Uttarakhand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Altitude (e.g. 12,500 Ft)</label>
                  <input
                    type="text"
                    value={editingTrek.altitude}
                    onChange={(e) => setEditingTrek({ ...editingTrek, altitude: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                    placeholder="12,500 Ft"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (e.g. 5D / 4N)</label>
                  <input
                    type="text"
                    value={editingTrek.duration}
                    onChange={(e) => setEditingTrek({ ...editingTrek, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                    placeholder="5D / 4N"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={editingTrek.difficulty}
                    onChange={(e) =>
                      setEditingTrek({
                        ...editingTrek,
                        difficulty: e.target.value as "Easy" | "Moderate" | "Challenging",
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Offering Price (₹)</label>
                  <input
                    type="number"
                    value={editingTrek.price}
                    onChange={(e) => setEditingTrek({ ...editingTrek, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                    placeholder="8999"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingTrek.originalPrice}
                    onChange={(e) => setEditingTrek({ ...editingTrek, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                    placeholder="10999"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={editingTrek.badge}
                    onChange={(e) => setEditingTrek({ ...editingTrek, badge: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                    placeholder="Bestseller / Monsoon Special"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Publish Status</label>
                  <select
                    value={editingTrek.status}
                    onChange={(e) =>
                      setEditingTrek({
                        ...editingTrek,
                        status: e.target.value as "Published" | "Draft",
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white"
                  >
                    <option value="Published">Published (Live on site)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingTrek.image}
                  onChange={(e) => setEditingTrek({ ...editingTrek, image: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingTrek.description}
                  onChange={(e) => setEditingTrek({ ...editingTrek, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  placeholder="Detailed description of the trail, campsite highlights, etc."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white rounded-xl text-xs font-bold transition disabled:opacity-60"
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete this trek?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to delete this trek? It will immediately be removed from the public catalog.
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
