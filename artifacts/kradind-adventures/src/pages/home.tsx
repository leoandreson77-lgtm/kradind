import { type FormEvent, useMemo, useRef, useState } from 'react';
import { Link } from 'wouter';
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
  return (
    <article className={`group overflow-hidden rounded-[1.35rem] border border-border/80 bg-card shadow-[0_8px_30px_hsl(166_45%_24%/0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_42px_hsl(166_45%_24%/0.14)] ${featured ? 'md:col-span-2' : ''}`} data-testid={`card-trek-${trek.id}`}>
      <div className={`image-shade relative overflow-hidden ${featured ? 'h-80 md:h-[25rem]' : 'h-64'}`}>
        <img src={trek.image} alt={trek.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" data-testid={`img-trek-${trek.id}`} />
        <div className="absolute left-4 top-4 z-10 flex gap-2">
          {trek.badge && <span className="rounded-full bg-accent px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.13em] text-accent-foreground">{trek.badge}</span>}
          <span className="rounded-full bg-background/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.13em] text-foreground backdrop-blur">{trek.duration}</span>
        </div>
        <button type="button" aria-label={saved ? 'Remove from saved treks' : 'Save trek'} onClick={() => setSaved(!saved)} className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-background/85 text-primary backdrop-blur transition hover:bg-accent hover:text-accent-foreground" data-testid={`button-save-trek-${trek.id}`}>
          <Heart className={`size-4 ${saved ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-5 left-5 z-10 text-card">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-white/75"><MapPin className="size-3.5" /> {trek.location}, {trek.region}</p>
          <h3 className="max-w-lg text-2xl font-bold leading-tight text-white md:text-3xl">{trek.name}</h3>
        </div>
      </div>
      <div className="flex items-end justify-between gap-3 p-5">
        <div>
          <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{trek.tagline}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-foreground/70">
            <span className="inline-flex items-center gap-1.5"><Gauge className="size-3.5 text-accent" /> {trek.difficulty}</span>
            <span className="inline-flex items-center gap-1.5"><Mountain className="size-3.5 text-accent" /> {trek.altitude}</span>
            <span className="inline-flex items-center gap-1.5 text-[#bd6b27]">★ {trek.rating} <span className="font-normal text-muted-foreground">({trek.reviewCount})</span></span>
          </div>
        </div>
        <Link href={`/treks/${trek.slug}`} className="group/link flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition hover:bg-accent hover:text-accent-foreground" data-testid={`link-explore-trek-${trek.id}`}>
          Explore <ArrowRight className="size-3.5 transition group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

function RadarCard({ report }: { report: TrailReport }) {
  const tone = report.status === 'open' ? 'text-[#2d796d] bg-[#d9ede6]' : report.status === 'caution' ? 'text-[#aa661b] bg-[#f7e6c7]' : 'text-[#ae4439] bg-[#f4d6d1]';
  return (
    <div className="flex min-w-[260px] flex-1 gap-4 rounded-xl border border-border/70 bg-card/75 p-4" data-testid={`card-radar-${report.id}`}>
      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary"><Wind className="size-4" /></div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-start justify-between gap-2"><h3 className="truncate text-sm font-bold">{report.trail}</h3><span className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${tone}`} data-testid={`status-radar-${report.id}`}>{report.status}</span></div>
        <p className="mb-2 text-xs text-muted-foreground">{report.region} · {report.weather} · {report.temperature}</p>
        <p className="text-xs leading-relaxed text-foreground/75">{report.note}</p>
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
    if (!treks) return [];
    return treks.filter((trek) => {
      const matchesQuery = !query || `${trek.name} ${trek.location} ${trek.region} ${trek.categories.join(' ')}`.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = activeCategory === 'All escapes' || trek.categories.some((category) => category.toLowerCase().includes(activeCategory.toLowerCase().replace(' escapes', '')));
      return matchesQuery && matchesCategory;
    });
  }, [treks, query, activeCategory]);

  const heroTrek = treks?.[0];
  const weekendTreks = filteredTreks.slice(0, 3);
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
    <div className="grain min-h-[100dvh] overflow-x-hidden">
      <header className="absolute left-0 right-0 top-0 z-30 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5" data-testid="link-home-logo">
            <span className="grid size-9 place-items-center rounded-xl bg-accent text-accent-foreground"><TentTree className="size-5" /></span>
            <span className="font-display text-lg font-extrabold tracking-[-.04em]">KRADIND<span className="text-accent">.</span></span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
            <a href="#escapes" className="transition hover:text-white" data-testid="link-nav-escapes">Find an escape</a>
            <a href="#match" className="transition hover:text-white" data-testid="link-nav-match">Trek matcher</a>
            <a href="#radar" className="transition hover:text-white" data-testid="link-nav-radar">Trail radar</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#escapes" className="hidden rounded-full border border-white/25 px-4 py-2 text-xs font-bold text-white transition hover:bg-white hover:text-primary sm:block" data-testid="link-plan-trip">Plan a trip</a>
            <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="grid size-9 place-items-center rounded-full border border-white/25 md:hidden" aria-label="Toggle navigation" data-testid="button-toggle-navigation">
              {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
        {menuOpen && <div className="mx-4 rounded-2xl bg-primary p-4 shadow-xl md:hidden"><div className="grid gap-3 text-sm font-semibold"><a href="#escapes" onClick={() => setMenuOpen(false)} data-testid="link-mobile-escapes">Find an escape</a><a href="#match" onClick={() => setMenuOpen(false)} data-testid="link-mobile-match">Trek matcher</a><a href="#radar" onClick={() => setMenuOpen(false)} data-testid="link-mobile-radar">Trail radar</a></div></div>}
      </header>

      <main>
        <section className="relative flex min-h-[720px] items-end overflow-hidden bg-primary pb-14 pt-32 text-white lg:min-h-[790px] lg:pb-20">
          {heroTrek?.image && <img src={heroTrek.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-luminosity" />}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,hsl(188_54%_37%/.33),transparent_32%),linear-gradient(105deg,hsl(171_30%_9%/.98)_5%,hsl(171_30%_14%/.66)_52%,hsl(171_30%_9%/.45))]" />
          <div className="absolute right-[9%] top-[24%] hidden size-48 rounded-full border border-white/15 lg:block"><div className="absolute -left-3 top-1/2 size-2 rounded-full bg-accent pulse-dot" /><div className="absolute inset-5 rounded-full border border-white/10" /></div>
          <div className="relative mx-auto w-full max-w-7xl px-5 lg:px-8">
            <div className="max-w-3xl reveal">
              <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[.2em] text-accent"><span className="h-px w-8 bg-accent" /> The wilderness, well supported</div>
              <h1 className="text-balance max-w-3xl text-5xl font-extrabold leading-[.98] tracking-[-.07em] sm:text-7xl lg:text-[6.6rem]">Leave the city.<br /><span className="text-accent">Find your wild.</span></h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-white/70 sm:text-lg">Handpicked treks, sharp local teams, and the kind of quiet you can feel in your chest. Your next story starts beyond the last signal bar.</p>
            </div>
            <form onSubmit={handleSearch} className="relative z-10 mt-10 grid max-w-4xl gap-2 rounded-2xl bg-[#f4eee2] p-2 text-foreground shadow-2xl shadow-black/20 sm:grid-cols-[1fr_auto_auto]" data-testid="form-hero-search">
              <div className="flex items-center gap-3 px-3"><Search className="size-5 text-primary/60" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a mountain, region or feeling" className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" data-testid="input-search-treks" /></div>
              <select value={activeCategory} onChange={(event) => setActiveCategory(event.target.value)} className="h-12 rounded-xl border-0 bg-[#e9e0d1] px-4 text-sm font-semibold outline-none" data-testid="select-search-category">{categories.map((category) => <option key={category}>{category}</option>)}</select>
              <button type="submit" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-sm font-bold text-accent-foreground transition hover:-translate-y-0.5 hover:bg-[#f47d48]" data-testid="button-search-treks">Search escapes <ArrowRight className="size-4" /></button>
            </form>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-white/55"><span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-accent" /> Local experts on every trail</span><span className="inline-flex items-center gap-2"><BadgeCheck className="size-4 text-accent" /> Small groups, big landscapes</span></div>
          </div>
        </section>

        <section className="border-b border-border/70 bg-[#eee6d7]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border/70 px-5 py-7 md:grid-cols-4 lg:px-8">
            {[['18', 'curated routes'], ['7,400m', 'highest summit'], ['4.9/5', 'traveller rating'], ['12 yrs', 'on the trail']].map(([value, label], index) => <div className={`px-4 first:pl-0 last:pr-0 ${index > 1 ? 'mt-5 md:mt-0' : ''}`} key={label}><p className="font-display text-2xl font-extrabold text-primary sm:text-3xl" data-testid={`text-stat-value-${index}`}>{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[.15em] text-muted-foreground">{label}</p></div>)}
          </div>
        </section>

        <section id="match" className="scroll-mt-8 bg-[#f5efe5] py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:px-8">
            <div className="reveal">
              <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[.18em] text-[#bd6b27]"><Sparkles className="size-4" /> Not sure where to begin?</div>
              <h2 className="max-w-md text-4xl font-extrabold leading-[1.02] text-primary sm:text-5xl">Tell us how you want to feel.</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">Two quick choices. We’ll point you towards the trail that meets you where you are — and takes you somewhere new.</p>
              <div className="mt-8 flex items-center gap-2 text-xs font-bold text-primary"><span className={`size-2 rounded-full ${matchStep >= 1 ? 'bg-accent' : 'bg-border'}`} /><span className={`size-2 rounded-full ${matchStep >= 2 ? 'bg-accent' : 'bg-border'}`} /><span className={`size-2 rounded-full ${matchStep >= 3 ? 'bg-accent' : 'bg-border'}`} /><span className="ml-2 text-muted-foreground">Step {Math.min(matchStep, 3)} of 2</span></div>
            </div>
            <div className="relative overflow-hidden rounded-[1.5rem] bg-primary p-7 text-white shadow-xl shadow-primary/15 sm:p-10">
              <div className="absolute -right-16 -top-16 size-52 rounded-full border-[20px] border-accent/10" />
              {matchStep <= 2 ? <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[.18em] text-accent">Your perfect distance</p>
                <h3 className="mt-3 text-3xl font-extrabold">{matchStep === 1 ? 'How much time can you disappear for?' : 'How wild should it get?'}</h3>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">{(matchStep === 1 ? matchDurations : matchDifficulties).map((choice) => <button type="button" key={choice} onClick={() => handleMatchChoice(choice, matchStep)} className="group rounded-xl border border-white/15 bg-white/5 p-4 text-left transition hover:border-accent hover:bg-accent hover:text-accent-foreground" data-testid={`button-match-${choice.replaceAll(' ', '-').toLowerCase()}`}><span className="mb-8 block text-white/40 group-hover:text-accent-foreground/60">{matchStep === 1 ? <CalendarDays className="size-5" /> : <Footprints className="size-5" />}</span><span className="text-sm font-bold">{choice}</span><ChevronRight className="mt-3 size-4 opacity-50 transition group-hover:translate-x-1" /></button>)}</div>
              </div> : <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[.18em] text-accent">Your trail brief is ready</p>
                <h3 className="mt-3 text-3xl font-extrabold">You’re a {matchDifficulty.toLowerCase()} kind of explorer.</h3>
                <p className="mt-4 max-w-md text-sm leading-6 text-white/70">We’ve tuned the map to {matchDuration.toLowerCase()} escapes with enough room for wonder. Start with these routes.</p>
                <button type="button" onClick={() => { setQuery(''); setActiveCategory('All escapes'); discoveryRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground transition hover:bg-[#f47d48]" data-testid="button-see-matches">See my matches <ArrowRight className="size-4" /></button>
                <button type="button" onClick={() => { setMatchStep(1); setMatchDifficulty(''); setMatchDuration(''); }} className="ml-3 text-xs font-semibold text-white/55 underline-offset-4 hover:text-white hover:underline" data-testid="button-reset-match">Start over</button>
              </div>}
            </div>
          </div>
        </section>

        <section id="escapes" ref={discoveryRef} className="scroll-mt-5 bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#bd6b27]">The good stuff</p><h2 className="text-4xl font-extrabold text-primary sm:text-5xl">Weekend escapes,<br /><span className="text-primary/45">properly done.</span></h2></div>
              <div className="flex max-w-full gap-2 overflow-x-auto pb-1">{categories.map((category) => <button type="button" key={category} onClick={() => setActiveCategory(category)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition ${activeCategory === category ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary'}`} data-testid={`button-filter-${category.replaceAll(' ', '-').toLowerCase()}`}>{category}</button>)}</div>
            </div>
            {treksLoading ? <div className="grid gap-5 md:grid-cols-2"><div className="h-96 animate-pulse rounded-[1.35rem] bg-muted" /><div className="h-96 animate-pulse rounded-[1.35rem] bg-muted" /></div> : treksError ? <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center"><p className="font-display text-xl font-bold text-primary">The map is taking a breather.</p><p className="mt-2 text-sm text-muted-foreground">We couldn’t load the escapes right now.</p><button type="button" onClick={() => refetchTreks()} className="mt-5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground" data-testid="button-retry-treks">Try again</button></div> : weekendTreks.length ? <div className="grid gap-5 md:grid-cols-2">{weekendTreks.map((trek, index) => <TrekCard key={trek.id} trek={trek} featured={index === 0} />)}</div> : <div className="rounded-2xl border border-dashed border-border p-12 text-center"><Compass className="mx-auto size-8 text-accent" /><p className="mt-4 font-display text-xl font-bold text-primary">No trails match that search.</p><p className="mt-2 text-sm text-muted-foreground">Try another region, category, or clear the filters.</p><button type="button" onClick={() => { setQuery(''); setActiveCategory('All escapes'); }} className="mt-5 text-xs font-bold text-accent underline underline-offset-4" data-testid="button-clear-filters">Clear filters</button></div>}
            {filteredTreks.length > 3 && <div className="mt-8 text-center"><p className="text-xs font-semibold text-muted-foreground">Showing the first three escapes — refine your search to find the right one.</p></div>}
          </div>
        </section>

        {specialTrek && <section className="bg-[#e9e0d1] py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[1.5rem] bg-[#d5e5df] md:grid-cols-[1.05fr_.95fr] lg:px-0">
            <div className="relative min-h-[360px] overflow-hidden md:min-h-[500px]"><img src={specialTrek.image} alt={specialTrek.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-primary/65 to-transparent" /><div className="absolute bottom-7 left-7 text-white"><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-accent">Seasonal special</p><p className="text-2xl font-extrabold">{specialTrek.name}</p></div></div>
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16"><div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Sun className="size-6" /></div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#bd6b27]">This season, go further</p><h2 className="mt-4 max-w-md text-4xl font-extrabold leading-[1.02] text-primary sm:text-5xl">The mountains are at their best right now.</h2><p className="mt-5 max-w-md text-sm leading-7 text-primary/65">{specialTrek.description}</p><div className="mt-8 flex items-center gap-5"><Link href={`/treks/${specialTrek.slug}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-accent hover:text-accent-foreground" data-testid="link-seasonal-special">See the seasonal escape <ArrowRight className="size-4" /></Link><span className="text-xs font-semibold text-primary/55">{formatPrice(specialTrek.price)} / person</span></div></div>
          </div>
        </section>}

        <section id="radar" className="scroll-mt-5 bg-primary py-20 text-white lg:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-accent"><span className="size-2 rounded-full bg-accent pulse-dot" /> Live trail radar</div><h2 className="text-4xl font-extrabold sm:text-5xl">Know before<br /><span className="text-white/45">you go.</span></h2></div><p className="max-w-xs text-sm leading-6 text-white/60">Conditions from our field teams, refreshed through the day. The trail always gets the final say.</p></div>
            {radarLoading ? <div className="grid gap-3 md:grid-cols-3"><div className="h-32 animate-pulse rounded-xl bg-white/10" /><div className="h-32 animate-pulse rounded-xl bg-white/10" /><div className="h-32 animate-pulse rounded-xl bg-white/10" /></div> : radarError ? <div className="rounded-xl border border-white/15 p-7"><p className="text-sm text-white/75">Live reports are temporarily offline.</p><button type="button" onClick={() => refetchRadar()} className="mt-4 rounded-full bg-accent px-4 py-2 text-xs font-bold text-accent-foreground" data-testid="button-retry-radar">Refresh radar</button></div> : radar?.length ? <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3">{radar.map((report) => <RadarCard key={report.id} report={report} />)}</div> : <div className="rounded-xl border border-white/15 p-7 text-sm text-white/65" data-testid="empty-radar">No field reports have come in yet. Check back soon.</div>}
            <div className="mt-8 flex items-center gap-2 text-xs text-white/45"><span>Last synced just now</span><span className="size-1 rounded-full bg-accent" /><span>Satellite + field team data</span></div>
          </div>
        </section>
      </main>

      <footer className="bg-[#eee6d7] py-12 text-primary">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 sm:flex-row sm:items-end lg:px-8"><div><Link href="/" className="flex items-center gap-2.5" data-testid="link-footer-logo"><span className="grid size-8 place-items-center rounded-lg bg-primary text-background"><TentTree className="size-4" /></span><span className="font-display text-lg font-extrabold">KRADIND<span className="text-accent">.</span></span></Link><p className="mt-4 max-w-xs text-xs leading-5 text-muted-foreground">Good people. Clear routes. Wild places that stay with you.</p></div><div className="flex flex-wrap gap-5 text-xs font-semibold text-primary/65"><a href="#escapes" className="hover:text-accent" data-testid="link-footer-escapes">Find an escape</a><a href="#radar" className="hover:text-accent" data-testid="link-footer-radar">Trail radar</a><a href="mailto:hello@kradind.com" className="hover:text-accent" data-testid="link-footer-contact">Talk to a human</a></div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary/40">{health?.status === 'ok' ? 'Trip desk online · ' : ''}© KRADIND ADVENTURES</p></div>
      </footer>
    </div>
  );
}