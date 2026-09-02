import { Link } from 'wouter';
import { Header } from '@/components/header';
import {
  ArrowRight,
  BadgeCheck,
  Compass,
  Heart,
  Mountain,
  ShieldCheck,
  TentTree,
  Users,
} from 'lucide-react';

const values = [
  {
    icon: Compass,
    title: 'The route comes first',
    copy: 'We choose places with a point of view, not just a good thumbnail. Every itinerary leaves room for the weather, the people, and the unplanned turn.',
  },
  {
    icon: Users,
    title: 'Small groups, real company',
    copy: 'A good departure is a handful of curious people, a local team who knows the slope, and enough quiet to hear yourself think.',
  },
  {
    icon: ShieldCheck,
    title: 'Wild, well supported',
    copy: 'Clear briefings, trained leaders, honest difficulty ratings, and a field team watching conditions before you even lace up.',
  },
];

export default function About() {
  return (
    <div className="grain min-h-[100dvh] overflow-x-hidden bg-background">
      <Header />

      <main>
        <section className="relative flex min-h-[640px] items-end overflow-hidden bg-primary pb-16 pt-32 text-white lg:min-h-[720px] lg:pb-24">
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=85" alt="" className="absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,hsl(171_30%_9%/.98)_5%,hsl(171_30%_14%/.7)_55%,hsl(171_30%_9%/.38))]" />
          <div className="relative mx-auto w-full max-w-7xl px-5 lg:px-8">
            <div className="max-w-3xl reveal">
              <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[.2em] text-accent"><span className="h-px w-8 bg-accent" /> A note from the trail</div>
              <h1 className="text-5xl font-extrabold leading-[.98] tracking-[-.06em] sm:text-7xl lg:text-[6.2rem]">
                We go where
                <br />
                <span className="text-accent">the quiet is.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
                KRADIND started with a simple belief: getting outside should
                feel less like logistics and more like coming back to yourself.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border/70 bg-[#eee6d7]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border/70 px-5 py-8 md:grid-cols-4 lg:px-8">
            {[
              ['12', 'years outside'],
              ['4,800+', 'travellers hosted'],
              ['18', 'routes curated'],
              ['4.9/5', 'traveller rating'],
            ].map(([value, label], index) => (
              <div className={`px-4 first:pl-0 last:pr-0 ${index > 1 ? 'mt-5 md:mt-0' : ''}`} key={label}>
                <p className="font-display text-2xl font-extrabold text-primary sm:text-3xl" data-testid={`text-about-stat-${index}`}>{value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[.15em] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:px-8 lg:py-28">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-[#bd6b27]">Why KRADIND exists</p>
            <h2 className="max-w-md text-4xl font-extrabold leading-[1.02] text-primary sm:text-5xl">A good adventure is more than a view.</h2>
          </div>
          <div className="grid gap-5 text-base leading-8 text-muted-foreground">
            <p>It’s the first cup of chai before sunrise. The local guide who knows exactly where the path disappears. The laugh that travels further than the group expected.</p>
            <p>We build the kind of trips we want to take ourselves: thoughtful routes, honest pacing, local knowledge, and a steady hand behind the scenes.</p>
            <p className="font-semibold text-primary">Come for the mountain. Leave with a bigger map of your life.</p>
          </div>
        </section>

        <section className="bg-[#e9e0d1] py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-10 max-w-xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-[#bd6b27]">How we travel</p>
              <h2 className="text-4xl font-extrabold text-primary sm:text-5xl">The things we don’t compromise on.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {values.map(({ icon: Icon, title, copy }) => (
                <article className="rounded-2xl border border-border/70 bg-background/65 p-7" key={title} data-testid={`card-about-value-${title.replaceAll(' ', '-').toLowerCase()}`}>
                  <div className="grid size-11 place-items-center rounded-2xl bg-primary text-accent"><Icon className="size-5" /></div>
                  <h3 className="mt-10 text-xl font-extrabold text-primary">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary px-5 py-20 text-white lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[.18em] text-accent"><Heart className="size-4" /> The promise</div>
              <h2 className="max-w-2xl text-4xl font-extrabold leading-[1.02] sm:text-6xl">Leave the city. Come back with more of yourself.</h2>
            </div>
            <div className="rounded-[1.35rem] border border-white/15 bg-white/5 p-7">
              <BadgeCheck className="size-6 text-accent" />
              <p className="mt-6 text-lg font-bold">Good people. Clear routes. Wild places that stay with you.</p>
              <Link href="/treks" className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground transition hover:bg-[#f47d48]" data-testid="link-about-cta">
                Find your route <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#eee6d7] py-10 text-primary">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 px-5 sm:flex-row sm:items-center lg:px-8">
          <Link href="/" className="flex items-center gap-2.5" data-testid="link-about-footer-logo"><span className="grid size-8 place-items-center rounded-lg bg-primary text-background"><TentTree className="size-4" /></span><span className="font-display text-lg font-extrabold">KRADIND<span className="text-accent">.</span></span></Link>
          <div className="flex flex-wrap gap-5 text-xs font-semibold text-primary/65"><Link href="/treks" className="hover:text-accent" data-testid="link-about-footer-escapes">Find an escape</Link><Link href="/contact" className="hover:text-accent" data-testid="link-about-footer-contact">Talk to a human</Link><span className="inline-flex items-center gap-2"><Mountain className="size-3.5" /> Built for the long way round</span></div>
        </div>
      </footer>
    </div>
  );
}