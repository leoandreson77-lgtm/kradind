import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookOpen, Calendar, Clock, ArrowRight, ArrowLeft } from "lucide-react";

const CATEGORY_MAP: Record<string, { name: string; title: string; desc: string }> = {
  "trekking-guides": {
    name: "Trekking Guides",
    title: "Himalayan Trekking Guides & Itineraries",
    desc: "Comprehensive route blueprints, elevation profiles, day-by-day itineraries, and safety protocols for alpine Himalayan trails.",
  },
  "travel-guides": {
    name: "Travel Guides",
    title: "Domestic & International Travel Guides",
    desc: "Complete destination guides, curated sightseeing circuits, local culture insights, and travel recommendations.",
  },
  "trekking-tips": {
    name: "Trekking Tips",
    title: "Mountain Trekking Tips & Safety Protocols",
    desc: "Altitude sickness prevention, physical fitness prep, layering rules, and trail etiquette from certified trek leaders.",
  },
  "travel-tips": {
    name: "Travel Tips",
    title: "Smart Travel Tips & Hacks",
    desc: "Packing advice, travel insurance guidelines, budgeting tricks, and seamless airport transit tips.",
  },
  "destination-guides": {
    name: "Destination Guides",
    title: "Regional Destination Guides",
    desc: "Detailed breakdowns of the best seasons, weather patterns, and top highlights across India and global getaways.",
  },
  "trek-stories": {
    name: "Trek Stories",
    title: "Summit Diaries & Trekker Stories",
    desc: "Inspiring first-person narratives, photographic memoirs, and life-changing experiences from high mountain passes.",
  },
};

const ALL_ARTICLES = [
  {
    title: "Ultimate Guide to Hampta Pass Crossover: Kullu to Spiti Valley",
    categorySlug: "trekking-guides",
    category: "Trekking Guides",
    date: "Sep 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    excerpt: "Everything you need to know about navigating the dramatic landscape shift from lush green Manali meadows to barren Spiti desert.",
  },
  {
    title: "Chopta Tungnath Chandrashila: The Crown Jewel of Garhwal Uttarakhand",
    categorySlug: "trekking-guides",
    category: "Trekking Guides",
    date: "Aug 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    excerpt: "A beginner-friendly Himalayan summit offering 360-degree views of Nanda Devi, Chaukhamba, and Trishul peaks.",
  },
  {
    title: "Exploring Leh Ladakh: High Passes, Monasteries and Pangong Tso Secrets",
    categorySlug: "travel-guides",
    category: "Travel Guides",
    date: "Jun 2026",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
    excerpt: "Planning the ultimate high-altitude road trip across Khardung La, Nubra Valley sand dunes, and turquoise salt lakes.",
  },
  {
    title: "Rajasthan In Winter: Royal Forts, Desert Camps & Local Delicacies",
    categorySlug: "travel-guides",
    category: "Travel Guides",
    date: "May 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
    excerpt: "The ideal 7-day winter holiday plan exploring Jaipur, Jodhpur, Udaipur, and the golden Thar dunes of Jaisalmer.",
  },
  {
    title: "How to Prevent Acute Mountain Sickness (AMS) on High Himalayan Trails",
    categorySlug: "trekking-tips",
    category: "Trekking Tips",
    date: "Aug 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    excerpt: "Essential acclimatization schedules, hydration protocols, and Diamox guidelines certified by wilderness first responders.",
  },
  {
    title: "Cardio & Strength Conditioning for 12,000+ Ft Treks: 6-Week Plan",
    categorySlug: "trekking-tips",
    category: "Trekking Tips",
    date: "Jul 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
    excerpt: "Targeted stair climbing, core workouts, and endurance training routines to prepare your lungs and legs for mountain passes.",
  },
  {
    title: "10 Essential Gear Items Every First-Time Himalayan Trekker Needs",
    categorySlug: "travel-tips",
    category: "Travel Tips",
    date: "Jul 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
    excerpt: "From waterproof trekking boots to moisture-wicking base layers: the definitive gear list for alpine trails.",
  },
  {
    title: "Best Seasons to Trek in Uttarakhand & Himachal: A Month-By-Month Guide",
    categorySlug: "destination-guides",
    category: "Destination Guides",
    date: "Aug 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    excerpt: "Understand spring wildflower blooms, monsoon valley crossovers, autumn crystal skies, and winter snow trails.",
  },
  {
    title: "A Night Under the Stars at Kheerganga: Thermal Springs and Pine Meadows",
    categorySlug: "trek-stories",
    category: "Trek Stories",
    date: "Jun 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    excerpt: "A traveler's journal capturing the natural sulfur pools and tranquil Parvati Valley campfires.",
  },
];

function getCategoryInfo(slug: string) {
  const key = slug.toLowerCase();
  if (CATEGORY_MAP[key]) return CATEGORY_MAP[key];
  const formatted = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
  return {
    name: formatted,
    title: `${formatted} Articles & Guides`,
    desc: `Explore articles and travel insights in ${formatted} published by KRADIND Adventures.`,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const info = getCategoryInfo(category);

  return {
    title: `${info.title} | KRADIND Travel Blog`,
    description: info.desc,
    alternates: {
      canonical: `https://kradind.com/blog/${category.toLowerCase()}`,
    },
    openGraph: {
      title: `${info.title} | KRADIND Travel Blog`,
      description: info.desc,
      url: `https://kradind.com/blog/${category.toLowerCase()}`,
      type: "website",
    },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const info = getCategoryInfo(category);
  const matchingArticles = ALL_ARTICLES.filter(
    (a) => a.categorySlug.toLowerCase() === category.toLowerCase()
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Fixed Sticky Top Navigation Header */}
      <div className="sticky top-0 z-50 w-full shadow-xs">
        <TopBar />
        <Header />
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0F3A2E] mb-4 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Categories</span>
          </Link>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              Blog Category
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 brand-font">
              {info.title}
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
              {info.desc}
            </p>
          </div>
        </div>

        {matchingArticles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <p className="text-slate-600 text-sm">
              More articles in this category are being published by our editorial team!
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-[#0F3A2E] text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              Browse All Blog Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingArticles.map((article, idx) => (
              <article
                key={idx}
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
                    <span className="bg-[#0F3A2E] text-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                      {article.category}
                    </span>
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
        )}
      </main>

      <Footer />
    </div>
  );
}
