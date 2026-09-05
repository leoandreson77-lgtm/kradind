"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export function FloatingWhatsApp() {
  const phoneNumber = "917500222141";
  const defaultMessage = encodeURIComponent(
    "Hi KRADIND Adventures! I'm interested in booking a trek and would like to know about available dates and packages.",
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 select-none">
      {/* Animated Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="animate-whatsapp-btn flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full transition-transform duration-200 hover:scale-110 active:scale-95"
      >
        <FaWhatsapp className="w-8 h-8 text-white" />
      </a>
    </div>
  );
}
