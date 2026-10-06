"use client";

import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Root Layout Error Caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center border border-rose-500/30 text-2xl font-bold">
            !
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Application Notice
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              The application encountered a critical runtime error. Click below to reload.
            </p>
            {error?.message && (
              <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-700/50 text-left font-mono text-[11px] text-rose-300 break-words max-h-28 overflow-y-auto">
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
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md"
            >
              Reload Page
            </button>
            <a
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl transition inline-block text-center"
            >
              Back to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
