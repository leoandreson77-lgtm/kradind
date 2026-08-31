import { type FormEvent, useState } from 'react';
import { Link } from 'wouter';
import { Header } from '@/components/header';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  TentTree,
} from 'lucide-react';

const questions = [
  ['Do I need trekking experience?', 'Not necessarily. Each route has an honest difficulty rating, and our team will help you pick a pace that feels exciting without feeling reckless.'],
  ['Can you help with a custom trip?', 'Yes. Share the rough shape of the trip you have in mind and our trip desk will suggest a route, season, and group size that fits.'],
  ['When do I pay?', 'This first step is only a request. No payment is collected until our team confirms the departure, availability, and details with you.'],
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="grain min-h-[100dvh] overflow-x-hidden bg-background">
      <Header />

      <main>
        <section className="bg-primary px-5 pb-16 pt-28 text-white lg:pb-24 lg:pt-36">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl reveal">
              <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[.2em] text-accent"><span className="h-px w-8 bg-accent" /> The trip desk</div>
              <h1 className="text-5xl font-extrabold leading-[.98] tracking-[-.06em] sm:text-7xl">A human is<br /><span className="text-accent">waiting to help.</span></h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-white/65 sm:text-lg">Ask us about a route, a season, the right boots, or whether you’re ready. There’s no wrong question before a good adventure.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[.75fr_1.25fr] lg:items-start lg:px-8 lg:py-24">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-[#bd6b27]">Let’s make a plan</p>
            <h2 className="text-4xl font-extrabold leading-[1.02] text-primary sm:text-5xl">What are you dreaming about?</h2>
            <div className="mt-8 grid gap-4">
              <a href="tel:+919999999999" className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-accent" data-testid="link-contact-call">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><Phone className="size-4" /></span>
                <span><span className="block text-sm font-bold text-primary">Call the trip desk</span><span className="mt-1 block text-xs text-muted-foreground">+91 99999 99999 · 10am–7pm IST</span></span>
              </a>
              <a href="mailto:hello@kradind.com" className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-accent" data-testid="link-contact-email">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><Mail className="size-4" /></span>
                <span><span className="block text-sm font-bold text-primary">Write us a note</span><span className="mt-1 block text-xs text-muted-foreground">hello@kradind.com · We reply within a day</span></span>
              </a>
              <div className="flex items-start gap-4 rounded-2xl bg-[#d5e5df] p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-accent"><Clock3 className="size-4" /></span>
                <span><span className="block text-sm font-bold text-primary">Trip desk hours</span><span className="mt-1 block text-xs text-primary/65">Monday–Saturday · 10am–7pm IST</span></span>
              </div>
            </div>
          </div>

          {submitted ? (
            <div className="rounded-[1.35rem] bg-primary p-8 text-white shadow-xl sm:p-10" data-testid="panel-contact-success">
              <div className="grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground"><Check className="size-6" /></div>
              <p className="mt-7 text-xs font-bold uppercase tracking-[.17em] text-accent">Message received</p>
              <h2 className="mt-2 text-3xl font-extrabold">We’ll meet you at the trailhead.</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/65">A trip expert will get back to you within one working day. In the meantime, have a look at the routes on the map.</p>
              <Link href="/treks" className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground" data-testid="link-contact-success-routes">Browse escapes <ArrowRight className="size-4" /></Link>
            </div>
          ) : (
            <form onSubmit={submitForm} className="rounded-[1.35rem] border border-border/80 bg-card p-6 shadow-[0_15px_50px_hsl(166_45%_24%/0.08)] sm:p-8" data-testid="form-contact">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-xs font-bold text-primary sm:col-span-2">Your name<input required name="name" placeholder="What should we call you?" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" data-testid="input-contact-name" /></label>
                <label className="text-xs font-bold text-primary">Email<input required type="email" name="email" placeholder="you@email.com" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" data-testid="input-contact-email" /></label>
                <label className="text-xs font-bold text-primary">Phone<input name="phone" placeholder="+91" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" data-testid="input-contact-phone" /></label>
                <label className="text-xs font-bold text-primary sm:col-span-2">What can we help with?<select name="topic" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal outline-none focus:border-accent" data-testid="select-contact-topic"><option>Help me choose a trek</option><option>Plan a private departure</option><option>Ask about an existing booking</option><option>Something else</option></select></label>
                <label className="text-xs font-bold text-primary sm:col-span-2">Your note<textarea required name="message" placeholder="Tell us the shape of the adventure..." className="mt-2 min-h-32 w-full resize-y rounded-xl border border-input bg-background p-3 text-sm font-normal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" data-testid="textarea-contact-message" /></label>
              </div>
              <button type="submit" className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-bold text-accent-foreground transition hover:-translate-y-0.5 hover:bg-[#f47d48]" data-testid="button-submit-contact">Send to the trip desk <ArrowRight className="size-4" /></button>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] text-muted-foreground"><ShieldCheck className="size-3.5 text-[#2d796d]" /> No spam. Just a thoughtful reply from a human.</p>
            </form>
          )}
        </section>

        <section className="border-t border-border/70 bg-[#f5efe5] py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[.65fr_1.35fr] lg:px-8">
            <div><p className="mb-4 text-xs font-bold uppercase tracking-[.17em] text-[#bd6b27]">Good to know</p><h2 className="text-4xl font-extrabold text-primary sm:text-5xl">A few things people ask.</h2><p className="mt-5 text-sm leading-6 text-muted-foreground">Still wondering something? That’s exactly what the trip desk is for.</p></div>
            <div className="divide-y divide-border/70 border-y border-border/70">{questions.map(([question, answer], index) => <div key={question}><button type="button" onClick={() => setOpenQuestion(openQuestion === index ? null : index)} className="flex w-full items-center justify-between gap-5 py-5 text-left text-sm font-bold text-primary" data-testid={`button-contact-faq-${index}`}><span>{question}</span>{openQuestion === index ? <ChevronUp className="size-4 shrink-0 text-accent" /> : <ChevronDown className="size-4 shrink-0 text-muted-foreground" />}</button>{openQuestion === index && <p className="max-w-2xl pb-5 pr-8 text-sm leading-6 text-muted-foreground" data-testid={`text-contact-faq-${index}`}>{answer}</p>}</div>)}</div>
          </div>
        </section>
      </main>

      <footer className="bg-primary py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 px-5 sm:flex-row sm:items-center lg:px-8">
          <Link href="/" className="flex items-center gap-2.5" data-testid="link-contact-footer-logo"><span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground"><TentTree className="size-4" /></span><span className="font-display text-lg font-extrabold">KRADIND<span className="text-accent">.</span></span></Link>
          <div className="flex flex-wrap gap-5 text-xs font-semibold text-white/55"><Link href="/treks" className="hover:text-white" data-testid="link-contact-footer-escapes">Find an escape</Link><Link href="/about" className="hover:text-white" data-testid="link-contact-footer-about">Our story</Link><span className="inline-flex items-center gap-2"><MapPin className="size-3.5" /> India · beyond</span></div>
        </div>
      </footer>
    </div>
  );
}