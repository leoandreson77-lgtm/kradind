import { type FormEvent, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import { Header } from '@/components/header';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  Compass,
  CreditCard,
  Gauge,
  Heart,
  Info,
  Mail,
  MapPin,
  Menu,
  Mountain,
  Phone,
  ShieldCheck,
  TentTree,
  Users,
  X,
} from 'lucide-react';
import { useCreateBooking, useGetTrek } from '@workspace/api-client-react';
import type { Batch, Trek } from '@workspace/api-client-react';

const gearOptions = [
  { id: 'sleeping-bag', label: 'Insulated sleeping bag', price: 850 },
  { id: 'trek-poles', label: 'Carbon trek poles', price: 450 },
  { id: 'rain-shell', label: 'Rain shell + gaiters', price: 650 },
];

const faqs = [
  ['Is this trek suitable for first-timers?', 'Yes. Our route leaders brief every group before departure and keep the pace conversational. The difficulty rating reflects the terrain and altitude, not a requirement for previous expedition experience.'],
  ['What happens if the weather changes?', 'We make the call with your safety in mind. If conditions require a route change or a postponement, our field team will contact you directly and explain the next best option.'],
  ['How do I get to base camp?', 'Your confirmation email includes a clear meeting point and a transfer recommendation. We can also help coordinate shared transfers from the nearest railhead or airport.'],
  ['Can I cancel or move my booking?', 'You can request a date move up to 14 days before departure, subject to batch availability. Our team will share the cancellation terms before any payment is collected.'],
];

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(date));
}

function TrekLoading() {
  return <div className="min-h-[100dvh] bg-background"><div className="h-16 animate-pulse bg-primary/10" /><div className="mx-auto max-w-7xl space-y-5 px-5 py-10 lg:px-8"><div className="h-[27rem] animate-pulse rounded-3xl bg-muted" /><div className="grid gap-5 md:grid-cols-3"><div className="h-44 animate-pulse rounded-2xl bg-muted" /><div className="h-44 animate-pulse rounded-2xl bg-muted md:col-span-2" /></div></div></div>;
}

function TrekError({ onRetry }: { onRetry: () => void }) {
  return <div className="grid min-h-[100dvh] place-items-center bg-background px-5 text-center"><div><div className="mx-auto grid size-16 place-items-center rounded-2xl bg-secondary text-primary"><Compass className="size-7" /></div><h1 className="mt-6 font-display text-3xl font-extrabold text-primary">This trail is hard to reach.</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">We couldn’t load the trek details. It may be a temporary signal drop.</p><button type="button" onClick={onRetry} className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground" data-testid="button-retry-trek">Try again</button></div></div>;
}

