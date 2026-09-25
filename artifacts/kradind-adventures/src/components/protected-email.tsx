"use client";

import React, { useState, useEffect } from "react";
import { Mail } from "lucide-react";

interface ProtectedEmailProps {
  email?: string;
  className?: string;
  showIcon?: boolean;
}

/**
 * Renders an anti-scraping protected email link.
 * In SSR (HTML crawled by bots & SEOptimer), renders an obfuscated format without mailto: or raw @
 * to pass Email Privacy audits and prevent spam harvesters.
 * In client browser, immediately renders full clickable mailto link for real human users.
 */
export function ProtectedEmailLink({
  email = "support@kradind.com",
  className = "flex items-center gap-2.5 hover:text-emerald-400 transition group",
  showIcon = true,
}: ProtectedEmailProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [user, domain] = email.split("@");
  const obfuscatedText = `${user || "support"} [at] ${domain || "kradind.com"}`;

  if (!mounted) {
    return (
      <a
        href="/contact"
        className={className}
        title="Contact KRAD Global Support"
      >
        {showIcon && (
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition">
            <Mail className="w-3.5 h-3.5" />
          </div>
        )}
        <span>{obfuscatedText}</span>
      </a>
    );
  }

  return (
    <a
      href={`mailto:${email}`}
      className={className}
      title={`Email ${email}`}
    >
      {showIcon && (
        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition">
          <Mail className="w-3.5 h-3.5" />
        </div>
      )}
      <span>{email}</span>
    </a>
  );
}

export function ProtectedContactCardEmail({
  email = "support@kradind.com",
}: {
  email?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [user, domain] = email.split("@");
  const obfuscatedText = `${user || "support"} [at] ${domain || "kradind.com"}`;

  if (!mounted) {
    return (
      <a
        href="/contact"
        className="text-xs text-slate-600 hover:text-emerald-700 font-medium mt-1 block"
        title="Contact KRAD Global Support"
      >
        {obfuscatedText}
      </a>
    );
  }

  return (
    <a
      href={`mailto:${email}`}
      className="text-xs text-slate-600 hover:text-emerald-700 font-medium mt-1 block"
      title={`Email ${email}`}
    >
      {email}
    </a>
  );
}
