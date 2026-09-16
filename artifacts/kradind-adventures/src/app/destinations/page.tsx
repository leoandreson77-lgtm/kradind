import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MapPin, ArrowRight, Mountain, Sparkles, Compass } from "lucide-react";

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

const DESTINATIONS = [
  {
    name: "Uttarakhand",
    slug: "uttarakhand",
    tagline: "Land of Gods, Sacred Rivers & Snowy Peaks",
    highlights: ["Chopta Tungnath", "Kedarkantha", "Nainital", "Rishikesh"],
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    badge: "Most Popular",
    color: "from-emerald-900/80",
  },
  {
    name: "Himachal Pradesh",
    slug: "himachal-pradesh",
    tagline: "Apple Orchards, Pine Valleys & High Passes",
    highlights: ["Hampta Pass", "Manali", "Kheerganga", "Spiti Valley"],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
    color: "from-blue-900/80",
  },
  {
    name: "Kashmir",
    slug: "kashmir",
    tagline: "Paradise On Earth & Serene Alpine Lakes",
    highlights: ["Srinagar Dal Lake", "Gulmarg", "Pahalgam", "Great Lakes"],
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
    badge: "Alpine Gem",
    color: "from-teal-900/80",
  },
  {
    name: "Ladakh",
    slug: "ladakh",
    tagline: "Moonscapes, Ancient Gompas & Pangong Tso",
    highlights: ["Leh Palace", "Nubra Valley", "Khardung La", "Pangong Tso"],
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    badge: "High Altitude",
    color: "from-sky-900/80",
  },
  {
    name: "Rajasthan",
    slug: "rajasthan",
    tagline: "Royal Forts, Palaces & Golden Desert Dunes",
    highlights: ["Jaipur Amber Fort", "Udaipur Lake Pichola", "Jaisalmer Dunes"],
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
    badge: "Heritage",
    color: "from-amber-900/80",
  },
  {
    name: "Kerala",
    slug: "kerala",
    tagline: "God's Own Country, Tea Valleys & Backwaters",
    highlights: ["Alleppey Houseboats", "Munnar Tea Gardens", "Wayanad"],
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    badge: "Tropical",
    color: "from-emerald-950/80",
  },
  {
    name: "Goa",
    slug: "goa",
    tagline: "Sun-Kissed Beaches, Coastal Cafes & Watersports",
    highlights: ["Calangute Beach", "Old Goa Churches", "Dudhsagar Falls"],
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    badge: "Beach Escapes",
    color: "from-rose-900/80",
  },
  {
    name: "Nepal",
    slug: "nepal",
    tagline: "Himalayan Kingdom, Stupas & High Summits",
    highlights: ["Kathmandu Valley", "Pokhara", "Annapurna", "Chitwan"],
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    badge: "International",
    color: "from-purple-900/80",
  },
];

export default function DestinationsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar />
      <Header />

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
          {DESTINATIONS.map((dest) => (
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
                <div className={`absolute inset-0 bg-gradient-to-t ${dest.color} via-black/30 to-transparent`} />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  {dest.badge}
                </span>
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

                <div className="space-y-2 pt-2 border-t border-slate-100">
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
