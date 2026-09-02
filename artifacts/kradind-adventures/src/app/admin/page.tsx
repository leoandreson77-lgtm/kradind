"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Mountain,
  Users,
  Radio,
  IndianRupee,
  PlusCircle,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Inbox,
  Mail,
  MessageSquare,
} from "lucide-react";
import { TrekData, TrailRadarReport, BookingRecord, LeadRecord } from "@/lib/cms-store";

export default function AdminDashboardPage() {
  const [treks, setTreks] = useState<TrekData[]>([]);
  const [radar, setRadar] = useState<TrailRadarReport[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [treksRes, radarRes, bookingsRes, leadsRes] = await Promise.all([
          fetch("/api/admin/treks"),
          fetch("/api/admin/radar"),
          fetch("/api/admin/bookings"),
          fetch("/api/admin/leads"),
        ]);

        if (treksRes.ok) setTreks(await treksRes.json());
        if (radarRes.ok) setRadar(await radarRes.json());
        if (bookingsRes.ok) setBookings(await bookingsRes.json());
        if (leadsRes.ok) setLeads(await leadsRes.json());
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const totalRevenue = bookings.reduce(
    (acc, b) => (b.status === "Confirmed" || b.status === "Completed" ? acc + b.totalAmount : acc),
    0,
  );

  const activeTreksCount = treks.filter((t) => t.status === "Published").length;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-white rounded-2xl border border-slate-200 p-5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Expedition Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time overview of live trails, bookings, and public site contents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/treks"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-semibold rounded-xl transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Manage Treks</span>
          </Link>
          <Link
            href="/admin/sections"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#FF6B35] hover:bg-[#e8590c] text-white text-xs font-semibold rounded-xl transition shadow-sm"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Edit Home Hero</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Active Treks */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Published Treks
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {activeTreksCount}{" "}
              <span className="text-xs font-normal text-slate-400">/ {treks.length} total</span>
            </div>
            <Link
              href="/admin/treks"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F3A2E] hover:underline mt-2"
            >
              <span>View catalog</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0F3A2E] flex items-center justify-center">
            <Mountain className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Bookings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Bookings
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{bookings.length}</div>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F3A2E] hover:underline mt-2"
            >
              <span>View departures</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Live Radar Reports */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Trail Radar Feeds
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{radar.length}</div>
            <Link
              href="/admin/radar"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F3A2E] hover:underline mt-2"
            >
              <span>Update conditions</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Radio className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Confirmed Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Confirmed Revenue
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-2 block">
              + Verified deposits
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF6B35] flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        {/* Card 5: Inquiries / Leads */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Customer Leads
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {leads.length}{" "}
              {leads.filter((l) => l.status === "New").length > 0 && (
                <span className="text-xs font-bold text-blue-600">
                  ({leads.filter((l) => l.status === "New").length} new)
                </span>
              )}
            </div>
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F3A2E] hover:underline mt-2"
            >
              <span>View inquiries</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Customer Bookings</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live reservations made through public booking modal
            </p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-bold text-[#0F3A2E] hover:underline"
          >
            All Bookings →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Booking ID</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Trek</th>
                <th className="px-5 py-3.5">Travelers</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3 font-mono font-bold text-slate-800">{b.id}</td>
                  <td className="px-5 py-3">
                    <div className="font-semibold text-slate-900">{b.customerName}</div>
                    <div className="text-[11px] text-slate-500">{b.email}</div>
                  </td>
                  <td className="px-5 py-3 font-medium text-slate-700">{b.trekName}</td>
                  <td className="px-5 py-3 text-slate-600">{b.travelers} Trekkers</td>
                  <td className="px-5 py-3 font-bold text-slate-900">
                    ₹{b.totalAmount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === "Confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : b.status === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {b.status === "Confirmed" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      <span>{b.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400 text-xs">
                    No bookings recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Leads & Inquiries Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Customer Inquiries & Leads</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Messages and inquiry requests submitted through contact form
            </p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-bold text-[#0F3A2E] hover:underline"
          >
            All Inquiries ({leads.length}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Ref ID</th>
                <th className="px-5 py-3.5">Lead Name</th>
                <th className="px-5 py-3.5">Inquiry Message</th>
                <th className="px-5 py-3.5">Source</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.slice(0, 5).map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3 font-mono font-bold text-slate-800">{l.id}</td>
                  <td className="px-5 py-3">
                    <div className="font-semibold text-slate-900">{l.name}</div>
                    <div className="text-[11px] text-slate-500">{l.email}</div>
                  </td>
                  <td className="px-5 py-3 max-w-xs truncate text-slate-600">
                    "{l.message}"
                  </td>
                  <td className="px-5 py-3 text-slate-500 font-medium">{l.source}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        l.status === "New"
                          ? "bg-blue-100 text-blue-800"
                          : l.status === "Contacted"
                          ? "bg-amber-100 text-amber-800"
                          : l.status === "Qualified"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href="/admin/leads"
                      className="text-xs font-semibold text-[#0F3A2E] hover:underline"
                    >
                      Reply →
                    </Link>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400 text-xs">
                    No customer leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
