"use client";

import React, { useEffect, useState } from "react";
import { Check, Sparkles, Sliders, CloudRain, PhoneCall, Save, ExternalLink } from "lucide-react";
import { HomeSectionsConfig } from "@/lib/cms-store";

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<HomeSectionsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/admin/sections");
      if (res.ok) {
        setSections(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSave = async (sectionKey: keyof HomeSectionsConfig) => {
    if (!sections) return;
    setSavingSection(sectionKey);

    try {
      const res = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sections),
      });

      if (res.ok) {
        showToast(`${sectionKey.toUpperCase()} section updated and live on website!`);
      } else {
        alert("Failed to save changes.");
      }
    } catch {
      alert("Error saving section");
    } finally {
      setSavingSection(null);
    }
  };

  if (loading || !sections) {
    return (
      <div className="space-y-4 animate-pulse max-w-4xl">
        <div className="h-8 bg-slate-200 rounded-lg w-48" />
        <div className="h-64 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Toast */}
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
            Home Sections CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Independently manage each homepage content block. Changes immediately reflect on the live site.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition shadow-sm"
        >
          <span>Preview Home Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 1. Hero Banner CMS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0F3A2E] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">1. Hero Section & Main Heading</h2>
              <p className="text-[11px] text-slate-500">First impressions, background picture, and top search tagline</p>
            </div>
          </div>
          <button
            onClick={() => handleSave("hero")}
            disabled={savingSection === "hero"}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold rounded-xl transition disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingSection === "hero" ? "Saving..." : "Save Hero"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Badge Tagline</label>
            <input
              type="text"
              value={sections.hero.badge}
              onChange={(e) =>
                setSections({
                  ...sections,
                  hero: { ...sections.hero, badge: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
              placeholder="Certified Himalayan Guides • Small Safe Batches"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Hero Title Heading (H1)</label>
            <input
              type="text"
              value={sections.hero.title}
              onChange={(e) =>
                setSections({
                  ...sections,
                  hero: { ...sections.hero, title: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
              placeholder="Experience the Himalayas"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Hero Subtitle</label>
            <textarea
              rows={2}
              value={sections.hero.subtitle}
              onChange={(e) =>
                setSections({
                  ...sections,
                  hero: { ...sections.hero, subtitle: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
              placeholder="Explore handpicked Himalayan treks, tropical road trips..."
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Hero Background Image URL</label>
            <input
              type="text"
              value={sections.hero.bgImage}
              onChange={(e) =>
                setSections({
                  ...sections,
                  hero: { ...sections.hero, bgImage: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-600"
              placeholder="https://images.unsplash.com/photo-..."
            />
          </div>
        </div>
      </div>

      {/* 2. Monsoon Specials & Coupon Banner CMS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF6B35] flex items-center justify-center font-bold">
              <CloudRain className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">2. Monsoon Specials & Promo Banner</h2>
              <p className="text-[11px] text-slate-500">Manage seasonal coupon code and promotional discount</p>
            </div>
          </div>
          <button
            onClick={() => handleSave("monsoon")}
            disabled={savingSection === "monsoon"}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF6B35] hover:bg-[#e8590c] text-white text-xs font-bold rounded-xl transition disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingSection === "monsoon" ? "Saving..." : "Save Promo Banner"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Banner Title</label>
            <input
              type="text"
              value={sections.monsoon.title}
              onChange={(e) =>
                setSections({
                  ...sections,
                  monsoon: { ...sections.monsoon, title: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
              placeholder="Monsoon Specials & Valley Blooms"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Promo Coupon Code</label>
            <input
              type="text"
              value={sections.monsoon.promoCode}
              onChange={(e) =>
                setSections({
                  ...sections,
                  monsoon: { ...sections.monsoon, promoCode: e.target.value.toUpperCase() },
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-[#FF6B35]"
              placeholder="MONSOON2026"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Discount Percentage (%)</label>
            <input
              type="number"
              value={sections.monsoon.discountPercent}
              onChange={(e) =>
                setSections({
                  ...sections,
                  monsoon: { ...sections.monsoon, discountPercent: Number(e.target.value) },
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
              placeholder="20"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Banner Status</label>
            <div className="pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sections.monsoon.enabled}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      monsoon: { ...sections.monsoon, enabled: e.target.checked },
                    })
                  }
                  className="rounded border-slate-300 text-[#FF6B35] focus:ring-0 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-700">
                  {sections.monsoon.enabled ? "Banner Enabled (Visible)" : "Banner Disabled (Hidden)"}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Top Bar & Emergency Helpline CMS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">3. Top Header Bar & Helpline</h2>
              <p className="text-[11px] text-slate-500">24/7 base camp helpline and eco-trail operator badge</p>
            </div>
          </div>
          <button
            onClick={() => handleSave("topBar")}
            disabled={savingSection === "topBar"}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingSection === "topBar" ? "Saving..." : "Save Top Bar"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Emergency Support Phone</label>
            <input
              type="text"
              value={sections.topBar.supportPhone}
              onChange={(e) =>
                setSections({
                  ...sections,
                  topBar: { ...sections.topBar, supportPhone: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Certification Badge Text</label>
            <input
              type="text"
              value={sections.topBar.leaveNoTrace}
              onChange={(e) =>
                setSections({
                  ...sections,
                  topBar: { ...sections.topBar, leaveNoTrace: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
              placeholder="🌱 Leave No Trace Certified Operator"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
