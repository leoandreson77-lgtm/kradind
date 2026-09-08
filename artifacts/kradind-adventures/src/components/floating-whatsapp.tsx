"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const whatsappUrl = "https://wa.link/n3u8c0";

  // Hide WhatsApp floating button on Admin CMS pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // On Landing Pages (/lp/...), mobile already has a dedicated sticky action bar with WhatsApp & Enquire.
  // Hide the floating widget on mobile (< lg) for /lp/ pages so it never overlaps the action bar buttons.
  const isLandingPage = pathname?.startsWith("/lp");

  return (
    <div
      className={`fixed z-50 select-none ${
        isLandingPage
          ? "hidden lg:block bottom-6 right-6"
          : "bottom-5 right-5 sm:bottom-6 sm:right-6"
      }`}
    >
      {/* Animated Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="animate-whatsapp-btn flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 shadow-xl"
      >
        <FaWhatsapp className="w-8 h-8 text-white" />
      </a>
    </div>
  );
}
