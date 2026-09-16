import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookOpen, Calendar, Clock, ArrowRight, Tag, Compass, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Travel Blog & Himalayan Trek Guides | KRADIND Adventures",
  description:
    "Expert trekking guides, travel tips, high-altitude preparation, destination guides, and inspiring traveler stories by KRADIND Adventures.",
  alternates: {
    canonical: "https://kradind.com/blog",
  },
  openGraph: {
    title: "Travel Blog & Himalayan Trek Guides | KRADIND Adventures",
    description: "Expert trekking guides, travel tips, and stories by KRADIND Adventures.",
    url: "https://kradind.com/blog",
    type: "website",
  },
};

const BLOG_CATEGORIES = [
  { name: "Trekking Guides", slug: "trekking-guides", desc: "Detailed step-by-step trail itineraries, maps & campsites.", icon: "🏔️" },
  { name: "Travel Guides", slug: "travel-guides", desc: "Complete state and country holiday guides.", icon: "🗺️" },
  { name: "Trekking Tips", slug: "trekking-tips", desc: "High-altitude sickness, packing checklists & fitness drills.", icon: "🎒" },
  { name: "Travel Tips", slug: "travel-tips", desc: "Smart hacks for budget travel, visas & luggage management.", icon: "💡" },
  { name: "Destination Guides", slug: "destination-guides", desc: "Best seasons, weather updates & local attractions.", icon: "📍" },
  { name: "Trek Stories", slug: "trek-stories", desc: "First-hand accounts from mountain summits and remote passes.", icon: "📖" },
];

const FEATURED_ARTICLES = [
  {
    title: "Ultimate Guide to Hampta Pass Crossover: Kullu to Spiti Valley",
    slug: "hampta-pass-crossover-guide",
    category: "Trekking Guides",
    categorySlug: "trekking-guides",
    date: "Sep 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    excerpt: "Everything you need to know about navigating the dramatic landscape shift from lush green Manali meadows to barren Spiti desert.",
  },
  {
    title: "How to Prevent Acute Mountain Sickness (AMS) on High Himalayan Trails",
    slug: "how-to-prevent-ams-mountain-sickness",
    category: "Trekking Tips",
    categorySlug: "trekking-tips",
    date: "Aug 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    excerpt: "Essential acclimatization schedules, hydration protocols, and Diamox guidelines certified by wilderness first responders.",
  },
  {
    title: "Chopta Tungnath Chandrashila: The Crown Jewel of Garhwal Uttarakhand",
    slug: "chopta-tungnath-chandrashila-trek-guide",
    category: "Destination Guides",
    categorySlug: "destination-guides",
    date: "Aug 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    excerpt: "A beginner-friendly Himalayan summit offering 360-degree views of Nanda Devi, Chaukhamba, and Trishul peaks.",
  },
  {
    title: "10 Essential Gear Items Every First-Time Himalayan Trekker Needs",
    slug: "essential-himalayan-trek-gear-checklist",
    category: "Travel Tips",
    categorySlug: "travel-tips",
    date: "Jul 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
    excerpt: "From waterproof trekking boots to moisture-wicking base layers: the definitive gear list for alpine trails.",
  },
  {
    title: "Exploring Leh Ladakh: High Passes, Monasteries and Pangong Tso Secrets",
    slug: "leh-ladakh-travel-guide",
    category: "Travel Guides",
    categorySlug: "travel-guides",
    date: "Jun 2026",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
    excerpt: "Planning the ultimate high-altitude road trip across Khardung La, Nubra Valley sand dunes, and turquoise salt lakes.",
  },
  {
    title: "A Night Under the Stars at Kheerganga: Thermal Springs and Pine Meadows",
    slug: "kheerganga-trek-hot-springs-story",
    category: "Trek Stories",
    categorySlug: "trek-stories",
    date: "Jun 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    excerpt: "A traveler's journal capturing the natural sulfur pools and tranquil Parvati Valley campfires.",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            The Himalayan & Travel Journal
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 brand-font">
            Travel Blog & Trekking Guides
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Written by certified Himalayan mountaineers and travel specialists. Discover in-depth trail routes, mountain fitness guides, gear recommendations, and destination insights.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BLOG_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/${cat.slug}`}
              className="bg-white border border-slate-200 rounded-xl p-3.5 text-center hover:border-emerald-500 hover:shadow-md transition group flex flex-col items-center justify-center space-y-1.5"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-bold text-xs text-slate-800 group-hover:text-emerald-900 block leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Featured Blog Posts Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 brand-font">
              Latest Guides & Articles
            </h2>
            <span className="text-xs text-slate-500">Curated by KRADIND Editorial Team</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_ARTICLES.map((article) => (
              <article
                key={article.slug}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition duration-300 flex flex-col group"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute top-3 left-3">
                    <Link
                      href={`/blog/${article.categorySlug}`}
                      className="bg-[#0F3A2E] text-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs hover:bg-emerald-900 transition"
                    >
                      {article.category}
                    </Link>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {article.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#FF6B35] transition leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <Link
                      href="/treks"
                      className="font-bold text-[#0F3A2E] hover:text-[#FF6B35] inline-flex items-center gap-1 transition"
                    >
                      <span>Explore Related Tours</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
