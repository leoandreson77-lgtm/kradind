"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Check, X, Eye, AlertCircle, Mountain, Calendar, Star, Sparkles, HelpCircle, CheckCircle2, ListPlus } from "lucide-react";
import { TrekData } from "@/lib/cms-store";

export default function AdminTreksPage() {
  const [treks, setTreks] = useState<TrekData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrek, setEditingTrek] = useState<TrekData | null>(null);
  const [modalTab, setModalTab] = useState<"basic" | "overview" | "itinerary" | "inclusions" | "faqs">("basic");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const fetchTreks = async () => {
    try {
      const res = await fetch("/api/admin/treks", { cache: "no-store" });
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
    setModalTab("basic");
    setEditingTrek({
      id: "",
      slug: "",
      name: "",
      location: "Uttarakhand",
      region: "Garhwal",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
      gallery: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"],
      tagline: "",
      overview: "",
      highlights: ["Experienced mountain guide", "All camp equipment & safety gear"],
      duration: "5 Days / 4 Nights",
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
        { day: 1, title: "Base Camp Arrival & Acclimatization", description: "Orientation, gear check, and acclimatization walk.", altitude: "6,000 Ft", distance: "Drive", meal: "Dinner", stay: "Guesthouse / Camp" },
      ],
      inclusions: ["All meals during the trek", "Certified mountain guides", "Tents, sleeping bags, and mattress"],
      exclusions: ["Personal expenses & tips", "Travel insurance", "Transportation to base camp unless booked"],
      faqs: [
        { question: "What is the fitness level required?", answer: "Moderate fitness. 3-4 km jogging daily for 2 weeks prior is recommended." }
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trek: TrekData) => {
    setModalTab("basic");
    setEditingTrek({
      ...trek,
      highlights: trek.highlights || [],
      itinerary: trek.itinerary || [],
      inclusions: trek.inclusions || [],
      exclusions: trek.exclusions || [],
      faqs: trek.faqs || [],
    });
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
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 my-4">
            
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingTrek.id ? `Edit: ${editingTrek.name || "Trek"}` : "Create New Trek"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update itinerary, pricing, overview, inclusions, and FAQs.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-100 overflow-x-auto scrollbar-none shrink-0 bg-slate-50/70">
              <button
                type="button"
                onClick={() => setModalTab("basic")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "basic"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Mountain className="w-3.5 h-3.5" />
                <span>Basic & Pricing</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab("overview")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "overview"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Overview & Highlights</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab("itinerary")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "itinerary"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>Itinerary ({editingTrek.itinerary?.length || 0} Days)</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab("inclusions")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "inclusions"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Inclusions & Exclusions</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab("faqs")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "faqs"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>FAQs ({editingTrek.faqs?.length || 0})</span>
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveTrek} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                
                {/* TAB 1: BASIC & PRICING */}
                {modalTab === "basic" && (
                  <div className="space-y-4">
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
                          placeholder="Hampta Pass Crossover Trek"
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
                          placeholder="hampta-pass"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Location (Start to End)</label>
                        <input
                          type="text"
                          value={editingTrek.location}
                          onChange={(e) => setEditingTrek({ ...editingTrek, location: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                          placeholder="Manali to Lahaul, Himachal Pradesh"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Region / Mountain Range</label>
                        <input
                          type="text"
                          value={editingTrek.region}
                          onChange={(e) => setEditingTrek({ ...editingTrek, region: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                          placeholder="Pir Panjal & Zanskar"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Max Altitude</label>
                        <input
                          type="text"
                          value={editingTrek.altitude}
                          onChange={(e) => setEditingTrek({ ...editingTrek, altitude: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                          placeholder="14,000 Ft"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                        <input
                          type="text"
                          value={editingTrek.duration}
                          onChange={(e) => setEditingTrek({ ...editingTrek, duration: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                          placeholder="5 Days / 4 Nights"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty / Grade</label>
                        <input
                          type="text"
                          value={editingTrek.difficulty}
                          onChange={(e) => setEditingTrek({ ...editingTrek, difficulty: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                          placeholder="Moderate"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Tag</label>
                        <input
                          type="text"
                          value={editingTrek.badge}
                          onChange={(e) => setEditingTrek({ ...editingTrek, badge: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                          placeholder="High Pass Epic"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Offering Price (₹)</label>
                        <input
                          type="number"
                          value={editingTrek.price}
                          onChange={(e) => setEditingTrek({ ...editingTrek, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-emerald-700"
                          placeholder="9999"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Original Price (₹)</label>
                        <input
                          type="number"
                          value={editingTrek.originalPrice}
                          onChange={(e) => setEditingTrek({ ...editingTrek, originalPrice: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500"
                          placeholder="12999"
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

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Image URL</label>
                        <input
                          type="text"
                          value={editingTrek.image}
                          onChange={(e) => setEditingTrek({ ...editingTrek, image: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                          placeholder="https://images.unsplash.com/photo-..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
                      <input
                        type="text"
                        value={editingTrek.tagline || ""}
                        onChange={(e) => setEditingTrek({ ...editingTrek, tagline: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                        placeholder="Cross from the lush green pine valleys of Kullu into the dramatic, barren moonscape of Spiti."
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: OVERVIEW & HIGHLIGHTS */}
                {modalTab === "overview" && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        About the Journey (Overview Narrative)
                      </label>
                      <textarea
                        rows={6}
                        value={editingTrek.overview || ""}
                        onChange={(e) => setEditingTrek({ ...editingTrek, overview: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm leading-relaxed"
                        placeholder="Write the detailed overview, landscape description, and trek story here..."
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold text-slate-700">
                          Expedition Highlights (Key Features)
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingTrek({
                              ...editingTrek,
                              highlights: [...(editingTrek.highlights || []), ""],
                            })
                          }
                          className="text-xs font-bold text-[#0F3A2E] hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Highlight
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(editingTrek.highlights || []).map((highlight, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={highlight}
                              onChange={(e) => {
                                const next = [...(editingTrek.highlights || [])];
                                next[idx] = e.target.value;
                                setEditingTrek({ ...editingTrek, highlights: next });
                              }}
                              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                              placeholder="e.g. Dramatic crossover from Kullu's pine forest to Spiti's cold desert"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = (editingTrek.highlights || []).filter((_, i) => i !== idx);
                                setEditingTrek({ ...editingTrek, highlights: next });
                              }}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {(!editingTrek.highlights || editingTrek.highlights.length === 0) && (
                          <p className="text-xs text-slate-400 italic py-2">No highlights added yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: ITINERARY (DAY-BY-DAY) */}
                {modalTab === "itinerary" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-700">
                        {editingTrek.itinerary?.length || 0} Scheduled Days
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const days = [...(editingTrek.itinerary || [])];
                          days.push({
                            day: days.length + 1,
                            title: `Day ${days.length + 1}`,
                            description: "",
                            distance: "4 km",
                            altitude: "10,000 Ft",
                            meal: "Breakfast, Lunch, Dinner",
                            stay: "Alpine Tents",
                          });
                          setEditingTrek({ ...editingTrek, itinerary: days });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F3A2E] text-white text-xs font-bold rounded-lg hover:bg-[#164e3f] transition"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Next Day
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(editingTrek.itinerary || []).map((day, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="w-7 h-7 rounded-full bg-[#0F3A2E] text-white text-xs font-bold flex items-center justify-center shrink-0">
                                {day.day}
                              </span>
                              <input
                                type="text"
                                value={day.title}
                                onChange={(e) => {
                                  const days = [...(editingTrek.itinerary || [])];
                                  days[idx] = { ...days[idx], title: e.target.value };
                                  setEditingTrek({ ...editingTrek, itinerary: days });
                                }}
                                className="flex-1 font-bold text-xs sm:text-sm px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-900"
                                placeholder={`Day ${day.day} Route / Title`}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const days = (editingTrek.itinerary || [])
                                  .filter((_, i) => i !== idx)
                                  .map((d, i) => ({ ...d, day: i + 1 }));
                                setEditingTrek({ ...editingTrek, itinerary: days });
                              }}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                              title="Delete this day"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Day Narrative / Activities</label>
                            <textarea
                              rows={3}
                              value={day.description}
                              onChange={(e) => {
                                const days = [...(editingTrek.itinerary || [])];
                                days[idx] = { ...days[idx], description: e.target.value };
                                setEditingTrek({ ...editingTrek, itinerary: days });
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed"
                              placeholder="Describe the trail terrain, river crossings, views, and resting points..."
                            />
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <div>
                              <label className="block text-[10px] text-slate-500 mb-0.5">Trek Distance</label>
                              <input
                                type="text"
                                value={day.distance || ""}
                                onChange={(e) => {
                                  const days = [...(editingTrek.itinerary || [])];
                                  days[idx] = { ...days[idx], distance: e.target.value };
                                  setEditingTrek({ ...editingTrek, itinerary: days });
                                }}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                placeholder="3 km"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 mb-0.5">Altitude</label>
                              <input
                                type="text"
                                value={day.altitude || ""}
                                onChange={(e) => {
                                  const days = [...(editingTrek.itinerary || [])];
                                  days[idx] = { ...days[idx], altitude: e.target.value };
                                  setEditingTrek({ ...editingTrek, itinerary: days });
                                }}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                placeholder="9,800 Ft"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 mb-0.5">Meals Included</label>
                              <input
                                type="text"
                                value={day.meal || ""}
                                onChange={(e) => {
                                  const days = [...(editingTrek.itinerary || [])];
                                  days[idx] = { ...days[idx], meal: e.target.value };
                                  setEditingTrek({ ...editingTrek, itinerary: days });
                                }}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                placeholder="Packed Lunch, Dinner"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 mb-0.5">Overnight Stay</label>
                              <input
                                type="text"
                                value={day.stay || ""}
                                onChange={(e) => {
                                  const days = [...(editingTrek.itinerary || [])];
                                  days[idx] = { ...days[idx], stay: e.target.value };
                                  setEditingTrek({ ...editingTrek, itinerary: days });
                                }}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                placeholder="Tents at Chika"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: INCLUSIONS & EXCLUSIONS */}
                {modalTab === "inclusions" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Inclusions */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Inclusions
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingTrek({
                              ...editingTrek,
                              inclusions: [...(editingTrek.inclusions || []), ""],
                            })
                          }
                          className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Item
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(editingTrek.inclusions || []).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const next = [...(editingTrek.inclusions || [])];
                                next[idx] = e.target.value;
                                setEditingTrek({ ...editingTrek, inclusions: next });
                              }}
                              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                              placeholder="e.g. All vegetarian meals on trek"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = (editingTrek.inclusions || []).filter((_, i) => i !== idx);
                                setEditingTrek({ ...editingTrek, inclusions: next });
                              }}
                              className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exclusions */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                          <X className="w-4 h-4 text-rose-600" /> Exclusions
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingTrek({
                              ...editingTrek,
                              exclusions: [...(editingTrek.exclusions || []), ""],
                            })
                          }
                          className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Item
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(editingTrek.exclusions || []).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const next = [...(editingTrek.exclusions || [])];
                                next[idx] = e.target.value;
                                setEditingTrek({ ...editingTrek, exclusions: next });
                              }}
                              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                              placeholder="e.g. Personal gear and backpacks"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = (editingTrek.exclusions || []).filter((_, i) => i !== idx);
                                setEditingTrek({ ...editingTrek, exclusions: next });
                              }}
                              className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: FAQS */}
                {modalTab === "faqs" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-700">
                        {editingTrek.faqs?.length || 0} Questions & Answers
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const faqs = [...(editingTrek.faqs || [])];
                          faqs.push({ question: "", answer: "" });
                          setEditingTrek({ ...editingTrek, faqs });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F3A2E] text-white text-xs font-bold rounded-lg hover:bg-[#164e3f] transition"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Question
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(editingTrek.faqs || []).map((faq, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => {
                                const faqs = [...(editingTrek.faqs || [])];
                                faqs[idx] = { ...faqs[idx], question: e.target.value };
                                setEditingTrek({ ...editingTrek, faqs });
                              }}
                              className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                              placeholder={`Question ${idx + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const faqs = (editingTrek.faqs || []).filter((_, i) => i !== idx);
                                setEditingTrek({ ...editingTrek, faqs });
                              }}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={faq.answer}
                            onChange={(e) => {
                              const faqs = [...(editingTrek.faqs || [])];
                              faqs[idx] = { ...faqs[idx], answer: e.target.value };
                              setEditingTrek({ ...editingTrek, faqs });
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed"
                            placeholder="Provide a clear, helpful answer..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 bg-slate-50/50">
                <div className="text-xs text-slate-500 hidden sm:block">
                  Tab: <strong className="text-slate-800 capitalize">{modalTab}</strong>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-60"
                  >
                    {actionLoading ? "Saving..." : "Save All Changes"}
                  </button>
                </div>
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
