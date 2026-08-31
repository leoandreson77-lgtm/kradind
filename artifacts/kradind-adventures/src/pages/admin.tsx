import { useState } from 'react';
import { Link } from 'wouter';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Edit,
  Eye,
  Filter,
  Layers,
  MapPin,
  Mountain,
  Plus,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  TentTree,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';

interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  trekName: string;
  batchDate: string;
  travelers: number;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Completed';
  createdAt: string;
}

const mockBookings: Booking[] = [
  {
    id: 'KRD-8849',
    customerName: 'Aarav Sharma',
    email: 'aarav@gmail.com',
    phone: '+91 98765 43210',
    trekName: 'Kedarkantha Winter Peak',
    batchDate: '15 Dec 2026',
    travelers: 2,
    totalAmount: 19998,
    status: 'Confirmed',
    createdAt: '10 mins ago',
  },
  {
    id: 'KRD-8850',
    customerName: 'Priya Verma',
    email: 'priya.v@outlook.com',
    phone: '+91 91234 56789',
    trekName: 'Valley of Flowers & Hemkund',
    batchDate: '22 Dec 2026',
    travelers: 1,
    totalAmount: 14500,
    status: 'Pending',
    createdAt: '25 mins ago',
  },
  {
    id: 'KRD-8851',
    customerName: 'Rohan Mehta',
    email: 'rohan.m@techcorp.in',
    phone: '+91 99887 76655',
    trekName: 'Hampta Pass Crossing',
    batchDate: '05 Jan 2027',
    travelers: 4,
    totalAmount: 49996,
    status: 'Pending',
    createdAt: '1 hour ago',
  },
  {
    id: 'KRD-8852',
    customerName: 'Neha Kapoor',
    email: 'neha.kapoor@gmail.com',
    phone: '+91 94567 12345',
    trekName: 'Kuari Pass Winter Trail',
    batchDate: '18 Dec 2026',
    travelers: 3,
    totalAmount: 32997,
    status: 'Confirmed',
    createdAt: '2 hours ago',
  },
  {
    id: 'KRD-8853',
    customerName: 'Vikramaditya Singh',
    email: 'vikram.singh@gmail.com',
    phone: '+91 97112 33445',
    trekName: 'Kedarkantha Winter Peak',
    batchDate: '10 Dec 2026',
    travelers: 2,
    totalAmount: 19998,
    status: 'Completed',
    createdAt: 'Yesterday',
  },
];

interface TrekItem {
  id: string;
  name: string;
  region: string;
  difficulty: string;
  duration: string;
  price: number;
  status: 'Active' | 'Draft' | 'Featured';
  bookingsCount: number;
}

