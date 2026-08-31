import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import {
  ArrowRight,
  Compass,
  Filter,
  Gauge,
  Heart,
  MapPin,
  Mountain,
  Search,
  TentTree,
  Wind,
} from 'lucide-react';
import { useListTreks } from '@workspace/api-client-react';
import type { Trek } from '@workspace/api-client-react';

const filters = ['All escapes', 'Weekend', 'Himalayas', 'Monsoon', 'Camping'];

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

function CatalogueCard({ trek }: { trek: Trek }) {
  const [saved, setSaved] = useState(false);

  return (
    <article
      className="group overflow-hidden rounded-[1.35rem] border border-border/80 bg-card shadow-[0_8px_30px_hsl(166_45%_24%/0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_42px_hsl(166_45%_24%/0.14)]"
      data-testid={`card-catalogue-trek-${trek.id}`}
    >
      <div className="image-shade relative h-72 overflow-hidden">
        <img
          src={trek.image}
          alt={trek.name}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          data-testid={`img-catalogue-trek-${trek.id}`}
        />
        <div className="absolute left-4 top-4 z-10 flex gap-2">
          {trek.badge && (
            <span className="rounded-full bg-accent px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.13em] text-accent-foreground">
              {trek.badge}
            </span>
          )}
          <span className="rounded-full bg-background/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.13em] text-foreground backdrop-blur">
            {trek.duration}
          </span>
        </div>
        <button
          type="button"
          aria-label={saved ? 'Remove from saved treks' : 'Save trek'}
          onClick={() => setSaved(!saved)}
          className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-background/85 text-primary backdrop-blur transition hover:bg-accent hover:text-accent-foreground"
          data-testid={`button-save-catalogue-trek-${trek.id}`}
        >
          <Heart className={`size-4 ${saved ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-5 left-5 z-10 text-white">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-white/75">
            <MapPin className="size-3.5" />
            {trek.location}, {trek.region}
          </p>
          <h2 className="text-3xl font-extrabold leading-tight">{trek.name}</h2>
        </div>
      </div>
      <div className="p-5">
        <p className="min-h-12 text-sm leading-6 text-muted-foreground">{trek.tagline}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border/70 pt-4 text-xs font-semibold text-foreground/70">
          <span className="inline-flex items-center gap-1.5">
            <Gauge className="size-3.5 text-accent" /> {trek.difficulty}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Mountain className="size-3.5 text-accent" /> {trek.altitude}
          </span>
          <span className="text-[#bd6b27]">★ {trek.rating}</span>
          <span className="ml-auto font-display text-lg font-extrabold text-primary">
            {formatPrice(trek.price)}
          </span>
        </div>
        <Link
          href={`/treks/${trek.slug}`}
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-primary-foreground transition hover:bg-accent hover:text-accent-foreground"
          data-testid={`link-catalogue-trek-${trek.id}`}
        >
          Explore this route <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}

export default function Treks() {
  const { data: treks, isLoading, isError, refetch } = useListTreks();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All escapes');

  const filteredTreks = useMemo(() => {
    if (!treks) return [];
    return treks.filter((trek) => {
      const matchesQuery =
        !query ||
        `${trek.name} ${trek.location} ${trek.region} ${trek.categories.join(' ')}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesFilter =
        activeFilter === 'All escapes' ||
        trek.categories.some((category) =>
          category.toLowerCase().includes(activeFilter.toLowerCase()),
        );
      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, query, treks]);

  return (
    <div className="grain min-h-[100dvh] overflow-x-hidden bg-background">
      <header className="border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 text-primary" data-testid="link-catalogue-logo">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-background">
              <TentTree className="size-5" />
            </span>
            <span className="font-display text-lg font-extrabold tracking-[-.04em]">
              KRADIND<span className="text-accent">.</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-xs font-bold text-primary/65 md:flex">
            <Link href="/treks" className="text-accent" data-testid="link-catalogue-nav-escapes">Find an escape</Link>
            <Link href="/about" className="hover:text-accent" data-testid="link-catalogue-nav-about">Our story</Link>
            <Link href="/contact" className="hover:text-accent" data-testid="link-catalogue-nav-contact">Talk to us</Link>
          </nav>
          <Link href="/#match" className="hidden rounded-full bg-accent px-4 py-2.5 text-xs font-bold text-accent-foreground transition hover:bg-[#f47d48] sm:block" data-testid="link-catalogue-plan">
            Find my trek
          </Link>
        </div>
      </header>

      <main>
        <section className="bg-primary px-5 py-16 text-white lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl reveal">
              <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[.2em] text-accent">
                <span className="h-px w-8 bg-accent" /> The full map
              </div>
              <h1 className="text-5xl font-extrabold leading-[.98] tracking-[-.06em] sm:text-7xl">
                Your next good
                <br />
                <span className="text-accent">story is out there.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
                From a first summit to a high-pass crossing, every route is
                chosen for the view, the people, and the feeling you bring home.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border/70 bg-[#eee6d7]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:px-8">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-border/70 bg-background px-4">
              <Search className="size-4 text-primary/55" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by place, pace or feeling"
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                data-testid="input-catalogue-search"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter className="mr-1 size-4 shrink-0 text-primary/55" />
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition ${
                    activeFilter === filter
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary'
                  }`}
                  data-testid={`button-catalogue-filter-${filter.replaceAll(' ', '-').toLowerCase()}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="mb-10 flex items-end justify-between gap-5">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#bd6b27]">
                {filteredTreks.length} routes on the map
              </p>
              <h2 className="text-4xl font-extrabold text-primary sm:text-5xl">
                Pick your kind
                <br />
                <span className="text-primary/45">of wild.</span>
              </h2>
            </div>
            <div className="hidden items-center gap-2 text-xs font-semibold text-muted-foreground sm:flex">
              <Wind className="size-4 text-accent" /> Live departures available
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="h-[31rem] animate-pulse rounded-[1.35rem] bg-muted" />
              <div className="h-[31rem] animate-pulse rounded-[1.35rem] bg-muted" />
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-10 text-center">
              <Compass className="mx-auto size-8 text-accent" />
              <p className="mt-4 font-display text-xl font-bold text-primary">The map is taking a breather.</p>
              <p className="mt-2 text-sm text-muted-foreground">We couldn’t load the escapes right now.</p>
              <button type="button" onClick={() => refetch()} className="mt-5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground" data-testid="button-retry-catalogue">
                Try again
              </button>
            </div>
          ) : filteredTreks.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {filteredTreks.map((trek) => <CatalogueCard key={trek.id} trek={trek} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-14 text-center">
              <Compass className="mx-auto size-8 text-accent" />
              <p className="mt-4 font-display text-xl font-bold text-primary">No trails match that search.</p>
              <button type="button" onClick={() => { setQuery(''); setActiveFilter('All escapes'); }} className="mt-5 text-xs font-bold text-accent underline underline-offset-4" data-testid="button-clear-catalogue-filters">
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="bg-[#e9e0d1] px-5 py-16 lg:py-20">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[1.5rem] bg-[#d5e5df] p-8 sm:p-12 lg:flex-row lg:items-center lg:p-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#bd6b27]">Still deciding?</p>
              <h2 className="mt-3 max-w-xl text-3xl font-extrabold leading-tight text-primary sm:text-4xl">
                Tell us how you want to feel. We’ll handle the map.
              </h2>
            </div>
            <Link href="/#match" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-accent hover:text-accent-foreground" data-testid="link-catalogue-matcher">
              Take the trek matcher <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-primary py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 px-5 sm:flex-row sm:items-center lg:px-8">
          <Link href="/" className="flex items-center gap-2.5" data-testid="link-catalogue-footer-logo">
            <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground"><TentTree className="size-4" /></span>
            <span className="font-display text-lg font-extrabold">KRADIND<span className="text-accent">.</span></span>
          </Link>
          <div className="flex flex-wrap gap-5 text-xs font-semibold text-white/55">
            <Link href="/about" className="hover:text-white" data-testid="link-catalogue-footer-about">Our story</Link>
            <Link href="/contact" className="hover:text-white" data-testid="link-catalogue-footer-contact">Talk to a human</Link>
            <span className="inline-flex items-center gap-2"><MapPin className="size-3.5" /> India · beyond</span>
          </div>
        </div>
      </footer>
    </div>
  );
}