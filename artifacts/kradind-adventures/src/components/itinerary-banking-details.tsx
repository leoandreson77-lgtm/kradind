"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Building2,
  Copy,
  Check,
  ShieldCheck,
  QrCode,
  Smartphone,
  ExternalLink,
  Globe,
  Phone,
  Mail,
  Share2,
} from "lucide-react";

export const KRADIND_BANK_DETAILS = {
  bankName: "ICICI Bank",
  accountName: "KRAD GLOBAL EXIM (INDIA) PRIVATE LIMITED",
  accountNumber: "778305500099",
  ifscCode: "ICIC0000021",
  accountType: "Current Account (CAA)",
  customerId: "594802615",
  primaryUpiId: "9999797269.ibz@icici",
  eazypayUpiId: "mskradglobaleximindiaprivatelimited.eazypay@icici",
  qrImage: "/payment-qr.jpg",
  helplinePhone: "+91 97979 41414",
  secondaryPhone: "+91 99997 97269",
  email: "info@kradind.com",
  website: "https://kradind.com",
};

export const KRADIND_SOCIAL_LINKS = [
  {
    name: "Instagram",
    handle: "@kradind_adventures",
    url: "https://instagram.com/kradind_adventures",
    color: "#E1306C",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    handle: "KRADIND Adventures",
    url: "https://facebook.com/kradind",
    color: "#1877F2",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    handle: "@kradind",
    url: "https://youtube.com/@kradind",
    color: "#FF0000",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    handle: "KRADIND Adventures",
    url: "https://linkedin.com/company/kradind",
    color: "#0A66C2",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    handle: "+91 97979 41414",
    url: "https://wa.me/919797941414",
    color: "#25D366",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15s-.78.98-.956 1.181c-.176.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.676-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.238-.244-.589-.493-.509-.678-.518-.176-.009-.377-.01-.578-.01s-.527.076-.803.376c-.276.301-1.054 1.03-1.054 2.511s1.079 2.912 1.23 3.113c.15.2 2.123 3.242 5.143 4.547.719.311 1.281.497 1.719.636.723.23 1.381.198 1.901.12.58-.088 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.076-.125-.276-.201-.578-.352zM12.04 21.678c-1.737 0-3.435-.447-4.938-1.298l-.354-.2-3.667.962.979-3.575-.231-.367c-.933-1.485-1.425-3.21-1.425-4.981 0-5.289 4.303-9.592 9.593-9.592 2.562 0 4.97 1 6.782 2.812 1.812 1.812 2.812 4.22 2.812 6.782 0 5.289-4.303 9.592-9.593 9.592zm0-21.678c-6.627 0-12 5.373-12 12 0 2.115.549 4.103 1.512 5.834l-1.552 5.666 5.803-1.522c1.67.915 3.585 1.422 5.637 1.422 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
      </svg>
    ),
  },
];

interface ItineraryBankingDetailsProps {
  compact?: boolean;
  className?: string;
  showSocials?: boolean;
}

export function ItineraryBankingDetails({
  compact = false,
  className = "",
  showSocials = true,
}: ItineraryBankingDetailsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className={`space-y-6 page-break-inside-avoid ${className}`}>
      {/* 1. Official Bank & UPI Payment Section */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0B2B22] to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-500/30 overflow-hidden relative print:bg-slate-900 print:text-white">
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Ribbon */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                Official Corporate Account
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>ICICI Bank • Booking &amp; Advance Deposit Details</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Verified
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Secure Merchant Gateway</span>
          </div>
        </div>

        {/* Main Content Grid: Account Data Left, Scan QR Right */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Left Column: Bank Account Details */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Account Holder Name */}
              <div className="sm:col-span-2 bg-white/5 rounded-2xl p-3 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Account Holder Name
                </span>
                <div className="text-xs sm:text-sm font-extrabold text-white tracking-wide flex items-center justify-between gap-2">
                  <span className="break-words">{KRADIND_BANK_DETAILS.accountName}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(KRADIND_BANK_DETAILS.accountName, "name")}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
                    title="Copy Name"
                  >
                    {copiedField === "name" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Account Number */}
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Current Account Number
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm sm:text-base font-black text-amber-300 tracking-wider">
                    {KRADIND_BANK_DETAILS.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(KRADIND_BANK_DETAILS.accountNumber, "acc")}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                    title="Copy Account Number"
                  >
                    {copiedField === "acc" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* IFSC Code */}
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  IFSC Code (All Branches)
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm sm:text-base font-black text-emerald-400 tracking-wider">
                    {KRADIND_BANK_DETAILS.ifscCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(KRADIND_BANK_DETAILS.ifscCode, "ifsc")}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                    title="Copy IFSC"
                  >
                    {copiedField === "ifsc" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Account Type & Bank */}
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Bank &amp; Account Type
                </span>
                <div className="text-xs font-bold text-slate-200">
                  {KRADIND_BANK_DETAILS.bankName} • {KRADIND_BANK_DETAILS.accountType}
                </div>
              </div>

              {/* Primary UPI ID */}
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Instant UPI ID (VPA)
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-sky-300 truncate">
                    {KRADIND_BANK_DETAILS.primaryUpiId}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(KRADIND_BANK_DETAILS.primaryUpiId, "upi")}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
                    title="Copy UPI ID"
                  >
                    {copiedField === "upi" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Note & Helpline */}
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/20 text-[11px] text-slate-300 flex items-start gap-2.5">
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Payment Intimation Note: </strong>
                After completing the bank transfer or UPI payment, kindly share the screenshot / UTR transaction reference
                number on WhatsApp at{" "}
                <a
                  href={`https://wa.me/919797941414?text=Hi%20KRADIND,%20here%20is%20my%20advance%20token%20payment%20receipt`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-emerald-300 underline underline-offset-2 hover:text-emerald-200"
                >
                  +91 97979 41414
                </a>{" "}
                for instant receipt generation &amp; hotel voucher lock.
              </div>
            </div>
          </div>

          {/* Right Column: High-DPI Official ICICI Bank QR Code */}
          <div className="md:col-span-4 bg-white text-slate-900 rounded-2xl p-4 flex flex-col items-center justify-between shadow-md border border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0F3A2E]">
                Scan &amp; Pay Instant UPI
              </span>
            </div>

            {/* QR Image Box */}
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-xl overflow-hidden border-2 border-slate-200 bg-white p-1 shadow-inner flex items-center justify-center">
              <img
                src={KRADIND_BANK_DETAILS.qrImage}
                alt="ICICI Bank Eazypay QR Code - KRAD GLOBAL EXIM"
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>

            {/* Accepted UPI Apps Banner */}
            <div className="mt-3 pt-2 border-t border-slate-100 w-full space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Accepts All UPI Apps
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] font-semibold text-slate-700">
                <span>Google Pay</span>
                <span>•</span>
                <span>PhonePe</span>
                <span>•</span>
                <span>Paytm</span>
                <span>•</span>
                <span>CRED</span>
                <span>•</span>
                <span>BHIM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Official Social Media Channels & Connect Ribbon */}
      {showSocials && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:bg-slate-50 page-break-inside-avoid">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
              Official Community &amp; Support
            </span>
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>Connect with KRADIND Adventures</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Follow Us
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Live trail updates, mountain photos, client video reviews, and seasonal holiday packages.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {KRADIND_SOCIAL_LINKS.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-bold transition shadow-2xs group"
                title={`${item.name}: ${item.handle}`}
              >
                <span className="group-hover:scale-110 transition-transform" style={{ color: item.color }}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
