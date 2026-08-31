import { useState } from 'react';
import { Link } from 'wouter';
import { Header } from '@/components/header';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  Clock,
  Compass,
  Filter,
  Heart,
  HelpCircle,
  Layers,
  MapPin,
  Mountain,
  Package as PackageIcon,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';

export interface PackageData {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  category: 'Weekend' | 'Alpine' | 'Bespoke' | 'Seasonal';
  price: number;
  duration: string;
  groupSize: string;
  isPopular?: boolean;
  inclusions: string[];
  description: string;
}

export const initialPackages: PackageData[] = [
  {
    id: 'pkg-weekend',
    title: 'Weekend Explorer Package',
    tagline: 'Quick 2–3 day mountain getaways without missing a beat.',
    badge: 'Weekend Special',
    category: 'Weekend',
    price: 4999,
    duration: '2–3 Days',
    groupSize: 'Max 12 Adventurers',
    isPopular: false,
    inclusions: [
      'Certified Local Trek Leader & Route Captain',
      'Base Camp Stay in Weatherproof Dome Tents',
      'Hot Camp Breakfast & Buffet Dinners',
      'Forest Department Permits & Entrance Fees',
      'Standard First-Aid Kit & Pulse Oximeter',
    ],
    description: 'Designed specifically for working professionals needing a quick mountain escape. Includes base camp setup, certified guides, and essential high-altitude gear.',
  },
  {
    id: 'pkg-alpine',
    title: 'Alpine Summit Expedition',
    tagline: 'Full summit experience with certified WFR leaders & high-altitude gear.',
    badge: 'Most Popular Choice',
    category: 'Alpine',
    price: 12499,
    duration: '5–7 Days',
    groupSize: 'Intimate Group (Max 10)',
    isPopular: true,
    inclusions: [
      'Wilderness First Responder (WFR) Lead Guide',
      'High-Altitude Alpine Tents & Sub-Zero Sleeping Bags',
      'Nutritious All-Inclusive Camp Meals + Hydration',
      'Oxygen Cylinder Backup & Medical Pulse Oximeter',
      'Off-Trail Luggage Porter Service Included',
      'Satellite GPS Tracking & Emergency Evac Cover',
    ],
    description: 'Our flagship expedition package for serious trekkers targeting high Himalayan passes. Complete safety coverage, premium sleeping gear, and porter service included.',
  },
  {
    id: 'pkg-bespoke',
    title: 'Bespoke Private Expedition',
    tagline: 'Customized dates, private guides, and luxury eco-camping.',
    badge: 'Custom Tailored',
    category: 'Bespoke',
    price: 24999,
    duration: 'Custom Flexible',
    groupSize: 'Private Group',
    isPopular: false,
    inclusions: [
      'Dedicated Private Expedition Captain & Guide Team',
      '100% Flexible Departure Dates & Pacing',
      'Luxury Eco-Tents & Dedicated Camp Chef',
      'Private Transport from Railway Station/Airport',
      'Customized Summit Route & Altitude Protocol Map',
    ],
    description: 'Tailored specifically for families, corporate retreats, or private groups wanting complete flexibility, private camp chefs, and custom trail itineraries.',
  },
  {
    id: 'pkg-monsoon',
    title: 'Monsoon Valley Wanderer',
    tagline: 'Explore lush green valleys and blooming alpine flowers in peak rains.',
    badge: 'Seasonal Bloom',
    category: 'Seasonal',
    price: 8999,
    duration: '4–5 Days',
    groupSize: 'Max 12 Adventurers',
    isPopular: false,
    inclusions: [
      'Waterproof Trail Gaiters & Rain Shell Gear',
      'Botanical Guide for Flora & Fauna Discovery',
      'Homestay & Eco-Lodge Stays En Route',
      'All Regional Meals & Herbal Tea Stations',
      'Trail Insurance & Local Eco-Permits',
    ],
    description: 'Experience the magic of monsoon trekking with specialized rain protection gear, local homestays, and expert botanical guides leading the trail.',
  },
];

