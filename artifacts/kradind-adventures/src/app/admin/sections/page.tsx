"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  Sliders,
  CloudRain,
  PhoneCall,
  Save,
  ExternalLink,
  ShieldCheck,
  Award,
  HelpCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Share2,
  Compass,
  Activity,
  HeartHandshake,
  Mountain,
  Zap,
  Globe,
  MessageSquare,
  Clock,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { HomeSectionsConfig, SectionFaqItem, TrustSignalItem, TrekData } from "@/lib/cms-store";
import { ImageUploader } from "@/components/admin/image-uploader";

type SectionTab = "topBar" | "hero" | "monsoon" | "treks" | "eeat" | "footer";

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<HomeSectionsConfig | null>(null);
  const [treks, setTreks] = useState<TrekData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SectionTab>("hero");
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchData = async () => {
    try {
      const [secRes, treksRes] = await Promise.all([
        fetch("/api/admin/sections", { cache: "no-store" }),
        fetch("/api/admin/treks", { cache: "no-store" }),
      ]);

      if (secRes.ok) {
        setSections(await secRes.json());
      }
      if (treksRes.ok) {
        setTreks(await treksRes.json());
      }
    } catch (err) {
      console.error("Failed to load sections data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (sectionName?: string) => {
    if (!sections) return;
    setSavingSection(sectionName || activeTab);

    try {
      const res = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sections),
      });

      if (res.ok) {
        const updated = await res.json();
        setSections(updated);
        showToast(
          sectionName
            ? `✅ ${sectionName.toUpperCase()} section saved and live!`
            : `✅ Changes saved successfully to live website!`
        );
      } else {
        const err = await res.json().catch(() => null);
        alert(err?.error || "Failed to save section changes.");
      }
    } catch {
      alert("Network error while saving section.");
    } finally {
      setSavingSection(null);
    }
  };

  // FAQ helpers
  const handleAddFaq = () => {
    if (!sections) return;
    const currentFaqs = sections.eeat?.faqs || [];
    const newFaqs: SectionFaqItem[] = [
      ...currentFaqs,
      {
        q: "New question about trekking with KRADIND?",
        a: "Provide a clear, reassuring, and detailed answer for your trekkers here.",
      },
    ];

    setSections({
      ...sections,
      eeat: {
        ...(sections.eeat || ({} as any)),
        faqs: newFaqs,
      },
    });
  };

  const handleUpdateFaq = (index: number, field: "q" | "a", value: string) => {
    if (!sections) return;
    const currentFaqs = [...(sections.eeat?.faqs || [])];
    if (!currentFaqs[index]) return;
    currentFaqs[index] = { ...currentFaqs[index], [field]: value };

    setSections({
      ...sections,
      eeat: {
        ...(sections.eeat || ({} as any)),
        faqs: currentFaqs,
      },
    });
  };

  const handleDeleteFaq = (index: number) => {
    if (!sections) return;
    const currentFaqs = (sections.eeat?.faqs || []).filter((_, i) => i !== index);
    setSections({
      ...sections,
      eeat: {
        ...(sections.eeat || ({} as any)),
        faqs: currentFaqs,
      },
    });
  };

  const handleMoveFaq = (index: number, direction: "up" | "down") => {
    if (!sections) return;
    const currentFaqs = [...(sections.eeat?.faqs || [])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentFaqs.length) return;

    const temp = currentFaqs[index];
    currentFaqs[index] = currentFaqs[targetIndex];
    currentFaqs[targetIndex] = temp;

    setSections({
      ...sections,
      eeat: {
        ...(sections.eeat || ({} as any)),
        faqs: currentFaqs,
      },
    });
  };

  // Popular tags helper
  const handlePopularTagsChange = (val: string) => {
    if (!sections) return;
    const tags = val
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setSections({
      ...sections,
      hero: { ...sections.hero, popularTags: tags },
    });
  };

  if (loading || !sections) {
    return (
      <div className="space-y-6 animate-pulse max-w-5xl">
        <div className="h-8 bg-slate-200 rounded-lg w-64" />
        <div className="h-12 bg-slate-200 rounded-xl w-full" />
        <div className="h-96 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  const tabs = [
    { id: "hero" as SectionTab, label: "Hero & Banner", icon: Sparkles, desc: "Tagline, title & background" },
    { id: "topBar" as SectionTab, label: "Top Bar & Helpline", icon: PhoneCall, desc: "Helpline & badges" },
    { id: "monsoon" as SectionTab, label: "Monsoon & Offers", icon: CloudRain, desc: "Promo coupons & discounts" },
    { id: "treks" as SectionTab, label: "Featured & Weekend", icon: Mountain, desc: "Homepage showcase curations" },
    { id: "eeat" as SectionTab, label: "Authority & FAQs", icon: ShieldCheck, desc: "Curation byline & FAQs" },
    { id: "footer" as SectionTab, label: "Footer & Social", icon: Globe, desc: "Contact info & social links" },
  ];

  return (
    <div className="space-y-6 max-w-6xl pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F3A2E] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in border border-emerald-500/40">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span>Complete Website Section CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Edit Every Website Section
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fine-tune any content block, header, trust signal, or FAQ. Changes publish directly to the live site.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition shadow-xs"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => handleSave()}
            disabled={Boolean(savingSection)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold rounded-xl transition shadow-md disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{savingSection ? "Saving Live..." : "Save All Changes"}</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-slate-200/70 p-1.5 rounded-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl text-center transition-all ${
                isActive
                  ? "bg-white text-slate-900 shadow-md font-bold scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-[#0F3A2E]" : "text-slate-500"}`} />
                <span className="text-xs">{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HERO SECTION */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#0F3A2E] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Hero Banner &amp; Primary Value Proposition</h2>
                <p className="text-xs text-slate-500">The main banner visitors see at the top of the homepage</p>
              </div>
            </div>
            <button
              onClick={() => handleSave("hero")}
              disabled={savingSection === "hero"}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingSection === "hero" ? "Saving..." : "Save Hero"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Top Badge Pill Tagline</label>
              <input
                type="text"
                value={sections.hero.badge || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    hero: { ...sections.hero, badge: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                placeholder="Certified Himalayan Guides • Small Safe Batches"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Displays inside the small glowing pill above the main heading</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Hero Title (H1 Heading)</label>
              <input
                type="text"
                value={sections.hero.title || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    hero: { ...sections.hero, title: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                placeholder="Experience the Himalayas"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Hero Subtitle Description</label>
              <textarea
                rows={3}
                value={sections.hero.subtitle || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    hero: { ...sections.hero, subtitle: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none leading-relaxed"
                placeholder="Explore handpicked Himalayan treks, tropical road trips, and sacred pilgrimages..."
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Search Placeholder Text</label>
              <input
                type="text"
                value={sections.hero.searchPlaceholder || "Search by trek name, state, pass or elevation..."}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    hero: { ...sections.hero, searchPlaceholder: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Quick Search Popular Tags (Comma-separated)</label>
              <input
                type="text"
                value={(sections.hero.popularTags || []).join(", ")}
                onChange={(e) => handlePopularTagsChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-medium"
                placeholder="Kedarkantha, Chopta Tungnath, Hampta Pass, Spiti, Leh Ladakh"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Trekkers can click these tags in the search widget for 1-tap filtering</span>
            </div>

            <div className="pt-2">
              <ImageUploader
                mode="single"
                value={sections.hero.bgImage}
                onChange={(url) =>
                  setSections({
                    ...sections,
                    hero: { ...sections.hero, bgImage: url },
                  })
                }
                alt={sections.hero.imageAlt || ""}
                onAltChange={(alt) =>
                  setSections({
                    ...sections,
                    hero: { ...sections.hero, imageAlt: alt },
                  })
                }
                altPlaceholder="Domestic and international tour packages by KRAD Global in Dehradun"
                label="Hero Background Photo"
                description="Full-bleed backdrop photo. We recommend 1920x1080px or higher for crisp display."
                aspect="banner"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOP BAR & EMERGENCY HELPLINE */}
      {activeTab === "topBar" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                <PhoneCall className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Top Header Bar &amp; Ground Support</h2>
                <p className="text-xs text-slate-500">Emergency support phone, WhatsApp link, and eco operator badge</p>
              </div>
            </div>
            <button
              onClick={() => handleSave("topBar")}
              disabled={savingSection === "topBar"}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingSection === "topBar" ? "Saving..." : "Save Top Bar"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">24/7 Ground Helpline Phone</label>
              <input
                type="text"
                value={sections.topBar.supportPhone || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    topBar: { ...sections.topBar, supportPhone: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900"
                placeholder="+91 75002 22141"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Official WhatsApp Number</label>
              <input
                type="text"
                value={sections.topBar.whatsappNumber || "+91 75002 22141"}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    topBar: { ...sections.topBar, whatsappNumber: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-emerald-700"
                placeholder="+91 75002 22141"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5">Eco Operator Badge Text</label>
              <input
                type="text"
                value={sections.topBar.leaveNoTrace || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    topBar: { ...sections.topBar, leaveNoTrace: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                placeholder="🌱 Leave No Trace Certified Operator"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Announcement Ticker Text (Optional)</label>
              <input
                type="text"
                value={sections.topBar.announcementText || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    topBar: { ...sections.topBar, announcementText: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                placeholder="🔥 2026 Himalayan Batches Now Live with Early-Bird Discounts"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Announcement Link URL</label>
              <input
                type="text"
                value={sections.topBar.announcementLink || "/treks"}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    topBar: { ...sections.topBar, announcementLink: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono"
                placeholder="/treks"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MONSOON & SEASONAL SPECIALS */}
      {activeTab === "monsoon" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF6B35] flex items-center justify-center font-bold">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Seasonal Promo &amp; Discount Banner</h2>
                <p className="text-xs text-slate-500">Highlight seasonal deals and coupon codes for quick bookings</p>
              </div>
            </div>
            <button
              onClick={() => handleSave("monsoon")}
              disabled={savingSection === "monsoon"}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF6B35] hover:bg-[#e8590c] text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingSection === "monsoon" ? "Saving..." : "Save Promo"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="sm:col-span-2 p-4 bg-orange-50/70 border border-orange-200/70 rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block text-sm">Promo Banner Visibility</span>
                <span className="text-xs text-slate-600">Turn the seasonal banner on or off across the homepage</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sections.monsoon.enabled}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      monsoon: { ...sections.monsoon, enabled: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B35]" />
              </label>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Banner Heading</label>
              <input
                type="text"
                value={sections.monsoon.title || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    monsoon: { ...sections.monsoon, title: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
                placeholder="Monsoon Specials & Valley Blooms"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Coupon Promo Code</label>
              <input
                type="text"
                value={sections.monsoon.promoCode || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    monsoon: { ...sections.monsoon, promoCode: e.target.value.toUpperCase() },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-[#FF6B35]"
                placeholder="MONSOON2026"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Discount Percentage (%)</label>
              <input
                type="number"
                value={sections.monsoon.discountPercent || 20}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    monsoon: { ...sections.monsoon, discountPercent: Number(e.target.value) },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                placeholder="20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Badge Tagline</label>
              <input
                type="text"
                value={sections.monsoon.badge || "Limited Season Offer"}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    monsoon: { ...sections.monsoon, badge: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                placeholder="Limited Season Offer"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5">Banner Subtitle / Description</label>
              <textarea
                rows={2}
                value={sections.monsoon.subtitle || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    monsoon: { ...sections.monsoon, subtitle: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
                placeholder="Unlock exclusive rainy season discounts on UNESCO Valley of Flowers, Hampta Pass, and Kashmir circuits."
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BEST TREKS & WEEKEND TREKS CURATION */}
      {activeTab === "treks" && (
        <div className="space-y-6">
          {/* 1. Flagship Treks */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Mountain className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Top Himalayan Treks Section</h2>
                  <p className="text-xs text-slate-500">Showcase 4 flagship high-altitude expeditions on the homepage</p>
                </div>
              </div>
              <button
                onClick={() => handleSave("bestTreks")}
                disabled={savingSection === "bestTreks"}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Best Treks</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Section Pill Badge</label>
                <input
                  type="text"
                  value={sections.bestTreks?.badge || "4.9+ Rated Flagship Expeditions"}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      bestTreks: {
                        badge: e.target.value,
                        title: sections.bestTreks?.title || "Top Himalayan Treks & High Passes",
                        subtitle: sections.bestTreks?.subtitle || "",
                        featuredSlugs: sections.bestTreks?.featuredSlugs || [],
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Section Main Heading</label>
                <input
                  type="text"
                  value={sections.bestTreks?.title || "Top Himalayan Treks & High Passes"}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      bestTreks: {
                        badge: sections.bestTreks?.badge || "",
                        title: e.target.value,
                        subtitle: sections.bestTreks?.subtitle || "",
                        featuredSlugs: sections.bestTreks?.featuredSlugs || [],
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1.5">Section Subtitle / Description</label>
                <input
                  type="text"
                  value={sections.bestTreks?.subtitle || ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      bestTreks: {
                        badge: sections.bestTreks?.badge || "",
                        title: sections.bestTreks?.title || "",
                        subtitle: e.target.value,
                        featuredSlugs: sections.bestTreks?.featuredSlugs || [],
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  placeholder="Highest rated high-altitude alpine routes led by NIM-certified leaders."
                />
              </div>

              {/* Slugs selector */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1.5">Featured Treks (Choose or Click to Toggle)</label>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  {treks.map((t) => {
                    const isSelected = (sections.bestTreks?.featuredSlugs || []).includes(t.slug);
                    return (
                      <button
                        type="button"
                        key={t.slug}
                        onClick={() => {
                          const current = sections.bestTreks?.featuredSlugs || [];
                          const updated = isSelected
                            ? current.filter((s) => s !== t.slug)
                            : [...current, t.slug];
                          setSections({
                            ...sections,
                            bestTreks: {
                              badge: sections.bestTreks?.badge || "4.9+ Rated Flagship Expeditions",
                              title: sections.bestTreks?.title || "Top Himalayan Treks & High Passes",
                              subtitle: sections.bestTreks?.subtitle || "",
                              featuredSlugs: updated,
                            },
                          });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-[#0F3A2E] text-white shadow-sm"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{t.name}</span>
                      </button>
                    );
                  })}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Currently selected: {(sections.bestTreks?.featuredSlugs || []).length} treks
                </span>
              </div>
            </div>
          </div>

          {/* 2. Weekend Treks */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Weekend Escapes Section</h2>
                  <p className="text-xs text-slate-500">Short breaks requiring zero work leaves for working professionals</p>
                </div>
              </div>
              <button
                onClick={() => handleSave("weekendTreks")}
                disabled={savingSection === "weekendTreks"}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Weekend Treks</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Section Pill Badge</label>
                <input
                  type="text"
                  value={sections.weekendTreks?.badge || "Zero Work Leave Needed"}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      weekendTreks: {
                        badge: e.target.value,
                        title: sections.weekendTreks?.title || "Weekend Escapes & Short Breaks",
                        subtitle: sections.weekendTreks?.subtitle || "",
                        featuredSlugs: sections.weekendTreks?.featuredSlugs || [],
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Section Main Heading</label>
                <input
                  type="text"
                  value={sections.weekendTreks?.title || "Weekend Escapes & Short Breaks"}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      weekendTreks: {
                        badge: sections.weekendTreks?.badge || "",
                        title: e.target.value,
                        subtitle: sections.weekendTreks?.subtitle || "",
                        featuredSlugs: sections.weekendTreks?.featuredSlugs || [],
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
                />
              </div>

              {/* Slugs selector */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1.5">Featured Weekend Slugs</label>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  {treks.map((t) => {
                    const isSelected = (sections.weekendTreks?.featuredSlugs || []).includes(t.slug);
                    return (
                      <button
                        type="button"
                        key={t.slug}
                        onClick={() => {
                          const current = sections.weekendTreks?.featuredSlugs || [];
                          const updated = isSelected
                            ? current.filter((s) => s !== t.slug)
                            : [...current, t.slug];
                          setSections({
                            ...sections,
                            weekendTreks: {
                              badge: sections.weekendTreks?.badge || "Zero Work Leave Needed",
                              title: sections.weekendTreks?.title || "Weekend Escapes & Short Breaks",
                              subtitle: sections.weekendTreks?.subtitle || "",
                              featuredSlugs: updated,
                            },
                          });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-amber-600 text-white shadow-sm"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        <span>{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: E-E-A-T AUTHORITY, TRUST BADGES & FAQS */}
      {activeTab === "eeat" && (
        <div className="space-y-6">
          {/* 1. Authority Byline & Curation */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#0F3A2E] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Expedition Authority &amp; Curation Banner</h2>
                  <p className="text-xs text-slate-500">Google E-E-A-T mountaineering authority and leadership disclosure</p>
                </div>
              </div>
              <button
                onClick={() => handleSave("eeat")}
                disabled={savingSection === "eeat"}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Authority &amp; FAQs</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Curation Title Byline</label>
                <input
                  type="text"
                  value={sections.eeat?.title || "Curated by KRADIND Expedition Team"}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      eeat: { ...(sections.eeat as any), title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
                  placeholder="Curated by KRADIND Expedition Team"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Last Reviewed Date</label>
                <input
                  type="text"
                  value={sections.eeat?.lastReviewed || "14 September 2026"}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      eeat: { ...(sections.eeat as any), lastReviewed: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                  placeholder="14 September 2026"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1.5">Directorate Qualifications &amp; Credentials</label>
                <input
                  type="text"
                  value={sections.eeat?.role || "Chief Expedition Directorate • Nehru Institute of Mountaineering (NIM) Certified Leaders • WFA Certified"}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      eeat: { ...(sections.eeat as any), role: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1.5">Authority Narrative Paragraph</label>
                <textarea
                  rows={3}
                  value={sections.eeat?.description || ""}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      eeat: { ...(sections.eeat as any), description: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm leading-relaxed"
                  placeholder="Leading certified high-altitude alpine expeditions across Garhwal, Himachal, and Ladakh with over a decade of technical mountain terrain leadership and comprehensive mountain weather monitoring."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Policy Button Text</label>
                <input
                  type="text"
                  value={sections.eeat?.policyLinkText || "Read Our Editorial & Safety Policy"}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      eeat: { ...(sections.eeat as any), policyLinkText: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Audit Badge Text</label>
                <input
                  type="text"
                  value={sections.eeat?.auditBadgeText || "Fact-Checked & NIM/HMI Audited"}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      eeat: { ...(sections.eeat as any), auditBadgeText: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* 2. Trust Signals (4 Cards) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>4 Trust Cards &amp; Certifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(sections.eeat?.trustCards || []).map((card, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase text-slate-400">Card #{idx + 1}</span>
                  </div>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => {
                      const updatedCards = [...(sections.eeat?.trustCards || [])];
                      updatedCards[idx] = { ...card, title: e.target.value };
                      setSections({
                        ...sections,
                        eeat: { ...(sections.eeat as any), trustCards: updatedCards },
                      });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                  <textarea
                    rows={3}
                    value={card.desc}
                    onChange={(e) => {
                      const updatedCards = [...(sections.eeat?.trustCards || [])];
                      updatedCards[idx] = { ...card, desc: e.target.value };
                      setSections({
                        ...sections,
                        eeat: { ...(sections.eeat as any), trustCards: updatedCards },
                      });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 3. Interactive FAQ Manager */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-600" />
                  <span>Homepage Frequently Asked Questions (FAQs)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add, edit, delete or reorder FAQs rendered in the trust &amp; authority section
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddFaq}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-xl transition"
              >
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Add FAQ Question</span>
              </button>
            </div>

            <div className="space-y-4">
              {(sections.eeat?.faqs || []).map((faq, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#0F3A2E] text-white flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-xs text-slate-700">FAQ Question #{idx + 1}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveFaq(idx, "up")}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveFaq(idx, "down")}
                        disabled={idx === (sections.eeat?.faqs || []).length - 1}
                        title="Move Down"
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(idx)}
                        title="Delete Question"
                        className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={faq.q}
                      onChange={(e) => handleUpdateFaq(idx, "q", e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:ring-1 focus:ring-emerald-500 outline-none"
                      placeholder="Enter question..."
                    />
                  </div>

                  <div>
                    <textarea
                      rows={3}
                      value={faq.a}
                      onChange={(e) => handleUpdateFaq(idx, "a", e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:ring-1 focus:ring-emerald-500 outline-none leading-relaxed"
                      placeholder="Enter detailed answer..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FOOTER, SOCIAL MEDIA & COMPANY CONTACT */}
      {activeTab === "footer" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Footer, Official Contact &amp; Social Links</h2>
                <p className="text-xs text-slate-500">Edit company addresses, contact information, and all 6 social media handles</p>
              </div>
            </div>
            <button
              onClick={() => handleSave("contactAndFooter")}
              disabled={savingSection === "contactAndFooter"}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Footer &amp; Social</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Official Support Email</label>
              <input
                type="email"
                value={sections.contactAndFooter?.supportEmail || "support@kradind.com"}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    contactAndFooter: {
                      ...(sections.contactAndFooter as any),
                      supportEmail: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Official Support Phone</label>
              <input
                type="text"
                value={sections.contactAndFooter?.supportPhone || "+91 75002 22141"}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    contactAndFooter: {
                      ...(sections.contactAndFooter as any),
                      supportPhone: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5">Official WhatsApp Direct Chat Link</label>
              <input
                type="text"
                value={sections.contactAndFooter?.whatsappLink || "https://wa.link/n3u8c0"}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    contactAndFooter: {
                      ...(sections.contactAndFooter as any),
                      whatsappLink: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5">Registered Office Address</label>
              <textarea
                rows={2}
                value={sections.contactAndFooter?.address || "Rajpur Road, Jakhan, Dehradun, Uttarakhand – 248001, India"}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    contactAndFooter: {
                      ...(sections.contactAndFooter as any),
                      address: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
              />
            </div>

            {/* Social Links Subheading */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>Social Media URLs</span>
              </h4>
              <p className="text-[11px] text-slate-500">Links embedded into header icons, footer icons, and social share widgets</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Instagram URL</label>
              <input
                type="text"
                value={sections.contactAndFooter?.instagramUrl || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    contactAndFooter: {
                      ...(sections.contactAndFooter as any),
                      instagramUrl: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Facebook URL</label>
              <input
                type="text"
                value={sections.contactAndFooter?.facebookUrl || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    contactAndFooter: {
                      ...(sections.contactAndFooter as any),
                      facebookUrl: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">YouTube URL</label>
              <input
                type="text"
                value={sections.contactAndFooter?.youtubeUrl || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    contactAndFooter: {
                      ...(sections.contactAndFooter as any),
                      youtubeUrl: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">X (Twitter) URL</label>
              <input
                type="text"
                value={sections.contactAndFooter?.twitterUrl || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    contactAndFooter: {
                      ...(sections.contactAndFooter as any),
                      twitterUrl: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Threads URL</label>
              <input
                type="text"
                value={sections.contactAndFooter?.threadsUrl || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    contactAndFooter: {
                      ...(sections.contactAndFooter as any),
                      threadsUrl: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Pinterest URL</label>
              <input
                type="text"
                value={sections.contactAndFooter?.pinterestUrl || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    contactAndFooter: {
                      ...(sections.contactAndFooter as any),
                      pinterestUrl: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5">Copyright Notice</label>
              <input
                type="text"
                value={sections.contactAndFooter?.copyrightText || "© 2026 KRADIND Adventures Private Limited. All rights reserved."}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    contactAndFooter: {
                      ...(sections.contactAndFooter as any),
                      copyrightText: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
