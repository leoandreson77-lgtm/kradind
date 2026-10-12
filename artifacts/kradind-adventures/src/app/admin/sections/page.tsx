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
  Plane,
  Calendar,
  CalendarCheck,
  Eye,
  QrCode,
  Copy,
  Download,
} from "lucide-react";
import {
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaFacebookF,
  FaXTwitter,
  FaThreads,
  FaPinterestP,
} from "react-icons/fa6";
import QRCode from "qrcode";
import { HomeSectionsConfig, SectionFaqItem, TrustSignalItem, TrekData, DestinationData } from "@/lib/cms-store";
import { ImageUploader } from "@/components/admin/image-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

type SectionTab = "hero" | "seasonal" | "topBar" | "monsoon" | "treks" | "international" | "eeat" | "socials" | "footer";

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<HomeSectionsConfig | null>(null);
  const [treks, setTreks] = useState<TrekData[]>([]);
  const [internationalList, setInternationalList] = useState<DestinationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SectionTab>("hero");
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [adminQrUrl, setAdminQrUrl] = useState<string>("");
  const [copiedHub, setCopiedHub] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchData = async () => {
    try {
      const [secRes, treksRes, intlRes] = await Promise.all([
        fetch("/api/admin/sections", { cache: "no-store" }),
        fetch("/api/admin/treks", { cache: "no-store" }),
        fetch("/api/admin/international", { cache: "no-store" }),
      ]);

      if (secRes.ok) {
        setSections(await secRes.json());
      }
      if (treksRes.ok) {
        setTreks(await treksRes.json());
      }
      if (intlRes.ok) {
        setInternationalList(await intlRes.json());
      }
    } catch (err) {
      console.error("Failed to load sections data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as SectionTab;
      if (
        tabParam &&
        ["hero", "seasonal", "topBar", "monsoon", "treks", "international", "eeat", "socials", "footer"].includes(tabParam)
      ) {
        setActiveTab(tabParam);
      }

      const hubUrl = `${window.location.origin}/connect`;
      QRCode.toDataURL(hubUrl, {
        width: 320,
        margin: 2,
        color: { dark: "#0F3A2E", light: "#FFFFFF" },
      })
        .then(setAdminQrUrl)
        .catch(() => {});
    }
  }, []);

  const handleCopyAdminHub = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/connect`);
      setCopiedHub(true);
      showToast("✅ Social & QR Hub URL copied to clipboard!");
      setTimeout(() => setCopiedHub(false), 2500);
    } catch {
      showToast("Failed to copy URL");
    }
  };

  const handleDownloadAdminQr = () => {
    if (!adminQrUrl) return;
    const a = document.createElement("a");
    a.href = adminQrUrl;
    a.download = "kradind-connect-qr.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("✅ Hub QR code PNG downloaded!");
  };

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
    { id: "seasonal" as SectionTab, label: "Seasonal Carousel", icon: CalendarCheck, desc: "Top 5 Indiahikes-style carousel" },
    { id: "topBar" as SectionTab, label: "Top Bar & Helpline", icon: PhoneCall, desc: "Helpline & badges" },
    { id: "monsoon" as SectionTab, label: "Monsoon & Offers", icon: CloudRain, desc: "Promo coupons & discounts" },
    { id: "treks" as SectionTab, label: "Featured & Weekend", icon: Mountain, desc: "Homepage showcase curations" },
    { id: "international" as SectionTab, label: "International Tours", icon: Plane, desc: "Global destinations showcase" },
    { id: "eeat" as SectionTab, label: "Authority & FAQs", icon: ShieldCheck, desc: "Curation byline & FAQs" },
    { id: "socials" as SectionTab, label: "LinkedIn & Socials (QR)", icon: Share2, desc: "LinkedIn company, QR hub & social networks" },
    { id: "footer" as SectionTab, label: "Footer & Contact", icon: Globe, desc: "Contact info & social links" },
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
            href="/connect"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl transition shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-700" />
            <span>📱 View Social & QR Hub</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
          </a>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 bg-slate-200/70 p-1.5 rounded-2xl">
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

            <RichTextEditor
              compact
              label="Hero Subtitle Description"
              rows={2}
              value={sections.hero.subtitle || ""}
              onChange={(val) =>
                setSections({
                  ...sections,
                  hero: { ...sections.hero, subtitle: val },
                })
              }
              placeholder="Explore handpicked Himalayan treks, tropical road trips, and sacred pilgrimages..."
              helperText="Format key phrases with bold, colors, or highlights for hero title emphasis."
            />

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

      {/* TAB: SEASONAL FEATURED TREKS (Indiahikes-Style Carousel) */}
      {activeTab === "seasonal" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                <CalendarCheck className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    Seasonal Featured Carousel (Indiahikes-Style)
                  </h2>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Homepage Highlight
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Feature handpicked high-altitude treks with date badges (e.g. &ldquo;Top 5 Treks for October-November&rdquo;)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sections.seasonalCollection?.enabled ?? true}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      seasonalCollection: {
                        enabled: e.target.checked,
                        badge: sections.seasonalCollection?.badge || "High Altitude Autumn Window",
                        title: sections.seasonalCollection?.title || "Top 5 Treks for October-November",
                        subtitle:
                          sections.seasonalCollection?.subtitle ||
                          "Oct-Nov is the best window for doing the high-altitude treks in our country with the clearest views. Here are the Top 5.",
                        seasonTag: sections.seasonalCollection?.seasonTag || "October - November",
                        featuredSlugs: sections.seasonalCollection?.featuredSlugs || [
                          "kuari-pass-trek",
                          "dayara-bugyal-trek",
                          "chopta-tungnath-chandrashila",
                          "pench-tiger-trail",
                          "hampta-pass",
                        ],
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-[#0F3A2E] focus:ring-emerald-500"
                />
                <span>Active on Homepage</span>
              </label>

              <button
                onClick={() => handleSave("seasonalCollection")}
                disabled={savingSection === "seasonalCollection"}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-60 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingSection === "seasonalCollection" ? "Saving..." : "Save Carousel"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Section Pill Tag / Badge</label>
              <input
                type="text"
                value={sections.seasonalCollection?.badge || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    seasonalCollection: {
                      enabled: sections.seasonalCollection?.enabled ?? true,
                      badge: e.target.value,
                      title: sections.seasonalCollection?.title || "Top 5 Treks for October-November",
                      subtitle: sections.seasonalCollection?.subtitle || "",
                      seasonTag: sections.seasonalCollection?.seasonTag || "October - November",
                      featuredSlugs: sections.seasonalCollection?.featuredSlugs || [],
                    },
                  })
                }
                placeholder="High Altitude Autumn Window"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Season / Window Label</label>
              <input
                type="text"
                value={sections.seasonalCollection?.seasonTag || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    seasonalCollection: {
                      enabled: sections.seasonalCollection?.enabled ?? true,
                      badge: sections.seasonalCollection?.badge || "",
                      title: sections.seasonalCollection?.title || "Top 5 Treks for October-November",
                      subtitle: sections.seasonalCollection?.subtitle || "",
                      seasonTag: e.target.value,
                      featuredSlugs: sections.seasonalCollection?.featuredSlugs || [],
                    },
                  })
                }
                placeholder="October - November"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5">Main Section Heading (Displayed prominently)</label>
              <input
                type="text"
                value={sections.seasonalCollection?.title || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    seasonalCollection: {
                      enabled: sections.seasonalCollection?.enabled ?? true,
                      badge: sections.seasonalCollection?.badge || "",
                      title: e.target.value,
                      subtitle: sections.seasonalCollection?.subtitle || "",
                      seasonTag: sections.seasonalCollection?.seasonTag || "",
                      featuredSlugs: sections.seasonalCollection?.featuredSlugs || [],
                    },
                  })
                }
                placeholder="Top 5 Treks for October-November"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5">Subtitle / Description</label>
              <textarea
                rows={2}
                value={sections.seasonalCollection?.subtitle || ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    seasonalCollection: {
                      enabled: sections.seasonalCollection?.enabled ?? true,
                      badge: sections.seasonalCollection?.badge || "",
                      title: sections.seasonalCollection?.title || "",
                      subtitle: e.target.value,
                      seasonTag: sections.seasonalCollection?.seasonTag || "",
                      featuredSlugs: sections.seasonalCollection?.featuredSlugs || [],
                    },
                  })
                }
                placeholder="Oct-Nov is the best window for doing the high-altitude treks in our country with the clearest views. Here are the Top 5."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
              />
            </div>

            {/* Selected Treks in Order */}
            <div className="sm:col-span-2 space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 text-xs block">
                    Featured Treks Sequence ({(sections.seasonalCollection?.featuredSlugs || []).length} Selected)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Use Up/Down arrows to change display order on the carousel.
                  </span>
                </div>
              </div>

              {/* Selected List with Ordering */}
              <div className="space-y-2">
                {(sections.seasonalCollection?.featuredSlugs || []).map((slug, idx) => {
                  const trekItem = treks.find((t) => t.slug === slug);
                  const title = trekItem?.name || slug;
                  return (
                    <div
                      key={slug}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#0F3A2E] text-white flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 block">{title}</span>
                          <span className="text-[10px] text-slate-400">
                            {trekItem?.duration} • {trekItem?.altitude || "Alpine Summit"} • {trekItem?.batches?.length || 0} departures
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const cur = [...(sections.seasonalCollection?.featuredSlugs || [])];
                            const temp = cur[idx];
                            cur[idx] = cur[idx - 1];
                            cur[idx - 1] = temp;
                            setSections({
                              ...sections,
                              seasonalCollection: {
                                ...sections.seasonalCollection!,
                                featuredSlugs: cur,
                              },
                            });
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-600 cursor-pointer"
                          title="Move earlier in carousel"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          disabled={idx === (sections.seasonalCollection?.featuredSlugs || []).length - 1}
                          onClick={() => {
                            const cur = [...(sections.seasonalCollection?.featuredSlugs || [])];
                            const temp = cur[idx];
                            cur[idx] = cur[idx + 1];
                            cur[idx + 1] = temp;
                            setSections({
                              ...sections,
                              seasonalCollection: {
                                ...sections.seasonalCollection!,
                                featuredSlugs: cur,
                              },
                            });
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-600 cursor-pointer"
                          title="Move later in carousel"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const cur = (sections.seasonalCollection?.featuredSlugs || []).filter((s) => s !== slug);
                            setSections({
                              ...sections,
                              seasonalCollection: {
                                ...sections.seasonalCollection!,
                                featuredSlugs: cur,
                              },
                            });
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Remove from carousel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add More Treks to Carousel */}
              <div className="pt-2">
                <span className="block text-[11px] font-bold text-slate-600 mb-1.5">
                  Click to add/remove more treks:
                </span>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-100/60 border border-slate-200/80 rounded-2xl max-h-48 overflow-y-auto">
                  {treks.map((t) => {
                    const isSelected = (sections.seasonalCollection?.featuredSlugs || []).includes(t.slug);
                    return (
                      <button
                        type="button"
                        key={t.slug}
                        onClick={() => {
                          const current = sections.seasonalCollection?.featuredSlugs || [];
                          const updated = isSelected
                            ? current.filter((s) => s !== t.slug)
                            : [...current, t.slug];
                          setSections({
                            ...sections,
                            seasonalCollection: {
                              enabled: sections.seasonalCollection?.enabled ?? true,
                              badge: sections.seasonalCollection?.badge || "High Altitude Autumn Window",
                              title: sections.seasonalCollection?.title || "Top 5 Treks for October-November",
                              subtitle: sections.seasonalCollection?.subtitle || "",
                              seasonTag: sections.seasonalCollection?.seasonTag || "",
                              featuredSlugs: updated,
                            },
                          });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-[#0F3A2E] text-white shadow-xs"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
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
                placeholder="+91 9797941414"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Official WhatsApp Number (Floating Icon & TopBar)</label>
              <input
                type="text"
                value={sections.topBar.whatsappNumber ?? ""}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    topBar: { ...sections.topBar, whatsappNumber: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-emerald-700"
                placeholder="+91 9797941414"
              />
              <p className="text-[11px] text-slate-400 mt-1">Applies to top bar and floating WhatsApp chat button.</p>
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
              <RichTextEditor
                compact
                label="Banner Subtitle / Description"
                rows={2}
                value={sections.monsoon.subtitle || ""}
                onChange={(val) =>
                  setSections({
                    ...sections,
                    monsoon: { ...sections.monsoon, subtitle: val },
                  })
                }
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

      {/* TAB: INTERNATIONAL TOURS SHOWCASE */}
      {activeTab === "international" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                <Plane className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">International Escapes &amp; Island Gateways</h2>
                <p className="text-xs text-slate-500">Curate the global journeys showcased on the homepage</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/international"
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                <span>Manage Tour Packages</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => handleSave("international")}
                disabled={savingSection === "international"}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingSection === "international" ? "Saving..." : "Save International"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Section Enable Toggle */}
            <div className="sm:col-span-2 flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Showcase Section Visibility</span>
                <span className="text-[11px] text-slate-500">Toggle whether the International Tours section is displayed on the homepage</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sections.international?.enabled ?? true}
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      international: {
                        enabled: e.target.checked,
                        badge: sections.international?.badge || "Explore Beyond Borders",
                        title: sections.international?.title || "International Tours & Island Escapes",
                        subtitle: sections.international?.subtitle || "Handcrafted overseas journeys with verified accommodations, local English-speaking guides, seamless visa assistance, and 24/7 on-trip concierge.",
                        featuredSlugs: sections.international?.featuredSlugs || ["bali", "thailand", "dubai", "vietnam", "singapore", "maldives"],
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F3A2E]"></div>
              </label>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Section Pill Badge</label>
              <input
                type="text"
                value={sections.international?.badge || "Explore Beyond Borders"}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    international: {
                      enabled: sections.international?.enabled ?? true,
                      badge: e.target.value,
                      title: sections.international?.title || "International Tours & Island Escapes",
                      subtitle: sections.international?.subtitle || "",
                      featuredSlugs: sections.international?.featuredSlugs || [],
                    },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                placeholder="Explore Beyond Borders"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Section Main Heading</label>
              <input
                type="text"
                value={sections.international?.title || "International Tours & Island Escapes"}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    international: {
                      enabled: sections.international?.enabled ?? true,
                      badge: sections.international?.badge || "",
                      title: e.target.value,
                      subtitle: sections.international?.subtitle || "",
                      featuredSlugs: sections.international?.featuredSlugs || [],
                    },
                  })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                placeholder="International Tours & Island Escapes"
              />
            </div>

            <div className="sm:col-span-2">
              <RichTextEditor
                compact
                label="Section Subtitle / Description"
                rows={2}
                value={sections.international?.subtitle || ""}
                onChange={(val) =>
                  setSections({
                    ...sections,
                    international: {
                      enabled: sections.international?.enabled ?? true,
                      badge: sections.international?.badge || "",
                      title: sections.international?.title || "",
                      subtitle: val,
                      featuredSlugs: sections.international?.featuredSlugs || [],
                    },
                  })
                }
                placeholder="Handcrafted overseas journeys with verified accommodations, local English-speaking guides, seamless visa assistance, and 24/7 on-trip concierge."
              />
            </div>

            {/* Featured International Slugs selector */}
            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-700">Featured International Packages (Click to Select / Deselect)</label>
                <Link
                  href="/admin/international"
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                >
                  <span>Open International CMS</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                {internationalList.length === 0 ? (
                  <div className="text-xs text-slate-500 py-2">
                    Loading packages or no international tours found. You can create and manage tours in the{" "}
                    <Link href="/admin/international" className="text-emerald-700 font-bold underline">
                      International CMS
                    </Link>
                    .
                  </div>
                ) : (
                  internationalList.map((dest) => {
                    const isSelected = (sections.international?.featuredSlugs || []).includes(dest.slug);
                    return (
                      <button
                        type="button"
                        key={dest.slug}
                        onClick={() => {
                          const current = sections.international?.featuredSlugs || [];
                          const updated = isSelected
                            ? current.filter((s) => s !== dest.slug)
                            : [...current, dest.slug];
                          setSections({
                            ...sections,
                            international: {
                              enabled: sections.international?.enabled ?? true,
                              badge: sections.international?.badge || "Explore Beyond Borders",
                              title: sections.international?.title || "International Tours & Island Escapes",
                              subtitle: sections.international?.subtitle || "",
                              featuredSlugs: updated,
                            },
                          });
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                          isSelected
                            ? "bg-[#0F3A2E] text-white shadow-sm"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{dest.icon ? `${dest.icon} ` : ""}{dest.name}</span>
                        <span className="text-[10px] opacity-75">({dest.duration})</span>
                      </button>
                    );
                  })
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Selected packages will be displayed in the high-converting interactive carousel cards on your homepage.
              </p>
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

                  <RichTextEditor
                    compact
                    label="Answer"
                    rows={2}
                    value={faq.a || ""}
                    onChange={(val) => handleUpdateFaq(idx, "a", val)}
                    placeholder="Enter detailed answer..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: LINKEDIN COMPANY SECTION & ANIMATED SOCIAL QR HUB */}
      {activeTab === "socials" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#004182] text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                <FaLinkedinIn className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    LinkedIn Official Section &amp; Social QR Hub
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-[#0A66C2] border border-blue-200">
                    Official CMS
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage official LinkedIn company profile, interactive QR directory, and all brand social channels.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href="/connect"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl transition shadow-xs"
              >
                <QrCode className="w-4 h-4 text-emerald-700" />
                <span>Open Live Hub (/connect)</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
              </a>
              <button
                onClick={() => handleSave("socials")}
                disabled={savingSection === "socials"}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold rounded-xl transition shadow-sm disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{savingSection === "socials" ? "Saving..." : "Save Social & LinkedIn"}</span>
              </button>
            </div>
          </div>

          {/* QUICK BANNER / CALLOUT */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#0F3A2E] to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-500/30 shadow-lg">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Animated Social &amp; QR Hub is Active</span>
              </div>
              <p className="text-xs text-slate-200">
                A dedicated, high-converting luxury hub is published at <strong>/connect</strong> and <strong>/socials</strong> matching KRADIND&apos;s Himalayan emerald theme with live QR code scanning, vCard download, and interactive channel cards.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyAdminHub}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition"
              >
                {copiedHub ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHub ? "Copied Link!" : "Copy Hub URL"}</span>
              </button>
              {adminQrUrl && (
                <button
                  type="button"
                  onClick={handleDownloadAdminQr}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-sm"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Download Hub QR</span>
                </button>
              )}
            </div>
          </div>

          {/* SECTION 1: PROMINENT LINKEDIN COMPANY CARD */}
          <div className="rounded-3xl border-2 border-[#0A66C2]/30 bg-gradient-to-br from-[#0A66C2]/5 via-white to-blue-50/20 p-6 sm:p-7 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center font-bold shadow-md">
                  <FaLinkedinIn className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>LinkedIn Official Company Section</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0A66C2] text-white">
                      B2B &amp; Corporate
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official organization URL for corporate treks, college expeditions, and institutional partnerships.
                  </p>
                </div>
              </div>

              {sections.contactAndFooter?.linkedinUrl && (
                <a
                  href={sections.contactAndFooter.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-bold transition shadow-xs self-start sm:self-auto"
                >
                  <span>Test Open LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1.5">
                    Official LinkedIn Company Page URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0A66C2]">
                      <FaLinkedinIn className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      value={sections.contactAndFooter?.linkedinUrl || ""}
                      placeholder="https://www.linkedin.com/company/krad-india/"
                      onChange={(e) =>
                        setSections({
                          ...sections,
                          contactAndFooter: {
                            ...(sections.contactAndFooter as any),
                            linkedinUrl: e.target.value,
                          },
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-[#0A66C2] outline-none bg-white shadow-xs"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Default: <code className="text-[#0A66C2] bg-blue-50 px-1 py-0.5 rounded font-mono">https://www.linkedin.com/company/krad-india/</code>. This URL updates the website footer icon, proposal PDFs, and the animated Social Hub.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-slate-600 space-y-1.5">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0A66C2]" />
                    <span>How this LinkedIn section is used:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                    <li>Displays with official verified blue badge on <strong>/connect</strong> and <strong>/socials</strong></li>
                    <li>Included in downloadable vCard contact card (<code className="font-mono text-slate-700">kradind-adventures.vcf</code>)</li>
                    <li>Linked in the global website footer social row alongside Instagram and WhatsApp</li>
                    <li>Used for B2B corporate mountaineering queries, CSR expeditions, and campus travel clubs</li>
                  </ul>
                </div>
              </div>

              {/* LinkedIn Preview Card */}
              <div className="rounded-2xl bg-slate-900 text-white p-5 flex flex-col justify-between border border-slate-800 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A66C2]/20 rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                      Live Hub Preview
                    </span>
                    <FaLinkedinIn className="w-4 h-4 text-[#0A66C2]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <span>KRADIND Adventures</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      @krad-india
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Corporate Treks, Institutional Expeditions, B2B Travel Tie-ups &amp; Career Opportunities.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 mt-4 relative z-10 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Dehradun, UK • Travel &amp; Treks</span>
                  <span className="text-[11px] font-bold text-blue-400 flex items-center gap-1">
                    <span>Connect</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: LIVE QR CODE HUB STATION */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0F3A2E] text-white flex items-center justify-center font-bold shadow-md">
                  <QrCode className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Interactive QR Code Hub Station
                  </h3>
                  <p className="text-xs text-slate-500">
                    High-resolution dynamic QR code linking to all official social channels &amp; contacts
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAdminHub}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                >
                  {copiedHub ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHub ? "Copied" : "Copy Link"}</span>
                </button>
                {adminQrUrl && (
                  <button
                    type="button"
                    onClick={handleDownloadAdminQr}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-semibold transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                {adminQrUrl ? (
                  <img
                    src={adminQrUrl}
                    alt="KRADIND Connect QR Code"
                    className="w-48 h-48 rounded-xl object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-xl bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                    Generating QR...
                  </div>
                )}
                <span className="text-[11px] font-bold text-slate-600 mt-2 flex items-center gap-1">
                  <span>Target:</span>
                  <code className="text-[#0F3A2E] bg-emerald-50 px-1 py-0.5 rounded font-mono">/connect</code>
                </span>
              </div>

              <div className="md:col-span-2 space-y-3 text-xs text-slate-600">
                <h4 className="font-extrabold text-sm text-slate-900">
                  Deploy KRADIND QR Code Across All Touchpoints:
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When travelers scan this QR code with any iOS or Android camera, they are instantly taken to the animated KRADIND Hub where they can follow your LinkedIn, Instagram, WhatsApp 24/7 helpline, YouTube channel, and save your official vCard directly into their phone contacts.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-800 block text-xs">🏔️ Physical Ground Marketing</span>
                    <span className="text-[11px] text-slate-500">Print on Sankri, Joshimath &amp; Leh basecamp standees, vehicle fleet stickers, and trek completion certificates.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-800 block text-xs">📄 Digital Travel Vouchers</span>
                    <span className="text-[11px] text-slate-500">Embed on booking confirmation PDFs, WhatsApp departure broadcasts, and proposal vouchers.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: ALL SOCIAL MEDIA CHANNELS GRID */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  All Social Media Profiles &amp; Direct Handles
                </h3>
                <p className="text-xs text-slate-500">
                  Update any handle below. They are updated globally across the website and in the QR Hub.
                </p>
              </div>
              <button
                onClick={() => handleSave("socials")}
                disabled={savingSection === "socials"}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All Socials</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              {/* Instagram */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-600 to-purple-600 text-white flex items-center justify-center">
                      <FaInstagram className="w-4 h-4" />
                    </div>
                    <label className="font-bold text-slate-800">Instagram Profile URL</label>
                  </div>
                  {sections.contactAndFooter?.instagramUrl && (
                    <a
                      href={sections.contactAndFooter.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-600 hover:underline text-[11px] font-semibold flex items-center gap-0.5"
                    >
                      <span>Test</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={sections.contactAndFooter?.instagramUrl || ""}
                  placeholder="https://www.instagram.com/kradglobal/"
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      contactAndFooter: {
                        ...(sections.contactAndFooter as any),
                        instagramUrl: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              {/* WhatsApp */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#25D366] text-white flex items-center justify-center">
                      <FaWhatsapp className="w-4 h-4" />
                    </div>
                    <label className="font-bold text-slate-800">WhatsApp Direct Link</label>
                  </div>
                  {sections.contactAndFooter?.whatsappLink && (
                    <a
                      href={sections.contactAndFooter.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline text-[11px] font-semibold flex items-center gap-0.5"
                    >
                      <span>Test</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={sections.contactAndFooter?.whatsappLink || ""}
                  placeholder="https://wa.me/919797941414"
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      contactAndFooter: {
                        ...(sections.contactAndFooter as any),
                        whatsappLink: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              {/* YouTube */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FF0000] text-white flex items-center justify-center">
                      <FaYoutube className="w-4 h-4" />
                    </div>
                    <label className="font-bold text-slate-800">YouTube Channel URL</label>
                  </div>
                  {sections.contactAndFooter?.youtubeUrl && (
                    <a
                      href={sections.contactAndFooter.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:underline text-[11px] font-semibold flex items-center gap-0.5"
                    >
                      <span>Test</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={sections.contactAndFooter?.youtubeUrl || ""}
                  placeholder="https://www.youtube.com/@kradglobaltravels"
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      contactAndFooter: {
                        ...(sections.contactAndFooter as any),
                        youtubeUrl: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              {/* Facebook */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#1877F2] text-white flex items-center justify-center">
                      <FaFacebookF className="w-4 h-4" />
                    </div>
                    <label className="font-bold text-slate-800">Facebook Page URL</label>
                  </div>
                  {sections.contactAndFooter?.facebookUrl && (
                    <a
                      href={sections.contactAndFooter.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-[11px] font-semibold flex items-center gap-0.5"
                    >
                      <span>Test</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={sections.contactAndFooter?.facebookUrl || ""}
                  placeholder="https://www.facebook.com/share/189E2RUcH4/"
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      contactAndFooter: {
                        ...(sections.contactAndFooter as any),
                        facebookUrl: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              {/* X / Twitter */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center">
                      <FaXTwitter className="w-4 h-4" />
                    </div>
                    <label className="font-bold text-slate-800">X (Twitter) URL</label>
                  </div>
                  {sections.contactAndFooter?.twitterUrl && (
                    <a
                      href={sections.contactAndFooter.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-800 hover:underline text-[11px] font-semibold flex items-center gap-0.5"
                    >
                      <span>Test</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={sections.contactAndFooter?.twitterUrl || ""}
                  placeholder="https://x.com/KradGlobalTour"
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      contactAndFooter: {
                        ...(sections.contactAndFooter as any),
                        twitterUrl: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              {/* Threads */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center">
                      <FaThreads className="w-4 h-4" />
                    </div>
                    <label className="font-bold text-slate-800">Threads URL</label>
                  </div>
                  {sections.contactAndFooter?.threadsUrl && (
                    <a
                      href={sections.contactAndFooter.threadsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-800 hover:underline text-[11px] font-semibold flex items-center gap-0.5"
                    >
                      <span>Test</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={sections.contactAndFooter?.threadsUrl || ""}
                  placeholder="https://www.threads.net/@kradglobal"
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      contactAndFooter: {
                        ...(sections.contactAndFooter as any),
                        threadsUrl: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              {/* Pinterest */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#BD081C] text-white flex items-center justify-center">
                      <FaPinterestP className="w-4 h-4" />
                    </div>
                    <label className="font-bold text-slate-800">Pinterest URL</label>
                  </div>
                  {sections.contactAndFooter?.pinterestUrl && (
                    <a
                      href={sections.contactAndFooter.pinterestUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-700 hover:underline text-[11px] font-semibold flex items-center gap-0.5"
                    >
                      <span>Test</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={sections.contactAndFooter?.pinterestUrl || ""}
                  placeholder="https://in.pinterest.com/KradGlobalTravels/"
                  onChange={(e) =>
                    setSections({
                      ...sections,
                      contactAndFooter: {
                        ...(sections.contactAndFooter as any),
                        pinterestUrl: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: FOOTER, OFFICIAL CONTACT & COMPANY DETAILS */}
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
                value={sections.contactAndFooter?.supportEmail || "info@kradind.com"}
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
                value={sections.contactAndFooter?.supportPhone || "+91 9797941414"}
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
              <label className="block font-bold text-slate-700 mb-1.5">Official WhatsApp Direct Chat Link (Footer & CTA)</label>
              <input
                type="text"
                value={sections.contactAndFooter?.whatsappLink ?? ""}
                placeholder="https://wa.me/919797941414"
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
              <p className="text-[11px] text-slate-400 mt-1">Enter full URL (e.g. https://wa.me/919797941414) or mobile number.</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5">Registered Office Address</label>
              <textarea
                rows={2}
                value={sections.contactAndFooter?.address || "Hall No. H -04, 410, Pratap Palace, Vasant Vihar, Indra Nagar Colony, Dehradun, Uttarakhand 248001"}
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

            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1.5 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="font-extrabold text-[#0A66C2] flex items-center gap-1.5">
                  <FaLinkedinIn className="w-3.5 h-3.5" />
                  <span>LinkedIn Official Company URL (Corporate & B2B)</span>
                </label>
                {sections.contactAndFooter?.linkedinUrl && (
                  <a
                    href={sections.contactAndFooter.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0A66C2] hover:underline font-bold text-[11px] flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="text"
                value={sections.contactAndFooter?.linkedinUrl || ""}
                placeholder="https://www.linkedin.com/company/krad-india/"
                onChange={(e) =>
                  setSections({
                    ...sections,
                    contactAndFooter: {
                      ...(sections.contactAndFooter as any),
                      linkedinUrl: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2.5 border border-blue-300 rounded-xl text-xs sm:text-sm font-mono bg-white"
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