export default function PackagesPage() {
  const [packagesList] = useState<PackageData[]>(initialPackages);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filtered = packagesList.filter(
    (pkg) => activeCategory === 'All' || pkg.category === activeCategory
  );

  return (
    <div className="grain min-h-[100dvh] overflow-x-hidden bg-background text-foreground">
      <Header />

      <main className="pt-24 lg:pt-32">
        {/* HERO BANNER */}
        <section className="relative overflow-hidden bg-primary px-5 pb-16 pt-12 text-white lg:pb-24 lg:pt-16">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85"
            alt="Himalayan package background"
            className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-overlay scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/70 to-background" />

          <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[.2em] text-accent backdrop-blur-md">
                <PackageIcon className="size-4" /> Curated Expedition Tiers
              </div>
              <h1 className="font-display text-5xl font-extrabold leading-[.98] tracking-tight sm:text-7xl">
                All-Inclusive <br />
                <span className="gradient-accent-text">Expedition Packages.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                Choose the perfect package tier for your Himalayan journey. Certified guides, top-tier mountain equipment, permits, and zero hidden costs.
              </p>
            </div>

            {/* CATEGORY FILTERS */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {['All', 'Weekend', 'Alpine', 'Bespoke', 'Seasonal'].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-accent text-accent-foreground shadow-lg scale-105'
                      : 'border border-white/20 bg-white/10 text-white hover:bg-white/20'
                  }`}
                  data-testid={`filter-package-${cat.toLowerCase()}`}
                >
                  {cat === 'All' ? 'All Packages' : `${cat} Tiers`}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* PACKAGES GRID */}
        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-3xl border p-8 transition-all duration-300 hover:shadow-2xl ${
                  pkg.isPopular
                    ? 'border-2 border-accent bg-primary text-white shadow-xl shadow-accent/15 scale-[1.02]'
                    : 'border-border/80 bg-card text-foreground hover:border-primary/40'
                }`}
                data-testid={`card-package-${pkg.id}`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-foreground shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                    {pkg.badge}
                  </div>
                  <h3 className={`font-display text-2xl font-extrabold ${pkg.isPopular ? 'text-white' : 'text-primary'}`}>
                    {pkg.title}
                  </h3>
                  <p className={`mt-2 text-xs leading-relaxed ${pkg.isPopular ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {pkg.tagline}
                  </p>

                  <div className={`my-6 border-y py-4 ${pkg.isPopular ? 'border-white/15' : 'border-border/60'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${pkg.isPopular ? 'text-white/50' : 'text-muted-foreground'}`}>
                      Price Tier
                    </p>
                    <p className={`font-display text-4xl font-extrabold ${pkg.isPopular ? 'text-white' : 'text-primary'}`}>
                      ₹{pkg.price.toLocaleString()}{' '}
                      <span className={`font-sans text-xs font-semibold ${pkg.isPopular ? 'text-white/70' : 'text-muted-foreground'}`}>
                        / {pkg.category === 'Bespoke' ? 'group' : 'person'}
                      </span>
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5 text-accent" /> {pkg.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="size-3.5 text-accent" /> {pkg.groupSize}
                      </span>
                    </div>
                  </div>

                  <p className={`mb-3 text-xs font-bold uppercase tracking-wider ${pkg.isPopular ? 'text-accent' : 'text-primary'}`}>
                    Package Inclusions:
                  </p>
                  <ul className="space-y-2.5 text-xs font-medium">
                    {pkg.inclusions.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <Check className="size-4 text-accent shrink-0 mt-0.5" />
                        <span className={pkg.isPopular ? 'text-white/90' : 'text-foreground/80'}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPackage(pkg)}
                  className={`mt-8 w-full rounded-2xl py-3.5 text-center text-xs font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                    pkg.isPopular
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                      : 'border border-primary/20 bg-secondary text-primary hover:bg-primary hover:text-primary-foreground'
                  }`}
                  data-testid={`button-book-pkg-${pkg.id}`}
                >
                  Book Package Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* BOOKING MODAL */}
        {selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in-0">
            <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-primary p-6 text-white shadow-2xl sm:p-8">
              <button
                type="button"
                onClick={() => {
                  setSelectedPackage(null);
                  setBookingSuccess(false);
                }}
                className="absolute right-5 top-5 grid size-9 place-items-center rounded-full border border-white/20 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>

              {!bookingSuccess ? (
                <div>
                  <div className="inline-flex rounded-full bg-accent/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                    Reserve Package
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-extrabold">{selectedPackage.title}</h3>
                  <p className="mt-1 font-display text-3xl font-extrabold text-accent">
                    ₹{selectedPackage.price.toLocaleString()}
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setBookingSuccess(true);
                    }}
                    className="mt-6 space-y-4 text-xs font-medium"
                  >
                    <div>
                      <label className="block text-white/80 font-bold mb-1">Full Name</label>
                      <input
                        required
                        placeholder="Your full name"
                        className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-white outline-none focus:border-accent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white/80 font-bold mb-1">Phone Number</label>
                        <input
                          required
                          placeholder="+91 99999 99999"
                          className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-white outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 font-bold mb-1">Travelers</label>
                        <select className="h-11 w-full rounded-xl border border-white/20 bg-primary px-3 text-white outline-none focus:border-accent">
                          <option value="1">1 Person</option>
                          <option value="2">2 Persons</option>
                          <option value="3">3 Persons</option>
                          <option value="4">4+ Group</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="mt-4 w-full rounded-2xl bg-accent py-3.5 text-xs font-bold text-accent-foreground shadow-lg transition hover:bg-accent/90"
                    >
                      Confirm Package Request
                    </button>
                  </form>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-lg">
                    <Check className="size-8" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-extrabold">Package Request Sent!</h3>
                  <p className="mt-2 text-xs text-white/70 leading-relaxed">
                    Our expedition desk will contact you within 30 minutes to confirm dates and guide allocation.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPackage(null);
                      setBookingSuccess(false);
                    }}
                    className="mt-6 rounded-full bg-accent px-6 py-2.5 text-xs font-bold text-accent-foreground"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