const mockTreks: TrekItem[] = [
  {
    id: 'trk-1',
    name: 'Kedarkantha Winter Peak',
    region: 'Uttarakhand',
    difficulty: 'Moderate',
    duration: '5 Days',
    price: 9999,
    status: 'Featured',
    bookingsCount: 142,
  },
  {
    id: 'trk-2',
    name: 'Valley of Flowers & Hemkund',
    region: 'Uttarakhand',
    difficulty: 'Moderate',
    duration: '6 Days',
    price: 14500,
    status: 'Active',
    bookingsCount: 98,
  },
  {
    id: 'trk-3',
    name: 'Hampta Pass Crossing',
    region: 'Himachal Pradesh',
    difficulty: 'Challenging',
    duration: '5 Days',
    price: 12499,
    status: 'Featured',
    bookingsCount: 115,
  },
  {
    id: 'trk-4',
    name: 'Kuari Pass Winter Trail',
    region: 'Uttarakhand',
    difficulty: 'Easy–Moderate',
    duration: '6 Days',
    price: 10999,
    status: 'Active',
    bookingsCount: 76,
  },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'treks' | 'radar' | 'analytics'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [treks, setTreks] = useState<TrekItem[]>(mockTreks);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [newRadarMsg, setNewRadarMsg] = useState('');
  const [radarReports, setRadarReports] = useState([
    { id: 'rad-1', trek: 'Kedarkantha Peak', condition: 'Clear Skies & Fresh Snow', status: 'Optimal', time: '1 hour ago' },
    { id: 'rad-2', trek: 'Hampta Pass', condition: 'Sub-zero Ridge Winds (-8°C)', status: 'Caution', time: '3 hours ago' },
    { id: 'rad-3', trek: 'Kuari Pass', condition: 'Trail Dry & Well Marked', status: 'Optimal', time: '5 hours ago' },
  ]);

  function updateBookingStatus(id: string, newStatus: 'Pending' | 'Confirmed' | 'Completed') {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  }

  function addRadarReport() {
    if (!newRadarMsg.trim()) return;
    setRadarReports([
      {
        id: `rad-${Date.now()}`,
        trek: 'Himalayan Ridge Feed',
        condition: newRadarMsg.trim(),
        status: 'Optimal',
        time: 'Just now',
      },
      ...radarReports,
    ]);
    setNewRadarMsg('');
  }

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.trekName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="grain min-h-[100dvh] overflow-x-hidden bg-background text-foreground">
      {/* ADMIN HEADER */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-primary/95 px-6 py-4 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5" data-testid="link-admin-logo">
              <span className="grid size-9 place-items-center rounded-xl bg-accent text-accent-foreground shadow-md">
                <TentTree className="size-5" />
              </span>
              <span className="font-display text-xl font-extrabold tracking-tight">
                KRADIND<span className="text-accent">.</span>
              </span>
            </Link>
            <span className="rounded-full bg-accent/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
              Admin Portal
            </span>
          </div>

          {/* TABS */}
          <nav className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-accent text-accent-foreground shadow'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              Bookings ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('treks')}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'treks'
                  ? 'bg-accent text-accent-foreground shadow'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              Manage Treks ({treks.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('radar')}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'radar'
                  ? 'bg-accent text-accent-foreground shadow'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              Trail Radar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-accent text-accent-foreground shadow'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              Analytics
            </button>
          </nav>

          <Link
            href="/"
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/10"
          >
            View Live Site →
          </Link>
        </div>
      </header>

      {/* STATS OVERVIEW BAR */}
      <section className="border-b border-border/80 bg-card/60 py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 md:grid-cols-4">
          <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Revenue</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-primary">₹1,37,489</p>
            <p className="mt-0.5 text-[10px] font-semibold text-accent">+24% this month</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Pending Requests</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-primary">
              {bookings.filter((b) => b.status === 'Pending').length}
            </p>
            <p className="mt-0.5 text-[10px] font-semibold text-accent">Requires confirmation</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Active Departures</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-primary">12 Batches</p>
            <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">Season 2026</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Safety Score</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-primary">99.8%</p>
            <p className="mt-0.5 text-[10px] font-semibold text-accent">Zero safety incidents</p>
          </div>
        </div>
      </section>

      {/* MAIN ADMIN BODY */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* TAB 1: BOOKINGS DESK */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-3xl font-extrabold text-primary">Expedition Booking Desk</h2>
                <p className="mt-1 text-xs text-muted-foreground">Manage customer trip requests & status confirmations</p>
              </div>

              {/* SEARCH & FILTERS */}
              <div className="flex items-center gap-3">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 size-4 text-muted-foreground" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search customer, trek..."
                    className="h-10 rounded-xl border border-input bg-background pl-9 pr-4 text-xs font-semibold outline-none focus:border-accent"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-10 rounded-xl border border-input bg-background px-3 text-xs font-semibold outline-none focus:border-accent"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* BOOKINGS TABLE */}
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/80 bg-secondary/50 font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3.5">Ref ID</th>
                      <th className="px-5 py-3.5">Customer</th>
                      <th className="px-5 py-3.5">Trek Route</th>
                      <th className="px-5 py-3.5">Departure</th>
                      <th className="px-5 py-3.5">Group</th>
                      <th className="px-5 py-3.5">Amount</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="transition hover:bg-secondary/30">
                        <td className="px-5 py-4 font-mono font-bold text-accent">{b.id}</td>
                        <td className="px-5 py-4">
                          <p className="font-bold text-primary">{b.customerName}</p>
                          <p className="text-[11px] text-muted-foreground">{b.email}</p>
                          <p className="text-[10px] text-muted-foreground">{b.phone}</p>
                        </td>
                        <td className="px-5 py-4 font-semibold text-primary">{b.trekName}</td>
                        <td className="px-5 py-4 font-medium text-muted-foreground">{b.batchDate}</td>
                        <td className="px-5 py-4 font-semibold text-primary">{b.travelers} Persons</td>
                        <td className="px-5 py-4 font-display font-extrabold text-primary">₹{b.totalAmount.toLocaleString()}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              b.status === 'Confirmed'
                                ? 'bg-emerald-500/15 text-emerald-600'
                                : b.status === 'Pending'
                                ? 'bg-amber-500/15 text-amber-600'
                                : 'bg-blue-500/15 text-blue-600'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {b.status === 'Pending' && (
                              <button
                                type="button"
                                onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                                className="rounded-lg bg-accent px-3 py-1.5 text-[10px] font-bold text-accent-foreground shadow transition hover:scale-105"
                              >
                                Confirm
                              </button>
                            )}
                            {b.status === 'Confirmed' && (
                              <button
                                type="button"
                                onClick={() => updateBookingStatus(b.id, 'Completed')}
                                className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-bold text-primary-foreground transition hover:scale-105"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TREK MANAGEMENT */}
        {activeTab === 'treks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-3xl font-extrabold text-primary">Expedition Catalog Control</h2>
                <p className="mt-1 text-xs text-muted-foreground">Manage active routes, pricing, and batch availability</p>
              </div>

              <button
                type="button"
                className="flex items-center gap-2 rounded-2xl bg-accent px-5 py-2.5 text-xs font-bold text-accent-foreground shadow transition hover:bg-accent/90"
              >
                <Plus className="size-4" /> Add New Route
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {treks.map((trek) => (
                <div key={trek.id} className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {trek.region}
                    </span>
                    <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                      {trek.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-extrabold text-primary">{trek.name}</h3>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">{trek.duration} • {trek.difficulty}</p>
                  </div>

                  <div className="border-t border-border/60 pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Price / Person</p>
                      <p className="font-display text-lg font-extrabold text-primary">₹{trek.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Booked</p>
                      <p className="font-mono text-sm font-bold text-accent">{trek.bookingsCount} Users</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TRAIL RADAR UPDATER */}
        {activeTab === 'radar' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-primary">Live Satellite Trail Radar Control</h2>
              <p className="mt-1 text-xs text-muted-foreground">Post real-time mountain field updates to the live homepage radar</p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-primary">
                Post Satellite Weather / Condition Alert
              </label>
              <div className="flex gap-3">
                <input
                  value={newRadarMsg}
                  onChange={(e) => setNewRadarMsg(e.target.value)}
                  placeholder="e.g. Kedarkantha Summit: Clear weather, trail open with safety guides..."
                  className="h-11 flex-1 rounded-xl border border-input bg-background px-4 text-xs font-medium outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={addRadarReport}
                  className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-accent-foreground shadow transition hover:bg-accent/90"
                >
                  <Radio className="size-4" /> Broadcast Update
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Broadcast Feed</h3>
              {radarReports.map((rep) => (
                <div key={rep.id} className="flex items-center justify-between rounded-xl border border-border/70 bg-card p-4">
                  <div className="flex items-center gap-3">
                    <Radio className="size-5 text-accent animate-pulse" />
                    <div>
                      <p className="text-xs font-bold text-primary">{rep.trek}</p>
                      <p className="text-xs text-muted-foreground">{rep.condition}</p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{rep.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS OVERVIEW */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-primary">Expedition Telemetry Analytics</h2>
              <p className="mt-1 text-xs text-muted-foreground">Real-time performance metrics and conversion stats</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <h3 className="font-display text-lg font-extrabold text-primary">Top Performing Routes</h3>
                <div className="mt-4 space-y-3">
                  {[
                    { name: 'Kedarkantha Winter Peak', percentage: 84 },
                    { name: 'Hampta Pass Crossing', percentage: 68 },
                    { name: 'Valley of Flowers', percentage: 52 },
                    { name: 'Kuari Pass Winter Trail', percentage: 41 },
                  ].map((item) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-primary">
                        <span>{item.name}</span>
                        <span className="text-accent">{item.percentage}% Occupancy</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <h3 className="font-display text-lg font-extrabold text-primary">Season Health Summary</h3>
                <ul className="mt-4 space-y-3 text-xs font-medium text-muted-foreground">
                  <li className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span>Average Group Size:</span>
                    <span className="font-bold text-primary">8 Travellers / Batch</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span>Repeat Adventurers:</span>
                    <span className="font-bold text-accent">34.2%</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span>Average Expedition Value:</span>
                    <span className="font-bold text-primary">₹22,400</span>
                  </li>
                  <li className="flex items-center justify-between pb-2">
                    <span>Satellite Radar Uptime:</span>
                    <span className="font-bold text-emerald-600">100.0%</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