function BookingPanel({ trek }: { trek: Trek }) {
  const [selectedBatch, setSelectedBatch] = useState<Batch | undefined>(trek.batches?.[0]);
  const [travelers, setTravelers] = useState(1);
  const [gear, setGear] = useState<string[]>([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmation, setConfirmation] = useState<{ id: string; message: string } | null>(null);
  const createBooking = useCreateBooking();
  const gearTotal = gear.reduce((sum, id) => sum + (gearOptions.find((option) => option.id === id)?.price ?? 0), 0);
  const total = (selectedBatch?.price ?? trek.price) * travelers + gearTotal * travelers;

  function toggleGear(id: string) {
    setGear((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedBatch) return setFormError('Choose a departure date to continue.');
    if (fullName.trim().length < 2) return setFormError('Please enter your full name.');
    if (!email.includes('@')) return setFormError('Please enter a valid email address.');
    if (phone.trim().length < 7) return setFormError('Please enter a phone number we can reach.');
    setFormError('');
    createBooking.mutate({ data: { trekSlug: trek.slug, batchId: selectedBatch.id, fullName: fullName.trim(), email: email.trim(), phone: phone.trim(), travelers, gear } }, {
      onSuccess: (result) => setConfirmation({ id: result.id, message: result.message }),
      onError: () => setFormError('We couldn’t send that through. Please try once more.'),
    });
  }

  if (confirmation) return <div className="sticky top-6 rounded-[1.35rem] bg-primary p-7 text-white shadow-xl shadow-primary/15" data-testid="panel-booking-success"><div className="grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground"><Check className="size-6" /></div><p className="mt-6 text-xs font-bold uppercase tracking-[.17em] text-accent">Request received</p><h2 className="mt-2 font-display text-3xl font-extrabold">You’re on your way.</h2><p className="mt-4 text-sm leading-6 text-white/70">{confirmation.message || 'Our trip desk will be in touch shortly with the next steps.'}</p><div className="mt-6 rounded-xl border border-white/15 bg-white/5 p-4"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-white/45">Booking reference</p><p className="mt-1 font-mono text-sm font-bold text-accent" data-testid="text-booking-reference">{confirmation.id}</p></div><Link href="/" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-white underline decoration-accent decoration-2 underline-offset-4" data-testid="link-booking-home">Return to discovery <ArrowRight className="size-4" /></Link></div>;

  return <form onSubmit={submitBooking} className="sticky top-6 rounded-[1.35rem] border border-border/80 bg-card p-5 shadow-[0_15px_50px_hsl(166_45%_24%/0.1)] sm:p-6" data-testid="form-booking">
    <div className="flex items-start justify-between gap-4 border-b border-border/70 pb-5"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-[#bd6b27]">Reserve your place</p><p className="mt-2 font-display text-3xl font-extrabold text-primary">{formatPrice(selectedBatch?.price ?? trek.price)} <span className="font-sans text-xs font-medium text-muted-foreground">/ person</span></p></div><div className="rounded-xl bg-secondary px-3 py-2 text-right"><p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">from</p><p className="text-xs font-bold text-primary">{formatDate(selectedBatch?.startDate ?? new Date().toISOString())}</p></div></div>
    <div className="border-b border-border/70 py-5"><label className="mb-3 block text-xs font-bold uppercase tracking-[.13em] text-primary">Choose a batch</label><div className="grid gap-2">{trek.batches?.length ? trek.batches.map((batch) => <button type="button" key={batch.id} onClick={() => setSelectedBatch(batch)} className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${selectedBatch?.id === batch.id ? 'border-accent bg-accent/10' : 'border-border hover:border-primary/40'}`} data-testid={`button-batch-${batch.id}`}><span><span className="block text-sm font-bold text-primary">{formatDate(batch.startDate)} – {formatDate(batch.endDate)}</span><span className="mt-1 block text-[11px] text-muted-foreground">{batch.slotsLeft} places left</span></span><span className={`grid size-5 place-items-center rounded-full border ${selectedBatch?.id === batch.id ? 'border-accent bg-accent text-accent-foreground' : 'border-border'}`}>{selectedBatch?.id === batch.id && <Check className="size-3" />}</span></button>) : <p className="rounded-xl bg-secondary p-3 text-xs text-muted-foreground">New departures are being added. Contact the trip desk to register interest.</p>}</div></div>
    <div className="border-b border-border/70 py-5"><label className="mb-3 block text-xs font-bold uppercase tracking-[.13em] text-primary" htmlFor="travelers">Travellers</label><div className="flex items-center justify-between rounded-xl border border-border p-2"><span className="pl-2 text-sm font-semibold text-primary">{travelers} {travelers === 1 ? 'person' : 'people'}</span><div className="flex items-center gap-1"><button type="button" onClick={() => setTravelers(Math.max(1, travelers - 1))} className="grid size-8 place-items-center rounded-lg bg-secondary text-primary transition hover:bg-accent" data-testid="button-decrease-travelers">−</button><button type="button" onClick={() => setTravelers(Math.min(8, travelers + 1))} className="grid size-8 place-items-center rounded-lg bg-secondary text-primary transition hover:bg-accent" data-testid="button-increase-travelers">+</button></div></div></div>
    <div className="border-b border-border/70 py-5"><p className="mb-3 text-xs font-bold uppercase tracking-[.13em] text-primary">Borrow the good gear <span className="font-normal normal-case tracking-normal text-muted-foreground">(optional)</span></p><div className="grid gap-2">{gearOptions.map((option) => <label key={option.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-transparent p-2 transition hover:border-border"><span className="flex items-center gap-3"><input type="checkbox" checked={gear.includes(option.id)} onChange={() => toggleGear(option.id)} className="size-4 accent-[#e9683d]" data-testid={`input-gear-${option.id}`} /><span className="text-xs font-medium text-primary">{option.label}</span></span><span className="text-[11px] font-semibold text-muted-foreground">+{formatPrice(option.price)}</span></label>)}</div></div>
    <div className="grid gap-3 py-5 sm:grid-cols-2"><label className="text-xs font-semibold text-primary sm:col-span-2">Full name<input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your name" className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" data-testid="input-booking-name" /></label><label className="text-xs font-semibold text-primary">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@email.com" className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" data-testid="input-booking-email" /></label><label className="text-xs font-semibold text-primary">Phone<input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91" className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" data-testid="input-booking-phone" /></label></div>
    {formError && <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2.5 text-xs font-semibold text-destructive" role="alert" data-testid="status-booking-error">{formError}</p>}
    <div className="flex items-center justify-between border-t border-border/70 pt-4 text-sm"><span className="font-semibold text-muted-foreground">Estimated total</span><span className="font-display text-xl font-extrabold text-primary" data-testid="text-booking-total">{formatPrice(total)}</span></div>
    <button type="submit" disabled={createBooking.isPending || !trek.batches?.length} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-bold text-accent-foreground transition hover:-translate-y-0.5 hover:bg-[#f47d48] disabled:cursor-not-allowed disabled:opacity-50" data-testid="button-submit-booking">{createBooking.isPending ? 'Sending request…' : 'Request this adventure'} <ArrowRight className="size-4" /></button>
    <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] text-muted-foreground"><ShieldCheck className="size-3.5 text-[#2d796d]" /> No payment until your trip is confirmed</p>
  </form>;
}

export default function TrekDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { data: trek, isLoading, isError, refetch } = useGetTrek(slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const gallery = useMemo(() => trek ? [trek.image, ...(trek.gallery ?? [])].filter(Boolean) : [], [trek]);

  if (isLoading) return <TrekLoading />;
  if (isError || !trek) return <TrekError onRetry={() => refetch()} />;

  return <div className="grain min-h-[100dvh] overflow-x-hidden bg-background">
    <Header />

    <main className="pt-24 lg:pt-28">
      <div className="mx-auto max-w-7xl px-5 pt-6 lg:px-8"><button type="button" onClick={() => setLocation('/')} className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition hover:text-primary" data-testid="button-back-discovery"><ArrowLeft className="size-4" /> All escapes</button></div>
      <section className="mx-auto grid max-w-7xl gap-7 px-5 pb-12 pt-6 lg:grid-cols-[1.25fr_.75fr] lg:px-8 lg:pb-20 lg:pt-8">
        <div>
          <div className="relative h-[23rem] overflow-hidden rounded-[1.5rem] bg-primary sm:h-[34rem]"><img src={gallery[selectedImage] ?? trek.image} alt={trek.name} className="h-full w-full object-cover transition-opacity duration-500" data-testid="img-detail-hero" /><div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-transparent to-transparent" /><div className="absolute bottom-6 left-6 right-6 text-white sm:bottom-8 sm:left-8"><div className="mb-3 flex flex-wrap gap-2"><span className="rounded-full bg-accent px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.13em] text-accent-foreground">{trek.badge ?? 'Curated escape'}</span><span className="rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.13em] text-white backdrop-blur">{trek.difficulty}</span></div><h1 className="max-w-2xl text-4xl font-extrabold leading-[.98] sm:text-6xl">{trek.name}</h1><p className="mt-3 flex items-center gap-2 text-sm text-white/75"><MapPin className="size-4 text-accent" /> {trek.location}, {trek.region}</p></div></div>
          {gallery.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto">{gallery.map((image, index) => <button type="button" key={`${image}-${index}`} onClick={() => setSelectedImage(index)} className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-20 sm:w-28 ${selectedImage === index ? 'border-accent' : 'border-transparent opacity-65 hover:opacity-100'}`} data-testid={`button-gallery-${index}`}><img src={image} alt={`${trek.name} view ${index + 1}`} className="h-full w-full object-cover" /></button>)}</div>}
        </div>
        <BookingPanel trek={trek} />
      </section>

      <section className="border-y border-border/70 bg-[#eee6d7]"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-5 py-7 sm:grid-cols-4 lg:px-8">{[[Clock3, trek.duration, 'Duration'], [Gauge, trek.difficulty, 'Pace'], [Mountain, trek.altitude, 'Highest point'], [MapPin, trek.baseCamp, 'Base camp']].map(([Icon, value, label], index) => <div className="flex items-center gap-3" key={label as string}><span className="grid size-10 place-items-center rounded-xl bg-background text-accent"><Icon className="size-4" /></span><div><p className="text-xs font-bold text-primary" data-testid={`text-detail-fact-${index}`}>{value as string}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">{label as string}</p></div></div>)}</div></section>

      <section className="mx-auto grid max-w-7xl gap-16 px-5 py-16 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-24"><div><p className="mb-4 text-xs font-bold uppercase tracking-[.17em] text-[#bd6b27]">The why</p><h2 className="max-w-xl text-4xl font-extrabold leading-[1.02] text-primary sm:text-5xl">{trek.tagline}</h2><p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground" data-testid="text-detail-description">{trek.description}</p><div className="mt-8 flex flex-wrap gap-2">{trek.categories.map((category) => <span className="rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-primary" key={category} data-testid={`tag-category-${category}`}>{category}</span>)}</div></div><div className="rounded-2xl bg-primary p-7 text-white sm:p-8"><p className="text-xs font-bold uppercase tracking-[.17em] text-accent">At a glance</p><div className="mt-6 grid gap-5"><div className="flex items-start gap-3"><BadgeCheck className="mt-0.5 size-5 shrink-0 text-accent" /><div><p className="text-sm font-bold">A small, considered group</p><p className="mt-1 text-xs leading-5 text-white/60">Enough company for a good story, enough space to hear the forest.</p></div></div><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" /><div><p className="text-sm font-bold">Support that stays close</p><p className="mt-1 text-xs leading-5 text-white/60">Trained leaders, clear briefings, and a team watching the weather.</p></div></div><div className="flex items-start gap-3"><CreditCard className="mt-0.5 size-5 shrink-0 text-accent" /><div><p className="text-sm font-bold">Clear pricing</p><p className="mt-1 text-xs leading-5 text-white/60">Your trip cost is shown upfront. No surprise mountain maths.</p></div></div></div></div></section>

      <section id="itinerary" className="scroll-mt-5 bg-[#e9e0d1] py-16 lg:py-24"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="mb-10 max-w-xl"><p className="mb-4 text-xs font-bold uppercase tracking-[.17em] text-[#bd6b27]">The route</p><h2 className="text-4xl font-extrabold text-primary sm:text-5xl">A good day out,<br /><span className="text-primary/45">every day.</span></h2></div><div className="relative ml-2 max-w-4xl border-l border-primary/20">{trek.itinerary.map((day) => <article className="relative pb-8 pl-8 last:pb-0 sm:pl-12" key={day.day} data-testid={`article-itinerary-day-${day.day}`}><span className="absolute -left-[7px] top-0 grid size-3 place-items-center rounded-full bg-accent ring-8 ring-[#e9e0d1]" /><div className="grid gap-3 rounded-2xl border border-border/70 bg-background/65 p-5 sm:grid-cols-[8rem_1fr_auto] sm:items-start sm:p-6"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-accent">Day {String(day.day).padStart(2, '0')}</p><p className="mt-2 text-xs font-semibold text-muted-foreground">{day.distance}</p></div><div><h3 className="text-xl font-extrabold text-primary">{day.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{day.description}</p></div><div className="flex gap-3 text-[11px] font-bold text-primary/60 sm:block sm:text-right"><span>{day.altitude}</span><span className="mx-2 text-border sm:hidden">·</span><span>{day.meal}</span></div></div></article>)}</div></div></section>

      <section id="safety" className="scroll-mt-5 mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-24"><div><p className="mb-4 text-xs font-bold uppercase tracking-[.17em] text-[#bd6b27]">The promise</p><h2 className="text-4xl font-extrabold leading-[1.02] text-primary sm:text-5xl">Wild does not mean<br />unsupported.</h2><p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">The best adventures have a steady hand behind them. That’s our job.</p></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-[#d5e5df] p-6"><ShieldCheck className="size-6 text-primary" /><h3 className="mt-8 text-lg font-extrabold text-primary">Safety-first planning</h3><p className="mt-2 text-sm leading-6 text-primary/65">Weather checks, route briefings, first-aid trained leaders, and a plan for the unplanned.</p></div><div className="rounded-2xl bg-primary p-6 text-white"><Users className="size-6 text-accent" /><h3 className="mt-8 text-lg font-extrabold">Small group rhythm</h3><p className="mt-2 text-sm leading-6 text-white/65">We keep departures intimate so local knowledge and quiet both have room.</p></div><div className="rounded-2xl border border-border bg-card p-6 sm:col-span-2"><div className="flex items-start gap-4"><Info className="mt-1 size-5 shrink-0 text-accent" /><div><h3 className="text-lg font-extrabold text-primary">What’s included</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Meals marked in the itinerary, shared accommodation, permits, local transfers from base camp, and an experienced trek leader. Personal travel to the meeting point and optional gear are separate.</p></div></div></div></div></section>

      <section id="faq" className="scroll-mt-5 border-t border-border/70 bg-[#f5efe5] py-16 lg:py-24"><div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[.65fr_1.35fr] lg:px-8"><div><p className="mb-4 text-xs font-bold uppercase tracking-[.17em] text-[#bd6b27]">Before you go</p><h2 className="text-4xl font-extrabold text-primary sm:text-5xl">Questions,<br />answered.</h2><p className="mt-5 text-sm leading-6 text-muted-foreground">Still wondering something? Our trip desk is an actual human.</p><a href="mailto:hello@kradind.com" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary underline decoration-accent decoration-2 underline-offset-4" data-testid="link-detail-email"><Mail className="size-4" /> Ask us anything</a></div><div className="divide-y divide-border/70 border-y border-border/70">{faqs.map(([question, answer], index) => <div key={question}><button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex w-full items-center justify-between gap-5 py-5 text-left text-sm font-bold text-primary" data-testid={`button-faq-${index}`}><span>{question}</span>{openFaq === index ? <ChevronUp className="size-4 shrink-0 text-accent" /> : <ChevronDown className="size-4 shrink-0 text-muted-foreground" />}</button>{openFaq === index && <p className="max-w-2xl pb-5 pr-8 text-sm leading-6 text-muted-foreground" data-testid={`text-faq-answer-${index}`}>{answer}</p>}</div>)}</div></div></section>
    </main>
    <footer className="bg-primary py-10 text-white"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 px-5 sm:flex-row sm:items-center lg:px-8"><Link href="/" className="flex items-center gap-2.5" data-testid="link-detail-footer-logo"><span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground"><TentTree className="size-4" /></span><span className="font-display text-lg font-extrabold">KRADIND<span className="text-accent">.</span></span></Link><div className="flex flex-wrap gap-5 text-xs font-semibold text-white/55"><a href="tel:+919999999999" className="inline-flex items-center gap-2 hover:text-white" data-testid="link-detail-phone"><Phone className="size-3.5" /> +91 99999 99999</a><a href="mailto:hello@kradind.com" className="inline-flex items-center gap-2 hover:text-white" data-testid="link-detail-contact"><Mail className="size-3.5" /> hello@kradind.com</a></div></div></footer>
  </div>;
}