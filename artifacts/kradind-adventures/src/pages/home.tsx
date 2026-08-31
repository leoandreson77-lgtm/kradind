import { type FormEvent, useMemo, useRef, useState } from 'react';
import { Link } from 'wouter';
import { Header } from '@/components/header';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  Compass,
  Footprints,
  Gauge,
  Heart,
  MapPin,
  Menu,
  Mountain,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  TentTree,
  Wind,
  X,
  CheckCircle2,
  PhoneCall,
  Mail,
  Navigation,
  Star,
  Award,
  Check,
  Package,
  Zap,
} from 'lucide-react';
import { getHealthCheckQueryKey, useGetTrailRadar, useHealthCheck, useListTreks } from '@workspace/api-client-react';
import type { TrailReport, Trek } from '@workspace/api-client-react';

const categories = ['All escapes', 'Weekend', 'High altitude', 'Monsoon', 'Snow'];
const matchDurations = ['2–3 days', '4–6 days', '7+ days'];
const matchDifficulties = ['Gentle', 'Steady', 'Wild'];

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}

function TrekCard({ trek, featured = false }: { trek: Trek; featured?: boolean }) {
  const [saved, setSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <article
      className={`group relative overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-[0_22px_48px_rgba(14,56,44,0.12)] ${
        featured ? 'md:col-span-2' : ''
      }`}
      data-testid={`card-trek-${trek.id}`}
    >
      {showToast && (
        <div className="absolute top-4 left-1/2 z-30 -translate-x-1/2 animate-bounce rounded-full bg-primary/95 px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-xl backdrop-blur">
          {saved ? '❤️ Added to saved treks' : 'Removed from saved'}
        </div>
      )}

      <div className={`image-shade relative overflow-hidden ${featured ? 'h-80 md:h-[26rem]' : 'h-64'}`}>
        <img
          src={trek.image}
          alt={trek.name}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-108"
          data-testid={`img-trek-${trek.id}`}
        />
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
          {trek.badge && (
            <span className="rounded-full bg-accent/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-accent-foreground backdrop-blur-md shadow-sm">
              {trek.badge}
            </span>
          )}
          <span className="rounded-full bg-background/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-foreground backdrop-blur-md border border-white/20">
            {trek.duration}
          </span>
        </div>

        <button
          type="button"
          aria-label={saved ? 'Remove from saved treks' : 'Save trek'}
          onClick={toggleSave}
          className={`absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full transition-all duration-300 ${
            saved
              ? 'bg-accent text-accent-foreground shadow-lg scale-110'
              : 'bg-background/80 text-primary backdrop-blur-md hover:bg-accent hover:text-accent-foreground hover:scale-105'
          }`}
          data-testid={`button-save-trek-${trek.id}`}
        >
          <Heart className={`size-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        <div className="absolute bottom-5 left-5 right-5 z-10 text-card">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/80">
            <MapPin className="size-3.5 text-accent" /> {trek.location}, {trek.region}
          </p>
          <h3 className="max-w-lg font-display text-2xl font-bold leading-tight text-white md:text-3xl">
            {trek.name}
          </h3>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-end">
        <div className="space-y-3">
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{trek.tagline}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-foreground/80">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/80 px-2.5 py-1">
              <Gauge className="size-3.5 text-accent" /> {trek.difficulty}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/80 px-2.5 py-1">
              <Mountain className="size-3.5 text-accent" /> {trek.altitude}
            </span>
            <span className="inline-flex items-center gap-1 text-[#d97706] font-bold">
              <Star className="size-3.5 fill-current" /> {trek.rating}{' '}
              <span className="font-normal text-muted-foreground">({trek.reviewCount})</span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <div className="text-left sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Starting from</p>
            <p className="font-display text-lg font-extrabold text-primary">{formatPrice(trek.price)}</p>
          </div>
          <Link
            href={`/treks/${trek.slug}`}
            className="group/link inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:shadow-lg hover:shadow-accent/25"
            data-testid={`link-explore-trek-${trek.id}`}
          >
            Explore Trail <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function RadarCard({ report }: { report: TrailReport }) {
  const tone =
    report.status === 'open'
      ? 'text-emerald-700 bg-emerald-100/90 border-emerald-300 dark:text-emerald-300 dark:bg-emerald-950/60'
      : report.status === 'caution'
      ? 'text-amber-700 bg-amber-100/90 border-amber-300 dark:text-amber-300 dark:bg-amber-950/60'
      : 'text-rose-700 bg-rose-100/90 border-rose-300 dark:text-rose-300 dark:bg-rose-950/60';

  const dotTone =
    report.status === 'open'
      ? 'bg-emerald-500'
      : report.status === 'caution'
      ? 'bg-amber-500'
      : 'bg-rose-500';

  return (
    <div
      className="flex min-w-[280px] flex-1 gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/15 hover:border-white/25"
      data-testid={`card-radar-${report.id}`}
    >
      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/20 text-accent">
        <Wind className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <h3 className="truncate font-display text-base font-bold text-white">{report.trail}</h3>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tone}`}
            data-testid={`status-radar-${report.id}`}
          >
            <span className={`size-1.5 rounded-full ${dotTone} animate-pulse`} />
            {report.status}
          </span>
        </div>
        <p className="mb-2 text-xs font-medium text-white/70">
          {report.region} • {report.weather} • {report.temperature}
        </p>
        <p className="text-xs leading-relaxed text-white/80">{report.note}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All escapes');
  const [menuOpen, setMenuOpen] = useState(false);
  const [matchStep, setMatchStep] = useState(1);
  const [matchDifficulty, setMatchDifficulty] = useState('');
  const [matchDuration, setMatchDuration] = useState('');
  const discoveryRef = useRef<HTMLElement>(null);
  const { data: treks, isLoading: treksLoading, isError: treksError, refetch: refetchTreks } = useListTreks();
  const { data: radar, isLoading: radarLoading, isError: radarError, refetch: refetchRadar } = useGetTrailRadar();

  const filteredTreks = useMemo(() => {
    if (!treks || !Array.isArray(treks)) return [];
    return treks.filter((trek) => {
      const matchesQuery =
        !query || `${trek.name} ${trek.location} ${trek.region} ${trek.categories.join(' ')}`.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        activeCategory === 'All escapes' ||
        trek.categories.some((category) => category.toLowerCase().includes(activeCategory.toLowerCase().replace(' escapes', '')));
      return matchesQuery && matchesCategory;
    });
  }, [treks, query, activeCategory]);

  const heroTrek = Array.isArray(treks) ? treks[0] : undefined;
  const weekendTreks = filteredTreks.slice(0, 4);
  const specialTrek = filteredTreks[3] ?? filteredTreks[0];

  const { data: health } = useHealthCheck({ query: { staleTime: 60_000, queryKey: getHealthCheckQueryKey() } });

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    discoveryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleMatchChoice(value: string, step: number) {
    if (step === 1) setMatchDuration(value);
    if (step === 2) setMatchDifficulty(value);
    setMatchStep(step + 1);
  }

  return (
    <div className="grain min-h-[100dvh] overflow-x-hidden bg-background text-foreground">
      {/* HEADER NAVIGATION */}
      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative flex min-h-[780px] items-end overflow-hidden bg-primary pb-16 pt-36 text-white lg:min-h-[840px] lg:pb-24">
          {heroTrek?.image && (
            <img
              src={heroTrek.image}
              alt="Himalayan trail preview"
              className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-luminosity scale-105"
            />
          )}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,hsl(188_54%_37%/.35),transparent_40%),linear-gradient(110deg,hsl(171_30%_7%/.98)_10%,hsl(171_30%_14%/.75)_55%,hsl(171_30%_8%/.6))]" />

          {/* Glowing Ambient Accents */}
          <div className="absolute right-[8%] top-[22%] hidden size-64 rounded-full border border-white/10 lg:block">
            <div className="absolute -left-3 top-1/2 size-3 rounded-full bg-accent pulse-dot" />
            <div className="absolute inset-6 rounded-full border border-white/10" />
            <div className="absolute inset-14 rounded-full border border-accent/20" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-5 lg:px-8">
            <div className="max-w-3xl reveal">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[.2em] text-accent backdrop-blur-md">
                <span className="size-2 rounded-full bg-accent animate-ping" />
                Himalayan Expedition Season 2026
              </div>

              <h1 className="text-balance max-w-3xl font-display text-5xl font-extrabold leading-[.96] tracking-tight sm:text-7xl lg:text-[6.8rem]">
                Leave the city.<br />
                <span className="gradient-accent-text">Find your wild.</span>
              </h1>

              <p className="mt-8 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                Curated high-altitude escapes, certified local mountain guides, and untouched wilderness. Your next story begins where the road ends.
              </p>
            </div>

            {/* SEARCH BAR */}
            <form
              onSubmit={handleSearch}
              className="relative z-10 mt-12 grid max-w-4xl gap-2.5 rounded-2xl border border-white/20 bg-background/95 p-3 text-foreground shadow-2xl shadow-black/30 backdrop-blur-xl sm:grid-cols-[1fr_auto_auto]"
              data-testid="form-hero-search"
            >
              <div className="flex items-center gap-3 px-3">
                <Search className="size-5 text-primary/70" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search peak name, region, or terrain..."
                  className="h-12 w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
                  data-testid="input-search-treks"
                />
              </div>

              <select
                value={activeCategory}
                onChange={(event) => setActiveCategory(event.target.value)}
                className="h-12 rounded-xl border-0 bg-secondary px-4 text-sm font-bold text-foreground outline-none cursor-pointer"
                data-testid="select-search-category"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>

              <button
                type="submit"
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-7 text-sm font-bold text-accent-foreground shadow-lg transition-all duration-300 hover:bg-accent/90 hover:scale-[1.02]"
                data-testid="button-search-treks"
              >
                Search Escapes <ArrowRight className="size-4" />
              </button>
            </form>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-xs font-semibold text-white/70">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-accent" /> Certified Local Expeditions
              </span>
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="size-4 text-accent" /> 100% Safety Compliance
              </span>
              <span className="inline-flex items-center gap-2">
                <Compass className="size-4 text-accent" /> Small Batch Groups (Max 12)
              </span>
            </div>
          </div>
        </section>

        {/* METRICS & STATS BAR */}
        <section className="border-y border-border/80 bg-card/60 backdrop-blur-md">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border/60 px-5 py-8 md:grid-cols-4 lg:px-8">
            {[
              { value: '18+', label: 'Curated Routes', icon: Mountain },
              { value: '7,400m', label: 'Highest Peak', icon: Gauge },
              { value: '99.4%', label: 'Safety Index', icon: ShieldCheck },
              { value: '12 Yrs', label: 'On The Trail', icon: Award },
            ].map(({ value, label, icon: Icon }, index) => (
              <div
                className={`flex items-center gap-4 px-6 first:pl-0 last:pr-0 ${
                  index > 1 ? 'mt-6 md:mt-0' : ''
                }`}
                key={label}
              >
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-primary sm:text-3xl" data-testid={`text-stat-value-${index}`}>
                    {value}
                  </p>
                  <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EXPEDITION PACKAGES SECTION */}
        <section id="packages" className="scroll-mt-12 bg-background py-24 lg:py-32 border-b border-border/80">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[.2em] text-accent">
                <Package className="size-4" /> Curated All-Inclusive Tiers
              </div>
              <h2 className="font-display text-4xl font-extrabold text-primary sm:text-5xl">
                Expedition Packages
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Everything you need for a safe, unforgettable Himalayan trek. Clear pricing, certified guides, top-tier mountain equipment, and zero hidden costs.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 items-stretch">
              {/* PACKAGE 1: WEEKEND EXPLORER */}
              <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-8 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl">
                <div>
                  <div className="mb-4 inline-flex rounded-full bg-secondary px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                    Weekend Special
                  </div>
                  <h3 className="font-display text-2xl font-extrabold text-primary">Weekend Explorer</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Designed for quick 2–3 day mountain getaways without missing a beat.
                  </p>

                  <div className="my-6 border-y border-border/60 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Starting at</p>
                    <p className="font-display text-4xl font-extrabold text-primary">
                      ₹4,999 <span className="font-sans text-xs font-semibold text-muted-foreground">/ person</span>
                    </p>
                  </div>

                  <ul className="space-y-3 text-xs font-medium text-foreground/80">
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-accent shrink-0" /> Certified Local Trek Leader
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-accent shrink-0" /> Base Camp Stay & Dome Tents
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-accent shrink-0" /> Hot Camp Breakfast & Dinner
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-accent shrink-0" /> Forest Permits & Entry Fees
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-accent shrink-0" /> Standard First-Aid Support
                    </li>
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className="mt-8 block w-full rounded-2xl border border-primary/20 bg-secondary py-3.5 text-center text-xs font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  Book Package
                </Link>
              </div>

              {/* PACKAGE 2: ALPINE SUMMIT (FEATURED) */}
              <div className="relative flex flex-col justify-between rounded-3xl border-2 border-accent bg-primary p-8 text-white shadow-2xl shadow-accent/20 transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-foreground shadow-md">
                  Most Popular Choice
                </div>

                <div>
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                    <Zap className="size-3.5" /> High Altitude 5–7 Days
                  </div>
                  <h3 className="font-display text-2xl font-extrabold text-white">Alpine Summit Expedition</h3>
                  <p className="mt-2 text-xs text-white/70 leading-relaxed">
                    Full summit experience with certified WFR leaders & high-altitude gear.
                  </p>

                  <div className="my-6 border-y border-white/15 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Starting at</p>
                    <p className="font-display text-4xl font-extrabold text-white">
                      ₹12,499 <span className="font-sans text-xs font-semibold text-white/70">/ person</span>
                    </p>
                  </div>

                  <ul className="space-y-3 text-xs font-medium text-white/90">
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-accent shrink-0" /> Wilderness First Responder Guide
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-accent shrink-0" /> High-Altitude Alpine Tents & Gear
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-accent shrink-0" /> Full Meals + Hydration Stations
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-accent shrink-0" /> Oxygen Cylinder & Oximeter Backup
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-accent shrink-0" /> Off-trail Luggage Porter Included
                    </li>
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className="mt-8 block w-full rounded-2xl bg-accent py-3.5 text-center text-xs font-bold text-accent-foreground shadow-lg transition-all hover:bg-accent/90"
                >
                  Book Expedition Package
                </Link>
              </div>

              {/* PACKAGE 3: BESPOKE PRIVATE */}
              <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-8 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl">
                <div>
                  <div className="mb-4 inline-flex rounded-full bg-secondary px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                    Custom Tailored
                  </div>
                  <h3 className="font-display text-2xl font-extrabold text-primary">Bespoke Private Expedition</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Customized dates, private guides, and luxury eco-camping for families & groups.
                  </p>

                  <div className="my-6 border-y border-border/60 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Starting at</p>
                    <p className="font-display text-4xl font-extrabold text-primary">
                      ₹24,999 <span className="font-sans text-xs font-semibold text-muted-foreground">/ group</span>
                    </p>
                  </div>

                  <ul className="space-y-3 text-xs font-medium text-foreground/80">
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-accent shrink-0" /> Dedicated Private Expedition Captain
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-accent shrink-0" /> Flexible Departure Schedule
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-accent shrink-0" /> Luxury Eco-Tents & Camp Chef
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-accent shrink-0" /> Private Base Camp Transport
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-accent shrink-0" /> Custom Route & Altitude Plan
                    </li>
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className="mt-8 block w-full rounded-2xl border border-primary/20 bg-secondary py-3.5 text-center text-xs font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  Inquire Custom Package
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TREK MATCHER WIZARD */}
        <section id="match" className="scroll-mt-12 bg-secondary/40 py-24 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:px-8">
            <div className="reveal">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                <Sparkles className="size-4" /> Custom Recommendation
              </div>
              <h2 className="max-w-md font-display text-4xl font-extrabold leading-tight text-primary sm:text-5xl">
                Tell us how you want to feel.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                Answer two quick questions. Our trail engine matches your schedule and fitness level with the perfect Himalayan route.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex gap-2">
                  <span className={`h-2.5 rounded-full transition-all duration-300 ${matchStep >= 1 ? 'w-8 bg-accent' : 'w-2.5 bg-border'}`} />
                  <span className={`h-2.5 rounded-full transition-all duration-300 ${matchStep >= 2 ? 'w-8 bg-accent' : 'w-2.5 bg-border'}`} />
                  <span className={`h-2.5 rounded-full transition-all duration-300 ${matchStep >= 3 ? 'w-8 bg-accent' : 'w-2.5 bg-border'}`} />
                </div>
                <span className="text-xs font-bold text-muted-foreground">Step {Math.min(matchStep, 2)} of 2</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-primary p-8 text-white shadow-2xl shadow-primary/20 sm:p-12">
              <div className="absolute -right-20 -top-20 size-64 rounded-full border-[24px] border-accent/10" />

              {matchStep <= 2 ? (
                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-accent">Trail Preference</p>
                  <h3 className="mt-3 font-display text-3xl font-extrabold">
                    {matchStep === 1 ? 'How many days can you disappear?' : 'What difficulty fits your spirit?'}
                  </h3>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {(matchStep === 1 ? matchDurations : matchDifficulties).map((choice) => (
                      <button
                        type="button"
                        key={choice}
                        onClick={() => handleMatchChoice(choice, matchStep)}
                        className="group flex flex-col justify-between rounded-2xl border border-white/15 bg-white/5 p-5 text-left transition-all duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground hover:shadow-xl"
                        data-testid={`button-match-${choice.replaceAll(' ', '-').toLowerCase()}`}
                      >
                        <span className="mb-6 block text-white/50 group-hover:text-accent-foreground/80">
                          {matchStep === 1 ? <CalendarDays className="size-6" /> : <Footprints className="size-6" />}
                        </span>
                        <div>
                          <span className="block font-display text-lg font-bold">{choice}</span>
                          <span className="mt-1 flex items-center gap-1 text-xs font-semibold opacity-70 group-hover:opacity-100">
                            Select option <ChevronRight className="size-3 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
                    <CheckCircle2 className="size-4" /> Recommendation Ready
                  </div>
                  <h3 className="font-display text-3xl font-extrabold">
                    You’re built for a {matchDifficulty.toLowerCase()} escape.
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
                    We’ve filtered Himalayan departures for {matchDuration.toLowerCase()} trips matching your profile.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                        setActiveCategory('All escapes');
                        discoveryRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-lg transition hover:bg-accent/90"
                      data-testid="button-see-matches"
                    >
                      View Matched Treks <ArrowRight className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMatchStep(1);
                        setMatchDifficulty('');
                        setMatchDuration('');
                      }}
                      className="text-xs font-bold text-white/70 underline-offset-4 hover:text-white hover:underline"
                      data-testid="button-reset-match"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* TREK DISCOVERY SECTION */}
        <section id="escapes" ref={discoveryRef} className="scroll-mt-10 bg-background py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-accent">Curated Expeditions</p>
                <h2 className="font-display text-4xl font-extrabold text-primary sm:text-5xl">
                  Featured Treks & Escapes
                </h2>
              </div>

              {/* CATEGORY TABS */}
              <div className="flex max-w-full gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-xs font-bold transition-all duration-300 ${
                      activeCategory === category
                        ? 'border-primary bg-primary text-primary-foreground shadow-md'
                        : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary'
                    }`}
                    data-testid={`button-filter-${category.replaceAll(' ', '-').toLowerCase()}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {treksLoading ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="h-96 animate-pulse rounded-3xl bg-muted" />
                <div className="h-96 animate-pulse rounded-3xl bg-muted" />
              </div>
            ) : treksError ? (
              <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-10 text-center">
                <p className="font-display text-2xl font-bold text-primary">Unable to load treks</p>
                <p className="mt-2 text-sm text-muted-foreground">Check your connection and try again.</p>
                <button
                  type="button"
                  onClick={() => refetchTreks()}
                  className="mt-6 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-md"
                  data-testid="button-retry-treks"
                >
                  Retry Loading
                </button>
              </div>
            ) : weekendTreks.length ? (
              <div className="grid gap-6 md:grid-cols-2">
                {weekendTreks.map((trek, index) => (
                  <TrekCard key={trek.id} trek={trek} featured={index === 0} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border p-14 text-center">
                <Compass className="mx-auto size-10 text-accent" />
                <p className="mt-4 font-display text-2xl font-bold text-primary">No matching escapes found</p>
                <p className="mt-2 text-sm text-muted-foreground">Try broadening your search term or category filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setActiveCategory('All escapes');
                  }}
                  className="mt-6 text-xs font-bold text-accent underline underline-offset-4"
                  data-testid="button-clear-filters"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {filteredTreks.length > 4 && (
              <div className="mt-12 text-center">
                <Link
                  href="/treks"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-8 py-3 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground hover:shadow-lg"
                >
                  View All {filteredTreks.length} Expeditions <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* SEASONAL HIGHLIGHT SECTION */}
        {specialTrek && (
          <section className="bg-secondary/60 py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <div className="overflow-hidden rounded-[2.5rem] border border-border/80 bg-card shadow-2xl lg:grid lg:grid-cols-[1.1fr_.9fr]">
                <div className="relative min-h-[380px] overflow-hidden lg:min-h-[520px]">
                  <img
                    src={specialTrek.image}
                    alt={specialTrek.name}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <span className="mb-2 inline-block rounded-full bg-accent px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                      Seasonal Highlight
                    </span>
                    <p className="font-display text-3xl font-extrabold">{specialTrek.name}</p>
                  </div>
                </div>

                <div className="flex flex-col justify-center p-8 sm:p-14 lg:p-16">
                  <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-accent/15 text-accent">
                    <Sun className="size-7" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-accent">Best Season Departure</p>
                  <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight text-primary sm:text-5xl">
                    Peak Alpine Conditions
                  </h2>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {specialTrek.description}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-6">
                    <Link
                      href={`/treks/${specialTrek.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition hover:bg-accent hover:text-accent-foreground"
                      data-testid="link-seasonal-special"
                    >
                      Book Departure <ArrowRight className="size-4" />
                    </Link>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Price Per Person</p>
                      <p className="font-display text-xl font-extrabold text-primary">{formatPrice(specialTrek.price)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* LIVE TRAIL RADAR */}
        <section id="radar" className="scroll-mt-10 bg-primary py-24 text-white lg:py-32">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-accent">
                  <span className="size-2.5 rounded-full bg-accent pulse-dot" /> Live Trail Intelligence
                </div>
                <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Real-Time Field Radar</h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-white/70">
                Direct updates from our mountain captains on trail weather, pass visibility, and snow levels.
              </p>
            </div>

            {radarLoading ? (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="h-36 animate-pulse rounded-2xl bg-white/10" />
                <div className="h-36 animate-pulse rounded-2xl bg-white/10" />
                <div className="h-36 animate-pulse rounded-2xl bg-white/10" />
              </div>
            ) : radarError ? (
              <div className="rounded-2xl border border-white/15 p-8 text-center">
                <p className="text-sm text-white/80">Trail radar temporarily offline.</p>
                <button
                  type="button"
                  onClick={() => refetchRadar()}
                  className="mt-4 rounded-full bg-accent px-5 py-2 text-xs font-bold text-accent-foreground shadow"
                  data-testid="button-retry-radar"
                >
                  Refresh Field Data
                </button>
              </div>
            ) : Array.isArray(radar) && radar.length ? (
              <div className="grid gap-4 md:grid-cols-3">
                {radar.map((report) => (
                  <RadarCard key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/15 p-8 text-sm text-white/70" data-testid="empty-radar">
                No recent field reports received.
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50">
              <div className="flex items-center gap-2">
                <span>Satellite Feed Active</span>
                <span className="size-1.5 rounded-full bg-accent" />
                <span>Updated hourly by field captains</span>
              </div>
              <span>Status: All safety protocol systems normal</span>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card py-16 text-foreground">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3" data-testid="link-footer-logo">
                <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
                  <TentTree className="size-5" />
                </span>
                <span className="font-display text-2xl font-extrabold tracking-tight">
                  KRADIND<span className="text-accent">.</span>
                </span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                KRADIND Adventures builds curated Himalayan expeditions with zero compromise on safety, local stewardship, and wilderness authentic experiences.
              </p>

              <div className="mt-6 flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Mail className="size-4 text-accent" /> hello@kradind.com</span>
                <span className="inline-flex items-center gap-1.5"><PhoneCall className="size-4 text-accent" /> +91 98765 43210</span>
              </div>
            </div>

            <div>
              <p className="font-display text-base font-bold text-primary">Quick Navigation</p>
              <ul className="mt-4 space-y-2.5 text-xs font-semibold text-muted-foreground">
                <li><Link href="/treks" className="transition hover:text-accent" data-testid="link-footer-escapes">Explore Treks</Link></li>
                <li><a href="#match" className="transition hover:text-accent" data-testid="link-footer-match">Trek Matcher</a></li>
                <li><a href="#radar" className="transition hover:text-accent" data-testid="link-footer-radar">Live Trail Radar</a></li>
                <li><Link href="/about" className="transition hover:text-accent" data-testid="link-footer-about">Our Story</Link></li>
                <li><Link href="/contact" className="transition hover:text-accent" data-testid="link-footer-contact">Contact & Support</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-display text-base font-bold text-primary">Safety & Promise</p>
              <ul className="mt-4 space-y-2.5 text-xs font-semibold text-muted-foreground">
                <li>• Certified Wilderness First Responders</li>
                <li>• Oxygen & First-Aid Backup</li>
                <li>• Eco-Leave-No-Trace Policy</li>
                <li>• Small Group Ratios (1:6)</li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col justify-between gap-4 border-t border-border/80 pt-8 text-xs font-medium text-muted-foreground sm:flex-row sm:items-center">
            <p>© 2026 KRADIND Adventures. Hand-crafted for wild souls everywhere.</p>
            <p className="text-[11px] uppercase tracking-wider font-bold text-primary/60">
              {health?.status === 'ok' ? 'Desk Online • ' : ''}All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}