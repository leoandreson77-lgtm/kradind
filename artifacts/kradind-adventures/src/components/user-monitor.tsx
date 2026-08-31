import { useEffect, useState } from 'react';
import {
  Activity,
  BarChart3,
  Eye,
  Globe,
  Monitor,
  ShieldCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';

interface UserEvent {
  id: string;
  time: string;
  user: string;
  location: string;
  action: string;
  target: string;
}

const initialEvents: UserEvent[] = [
  {
    id: 'evt-1',
    time: 'Just now',
    user: 'Explorer #4092',
    location: 'New Delhi, IN',
    action: 'Booked Package',
    target: 'Alpine Summit Expedition',
  },
  {
    id: 'evt-2',
    time: '12s ago',
    user: 'Explorer #3881',
    location: 'Mumbai, IN',
    action: 'Viewed Route',
    target: 'Kedarkantha Winter Peak',
  },
  {
    id: 'evt-3',
    time: '45s ago',
    user: 'Explorer #1029',
    location: 'Bengaluru, IN',
    action: 'Ran Trek Matcher',
    target: 'Weekend / Moderate',
  },
  {
    id: 'evt-4',
    time: '1m ago',
    user: 'Explorer #5512',
    location: 'Chandigarh, IN',
    action: 'Saved Trek',
    target: 'Valley of Flowers',
  },
  {
    id: 'evt-5',
    time: '2m ago',
    user: 'Explorer #7710',
    location: 'Pune, IN',
    action: 'Checked Radar',
    target: 'Kuari Pass Trail',
  },
];

export function UserMonitor() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeUsers, setActiveUsers] = useState(24);
  const [events, setEvents] = useState<UserEvent[]>(initialEvents);
  const [pageViews, setPageViews] = useState(1420);

  // Simulate real-time live traffic pulses
  useEffect(() => {
    const interval = setInterval(() => {
      // Random fluctuation in online users
      const delta = Math.floor(Math.random() * 3) - 1;
      setActiveUsers((prev) => Math.max(12, Math.min(48, prev + delta)));
      setPageViews((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* FLOATING TELEMETRY WIDGET BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-2.5 rounded-full border border-white/20 bg-primary/95 px-4 py-2.5 text-xs font-bold text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-primary"
          data-testid="button-open-user-monitor"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
          </span>
          <span className="hidden sm:inline">Live Monitor:</span>
          <span className="font-mono text-accent">{activeUsers} active</span>
          <Activity className="size-4 text-accent transition-transform group-hover:rotate-12" />
        </button>
      </div>

      {/* MONITORING DASHBOARD MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-0">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-primary p-6 text-white shadow-2xl sm:p-8">
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 grid size-9 place-items-center rounded-full border border-white/20 text-white/70 transition hover:bg-white/10 hover:text-white"
              data-testid="button-close-user-monitor"
            >
              <X className="size-5" />
            </button>

            {/* HEADER */}
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-md">
                <Monitor className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-xl font-extrabold">Real-Time User Monitor</h3>
                <p className="text-xs text-white/60">Live telemetry, active explorer sessions & traffic insights</p>
              </div>
            </div>

            {/* METRICS CARDS */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="flex items-center justify-between text-xs text-white/65">
                  <span>Active Users</span>
                  <Users className="size-4 text-accent" />
                </div>
                <p className="mt-2 font-mono text-2xl font-extrabold text-white">{activeUsers}</p>
                <p className="mt-0.5 text-[10px] text-accent font-semibold flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-accent animate-pulse" /> Live right now
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="flex items-center justify-between text-xs text-white/65">
                  <span>Page Views Today</span>
                  <Eye className="size-4 text-accent" />
                </div>
                <p className="mt-2 font-mono text-2xl font-extrabold text-white">{pageViews}</p>
                <p className="mt-0.5 text-[10px] text-white/50">+18% vs yesterday</p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="flex items-center justify-between text-xs text-white/65">
                  <span>Conversion Rate</span>
                  <BarChart3 className="size-4 text-accent" />
                </div>
                <p className="mt-2 font-mono text-2xl font-extrabold text-accent">4.8%</p>
                <p className="mt-0.5 text-[10px] text-white/50">Optimal health</p>
              </div>
            </div>

            {/* LIVE ACTIVITY FEED */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-2">
                  <Zap className="size-3.5" /> Live Activity Feed
                </h4>
                <span className="text-[11px] text-white/40">Auto-updating</span>
              </div>

              <div className="mt-3 max-h-52 overflow-y-auto rounded-2xl border border-white/15 bg-white/5 p-3 divide-y divide-white/10">
                {events.map((evt) => (
                  <div key={evt.id} className="flex items-center justify-between py-2.5 px-2 text-xs">
                    <div className="flex items-center gap-3">
                      <Globe className="size-4 text-accent/80 shrink-0" />
                      <div>
                        <span className="font-semibold text-white">{evt.user}</span>{' '}
                        <span className="text-white/60">({evt.location})</span>
                        <p className="text-[11px] text-white/80">
                          {evt.action}: <span className="text-accent font-semibold">{evt.target}</span>
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-white/40 shrink-0">{evt.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* INTEGRATION INFO */}
            <div className="mt-6 flex items-center justify-between rounded-xl border border-accent/20 bg-accent/10 px-4 py-3 text-xs">
              <div className="flex items-center gap-2 text-white/80">
                <ShieldCheck className="size-4 text-accent" />
                <span>Ready for <b>Google Analytics</b>, <b>PostHog</b>, or <b>LogRocket</b></span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground shadow"
              >
                Close Monitor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
