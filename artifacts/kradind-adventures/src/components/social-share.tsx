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

        <div className="flex items-center flex-wrap gap-2">
          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `${shareTitle} - ${shareUrl}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white border border-[#25D366]/30 font-semibold transition"
          >
            <FaWhatsapp className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          {/* X / Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              shareUrl
            )}&text=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X (Twitter)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200 hover:bg-slate-900 text-slate-800 hover:text-white border border-slate-300 font-semibold transition"
          >
            <FaXTwitter className="w-3.5 h-3.5" />
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/30 font-semibold transition"
          >
            <FaFacebookF className="w-3.5 h-3.5" />
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0A66C2]/10 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white border border-[#0A66C2]/30 font-semibold transition"
          >
            <FaLinkedinIn className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </a>

          {/* Copy Link */}
          <button
            onClick={handleCopy}
            type="button"
            aria-label="Copy page link to clipboard"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 font-semibold transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-500" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
