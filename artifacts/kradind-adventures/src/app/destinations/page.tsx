import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MapPin, ArrowRight, Mountain, Sparkles, Compass, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Top Travel Destinations in India & International | KRADIND Adventures",
  description:
    "Explore the best travel destinations curated by KRADIND: Uttarakhand, Himachal Pradesh, Kashmir, Ladakh, Rajasthan, Kerala, Goa, and Nepal.",
  alternates: {
    canonical: "https://kradind.com/destinations",
  },
  openGraph: {
    title: "Top Travel Destinations in India & International | KRADIND Adventures",
    description: "Explore top travel destinations curated by KRADIND Adventures.",
    url: "https://kradind.com/destinations",
    type: "website",
  },
};

import { getDestinationsAsync, getDefaultDestinations } from "@/lib/cms-store";

export const revalidate = 60;

export default async function DestinationsPage() {
  const allDestinations = await getDestinationsAsync();
  const destinations = (allDestinations || getDefaultDestinations()).filter(
    (d) => d.status === "Published"
  );
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Fixed Sticky Top Navigation Header */}
      <div className="sticky top-0 z-50 w-full shadow-xs">
        <TopBar />
        <Header />
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            Explore India & The World
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 brand-font">
            Handpicked Travel Destinations
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            From the soaring summits of Uttarakhand and Himachal to the golden sand dunes of Rajasthan and tropical backwaters of Kerala, discover our verified destinations.
          </p>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <Image
                  src={dest.image}
                  alt={`${dest.name} holiday destination by KRADIND`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${dest.color || "from-emerald-900/80"} via-black/30 to-transparent`} />
                {dest.badge && (
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    {dest.badge}
                  </span>
                )}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-lg font-extrabold leading-tight drop-shadow-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    {dest.name}
                  </h3>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-600 leading-snug">
                  {dest.tagline}
                </p>

                {/* Duration & Itinerary badge & Price */}
                {(dest.duration || (dest.itinerary && dest.itinerary.length > 0) || dest.price) && (
                  <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                    <span className="font-semibold text-emerald-800 flex items-center gap-1">
                      {dest.itinerary && dest.itinerary.length > 0 ? (
                        <>
                          <Calendar className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{dest.itinerary.length} Days Itinerary</span>
                        </>
                      ) : dest.duration ? (
                        <>
                          <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{dest.duration}</span>
                        </>
                      ) : null}
                    </span>
                    {dest.price && (
                      <span className="font-extrabold text-slate-900">
                        ₹{dest.price.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {dest.highlights && dest.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {dest.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B35] group-hover:translate-x-1 transition-transform">
                    Explore {dest.name} Tours <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
