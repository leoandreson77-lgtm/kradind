"use client";

import React, { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { FaWhatsapp, FaXTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa6";

export function SocialShare({
  title = "Explore Certified Himalayan Treks & Live Trail Radar with KRADIND Adventures",
  url = "https://kradind.com",
}: {
  title?: string;
  url?: string;
} = {}) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url;
  const shareTitle = title;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-100 border-t border-b border-slate-200/80 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-bold">
          <Share2 className="w-4 h-4 text-[#FF6B35]" />
          <span>Share KRADIND Adventures &amp; Live Trail Radar:</span>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* WhatsApp Share */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `${shareTitle} - ${shareUrl}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
            className="flex items-center gap-1.5 px-3.5 py-2.5 min-h-[42px] rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#075E54] hover:text-white border border-[#25D366]/40 font-bold transition text-xs"
          >
            <FaWhatsapp className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          {/* WhatsApp Community Channel */}
          <a
            href="https://whatsapp.com/channel/0029Vb8H9BNKmCPWGI94Ro34"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join WhatsApp Community"
            className="flex items-center gap-1.5 px-3.5 py-2.5 min-h-[42px] rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition shadow-sm text-xs"
          >
            <FaWhatsapp className="w-4 h-4" />
            <span>Join Community</span>
          </a>

          {/* X / Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              shareUrl
            )}&text=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X (Twitter)"
            className="flex items-center gap-1.5 px-3.5 py-2.5 min-h-[42px] rounded-full bg-slate-200 hover:bg-slate-900 text-slate-900 hover:text-white border border-slate-300 font-bold transition text-xs"
          >
            <FaXTwitter className="w-4 h-4" />
            <span>X / Twitter</span>
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="flex items-center gap-1.5 px-3.5 py-2.5 min-h-[42px] rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#0d5ac1] hover:text-white border border-[#1877F2]/30 font-bold transition text-xs"
          >
            <FaFacebookF className="w-4 h-4" />
            <span>Facebook</span>
          </a>

          {/* LinkedIn */}
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
            className="flex items-center gap-1.5 px-3.5 py-2.5 min-h-[42px] rounded-full bg-[#0A66C2]/10 hover:bg-[#0A66C2] text-[#004182] hover:text-white border border-[#0A66C2]/30 font-bold transition text-xs"
          >
            <FaLinkedinIn className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>

          {/* Individual Link Display & Copy Button */}
          <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-full pl-3 pr-1 py-1 min-h-[42px] max-w-[280px] sm:max-w-[320px]">
            <label htmlFor="share-page-url-input" className="sr-only">
              Direct page URL to share
            </label>
            <input
              id="share-page-url-input"
              type="text"
              readOnly
              aria-label="Direct page URL to share"
              value={shareUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="bg-transparent text-[11px] font-mono text-slate-700 focus:outline-none w-full select-all truncate"
              title="Individual link"
            />
            <button
              onClick={handleCopy}
              type="button"
              aria-label="Copy page link to clipboard"
              className="shrink-0 flex items-center gap-1 px-3 py-2 min-h-[36px] rounded-full bg-slate-900 hover:bg-emerald-700 text-white text-[11px] font-semibold transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
