"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import {
  Globe,
  Phone,
  Mail,
  MapPin,
  QrCode,
  Download,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  Mountain,
  Compass,
  MessageCircle,
  Clock,
  UserCheck,
  Link2,
} from "lucide-react";
import {
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaFacebookF,
  FaXTwitter,
  FaPinterestP,
} from "react-icons/fa6";

export interface SocialLinksConfig {
  linkedinUrl?: string;
  instagramUrl?: string;
  whatsappLink?: string;
  whatsappChannelUrl?: string;
  youtubeUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  pinterestUrl?: string;
  websiteUrl?: string;
  supportPhone?: string;
  supportEmail?: string;
  address?: string;
}

interface SocialMediaHubProps {
  initialConfig?: SocialLinksConfig;
}

export function SocialMediaHub({ initialConfig }: SocialMediaHubProps) {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [qrTarget, setQrTarget] = useState<"hub" | "whatsapp" | "instagram" | "linkedin">("hub");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [currentUrl, setCurrentUrl] = useState("https://www.kradind.com/connect");
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const linkedinUrl = initialConfig?.linkedinUrl || "https://www.linkedin.com/company/krad-india/";
  const instagramUrl = initialConfig?.instagramUrl || "https://www.instagram.com/kradglobal/";
  const whatsappUrl = initialConfig?.whatsappLink || "https://wa.me/919797941414";
  const whatsappChannelUrl = initialConfig?.whatsappChannelUrl || "https://whatsapp.com/channel/0029Vb8H9BNKmCPWGI94Ro34";
  const youtubeUrl = initialConfig?.youtubeUrl || "https://www.youtube.com/@kradglobaltravels";
  const facebookUrl = initialConfig?.facebookUrl || "https://www.facebook.com/share/189E2RUcH4/";
  const twitterUrl = initialConfig?.twitterUrl || "https://x.com/KradGlobalTour";
  const pinterestUrl = initialConfig?.pinterestUrl || "https://in.pinterest.com/KradGlobalTravels/";
  const phone = initialConfig?.supportPhone || "+91 9797941414";
  const email = initialConfig?.supportEmail || "Info@kradind.com";
  const address = initialConfig?.address || "Hall No. H -04, 410, Pratap Palace, Vasant Vihar, Indra Nagar Colony, Dehradun, Uttarakhand 248001";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Determine active target URL for QR Code
  const getActiveQrUrl = () => {
    switch (qrTarget) {
      case "whatsapp":
        return whatsappUrl;
      case "instagram":
        return instagramUrl;
      case "linkedin":
        return linkedinUrl;
      default:
        return currentUrl;
    }
  };

  // Generate QR Code on canvas
  useEffect(() => {
    const targetUrl = getActiveQrUrl();
    QRCode.toDataURL(targetUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: "#0F3A2E",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("Failed to generate QR code:", err);
      });
  }, [qrTarget, currentUrl, linkedinUrl, instagramUrl, whatsappUrl]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      showToast("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast("Failed to copy link");
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "KRADIND Adventures • Official Social & Connect Hub",
          text: "Connect with KRADIND Adventures across LinkedIn, Instagram, WhatsApp, YouTube, and explore Himalayan Expeditions & Tours.",
          url: currentUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `kradind-adventures-qr-${qrTarget}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`QR Code downloaded (${qrTarget})!`);
  };

  const handleDownloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:KRADIND Adventures
ORG:KRAD Global Travels & KRADIND Adventures Private Limited
TITLE:High-Altitude Expeditions & Customized Tours
TEL;TYPE=WORK,VOICE:+919797941414
TEL;TYPE=CELL,WHATSAPP:+919797941414
EMAIL;TYPE=WORK:Info@kradind.com
URL;TYPE=WORK:https://www.kradind.com
URL;TYPE=LINKEDIN:${linkedinUrl}
URL;TYPE=INSTAGRAM:${instagramUrl}
URL;TYPE=WHATSAPP_CHANNEL:${whatsappChannelUrl}
ADR;TYPE=WORK:;;Hall No. H -04, 410, Pratap Palace, Vasant Vihar, Indra Nagar Colony;Dehradun;Uttarakhand;248001;India
NOTE:Official KRADIND Adventures Contact Card • Himalayan Treks, Domestic Holiday Circuits & International Tours.
END:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "kradind-adventures.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Contact card (vCard) downloaded!");
  };

  const socialChannels = [
    {
      id: "linkedin",
      title: "LinkedIn Company",
      handle: "KRADIND Adventures",
      subHandle: "@krad-india",
      description: "Corporate Treks, Institutional Expeditions, B2B Travel Tie-ups & Career Opportunities.",
      url: linkedinUrl,
      icon: FaLinkedinIn,
      badge: "Corporate & B2B",
      brandColor: "#0A66C2",
      badgeColor: "bg-[#0A66C2]/20 text-[#60A5FA] border-[#0A66C2]/40",
      borderHover: "hover:border-[#0A66C2]",
      glowColor: "rgba(10, 102, 194, 0.35)",
      ctaText: "Connect on LinkedIn",
    },
    {
      id: "instagram",
      title: "Instagram",
      handle: "@kradglobal",
      subHandle: "12K+ Followers",
      description: "Daily Himalayan Summit Reels, Real-Time Trail Radars, Camp Stories & Scenic Snaps.",
      url: instagramUrl,
      icon: FaInstagram,
      badge: "Daily Updates",
      brandColor: "#E1306C",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      borderHover: "hover:border-[#E1306C]",
      glowColor: "rgba(225, 48, 108, 0.35)",
      ctaText: "Follow on Instagram",
    },
    {
      id: "whatsapp",
      title: "WhatsApp Priority Desk",
      handle: "+91 9797941414",
      subHandle: "24/7 Live Support",
      description: "Direct Expedition Consultation, Custom Itinerary Blueprints & Instant Group Bookings.",
      url: whatsappUrl,
      icon: FaWhatsapp,
      badge: "Instant 24/7 Reply",
      brandColor: "#25D366",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      borderHover: "hover:border-[#25D366]",
      glowColor: "rgba(37, 211, 102, 0.35)",
      ctaText: "Chat on WhatsApp",
    },
    {
      id: "youtube",
      title: "YouTube Channel",
      handle: "@kradglobaltravels",
      subHandle: "4K Documentaries",
      description: "Summit Route Walkthroughs, Himalayan Drone Films, Trekker Interviews & Winter Guides.",
      url: youtubeUrl,
      icon: FaYoutube,
      badge: "4K Video Films",
      brandColor: "#FF0000",
      badgeColor: "bg-red-500/20 text-red-300 border-red-500/40",
      borderHover: "hover:border-[#FF0000]",
      glowColor: "rgba(255, 0, 0, 0.35)",
      ctaText: "Subscribe on YouTube",
    },
    {
      id: "facebook",
      title: "Facebook Community",
      handle: "KRAD Global Travels",
      subHandle: "Traveler Community",
      description: "Verified Trekker Reviews, Departure Album Highlights, Photo Galleries & Community Events.",
      url: facebookUrl,
      icon: FaFacebookF,
      badge: "Community Hub",
      brandColor: "#1877F2",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      borderHover: "hover:border-[#1877F2]",
      glowColor: "rgba(24, 119, 242, 0.35)",
      ctaText: "Join on Facebook",
    },
    {
      id: "twitter",
      title: "X (Twitter)",
      handle: "@KradGlobalTour",
      subHandle: "Weather & Alerts",
      description: "High-Altitude Weather Bulletins, Summit Pass Conditions & Flash Expedition Announcements.",
      url: twitterUrl,
      icon: FaXTwitter,
      badge: "Trail Alerts",
      brandColor: "#E2E8F0",
      badgeColor: "bg-slate-700/50 text-slate-200 border-slate-600",
      borderHover: "hover:border-slate-300",
      glowColor: "rgba(255, 255, 255, 0.25)",
      ctaText: "Follow on X",
    },
    {
      id: "whatsapp-community",
      title: "WhatsApp Community & Channel",
      handle: "KRADIND Official Channel",
      subHandle: "Broadcasts & Flash Deals",
      description: "Join official WhatsApp Channel for instant Himalayan trail bulletins, flash departure discounts & trekker community updates.",
      url: whatsappChannelUrl,
      icon: FaWhatsapp,
      badge: "Official Channel",
      brandColor: "#25D366",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      borderHover: "hover:border-[#25D366]",
      glowColor: "rgba(37, 211, 102, 0.35)",
      ctaText: "Join WhatsApp Channel",
    },
    {
      id: "pinterest",
      title: "Pinterest",
      handle: "KradGlobalTravels",
      subHandle: "Visual Moodboards",
      description: "Packing Checklists, High-Altitude Photography Inspiration & Destination Circuits.",
      url: pinterestUrl,
      icon: FaPinterestP,
      badge: "Inspiration",
      brandColor: "#BD081C",
      badgeColor: "bg-rose-600/20 text-rose-300 border-rose-600/40",
      borderHover: "hover:border-[#BD081C]",
      glowColor: "rgba(189, 8, 28, 0.35)",
      ctaText: "Explore on Pinterest",
    },
    {
      id: "website",
      title: "Explore Website",
      handle: "www.kradind.com",
      subHandle: "29+ Packages Live",
      description: "Himalayan Expeditions, Domestic State Packages, Fixed Departure Batches & International Tours.",
      url: "/",
      icon: Globe,
      badge: "Official Portal",
      brandColor: "#10B981",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      borderHover: "hover:border-emerald-400",
      glowColor: "rgba(16, 185, 129, 0.35)",
      ctaText: "Explore Packages",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#051813] text-slate-100 overflow-hidden selection:bg-emerald-500/30 selection:text-white">
      {/* Background Animated Gradient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-emerald-600/15 via-[#0F3A2E]/20 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Subtle Topographic Grid Lines Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F3A2E]/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-2.5 text-xs font-bold animate-fade-in">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Top Breadcrumb / Back Link */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition backdrop-blur-sm"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>← Back to KRADIND Home</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
              title="Share this page"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
              title="Copy link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Hero Brand Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* Logo with Glowing Ring */}
          <div className="relative inline-block mb-4 group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 rounded-3xl blur-md opacity-50 group-hover:opacity-80 transition duration-500 animate-pulse" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#09221B] p-2 border border-emerald-400/40 shadow-2xl flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.png"
                alt="KRADIND Adventures"
                width={96}
                height={96}
                className="object-contain w-full h-full drop-shadow-md"
                priority
              />
            </div>
          </div>

          {/* Verified Brand Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/15 to-amber-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Official KRADIND Adventures Directory</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Connect With <span className="bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-300 bg-clip-text text-transparent">KRADIND</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mt-3 font-medium max-w-xl mx-auto leading-relaxed">
            High-Altitude Expeditions • Tailored Domestic Circuits • Fixed Departure Batches • International Holidays
          </p>

          {/* Authority Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-[11px] font-bold text-slate-300">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>4.9 / 5 Rating (12,000+ Trekkers)</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-emerald-400" />
              <span>Himalayan Certified Expedition Leaders</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Govt. Registered Enterprise</span>
            </span>
          </div>
        </div>

        {/* Top 2-Column Showcase: Interactive QR Station (Left/Top) + Priority Channels (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 items-start">
          
          {/* Interactive QR Station Card (5 Columns on Desktop) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#0F3A2E]/60 to-[#08221B]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-emerald-500/30 shadow-2xl relative overflow-hidden group">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white">Interactive QR Code</h2>
                  <p className="text-[11px] text-emerald-300/80">Scan with any phone camera</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Live QR
              </span>
            </div>

            {/* Target Selector Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-black/40 rounded-xl mb-5 text-[10px] font-bold">
              {[
                { id: "hub", label: "All Links" },
                { id: "whatsapp", label: "WhatsApp" },
                { id: "instagram", label: "Instagram" },
                { id: "linkedin", label: "LinkedIn" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setQrTarget(tab.id as any)}
                  className={`py-1.5 px-1 rounded-lg transition text-center cursor-pointer ${
                    qrTarget === tab.id
                      ? "bg-emerald-600 text-white shadow-xs font-black"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* QR Canvas Display */}
            <div className="relative mx-auto max-w-[280px] p-5 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center border-4 border-emerald-500/30">
              {qrDataUrl ? (
                <div className="relative w-full aspect-square flex items-center justify-center">
                  <img
                    src={qrDataUrl}
                    alt={`KRADIND QR Code - ${qrTarget}`}
                    className="w-full h-full object-contain"
                  />
                  {/* Subtle Center Watermark Badge */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-xl bg-[#09221B] border-2 border-emerald-400 shadow-md flex items-center justify-center p-1">
                      <Image
                        src="/logo.png"
                        alt="KRADIND"
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs animate-pulse">
                  Generating QR...
                </div>
              )}

              <p className="text-[10px] font-bold text-[#0F3A2E] mt-3 uppercase tracking-wider text-center">
                Scan to Open {qrTarget === "hub" ? "KRADIND Directory" : qrTarget.toUpperCase()}
              </p>
            </div>

            {/* Quick QR Actions */}
            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                onClick={handleDownloadQr}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download QR</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-bold transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
                <span>{copied ? "Copied Link" : "Copy Link"}</span>
              </button>
            </div>

            {/* Individual Link Display & One-Click Copy Box */}
            <div className="mt-4 p-3 rounded-xl bg-black/40 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Individual Link:</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Direct URL
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="flex-1 bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-emerald-300 select-all focus:outline-none focus:border-emerald-400 truncate"
                  title="Click to select individual link"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shrink-0 cursor-pointer shadow"
                  title="Copy individual link"
                >
                  {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3 text-white" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Direct WhatsApp Community Link Button */}
            <a
              href={whatsappChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] text-emerald-300 hover:text-slate-950 border border-[#25D366]/40 text-xs font-bold transition shadow-sm"
            >
              <FaWhatsapp className="w-4 h-4" />
              <span>Join WhatsApp Community Channel</span>
            </a>

            {/* One-Click Save Contact Card */}
            <div className="mt-3.5 pt-3.5 border-t border-emerald-500/20 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-300 font-medium">Save to phone contacts:</span>
              <button
                onClick={handleDownloadVCard}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 transition cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Save Contact (vCard)</span>
              </button>
            </div>
          </div>

          {/* Featured Channels: LinkedIn, WhatsApp, Instagram Highlight (7 Columns on Desktop) */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Priority Contact Channels</span>
              </h2>
              <span className="text-[11px] text-slate-400">Direct instant channels</span>
            </div>

            {/* Featured Channel 1: LinkedIn (Special prominence for user request) */}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0A66C2]/15 via-white/[0.04] to-white/[0.02] border border-[#0A66C2]/40 hover:border-[#0A66C2] transition-all duration-300 shadow-lg hover:shadow-[#0A66C2]/20 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition">
                    <FaLinkedinIn className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-white text-base group-hover:text-blue-300 transition">
                        LinkedIn Official Page
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0A66C2]/30 text-blue-200 border border-[#0A66C2]/50">
                        Corporate & B2B
                      </span>
                    </div>
                    <p className="text-xs text-blue-200/90 font-mono mt-0.5">
                      company/krad-india
                    </p>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-medium">
                      Corporate Treks, Offsite Expeditions, Student Outdoor Education, B2B Travel Partnerships & Careers.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 p-2 rounded-xl bg-white/5 group-hover:bg-[#0A66C2] text-slate-300 group-hover:text-white transition">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </a>

            {/* Featured Channel 2: WhatsApp Desk */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#25D366]/15 via-white/[0.04] to-white/[0.02] border border-[#25D366]/40 hover:border-[#25D366] transition-all duration-300 shadow-lg hover:shadow-[#25D366]/20 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition">
                    <FaWhatsapp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition">
                        WhatsApp 24/7 Concierge
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Instant Response
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/90 font-mono mt-0.5">
                      +91 9797941414
                    </p>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-medium">
                      Direct consultation with mountain leaders, custom group quotes, and batch slot confirmations.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 p-2 rounded-xl bg-white/5 group-hover:bg-[#25D366] text-slate-300 group-hover:text-white transition">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </a>

            {/* Featured Channel 3: Instagram */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#E1306C]/15 via-white/[0.04] to-white/[0.02] border border-[#E1306C]/40 hover:border-[#E1306C] transition-all duration-300 shadow-lg hover:shadow-[#E1306C]/20 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition">
                    <FaInstagram className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-white text-base group-hover:text-rose-300 transition">
                        Instagram Community
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        Summit Stories
                      </span>
                    </div>
                    <p className="text-xs text-rose-200/90 font-mono mt-0.5">
                      @kradglobal
                    </p>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-medium">
                      Daily high-altitude summit reels, snowfall updates, camper stories, and live trail radars.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 p-2 rounded-xl bg-white/5 group-hover:bg-[#E1306C] text-slate-300 group-hover:text-white transition">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </a>

            {/* Featured Channel 4: WhatsApp Official Community & Channel */}
            <a
              href={whatsappChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#25D366]/20 via-[#25D366]/10 to-white/[0.02] border border-[#25D366]/50 hover:border-[#25D366] transition-all duration-300 shadow-lg hover:shadow-[#25D366]/25 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#25D366] text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition font-black">
                    <FaWhatsapp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition">
                        WhatsApp Official Channel & Community
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/25 text-emerald-200 border border-emerald-500/50">
                        Channel Updates
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/90 font-mono mt-0.5 truncate max-w-sm">
                      whatsapp.com/channel/0029Vb8H9BNKmCPWGI94Ro34
                    </p>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-medium">
                      Follow official broadcasts for high-altitude weather bulletins, trek pass conditions, flash departure deals & community announcements.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 p-2 rounded-xl bg-white/5 group-hover:bg-[#25D366] text-slate-300 group-hover:text-slate-950 transition">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* All Channels Grid Section */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              <span>Explore All Social Channels</span>
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              {socialChannels.length} Official Handles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <a
                  key={channel.id}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 ${channel.borderHover} transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 overflow-hidden`}
                >
                  {/* Subtle Top Border Glow on Hover */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition duration-300"
                    style={{ backgroundColor: channel.brandColor }}
                  />

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition group-hover:scale-110 shadow-xs"
                        style={{ backgroundColor: channel.brandColor }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${channel.badgeColor}`}>
                        {channel.badge}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-white text-base group-hover:text-emerald-300 transition">
                      {channel.title}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {channel.handle}
                    </p>
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {channel.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition">
                    <span>{channel.ctaText}</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Ground Office & Direct Communication Hub Card */}
        <div className="bg-gradient-to-r from-[#0B2A22] via-[#0F3A2E] to-[#0B2A22] rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <MapPin className="w-3 h-3" />
                <span>Headquarters & Ground Support</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                KRADIND Adventures Private Limited
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                {address}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-200 pt-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>24/7 Expedition Control Room</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Govt. Tax & Registration Verified</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>Call {phone}</span>
              </a>

              <a
                href={`mailto:${email}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition"
              >
                <Mail className="w-4 h-4 text-amber-300" />
                <span>Email {email}</span>
              </a>

              <button
                onClick={handleDownloadVCard}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-black/40 hover:bg-black/60 text-slate-200 border border-white/10 text-xs font-bold transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Save VCard Contact</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-slate-500 mt-12 space-y-1">
          <p>© {new Date().getFullYear()} KRADIND Adventures Private Limited. All rights reserved.</p>
          <p className="text-[11px] text-slate-600">
            Official Travel Portfolio • Designed for Mountain Enthusiasts & Global Travelers.
          </p>
        </div>

      </main>
    </div>
  );
}
