"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Shield } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception for debugging
    console.error("Root Application Error Caught:", error);
  }, [error]);

  const isMaybeAdmin = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-md rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FF6B35]/15 text-[#FF6B35] flex items-center justify-center border border-[#FF6B35]/30">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white tracking-tight">
            {isMaybeAdmin ? "Admin Portal Notice" : "Application Error"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {isMaybeAdmin
              ? "A client-side issue occurred while rendering the management portal."
              : "Something went wrong while loading this page. Our team has been notified."}
          </p>
          {error?.message && (
            <div className="mt-3 p-3 bg-slate-950/60 rounded-xl border border-slate-700/50 text-left font-mono text-[11px] text-rose-300 break-words max-h-28 overflow-y-auto">
              {error.message}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.reload();
              } else {
                reset();
              }
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#0F3A2E] hover:bg-[#164e3f] text-emerald-200 border border-emerald-500/30 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Page</span>
          </button>

          {isMaybeAdmin ? (
            <Link
              href="/admin/login"
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          )}
        </div>

        <div className="pt-2 border-t border-slate-700/60 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to KRADIND Adventures Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
