"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Search,
  Layers,
  Clock,
  Tag,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  Eye,
  CheckCircle2,
  XCircle,
  Calendar,
  Phone,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { LandingPageData, TrekData } from "@/lib/cms-store";

const DEFAULT_NEW_PAGE: LandingPageData = {
  id: "",
  slug: "",
  title: "",
  subtitle: "Join India's most certified high-altitude expedition team for a breathtaking mountain experience.",
  badge: "EXCLUSIVE EXPEDITION 2026",
  heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85",
  promoOffer: {
    tag: "EARLY BIRD SPECIAL",
    discountText: "Save ₹2,500 on Next 10 Bookings",
    code: "SUMMIT2026",
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  highlights: [
    { title: "Wilderness First Aid Certified", desc: "Every batch led by WFA-trained guides equipped with pulse oximeters and oxygen cylinders.", icon: "Shield" },
    { title: "Eco-Conscious Trekking", desc: "Strict leave-no-trace protocol with bio-degradable waste disposal and eco-camps.", icon: "Compass" },
    { title: "Chef-Crafted Hot Meals", desc: "Fresh, high-carbohydrate nutrition planned specifically for rapid high-altitude acclimatization.", icon: "Coffee" },
    { title: "Triple-Layer Four-Season Tents", desc: "Tested waterproof dome tents and sub-zero rated sleeping bags for maximum warmth.", icon: "Tent" },
  ],
  featuredTrekSlugs: ["kedarkantha-winter-summit"],
  inclusions: [
    "Certified Wilderness First Responder (WFR) Trek Leaders",
    "All Meals: Breakfast, trail lunches, evening tea/snacks, and nutritious dinners",
    "High-altitude 4-season alpine tents and sub-zero sleeping bags with liners",
    "Safety kit: Oxygen cylinders, pulse oximeter, medical stretchers, and emergency walkie-talkies",
    "Microspikes and gaiters for snow/ice terrain",
    "Forest entry permits, camping fees, and environmental charges",
  ],
  exclusions: [
    "Personal porter or mule charges for backpack offloading",
    "Transportation from home city to base camp (can be arranged on request)",
    "Personal insurance and expenses of personal nature",
  ],
  leadFormConfig: {
    title: "Secure Your Slot & Exclusive Dossier",
    subtitle: "Limited to 15 trekkers per batch. Leave your phone number to receive instant WhatsApp itinerary & discounted price breakdown.",
    ctaText: "Get Instant Quote & PDF",
  },
  whatsappNumber: "917500222141",
  whatsappMessage: "Hi KRADIND Adventures! I'm interested in booking the exclusive expedition. Please share available dates and slots.",
  faqs: [
    { question: "Is this expedition beginner-friendly?", answer: "Yes! Our itineraries are designed with gradual acclimatization days and certified support staff, making it accessible to first-time fit trekkers." },
    { question: "What gear will KRADIND provide?", answer: "We provide high-altitude four-season tents, sub-zero sleeping bags, crampons/microspikes, gaiters, and dining tents. You only need personal clothing and sturdy trekking shoes." },
    { question: "What safety equipment is carried?", answer: "Each expedition carries medical oxygen cylinders, fingertip pulse oximeters, automated BP monitors, and emergency medical kits." },
  ],
  testimonials: [
    { name: "Aarav Sharma", city: "Bengaluru", text: "Summit day was pure magic! The trek leader kept our safety first and the warm meals at 10,000 ft were incredible.", rating: 5, batch: "Jan 2026 Batch" },
    { name: "Priyanka Desai", city: "Mumbai", text: "Best expedition company hands down. Equipment was top tier and the pre-trek coordination was smooth as butter.", rating: 5, batch: "Feb 2026 Batch" },
  ],
  status: "Published",
  sectionsEnabled: {
    hero: true,
    countdown: true,
    highlights: true,
    treks: true,
    inclusions: true,
    leadForm: true,
    testimonials: true,
    faqs: true,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function AdminLandingPagesPage() {
  const [pages, setPages] = useState<LandingPageData[]>([]);
  const [availableTreks, setAvailableTreks] = useState<TrekData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal editor states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<LandingPageData | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "promo" | "sections" | "highlights" | "inclusions" | "form" | "faqs">("overview");
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pagesRes, treksRes] = await Promise.all([
        fetch("/api/admin/landing-pages"),
        fetch("/api/admin/treks"),
      ]);

      if (pagesRes.ok) {
        const pData = await pagesRes.json();
        setPages(pData);
      }
      if (treksRes.ok) {
        const tData = await treksRes.json();
        setAvailableTreks(tData);
      }
    } catch (err) {
      console.error(err);
      showToast("Error loading landing pages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPages = useMemo(() => {
    if (!search.trim()) return pages;
    const s = search.toLowerCase();
    return pages.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.slug.toLowerCase().includes(s) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(s))
    );
  }, [pages, search]);

  const handleOpenAdd = () => {
    setEditingPage({
      ...DEFAULT_NEW_PAGE,
      id: "",
      slug: `expedition-${Date.now().toString().slice(-4)}`,
      title: "New Himalayan Expedition Campaign",
    });
    setActiveTab("overview");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (page: LandingPageData) => {
    setEditingPage(JSON.parse(JSON.stringify(page)));
    setActiveTab("overview");
    setIsModalOpen(true);
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    if (!editingPage.title.trim() || !editingPage.slug.trim()) {
      alert("Title and Slug are required!");
      return;
    }

    setActionLoading(true);
    const isNew = !editingPage.id;
    const url = isNew ? "/api/admin/landing-pages" : `/api/admin/landing-pages/${editingPage.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPage),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to save landing page");
        setActionLoading(false);
        return;
      }

      showToast(isNew ? "Landing Page created successfully!" : "Landing Page updated successfully!");
      setIsModalOpen(false);
      setEditingPage(null);
      fetchData();
    } catch {
      alert("Network error while saving landing page");
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickToggleStatus = async (page: LandingPageData) => {
    const newStatus = page.status === "Published" ? "Draft" : "Published";
    try {
      const res = await fetch(`/api/admin/landing-pages/${page.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...page, status: newStatus }),
      });
      if (res.ok) {
        setPages((prev) =>
          prev.map((p) => (p.id === page.id ? { ...p, status: newStatus } : p))
        );
        showToast(`Landing page status changed to ${newStatus}`);
      }
    } catch {
      alert("Error toggling status");
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/landing-pages/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Landing page deleted");
        setDeleteConfirmId(null);
        setPages((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete landing page");
      }
    } catch {
      alert("Error deleting landing page");
    } finally {
      setActionLoading(false);
    }
  };

  const copyUrl = (slug: string, id: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${origin}/lp/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F3A2E] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500/40 text-sm animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#FF6B35] uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            <span>High-Conversion Funnels</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Landing Pages & Expedition Campaigns
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Create and deploy dedicated landing pages with custom countdown offers, lead capture forms, and state-of-the-art Himalayan themes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#0F3A2E] to-emerald-800 text-white text-sm font-semibold shadow-md shadow-emerald-950/20 hover:brightness-110 active:scale-95 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Landing Page</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Campaigns</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{pages.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Dynamic pages in CMS</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Published</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {pages.filter((p) => p.status === "Published").length}
          </div>
          <div className="text-[11px] text-emerald-700/70 mt-0.5">Live on public URLs</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Draft Funnels</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {pages.filter((p) => p.status === "Draft").length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Hidden from public</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Treks</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{availableTreks.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Ready for campaign linking</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search landing pages by title or slug (e.g. kedarkantha, winter, summit)..."
          className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-xs text-slate-400 hover:text-slate-600 font-medium">
            Clear
          </button>
        )}
      </div>

      {/* Landing Pages Grid */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-emerald-700 border-t-transparent rounded-full mb-3"></div>
          <div className="text-sm font-medium text-slate-600">Loading landing pages...</div>
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No landing pages found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search ? "No results match your query." : "Click below to create your first dynamic campaign landing page."}
          </p>
          {!search && (
            <button
              onClick={handleOpenAdd}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F3A2E] text-white text-xs font-semibold shadow-sm hover:brightness-110"
            >
              <Plus className="w-3.5 h-3.5" /> Create Landing Page
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPages.map((page) => (
            <div
              key={page.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              {/* Top Banner / Image */}
              <div>
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={page.heroImage || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"}
                    alt={page.title}
                    fill
                    className="object-cover opacity-80 group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                  {/* Badges on Banner */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-black/60 backdrop-blur-md text-[#FF6B35] border border-[#FF6B35]/30">
                      {page.badge || "EXPEDITION"}
                    </span>

                    <button
                      onClick={() => handleQuickToggleStatus(page)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase transition border backdrop-blur-md ${
                        page.status === "Published"
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900"
                          : "bg-amber-950/80 text-amber-300 border-amber-500/40 hover:bg-amber-900"
                      }`}
                    >
                      {page.status}
                    </button>
                  </div>

                  {/* Title on Banner */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h2 className="text-lg font-black text-white leading-tight line-clamp-1">
                      {page.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-300 font-mono">
                      <span>/lp/{page.slug}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content & Stats */}
                <div className="p-5 space-y-4">
                  {/* Subtitle */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {page.subtitle}
                  </p>

                  {/* Promo Banner if present */}
                  {page.promoOffer?.discountText && (
                    <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-amber-900 font-semibold truncate">
                        <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{page.promoOffer.discountText}</span>
                      </div>
                      <span className="font-mono text-[10px] font-bold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded">
                        {page.promoOffer.code}
                      </span>
                    </div>
                  )}

                  {/* Configuration Pills */}
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Layers className="w-3 h-3 text-slate-400" />
                      <strong>{page.highlights?.length || 0}</strong> Highlights
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 className="w-3 h-3 text-slate-400" />
                      <strong>{page.inclusions?.length || 0}</strong> Inclusions
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <HelpCircle className="w-3 h-3 text-slate-400" />
                      <strong>{page.faqs?.length || 0}</strong> FAQs
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <MessageSquare className="w-3 h-3 text-slate-400" />
                      <strong>{page.testimonials?.length || 0}</strong> Reviews
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/lp/${page.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Page</span>
                  </Link>

                  <button
                    onClick={() => copyUrl(page.slug, page.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition"
                    title="Copy full public URL"
                  >
                    {copiedId === page.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Link</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(page)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition"
                    title="Edit Campaign"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(page.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Delete Landing Page"
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
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Landing Page?</h3>
            <p className="text-xs text-slate-500 mt-1">
              This will permanently remove this landing page and all its custom sections. This action cannot be undone.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                disabled={actionLoading}
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition"
              >
                {actionLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Modal Editor for Landing Page */}
      {isModalOpen && editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50 rounded-t-2xl">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FF6B35]" />
                  <span>{editingPage.id ? "Edit Landing Page" : "Create New Landing Page"}</span>
                </h2>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  /lp/{editingPage.slug || "custom-slug"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePage}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F3A2E] hover:brightness-110 shadow-sm transition"
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="px-6 border-b border-slate-200 bg-white flex overflow-x-auto gap-1 text-xs shrink-0 py-2">
              {[
                { id: "overview", label: "Overview & Hero" },
                { id: "promo", label: "Promo & Countdown" },
                { id: "sections", label: "Section Visibility" },
                { id: "highlights", label: "Highlights & Treks" },
                { id: "inclusions", label: "Inclusions" },
                { id: "form", label: "Lead Form & WhatsApp" },
                { id: "faqs", label: "FAQs & Reviews" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 font-semibold rounded-lg whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? "bg-[#0F3A2E] text-emerald-300"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body / Tab Panes */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              
              {/* TAB 1: OVERVIEW & HERO */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Campaign Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingPage.title}
                        onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                        placeholder="e.g. Kedarkantha Winter Summit Expedition"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        URL Slug <span className="text-rose-500">*</span> (e.g. kedarkantha-winter)
                      </label>
                      <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:border-emerald-600">
                        <span className="bg-slate-100 px-3 py-2 text-slate-500 text-xs border-r border-slate-300 font-mono">
                          /lp/
                        </span>
                        <input
                          type="text"
                          value={editingPage.slug}
                          onChange={(e) =>
                            setEditingPage({
                              ...editingPage,
                              slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                            })
                          }
                          placeholder="kedarkantha-winter"
                          className="w-full px-3 py-2 text-xs font-mono focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tagline</label>
                    <input
                      type="text"
                      value={editingPage.badge || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, badge: e.target.value })}
                      placeholder="e.g. EXCLUSIVE EXPEDITION 2026"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Summary</label>
                    <textarea
                      rows={3}
                      value={editingPage.subtitle}
                      onChange={(e) => setEditingPage({ ...editingPage, subtitle: e.target.value })}
                      placeholder="Compelling subheading explaining the expedition experience..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hero Image URL</label>
                    <input
                      type="text"
                      value={editingPage.heroImage}
                      onChange={(e) => setEditingPage({ ...editingPage, heroImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none font-mono text-xs"
                    />
                    {editingPage.heroImage && (
                      <div className="mt-2 relative h-32 rounded-xl overflow-hidden border border-slate-200">
                        <Image
                          src={editingPage.heroImage}
                          alt="Hero preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Publish Status</label>
                    <select
                      value={editingPage.status}
                      onChange={(e) =>
                        setEditingPage({ ...editingPage, status: e.target.value as "Published" | "Draft" })
                      }
                      className="px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none font-medium text-xs"
                    >
                      <option value="Published">Published (Publicly Accessible)</option>
                      <option value="Draft">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* TAB 2: PROMO & COUNTDOWN */}
              {activeTab === "promo" && (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                    <p className="font-bold mb-1">Urgency & Offer Widget</p>
                    This generates an animated countdown banner on top of the landing page to drive higher lead conversion.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Promo Tag</label>
                      <input
                        type="text"
                        value={editingPage.promoOffer?.tag || ""}
                        onChange={(e) =>
                          setEditingPage({
                            ...editingPage,
                            promoOffer: {
                              ...editingPage.promoOffer!,
                              tag: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. LIMITED TIME OFFER"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Discount Headline</label>
                      <input
                        type="text"
                        value={editingPage.promoOffer?.discountText || ""}
                        onChange={(e) =>
                          setEditingPage({
                            ...editingPage,
                            promoOffer: {
                              ...editingPage.promoOffer!,
                              discountText: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. Save Flat ₹2,500 on Next 10 Bookings"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Promo Coupon Code</label>
                      <input
                        type="text"
                        value={editingPage.promoOffer?.code || ""}
                        onChange={(e) =>
                          setEditingPage({
                            ...editingPage,
                            promoOffer: {
                              ...editingPage.promoOffer!,
                              code: e.target.value.toUpperCase(),
                            },
                          })
                        }
                        placeholder="e.g. SUMMIT2026"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Offer Expiry Date (ISO)</label>
                      <input
                        type="text"
                        value={editingPage.promoOffer?.expiryDate || ""}
                        onChange={(e) =>
                          setEditingPage({
                            ...editingPage,
                            promoOffer: {
                              ...editingPage.promoOffer!,
                              expiryDate: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. 2026-10-31T23:59:59Z"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SECTION VISIBILITY */}
              {activeTab === "sections" && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">
                    Control which sections render on this landing page. You can customize the page experience according to campaign goals.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(editingPage.sectionsEnabled).map(([sectionKey, isEnabled]) => (
                      <label
                        key={sectionKey}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                          isEnabled
                            ? "bg-emerald-50/50 border-emerald-300 text-emerald-950 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-500"
                        }`}
                      >
                        <span className="capitalize">{sectionKey} Section</span>
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={(e) =>
                            setEditingPage({
                              ...editingPage,
                              sectionsEnabled: {
                                ...editingPage.sectionsEnabled,
                                [sectionKey]: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: HIGHLIGHTS & TREKS */}
              {activeTab === "highlights" && (
                <div className="space-y-6">
                  {/* Featured Trek Select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Featured Treks (Select treks to display booking cards on LP)
                    </label>
                    <div className="space-y-2 border border-slate-200 rounded-xl p-3 max-h-48 overflow-y-auto">
                      {availableTreks.map((t) => {
                        const isSelected = editingPage.featuredTrekSlugs?.includes(t.slug);
                        return (
                          <label
                            key={t.slug}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition ${
                              isSelected ? "bg-emerald-100/60 font-semibold text-emerald-900" : "hover:bg-slate-100"
                            }`}
                          >
                            <div>
                              <span>{t.name}</span>
                              <span className="text-slate-400 ml-2 font-mono">({t.location} - ₹{t.price})</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const current = editingPage.featuredTrekSlugs || [];
                                const updated = e.target.checked
                                  ? [...current, t.slug]
                                  : current.filter((s) => s !== t.slug);
                                setEditingPage({ ...editingPage, featuredTrekSlugs: updated });
                              }}
                              className="w-4 h-4 text-emerald-600 rounded"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Highlights List */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700">Campaign Value Highlights</label>
                      <button
                        type="button"
                        onClick={() => {
                          const list = editingPage.highlights || [];
                          setEditingPage({
                            ...editingPage,
                            highlights: [
                              ...list,
                              { title: "New Feature Highlight", desc: "Description of safety, food, or gear advantage." },
                            ],
                          });
                        }}
                        className="text-xs text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Highlight
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(editingPage.highlights || []).map((hl, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={hl.title}
                              onChange={(e) => {
                                const copy = [...editingPage.highlights];
                                copy[idx].title = e.target.value;
                                setEditingPage({ ...editingPage, highlights: copy });
                              }}
                              placeholder="Highlight Title"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-semibold text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const copy = editingPage.highlights.filter((_, i) => i !== idx);
                                setEditingPage({ ...editingPage, highlights: copy });
                              }}
                              className="text-rose-500 hover:text-rose-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={hl.desc}
                            onChange={(e) => {
                              const copy = [...editingPage.highlights];
                              copy[idx].desc = e.target.value;
                              setEditingPage({ ...editingPage, highlights: copy });
                            }}
                            placeholder="Detailed description..."
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: INCLUSIONS */}
              {activeTab === "inclusions" && (
                <div className="space-y-6">
                  {/* Inclusions */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700">What is Included</label>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPage({
                            ...editingPage,
                            inclusions: [...(editingPage.inclusions || []), "High-quality mountain inclusion item"],
                          });
                        }}
                        className="text-xs text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Inclusion
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(editingPage.inclusions || []).map((inc, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={inc}
                            onChange={(e) => {
                              const copy = [...editingPage.inclusions];
                              copy[idx] = e.target.value;
                              setEditingPage({ ...editingPage, inclusions: copy });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const copy = editingPage.inclusions.filter((_, i) => i !== idx);
                              setEditingPage({ ...editingPage, inclusions: copy });
                            }}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exclusions */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700">Exclusions</label>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPage({
                            ...editingPage,
                            exclusions: [...(editingPage.exclusions || []), "Personal expenses / transport to basecamp"],
                          });
                        }}
                        className="text-xs text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Exclusion
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(editingPage.exclusions || []).map((exc, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={exc}
                            onChange={(e) => {
                              const copy = [...editingPage.exclusions!];
                              copy[idx] = e.target.value;
                              setEditingPage({ ...editingPage, exclusions: copy });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const copy = editingPage.exclusions!.filter((_, i) => i !== idx);
                              setEditingPage({ ...editingPage, exclusions: copy });
                            }}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: LEAD FORM & WHATSAPP */}
              {activeTab === "form" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Form Heading</label>
                      <input
                        type="text"
                        value={editingPage.leadFormConfig.title}
                        onChange={(e) =>
                          setEditingPage({
                            ...editingPage,
                            leadFormConfig: { ...editingPage.leadFormConfig, title: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Submit Button CTA Text</label>
                      <input
                        type="text"
                        value={editingPage.leadFormConfig.ctaText}
                        onChange={(e) =>
                          setEditingPage({
                            ...editingPage,
                            leadFormConfig: { ...editingPage.leadFormConfig, ctaText: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Form Subtitle</label>
                    <textarea
                      rows={2}
                      value={editingPage.leadFormConfig.subtitle}
                      onChange={(e) =>
                        setEditingPage({
                          ...editingPage,
                          leadFormConfig: { ...editingPage.leadFormConfig, subtitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Direct Number</label>
                      <input
                        type="text"
                        value={editingPage.whatsappNumber || ""}
                        onChange={(e) => setEditingPage({ ...editingPage, whatsappNumber: e.target.value })}
                        placeholder="e.g. 917500222141"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Default Message</label>
                      <input
                        type="text"
                        value={editingPage.whatsappMessage || ""}
                        onChange={(e) => setEditingPage({ ...editingPage, whatsappMessage: e.target.value })}
                        placeholder="Hi KRADIND! I want to book..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: FAQS & REVIEWS */}
              {activeTab === "faqs" && (
                <div className="space-y-6">
                  {/* FAQs */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700">Frequently Asked Questions</label>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPage({
                            ...editingPage,
                            faqs: [
                              ...(editingPage.faqs || []),
                              { question: "What is the cancellation policy?", answer: "Full refund up to 15 days before batch start." },
                            ],
                          });
                        }}
                        className="text-xs text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add FAQ
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(editingPage.faqs || []).map((faq, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => {
                                const copy = [...editingPage.faqs!];
                                copy[idx].question = e.target.value;
                                setEditingPage({ ...editingPage, faqs: copy });
                              }}
                              placeholder="Question"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-semibold text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const copy = editingPage.faqs!.filter((_, i) => i !== idx);
                                setEditingPage({ ...editingPage, faqs: copy });
                              }}
                              className="text-rose-500 hover:text-rose-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={faq.answer}
                            onChange={(e) => {
                              const copy = [...editingPage.faqs!];
                              copy[idx].answer = e.target.value;
                              setEditingPage({ ...editingPage, faqs: copy });
                            }}
                            placeholder="Answer..."
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Testimonials */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700">Trekker Testimonials</label>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPage({
                            ...editingPage,
                            testimonials: [
                              ...(editingPage.testimonials || []),
                              { name: "Rohit Verma", city: "Delhi NCR", text: "Exceptional experience with great leaders!", rating: 5, batch: "Recent Batch" },
                            ],
                          });
                        }}
                        className="text-xs text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Review
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(editingPage.testimonials || []).map((test, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={test.name}
                              onChange={(e) => {
                                const copy = [...editingPage.testimonials!];
                                copy[idx].name = e.target.value;
                                setEditingPage({ ...editingPage, testimonials: copy });
                              }}
                              placeholder="Name"
                              className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                            />
                            <input
                              type="text"
                              value={test.city}
                              onChange={(e) => {
                                const copy = [...editingPage.testimonials!];
                                copy[idx].city = e.target.value;
                                setEditingPage({ ...editingPage, testimonials: copy });
                              }}
                              placeholder="City"
                              className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                            />
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={test.batch}
                                onChange={(e) => {
                                  const copy = [...editingPage.testimonials!];
                                  copy[idx].batch = e.target.value;
                                  setEditingPage({ ...editingPage, testimonials: copy });
                                }}
                                placeholder="Batch (e.g. Dec 2025)"
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = editingPage.testimonials!.filter((_, i) => i !== idx);
                                  setEditingPage({ ...editingPage, testimonials: copy });
                                }}
                                className="text-rose-500 hover:text-rose-700 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <textarea
                            rows={2}
                            value={test.text}
                            onChange={(e) => {
                              const copy = [...editingPage.testimonials!];
                              copy[idx].text = e.target.value;
                              setEditingPage({ ...editingPage, testimonials: copy });
                            }}
                            placeholder="Review content..."
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50 rounded-b-2xl">
              <div className="text-xs text-slate-400">
                Created: {new Date(editingPage.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/60"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSavePage}
                  disabled={actionLoading}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0F3A2E] hover:brightness-110 rounded-xl shadow-sm transition"
                >
                  {actionLoading ? "Saving..." : "Save Landing Page"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
