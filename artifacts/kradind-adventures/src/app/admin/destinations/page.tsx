"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Check,
  MapPin,
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  Layers,
  Globe,
  Compass,
  X,
  AlertCircle,
  Eye,
} from "lucide-react";
import { DestinationData } from "@/lib/cms-store";

const POPULAR_EMOJIS = ["🏔️", "🌲", "❄️", "🏰", "🌴", "🌊", "🇳🇵", "🏝️", "✈️", "🛕", "⛺", "📍"];
const CATEGORIES = ["All", "Domestic", "International", "Trek", "Heritage", "Beach", "Spiritual"];

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<DestinationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<DestinationData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [highlightsInput, setHighlightsInput] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchDestinations = async () => {
    try {
      const res = await fetch("/api/admin/destinations", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setDestinations(data);
      }
    } catch (err) {
      console.error("Failed to load destinations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleOpenAdd = () => {
    const defaultItem: DestinationData = {
      id: "",
      name: "",
      slug: "",
      category: "Domestic",
      tagline: "",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      badge: "Trending",
      highlights: [],
      color: "from-emerald-900/80",
      icon: "🏔️",
      status: "Published",
    };
    setEditingDestination(defaultItem);
    setHighlightsInput("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dest: DestinationData) => {
    setEditingDestination(dest);
    setHighlightsInput((dest.highlights || []).join(", "));
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    if (!editingDestination) return;
    const isNew = !editingDestination.id;
    const autoSlug = isNew
      ? name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
      : editingDestination.slug;

    setEditingDestination({
      ...editingDestination,
      name,
      slug: autoSlug,
      tagline: editingDestination.tagline || (name ? `Explore handpicked tours, treks, and holidays in ${name}.` : ""),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDestination || !editingDestination.name.trim()) return;

    setActionLoading(true);
    const isNew = !editingDestination.id;
    const url = "/api/admin/destinations";
    const method = isNew ? "POST" : "PUT";

    const cleanHighlights = highlightsInput
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

    const payload = {
      ...editingDestination,
      highlights: cleanHighlights,
      slug: editingDestination.slug
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, ""),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to save destination");
        setActionLoading(false);
        return;
      }

      showToast(isNew ? "✨ New destination created successfully!" : "✅ Destination updated successfully!");
      setIsModalOpen(false);
      setEditingDestination(null);
      fetchDestinations();
    } catch {
      alert("An error occurred while saving.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/destinations?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("🗑️ Destination removed.");
        setDeleteConfirmId(null);
        fetchDestinations();
      } else {
        alert("Failed to delete destination.");
      }
    } catch {
      alert("Error deleting destination.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (dest: DestinationData) => {
    const updatedStatus = dest.status === "Published" ? "Draft" : "Published";
    try {
      const res = await fetch("/api/admin/destinations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dest, status: updatedStatus }),
      });
      if (res.ok) {
        showToast(`${dest.name} marked as ${updatedStatus}`);
        fetchDestinations();
      }
    } catch {
      alert("Error toggling status.");
    }
  };

  // Filter and search
  const filtered = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dest.tagline && dest.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (dest.highlights && dest.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory =
      categoryFilter === "All" ||
      (dest.category && dest.category.toLowerCase() === categoryFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const totalCount = destinations.length;
  const publishedCount = destinations.filter((d) => d.status === "Published").length;
  const domesticCount = destinations.filter((d) => (d.category || "Domestic").toLowerCase() === "domestic").length;
  const internationalCount = destinations.filter((d) => (d.category || "").toLowerCase() === "international").length;

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F3A2E] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 border border-emerald-500/40">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <MapPin className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Destinations CMS</h1>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Add, update, or re-categorize holiday destinations. Destinations published here dynamically appear in the Header navigation dropdown and on the public /destinations directory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/destinations"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Page</span>
          </Link>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e05320] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Destination</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Destinations</div>
            <div className="text-xl font-black text-slate-900">{totalCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Published Live</div>
            <div className="text-xl font-black text-emerald-700">{publishedCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Domestic Circuits</div>
            <div className="text-xl font-black text-slate-900">{domesticCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">International</div>
            <div className="text-xl font-black text-slate-900">{internationalCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, slug or highlights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                categoryFilter === cat
                  ? "bg-[#0F3A2E] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations List */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
          Loading destinations...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="text-4xl">📍</div>
          <div className="text-sm font-bold text-slate-700">No destinations found</div>
          <p className="text-xs text-slate-500">
            {searchQuery ? "Try refining your search query." : "Click 'Add Destination' above to create your first one."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((dest) => (
            <div
              key={dest.id || dest.slug}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image Preview Banner */}
                <div className="relative h-40 w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={dest.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/95 text-slate-900 px-2.5 py-1 rounded-full shadow-xs">
                      {dest.badge || dest.category || "Dest"}
                    </span>

                    <button
                      onClick={() => handleToggleStatus(dest)}
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs transition cursor-pointer ${
                        dest.status === "Published"
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-amber-500 text-white hover:bg-amber-600"
                      }`}
                      title="Click to toggle status"
                    >
                      {dest.status === "Published" ? "● Live" : "○ Draft"}
                    </button>
                  </div>

                  {/* Bottom Image Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{dest.icon || "📍"}</span>
                      <div>
                        <h3 className="font-extrabold text-base leading-tight drop-shadow-sm">{dest.name}</h3>
                        <span className="text-[11px] text-slate-300">/destinations/{dest.slug}</span>
                      </div>
                    </div>

                    <Link
                      href={`/destinations/${dest.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 backdrop-blur-xs text-white transition"
                      title="Preview public page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dest.tagline || "No tagline configured."}
                  </p>

                  {/* Highlights Tags */}
                  {dest.highlights && dest.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {dest.highlights.slice(0, 4).map((h, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md"
                        >
                          {h}
                        </span>
                      ))}
                      {dest.highlights.length > 4 && (
                        <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                          +{dest.highlights.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500">
                  Category: <span className="font-bold text-slate-800">{dest.category || "Domestic"}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(dest)}
                    className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                    title="Edit Destination"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(dest.id || dest.slug)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Destination"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">Delete Destination?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete this destination? It will be removed from the Header navigation and public directory.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={actionLoading}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition disabled:opacity-50"
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && editingDestination && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <MapPin className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    {editingDestination.id ? "Edit Destination" : "Add New Destination"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configure details for navbar dropdown and destinations pages.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Destination Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Destination Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Meghalaya, Bali, Spiti"
                    value={editingDestination.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15 transition font-semibold"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">URL Slug *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., meghalaya, bali"
                    value={editingDestination.slug}
                    onChange={(e) =>
                      setEditingDestination({
                        ...editingDestination,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15 transition font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Route: /destinations/{editingDestination.slug || "slug"}</span>
                </div>
              </div>

              {/* Emoji Icon & Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Emoji Icon */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Icon / Emoji</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={editingDestination.icon || "📍"}
                      onChange={(e) =>
                        setEditingDestination({ ...editingDestination, icon: e.target.value })
                      }
                      className="w-16 px-2 py-2 text-center text-base rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35]"
                    />
                    <div className="flex items-center gap-1 overflow-x-auto py-1">
                      {POPULAR_EMOJIS.slice(0, 6).map((emo) => (
                        <button
                          key={emo}
                          type="button"
                          onClick={() => setEditingDestination({ ...editingDestination, icon: emo })}
                          className="p-1 text-sm hover:bg-slate-100 rounded-md transition"
                        >
                          {emo}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={editingDestination.category || "Domestic"}
                    onChange={(e) =>
                      setEditingDestination({ ...editingDestination, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] font-semibold bg-white"
                  >
                    <option value="Domestic">Domestic</option>
                    <option value="International">International</option>
                    <option value="Trek">Trek / Mountains</option>
                    <option value="Heritage">Heritage & Forts</option>
                    <option value="Beach">Beach & Coastal</option>
                    <option value="Spiritual">Spiritual & Pilgrimage</option>
                  </select>
                </div>

                {/* Badge */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. Most Popular, Trending"
                    value={editingDestination.badge || ""}
                    onChange={(e) =>
                      setEditingDestination({ ...editingDestination, badge: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] font-medium"
                  />
                </div>
              </div>

              {/* Tagline / Subtitle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tagline / Short Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Land of Gods, Sacred Rivers & Snowy Peaks"
                  value={editingDestination.tagline}
                  onChange={(e) =>
                    setEditingDestination({ ...editingDestination, tagline: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] transition"
                />
              </div>

              {/* Highlights */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Key Highlights / Attractions (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cherrapunji, Living Root Bridge, Dawki River, Mawlynnong"
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] transition"
                />
              </div>

              {/* Image URL & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Cover Image URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={editingDestination.image}
                    onChange={(e) =>
                      setEditingDestination({ ...editingDestination, image: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] transition font-mono text-[11px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Publish Status</label>
                  <select
                    value={editingDestination.status}
                    onChange={(e) =>
                      setEditingDestination({
                        ...editingDestination,
                        status: e.target.value as "Published" | "Draft",
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] font-bold bg-white"
                  >
                    <option value="Published">🟢 Published (Live)</option>
                    <option value="Draft">🟡 Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Live Preview Card */}
              {editingDestination.name && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Dropdown & Card Preview
                  </span>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 text-xl">
                      {editingDestination.icon || "📍"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 truncate">
                          {editingDestination.name}
                        </span>
                        {editingDestination.badge && (
                          <span className="text-[9px] font-bold bg-[#FF6B35] text-white px-2 py-0.5 rounded-full">
                            {editingDestination.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 truncate block">
                        {editingDestination.tagline || "Tagline appears here..."}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 text-xs font-extrabold bg-[#0F3A2E] hover:bg-[#154d3d] text-white rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-50"
                >
                  {actionLoading ? "Saving..." : editingDestination.id ? "Update Destination" : "Publish Destination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
