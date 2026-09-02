"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);
  const phoneNumber = "917500222141";
  const defaultMessage = encodeURIComponent(
    "Hi KRADIND Adventures! I'm interested in booking a trek and would like to know about available dates and packages.",
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 select-none">
      {/* Floating Tooltip Pill */}
      {showTooltip && (
        <div className="bg-white text-slate-800 text-xs font-semibold py-1.5 px-3 rounded-full shadow-lg border border-slate-200/80 flex items-center gap-2 animate-bounce">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-700 font-bold"
          >
            Chat with Trek Expert!
          </a>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-600 ml-1"
            aria-label="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main WhatsApp Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-2xl shadow-emerald-900/40 transition-all duration-300 transform hover:scale-110 active:scale-95"
      >
        {/* Glow / Pulse rings */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-60 animate-ping duration-1000 -z-10" />

        {/* WhatsApp Icon (SVG for crisp official look) */}
        <svg
          className="w-8 h-8 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.093-1.84-.408-1.503-.625-2.484-2.146-2.56-2.247-.075-.101-.611-.813-.611-1.554 0-.741.388-1.106.526-1.256.138-.15.3-.188.4-.188.1 0 .201.002.288.006.092.004.215-.035.337.257.123.293.424 1.033.461 1.108.038.075.063.163.013.263-.05.1-.075.163-.15.251-.076.088-.16.196-.228.263-.076.075-.155.157-.067.308.088.15.391.644.838 1.042.577.513 1.063.672 1.214.747.151.075.24.063.328-.038.089-.1.377-.44.477-.591.101-.15.201-.126.339-.076.138.05.877.414 1.028.489.151.076.251.114.288.176.038.063.038.366-.106.771zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.178L2 22l4.957-1.399C8.423 21.499 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
        </svg>
      </a>
    </div>
  );
}
