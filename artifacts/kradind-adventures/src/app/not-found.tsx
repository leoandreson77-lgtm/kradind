"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Compass,
  Home,
  Mountain,
  Phone,
  MessageCircle,
  ArrowRight,
  Clock,
  Sparkles,
  Search,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(6);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    if (countdown <= 1) {
      router.push("/");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isPaused, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#071d17] to-slate-950 text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-white/10 px-4 sm:px-8 py-4 backdrop-blur-md bg-slate-950/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="KRADIND"
              width={160}
              height={50}
              priority
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <a
              href="https://wa.me/919797941414"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 transition font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: +91 9797941414</span>
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero 404 Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-20 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl w-full text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-widest shadow-lg">
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
            <span>404 • Trail Route Not Found</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Package No Longer <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">Available</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300/90 max-w-lg mx-auto leading-relaxed">
              This expedition or holiday package has been retired, removed, or updated to a new seasonal itinerary.
            </p>
          </div>

          {/* Auto-Redirect Countdown Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md max-w-md mx-auto shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-xs text-amber-300 font-bold mb-3">
              <Clock className="w-4 h-4 animate-pulse text-amber-400" />
              <span>
                Redirecting to homepage in <strong className="text-white text-base font-mono">{countdown}s</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#0F3A2E] hover:from-emerald-500 hover:to-emerald-700 text-white text-xs font-bold shadow-lg transition active:scale-95"
              >
                <Home className="w-4 h-4" />
                <span>Go to Homepage</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold border border-white/10 transition cursor-pointer"
              >
                <span>{isPaused ? "▶ Resume Redirect" : "⏸ Stay on this Page"}</span>
              </button>
            </div>
          </div>

          {/* Popular Categories Shortcut */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">
              Explore Active Collections
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <Link
                href="/treks"
                className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-emerald-950 border border-emerald-500/30 text-emerald-200 font-bold transition flex items-center gap-1.5 hover:scale-105"
              >
                <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                <span>Himalayan Treks</span>
              </Link>
              <Link
                href="/domestic-trips"
                className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-amber-950 border border-amber-500/30 text-amber-200 font-bold transition flex items-center gap-1.5 hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Domestic Holiday Tours</span>
              </Link>
              <Link
                href="/international-trips"
                className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-sky-950 border border-sky-500/30 text-sky-200 font-bold transition flex items-center gap-1.5 hover:scale-105"
              >
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>International Trips</span>
              </Link>
            </div>
          </div>

          {/* Helpline Text */}
          <div className="text-xs text-slate-400 pt-2">
            Looking for a specific trip or customized dates?{" "}
            <a
              href="https://wa.me/919797941414?text=Hello%20KRADIND,%20I%20am%20looking%20for%20a%20tour%20package."
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-bold underline hover:text-emerald-300"
            >
              Chat directly with our trip specialists
            </a>{" "}
            or write to <span className="font-mono text-white font-bold">Info@kradind.com</span>.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} KRADIND. All rights reserved. • Email: Info@kradind.com • Helpline: +91 9797941414
      </footer>
    </div>
  );
}
