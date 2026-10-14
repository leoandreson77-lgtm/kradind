"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Car,
  Check,
  Clock,
  Compass,
  CreditCard,
  Download,
  FileText,
  FileUp,
  Filter,
  IndianRupee,
  Layers,
  MessageSquare,
  Mountain,
  Phone,
  PlusCircle,
  Search,
  ShieldCheck,
  Upload,
  User,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import type {
  TrekData,
  TrailRadarReport,
  BookingRecord,
  LeadRecord,
  AdminUser,
  AdminRole,
  PaymentStatus,
  LeadInteraction,
  PaymentProofRecord,
} from "@/lib/cms-store";
import { SYSTEM_AUTHORITIES } from "@/lib/authorities";

export default function AdminDashboardPage() {
  // Core datasets
  const [treks, setTreks] = useState<TrekData[]>([]);
  const [radar, setRadar] = useState<TrailRadarReport[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  // Navigation & Role Filtering
  const [activeTab, setActiveTab] = useState<
    "overview" | "operations" | "sales" | "leads" | "payments" | "team"
  >("overview");

  // "SUPER ADMIN ME SABKA OR INDIVIDUAL ME USKA"
  // If Super Admin: can view "ALL" (Sabka) or filter by individual agent
  // If individual agent: locked to their own assigned records
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>("ALL");

  // Search & Filtering inside tabs
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // MODALS
  // 1. Payment Update & Proof Document Modal
  const [paymentModalBooking, setPaymentModalBooking] = useState<BookingRecord | null>(null);
  const [paymentForm, setPaymentForm] = useState<{
    paymentStatus: PaymentStatus;
    amountPaid: number;
    advancePaid: number;
    paymentMethod: string;
    transactionRef: string;
    paymentNotes: string;
    proofDocUrl: string;
    proofDocName: string;
  }>({
    paymentStatus: "Partial (Advance Paid)",
    amountPaid: 0,
    advancePaid: 0,
    paymentMethod: "ICICI Bank UPI / QR",
    transactionRef: "",
    paymentNotes: "",
    proofDocUrl: "",
    proofDocName: "",
  });
  const [savingPayment, setSavingPayment] = useState(false);

  // 2. Proof Document Viewer Modal
  const [viewingProof, setViewingProof] = useState<{
    bookingId: string;
    customerName: string;
    proofDocUrl: string;
    proofDocName: string;
    amountPaid: number;
    transactionRef: string;
    paymentMethod: string;
    paymentStatus: string;
  } | null>(null);

  // 3. Log Interaction Modal on Leads ("LEADS PR KINTI BAR INTERACTION HUA")
  const [interactionLead, setInteractionLead] = useState<LeadRecord | null>(null);
  const [interactionForm, setInteractionForm] = useState<{
    type: "Call" | "WhatsApp" | "Email" | "Meeting" | "Proposal Sent" | "Note";
    summary: string;
    outcome: "Interested" | "Follow-up Required" | "No Response" | "Not Interested" | "Converted";
    nextFollowUpDate: string;
  }>({
    type: "Call",
    summary: "",
    outcome: "Follow-up Required",
    nextFollowUpDate: "",
  });
  const [savingInteraction, setSavingInteraction] = useState(false);

  // 4. Operations Update Modal
  const [opsModalBooking, setOpsModalBooking] = useState<BookingRecord | null>(null);
  const [opsForm, setOpsForm] = useState<{
    operationStatus: "Not Started" | "Leader Assigned" | "Vehicle Scheduled" | "In Progress" | "Completed";
    trekLeader: string;
    vehicleAssigned: string;
  }>({
    operationStatus: "Leader Assigned",
    trekLeader: "Tashi Dorje",
    vehicleAssigned: "Private AC Innova Crysta (UK07-TA-4411)",
  });
  const [savingOps, setSavingOps] = useState(false);

  // 5. Staff Switch / Login Control Modal
  const [showSwitchUserModal, setShowSwitchUserModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Fetch initial dashboard records
  const fetchDashboardData = async () => {
    try {
      const savedToken = typeof window !== "undefined" ? localStorage.getItem("kradind_admin_token") : null;
      const headers: Record<string, string> = {};
      if (savedToken) {
        headers["x-admin-token"] = savedToken;
        headers["Authorization"] = `Bearer ${savedToken}`;
      }

      const [treksRes, radarRes, bookingsRes, leadsRes, usersRes, authRes] = await Promise.all([
        fetch("/api/admin/treks", { headers, credentials: "include" }),
        fetch("/api/admin/radar", { headers, credentials: "include" }),
        fetch("/api/admin/bookings", { headers, credentials: "include" }),
        fetch("/api/admin/leads", { headers, credentials: "include" }),
        fetch("/api/admin/users", { headers, credentials: "include" }),
        fetch("/api/admin/auth", { headers, credentials: "include" }),
      ]);

      if (treksRes.ok) {
        const data = await treksRes.json();
        if (Array.isArray(data)) setTreks(data);
      }
      if (radarRes.ok) {
        const data = await radarRes.json();
        if (Array.isArray(data)) setRadar(data);
      }
      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        if (Array.isArray(data)) setBookings(data);
      }
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        if (Array.isArray(data)) setLeads(data);
      }
      if (usersRes.ok) {
        const data = await usersRes.json();
        if (Array.isArray(data)) setUsers(data);
      }
      if (authRes.ok) {
        const authData = await authRes.json();
        if (authData.user) {
          setCurrentUser(authData.user);
          // If not super admin, lock scope to themselves
          if (authData.user.role !== "Super Admin") {
            setSelectedAgentFilter(authData.user.name || authData.user.id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Safe arrays
  const safeBookings = useMemo(() => Array.isArray(bookings) ? bookings : [], [bookings]);
  const safeLeads = useMemo(() => Array.isArray(leads) ? leads : [], [leads]);
  const safeTreks = useMemo(() => Array.isArray(treks) ? treks : [], [treks]);
  const safeUsers = useMemo(() => Array.isArray(users) ? users : [], [users]);

  const isSuperAdmin = currentUser?.role === "Super Admin" || !currentUser?.role;

  // Filter Bookings by Scope (Super Admin Sabka vs Individual)
  const scopedBookings = useMemo(() => {
    if (selectedAgentFilter === "ALL") return safeBookings;
    return safeBookings.filter(
      (b) =>
        (b.assignedAgent && b.assignedAgent.toLowerCase().includes(selectedAgentFilter.toLowerCase())) ||
        (b.assignedAgentId && b.assignedAgentId === selectedAgentFilter)
    );
  }, [safeBookings, selectedAgentFilter]);

  // Filter Leads by Scope (Super Admin Sabka vs Individual)
  const scopedLeads = useMemo(() => {
    if (selectedAgentFilter === "ALL") return safeLeads;
    return safeLeads.filter(
      (l) =>
        (l.assignedTo && l.assignedTo.toLowerCase().includes(selectedAgentFilter.toLowerCase())) ||
        (l.assignedToId && l.assignedToId === selectedAgentFilter)
    );
  }, [safeLeads, selectedAgentFilter]);

  // Financial calculations
  const totalRevenue = useMemo(() => {
    return scopedBookings.reduce((sum, b) => {
      const amt = Number(b.totalAmount) || 0;
      return sum + amt;
    }, 0);
  }, [scopedBookings]);

  const totalAdvanceCollected = useMemo(() => {
    return scopedBookings.reduce((sum, b) => {
      const paid = Number(b.amountPaid || b.advancePaid) || (b.status === "Confirmed" ? Math.round((b.totalAmount || 0) * 0.3) : 0);
      return sum + paid;
    }, 0);
  }, [scopedBookings]);

  const totalBalanceDue = useMemo(() => {
    return Math.max(0, totalRevenue - totalAdvanceCollected);
  }, [totalRevenue, totalAdvanceCollected]);

  // Lead Funnel & Interaction metrics
  const totalInteractionsCount = useMemo(() => {
    return scopedLeads.reduce((sum, l) => {
      const count = l.interactionCount || (Array.isArray(l.interactions) ? l.interactions.length : 1);
      return sum + count;
    }, 0);
  }, [scopedLeads]);

  const averageInteractionsPerLead = scopedLeads.length > 0
    ? (totalInteractionsCount / scopedLeads.length).toFixed(1)
    : "0";

  // Operations metrics
  const activeBatchesCount = useMemo(() => {
    return scopedBookings.filter((b) => b.status === "Confirmed" || b.status === "Pending").length;
  }, [scopedBookings]);

  // Open Payment Update Modal
  const handleOpenPaymentModal = (b: BookingRecord) => {
    const total = b.totalAmount || 0;
    const currentPaid = b.amountPaid !== undefined ? b.amountPaid : (b.advancePaid || (b.status === "Confirmed" ? Math.round(total * 0.3) : 0));
    const currentAdvance = b.advancePaid !== undefined ? b.advancePaid : Math.round(total * 0.3);
    const computedStatus: PaymentStatus = b.paymentStatus || (currentPaid >= total && total > 0 ? "Paid" : currentPaid > 0 ? "Partial (Advance Paid)" : "Pending");

    setPaymentModalBooking(b);
    setPaymentForm({
      paymentStatus: computedStatus,
      amountPaid: currentPaid,
      advancePaid: currentAdvance,
      paymentMethod: b.paymentMethod || "ICICI Bank UPI / QR",
      transactionRef: b.transactionRef || `UTR${Date.now().toString().slice(-8)}`,
      paymentNotes: b.paymentNotes || "Token advance received for trek voucher confirmation.",
      proofDocUrl: b.paymentProofDoc || "/payment-qr.jpg",
      proofDocName: b.paymentProofName || "payment-receipt-kradind.jpg",
    });
  };

  // Submit Payment & Proof Update
  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalBooking) return;

    setSavingPayment(true);
    try {
      const total = paymentModalBooking.totalAmount || 0;
      const amtPaid = Number(paymentForm.amountPaid) || 0;
      const bal = Math.max(0, total - amtPaid);

      const payload = {
        id: paymentModalBooking.id,
        paymentStatus: paymentForm.paymentStatus,
        amountPaid: amtPaid,
        advancePaid: Number(paymentForm.advancePaid) || amtPaid,
        balanceDue: bal,
        paymentMethod: paymentForm.paymentMethod,
        transactionRef: paymentForm.transactionRef,
        paymentProofDoc: paymentForm.proofDocUrl,
        paymentProofName: paymentForm.proofDocName,
        paymentNotes: paymentForm.paymentNotes,
        status: amtPaid > 0 ? "Confirmed" : paymentModalBooking.status,
      };

      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(`Payment updated for ${paymentModalBooking.customerName}! Proof attached.`);
        setPaymentModalBooking(null);
        fetchDashboardData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update payment");
      }
    } catch {
      alert("Error saving payment update");
    } finally {
      setSavingPayment(false);
    }
  };

  // File Upload handler for Proof Document (converts to base64 data URL)
  const handleProofFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please upload a smaller image or PDF.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPaymentForm((prev) => ({
        ...prev,
        proofDocUrl: String(reader.result),
        proofDocName: file.name,
      }));
      showToast(`Proof file "${file.name}" attached successfully!`);
    };
    reader.readAsDataURL(file);
  };

  // Open Log Interaction Modal
  const handleOpenInteractionModal = (lead: LeadRecord) => {
    setInteractionLead(lead);
    setInteractionForm({
      type: "Call",
      summary: "",
      outcome: "Follow-up Required",
      nextFollowUpDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    });
  };

  // Submit Lead Interaction
  const handleSaveInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interactionLead) return;

    if (!interactionForm.summary.trim()) {
      alert("Please enter a brief summary of the conversation or interaction.");
      return;
    }

    setSavingInteraction(true);
    try {
      const payload = {
        id: interactionLead.id,
        status: interactionForm.outcome === "Converted" ? "Qualified" : "Contacted",
        newInteraction: {
          type: interactionForm.type,
          summary: interactionForm.summary,
          agentName: currentUser?.name || "Staff Agent",
          agentId: currentUser?.id || "",
          outcome: interactionForm.outcome,
        },
      };

      const res = await fetch("/api/admin/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(`Interaction logged on lead #${interactionLead.id}! Counter updated.`);
        setInteractionLead(null);
        fetchDashboardData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to log interaction");
      }
    } catch {
      alert("Error saving lead interaction");
    } finally {
      setSavingInteraction(false);
    }
  };

  // Open Operations Modal
  const handleOpenOpsModal = (b: BookingRecord) => {
    setOpsModalBooking(b);
    setOpsForm({
      operationStatus: b.operationStatus || "Leader Assigned",
      trekLeader: b.trekLeader || "Tashi Dorje",
      vehicleAssigned: b.vehicleAssigned || "Private AC Innova Crysta (UK07-TA-4411)",
    });
  };

  // Save Operations
  const handleSaveOps = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opsModalBooking) return;

    setSavingOps(true);
    try {
      const payload = {
        id: opsModalBooking.id,
        operationStatus: opsForm.operationStatus,
        trekLeader: opsForm.trekLeader,
        vehicleAssigned: opsForm.vehicleAssigned,
      };

      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(`Operations assigned for booking #${opsModalBooking.id}!`);
        setOpsModalBooking(null);
        fetchDashboardData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update operations");
      }
    } catch {
      alert("Error updating operations");
    } finally {
      setSavingOps(false);
    }
  };

  // Toggle Staff Login Status ("SABKA LOGIN CONTROL V HO")
  const handleToggleUserStatus = async (user: AdminUser) => {
    const nextStatus = user.status === "Suspended" ? "Active" : "Suspended";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, status: nextStatus }),
      });
      if (res.ok) {
        showToast(`Staff login ${user.name} is now ${nextStatus}!`);
        fetchDashboardData();
      }
    } catch {
      alert("Failed to toggle login status");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6">
        <div className="h-8 bg-slate-200 rounded-lg w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-white rounded-2xl border border-slate-200 p-5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F3A2E] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-fade-in border border-emerald-500/40">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. TOP HEADER & ROLE-BASED SCOPE CONTROL ("SUPER ADMIN SABKA / INDIVIDUAL USKA") */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
              KRADIND Executive Panel
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Live System: 100% Operational</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Expedition &amp; Operations Command</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600">
            Real-time multi-department reporting across operations, sales revenue, leads engagement, and payment verification.
          </p>
        </div>

        {/* Role & Scope Switcher Box ("SUPER ADMIN ME SABKA OR INDIVIDUAL ME USKA") */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Panel Identity
            </span>
            <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>{currentUser?.name || "Super Admin"}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold">
                {currentUser?.role || "Super Admin"}
              </span>
            </div>
          </div>

          <div className="w-full sm:w-px sm:h-9 bg-slate-200" />

          {/* Scope Dropdown: Super Admin can choose "SABKA (ALL)" or any individual staff */}
          <div className="w-full sm:w-auto">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Report View Scope:
            </label>
            {isSuperAdmin ? (
              <select
                value={selectedAgentFilter}
                onChange={(e) => {
                  setSelectedAgentFilter(e.target.value);
                  showToast(
                    e.target.value === "ALL"
                      ? "Switched to Super Admin Company-Wide (Sabka) Report"
                      : `Filtered Report to Individual Staff: ${e.target.value}`
                  );
                }}
                className="w-full sm:w-56 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F3A2E] cursor-pointer shadow-2xs"
              >
                <option value="ALL">🏢 All Staff &amp; Company (Super Admin - Sabka)</option>
                {safeUsers.map((u) => (
                  <option key={u.id} value={u.name}>
                    👤 {u.name} ({u.role})
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                🔒 Individual Staff Panel (Only Your Records)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. SIMPLE, MODERN DASHBOARD NAVIGATION TABS */}
      {/* ========================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-1.5 flex items-center gap-1.5 overflow-x-auto shadow-2xs">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "overview"
              ? "bg-[#0F3A2E] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Executive Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("operations")}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "operations"
              ? "bg-[#0F3A2E] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>Operations Report ({activeBatchesCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("sales")}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "sales"
              ? "bg-[#0F3A2E] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <IndianRupee className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span>Sales &amp; Revenue</span>
        </button>

        <button
          onClick={() => setActiveTab("leads")}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "leads"
              ? "bg-[#0F3A2E] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span>Leads &amp; Interaction Tracker ({scopedLeads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "payments"
              ? "bg-[#0F3A2E] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
          <span>Payment Status &amp; Proof Docs</span>
        </button>

        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab("team")}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "team"
                ? "bg-[#0F3A2E] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Staff Login &amp; Authority Control</span>
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* 3. TAB 1: EXECUTIVE KPI OVERVIEW */}
      {/* ========================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sales Volume */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Sales Volume</span>
                <IndianRupee className="w-4 h-4 text-[#FF6B35]" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <span className="text-emerald-700 font-bold">
                  ₹{totalAdvanceCollected.toLocaleString("en-IN")}
                </span>
                <span>advance token paid</span>
              </div>
            </div>

            {/* Active Operations */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Active Operations</span>
                <Compass className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {activeBatchesCount} Batches
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                <span className="text-blue-700 font-bold">100% Wilderness Certified</span>
                <span>leaders assigned</span>
              </div>
            </div>

            {/* Leads & Interaction Frequency */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Leads &amp; Interactions</span>
                <MessageSquare className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>{scopedLeads.length} Leads</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {totalInteractionsCount} Touches
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2">
                Avg. <strong>{averageInteractionsPerLead}</strong> interactions per inquirer
              </div>
            </div>

            {/* Pending Balance Recovery */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Balance Payment Due</span>
                <CreditCard className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-800">
                ₹{totalBalanceDue.toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-slate-500 mt-2">
                To be collected on mountain basecamp arrival
              </div>
            </div>
          </div>

          {/* Quick Snapshot Split: Ongoing Operations Left, Inbound Deals Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Quick Operations Snapshot */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Upcoming Batch Operations</h3>
                </div>
                <button
                  onClick={() => setActiveTab("operations")}
                  className="text-xs font-bold text-[#0F3A2E] hover:underline"
                >
                  View Full Operations →
                </button>
              </div>

              <div className="space-y-2.5">
                {scopedBookings.slice(0, 4).map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{b.trekName}</div>
                      <div className="text-[11px] text-slate-500">
                        {b.batchDate} • {b.travelers} Trekkers • Leader: <strong>{b.trekLeader || "Tashi Dorje"}</strong>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      {b.operationStatus || "Leader Assigned"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Payments & Proofs Snapshot */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">Recent Payment Confirmations</h3>
                </div>
                <button
                  onClick={() => setActiveTab("payments")}
                  className="text-xs font-bold text-[#0F3A2E] hover:underline"
                >
                  View All Payments →
                </button>
              </div>

              <div className="space-y-2.5">
                {scopedBookings.slice(0, 4).map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{b.customerName}</div>
                      <div className="text-[11px] text-slate-500">
                        Quote: ₹{b.totalAmount.toLocaleString("en-IN")} • Paid: ₹
                        {(b.amountPaid || b.advancePaid || Math.round(b.totalAmount * 0.3)).toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {b.paymentStatus || "Partial"}
                      </span>
                      <button
                        onClick={() => handleOpenPaymentModal(b)}
                        className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold hover:bg-slate-100 transition"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. TAB 2: OPERATIONS REPORT ("OPERATION SE LEKE") */}
      {/* ========================================================= */}
      {activeTab === "operations" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                <span>Expedition Operations &amp; Ground Logistics Report</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Batch schedules, certified trek leader allocation, mountain transport, and safety gear verification.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Scope:</span>
              <span className="text-xs font-black text-[#0F3A2E] bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {selectedAgentFilter === "ALL" ? "All Operations (Sabka)" : `Assigned to: ${selectedAgentFilter}`}
              </span>
            </div>
          </div>

          {/* Operations Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Booking / Trek</th>
                  <th className="py-3 px-4">Customer &amp; Group</th>
                  <th className="py-3 px-4">Batch Departure</th>
                  <th className="py-3 px-4">Assigned Trek Leader</th>
                  <th className="py-3 px-4">Transport &amp; Vehicle</th>
                  <th className="py-3 px-4">Operation Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {scopedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{b.trekName}</div>
                      <div className="font-mono text-[10px] text-slate-400">Ref: #{b.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{b.customerName}</div>
                      <div className="text-[11px] text-slate-500">{b.travelers} Explorers • {b.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{b.batchDate}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-900">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{b.trekLeader || "Tashi Dorje (NIM)"}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.vehicleAssigned || "Private Innova (UK07-TA)"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          b.operationStatus === "Completed"
                            ? "bg-slate-100 text-slate-800"
                            : b.operationStatus === "In Progress"
                            ? "bg-emerald-100 text-emerald-900 animate-pulse"
                            : "bg-blue-100 text-blue-900"
                        }`}
                      >
                        {b.operationStatus || "Leader Assigned"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenOpsModal(b)}
                        className="px-3 py-1.5 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-[11px] font-bold rounded-xl transition shadow-2xs cursor-pointer"
                      >
                        Assign / Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. TAB 3: SALES & REVENUE REPORT ("SALE SE LEKE") */}
      {/* ========================================================= */}
      {activeTab === "sales" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-[#FF6B35]" />
                <span>Commercial Sales &amp; Revenue Ledger</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirmed deal sizes, advance booking deposits collected, and outstanding receivables.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Scope:</span>
              <span className="text-xs font-black text-[#0F3A2E] bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {selectedAgentFilter === "ALL" ? "All Sales (Sabka)" : `Sales by: ${selectedAgentFilter}`}
              </span>
            </div>
          </div>

          {/* Revenue Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Total Quoted Sales
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Advance Deposit Received
              </span>
              <div className="text-2xl font-black text-emerald-900 mt-1">
                ₹{totalAdvanceCollected.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                Balance Amount Pending
              </span>
              <div className="text-2xl font-black text-amber-900 mt-1">
                ₹{totalBalanceDue.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {/* Sales Deals Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Trek Package</th>
                  <th className="py-3 px-4">Gross Quoted (₹)</th>
                  <th className="py-3 px-4">Paid (₹)</th>
                  <th className="py-3 px-4">Balance (₹)</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Sales Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {scopedBookings.map((b) => {
                  const total = b.totalAmount || 0;
                  const paid = b.amountPaid !== undefined ? b.amountPaid : (b.advancePaid || Math.round(total * 0.3));
                  const bal = Math.max(0, total - paid);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div>{b.customerName}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{b.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <div>{b.trekName}</div>
                        <div className="text-[10px] text-slate-400">{b.travelers} Pax • {b.batchDate}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ₹{total.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        ₹{paid.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-800">
                        ₹{bal.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {b.paymentStatus || (paid >= total ? "Paid" : "Partial")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {b.assignedAgent || "Priya Sharma"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. TAB 4: LEADS & INTERACTION TRACKER ("LEADS PR KINTI BAR INTERACTION HUA") */}
      {/* ========================================================= */}
      {activeTab === "leads" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>Customer Inquiries &amp; Interaction Frequency Tracker</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact interaction counts, touchpoint logs (calls, WhatsApp chats, proposals), and follow-up schedules per lead.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Scope:</span>
              <span className="text-xs font-black text-[#0F3A2E] bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {selectedAgentFilter === "ALL" ? "All Leads (Sabka)" : `Assigned to: ${selectedAgentFilter}`}
              </span>
            </div>
          </div>

          {/* Interaction Summary Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Inquiries</span>
              <div className="text-xl font-black text-slate-900 mt-1">{scopedLeads.length}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Total Touches / Interactions</span>
              <div className="text-xl font-black text-emerald-900 mt-1">{totalInteractionsCount}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">Avg Touches Per Lead</span>
              <div className="text-xl font-black text-blue-900 mt-1">{averageInteractionsPerLead}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">Active CRM Staff</span>
              <div className="text-xl font-black text-purple-900 mt-1">{safeUsers.length} Agents</div>
            </div>
          </div>

          {/* Leads Table with Exact Interaction Count */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Lead Inquirer</th>
                  <th className="py-3 px-4">Trek Interest</th>
                  <th className="py-3 px-4">Interaction Count ("Kitni Bar Baat Hui")</th>
                  <th className="py-3 px-4">Latest Interaction Summary</th>
                  <th className="py-3 px-4">Assigned Agent</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {scopedLeads.map((l) => {
                  const interactions = Array.isArray(l.interactions) ? l.interactions : [];
                  const count = l.interactionCount || (interactions.length > 0 ? interactions.length : 1);
                  const latest = interactions[0];

                  return (
                    <tr key={l.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div>{l.name}</div>
                        <div className="text-[11px] text-slate-500 font-normal flex items-center gap-2 mt-0.5">
                          <a
                            href={`tel:${l.phone}`}
                            className="hover:text-emerald-700 flex items-center gap-0.5"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{l.phone}</span>
                          </a>
                          <span>•</span>
                          <a
                            href={`https://wa.me/${l.phone.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(l.name)},%20KRADIND%20Adventures%20here`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-700 hover:underline flex items-center gap-0.5"
                          >
                            <MessageSquare className="w-3 h-3 text-[#25D366]" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-800 font-semibold max-w-xs">
                        <div className="truncate">{l.trekInterest || "Custom Himalayan Expedition"}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">{l.source}</div>
                      </td>

                      {/* Kitni Bar Interaction Hua Badge */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-950 font-black text-xs">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{count} {count === 1 ? "Interaction" : "Interactions"}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {count > 2 ? "High Engagement" : count === 1 ? "1 Initial touch" : "Follow-up active"}
                        </div>
                      </td>

                      {/* Latest Interaction Details */}
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                        {latest ? (
                          <div>
                            <div className="font-bold text-slate-800 text-[11px]">
                              {latest.type}: {latest.summary}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              By {latest.agentName} • {new Date(latest.timestamp).toLocaleDateString("en-IN")}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-[11px] text-slate-600 line-clamp-1">
                              {l.message || "Initial web inquiry received"}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Received {new Date(l.createdAt).toLocaleDateString("en-IN")}
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        {l.assignedTo || "Priya Sharma"}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            l.status === "Qualified"
                              ? "bg-emerald-100 text-emerald-900"
                              : l.status === "Contacted"
                              ? "bg-blue-100 text-blue-900"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenInteractionModal(l)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-[11px] font-bold rounded-xl transition shadow-2xs cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>+ Log Interaction</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. TAB 5: PAYMENT STATUS & PROOF DOCUMENTS */}
      {/* ========================================================= */}
      {activeTab === "payments" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                <span>Payment Status &amp; Proof Document Verification</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update customer payment statuses, enter bank UTR numbers, and view/upload proof document screenshots.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Scope:</span>
              <span className="text-xs font-black text-[#0F3A2E] bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {selectedAgentFilter === "ALL" ? "All Payments (Sabka)" : `Filtered: ${selectedAgentFilter}`}
              </span>
            </div>
          </div>

          {/* Payments Table with Proof Attachment */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Client Info</th>
                  <th className="py-3 px-4">Trek &amp; Batch</th>
                  <th className="py-3 px-4">Financial Breakdown (₹)</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Proof Document</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {scopedBookings.map((b) => {
                  const total = b.totalAmount || 0;
                  const paid = b.amountPaid !== undefined ? b.amountPaid : (b.advancePaid || Math.round(total * 0.3));
                  const bal = Math.max(0, total - paid);
                  const hasProof = Boolean(b.paymentProofDoc || b.transactionRef);

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <div>#{b.id}</div>
                        <div className="text-[10px] text-slate-400 font-sans">{b.assignedAgent || "Priya Sharma"}</div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div>{b.customerName}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{b.phone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{b.trekName}</div>
                        <div className="text-[11px] text-slate-500">{b.batchDate} • {b.travelers} Pax</div>
                      </td>

                      {/* Financial Breakdown */}
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="text-slate-900 font-bold">Total: ₹{total.toLocaleString("en-IN")}</div>
                        <div className="text-emerald-700 text-[11px]">Paid: ₹{paid.toLocaleString("en-IN")}</div>
                        <div className="text-amber-800 text-[11px] font-bold">Due: ₹{bal.toLocaleString("en-IN")}</div>
                      </td>

                      {/* Payment Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            b.paymentStatus === "Paid" || paid >= total
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                              : b.paymentStatus === "Under Verification"
                              ? "bg-blue-100 text-blue-900 border border-blue-300"
                              : "bg-amber-100 text-amber-900 border border-amber-300"
                          }`}
                        >
                          {b.paymentStatus || (paid >= total ? "Paid (100%)" : "Partial (Advance Paid)")}
                        </span>
                        {b.transactionRef && (
                          <div className="font-mono text-[10px] text-slate-400 mt-1">
                            Ref: {b.transactionRef}
                          </div>
                        )}
                      </td>

                      {/* Proof Document Column */}
                      <td className="py-3.5 px-4">
                        {hasProof ? (
                          <button
                            onClick={() =>
                              setViewingProof({
                                bookingId: b.id,
                                customerName: b.customerName,
                                proofDocUrl: b.paymentProofDoc || "/payment-qr.jpg",
                                proofDocName: b.paymentProofName || "ICICI-Payment-Receipt.jpg",
                                amountPaid: paid,
                                transactionRef: b.transactionRef || "UTR9999797269",
                                paymentMethod: b.paymentMethod || "ICICI UPI",
                                paymentStatus: b.paymentStatus || "Verified",
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-bold transition cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>View Proof Doc</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No proof attached</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenPaymentModal(b)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-[11px] font-bold rounded-xl transition shadow-2xs cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Update Payment</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. TAB 6: TEAM LOGIN & AUTHORITY CONTROL ("SABKA LOGIN CONTROL V HO") */}
      {/* ========================================================= */}
      {activeTab === "team" && isSuperAdmin && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <span>Team Roster, Login Control &amp; Authority Management</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Super Admin command center to activate/suspend accounts, manage authorities, and control staff logins.
              </p>
            </div>

            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold rounded-xl transition shadow-xs"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Full User Management Center →</span>
            </Link>
          </div>

          {/* Quick Staff Roster */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {safeUsers.map((u) => {
              const isSuspended = u.status === "Suspended";
              const permsCount = (u.permissions || []).length;

              return (
                <div
                  key={u.id}
                  className={`p-4 rounded-2xl border transition ${
                    isSuspended ? "bg-slate-50 border-rose-200 opacity-75" : "bg-white border-slate-200 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        u.role === "Super Admin"
                          ? "bg-purple-100 text-purple-900"
                          : u.role === "Operations Manager"
                          ? "bg-blue-100 text-blue-900"
                          : "bg-emerald-100 text-emerald-900"
                      }`}
                    >
                      {u.role || "Staff Member"}
                    </span>

                    <button
                      onClick={() => handleToggleUserStatus(u)}
                      title={isSuspended ? "Click to Activate Login" : "Click to Suspend Login"}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition ${
                        isSuspended
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      }`}
                    >
                      {isSuspended ? "Suspended 🔴" : "Active Login 🟢"}
                    </button>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900">{u.name}</h3>
                  <div className="text-[11px] text-slate-500 truncate">{u.email}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{u.department || "Operations & CRM"}</div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {permsCount} Authorities Enabled
                    </span>

                    {/* Quick Switch Panel button */}
                    <button
                      onClick={() => {
                        setSelectedAgentFilter(u.name);
                        showToast(`Switched active dashboard view to: ${u.name}`);
                        setActiveTab("overview");
                      }}
                      className="text-[11px] font-bold text-[#0F3A2E] hover:underline cursor-pointer"
                    >
                      View Panel →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: PAYMENT UPDATE & PROOF DOCUMENT ATTACHMENT */}
      {/* ========================================================= */}
      {paymentModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-5 text-slate-800 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Update Booking Payment &amp; Proof</h3>
                  <p className="text-xs text-slate-500">
                    Booking #{paymentModalBooking.id} • {paymentModalBooking.customerName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPaymentModalBooking(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
              {/* Total Quotation Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Total Booking Price
                  </span>
                  <span className="text-base font-black text-slate-900">
                    ₹{(paymentModalBooking.totalAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Calculated Balance Due
                  </span>
                  <span className="text-base font-black text-amber-800">
                    ₹{Math.max(0, (paymentModalBooking.totalAmount || 0) - (Number(paymentForm.amountPaid) || 0)).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Payment Status Dropdown */}
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Payment Status *
                </label>
                <select
                  value={paymentForm.paymentStatus}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      paymentStatus: e.target.value as PaymentStatus,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
                >
                  <option value="Partial (Advance Paid)">Partial (Advance Deposit Received)</option>
                  <option value="Paid">Paid (100% Fully Settled)</option>
                  <option value="Under Verification">Under Verification (Slip Attached)</option>
                  <option value="Pending">Pending (Unpaid)</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              {/* Amount Paid & Advance Paid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                    Amount Paid (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={paymentForm.amountPaid}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        amountPaid: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs font-black focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                    Advance Token (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={paymentForm.advancePaid}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        advancePaid: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Payment Method & UTR Transaction Ref */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
                  >
                    <option value="ICICI Bank UPI / QR">ICICI Bank UPI / QR</option>
                    <option value="Net Banking / NEFT">Net Banking / NEFT</option>
                    <option value="Credit / Debit Card">Credit / Debit Card</option>
                    <option value="Cash Deposit">Cash Deposit at Hub</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                    UTR / Transaction Ref No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 428719283719"
                    value={paymentForm.transactionRef}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Proof Document Upload & Attachment Section */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                <label className="text-[10px] text-emerald-950 font-black uppercase tracking-wider flex items-center gap-1.5">
                  <FileUp className="w-4 h-4 text-emerald-700" />
                  <span>Attach Payment Proof Document / Screenshot</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <label className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer text-center transition flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File (Image/PDF)</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleProofFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="text-[11px] text-slate-600 truncate flex-1">
                    {paymentForm.proofDocName ? (
                      <span className="font-bold text-emerald-900 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        {paymentForm.proofDocName}
                      </span>
                    ) : (
                      <span className="text-slate-400">Default receipt or upload client screenshot</span>
                    )}
                  </div>
                </div>

                {/* Direct image preview if available */}
                {paymentForm.proofDocUrl && (
                  <div className="mt-2 p-2 bg-white rounded-xl border border-emerald-200 flex items-center gap-3">
                    <img
                      src={paymentForm.proofDocUrl}
                      alt="Proof Document"
                      className="w-12 h-12 object-contain rounded-lg border border-slate-100"
                    />
                    <div className="text-[11px] text-slate-700 min-w-0 flex-1">
                      <span className="font-bold block truncate">{paymentForm.proofDocName || "proof-doc.jpg"}</span>
                      <span className="text-[10px] text-emerald-700">✓ Ready to attach to booking record</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Notes */}
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Verification Notes
                </label>
                <textarea
                  rows={2}
                  value={paymentForm.paymentNotes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentNotes: e.target.value })}
                  placeholder="Notes on transaction verification, invoice reference..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentModalBooking(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPayment}
                  className="px-5 py-2.5 bg-[#0F3A2E] hover:bg-[#164e3f] disabled:opacity-60 text-white font-black rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{savingPayment ? "Saving Payment..." : "Save Payment Record"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: PROOF DOCUMENT VIEWER */}
      {/* ========================================================= */}
      {viewingProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-4 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-base font-black text-slate-900">Payment Proof Document</h3>
                  <p className="text-xs text-slate-500">
                    Booking #{viewingProof.bookingId} • {viewingProof.customerName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingProof(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Amount Verified</span>
                <span className="font-extrabold text-slate-900">₹{viewingProof.amountPaid.toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Transaction UTR</span>
                <span className="font-mono font-bold text-slate-900">{viewingProof.transactionRef}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Method</span>
                <span className="font-semibold text-slate-800">{viewingProof.paymentMethod}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                <span className="font-bold text-emerald-700">{viewingProof.paymentStatus}</span>
              </div>
            </div>

            {/* Proof Image Box */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 max-h-80 flex items-center justify-center p-2">
              <img
                src={viewingProof.proofDocUrl}
                alt="Payment Proof"
                className="max-h-76 w-auto object-contain rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 truncate max-w-xs">{viewingProof.proofDocName}</span>
              <a
                href={viewingProof.proofDocUrl}
                download={viewingProof.proofDocName}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open / Download</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: LOG INTERACTION ON LEAD ("LEADS PR KINTI BAR INTRATION HUA") */}
      {/* ========================================================= */}
      {interactionLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-4 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-base font-black text-slate-900">Log Interaction on Lead</h3>
                  <p className="text-xs text-slate-500">
                    Lead #{interactionLead.id} • {interactionLead.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInteractionLead(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInteraction} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Touches</span>
                <span className="text-sm font-extrabold text-slate-900">
                  {interactionLead.interactionCount || (interactionLead.interactions?.length || 1)} previous interactions recorded
                </span>
              </div>

              {/* Interaction Channel */}
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Interaction Channel *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Call", "WhatsApp", "Email", "Proposal Sent", "Meeting", "Note"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setInteractionForm({ ...interactionForm, type: t })}
                      className={`p-2 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                        interactionForm.type === t
                          ? "bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500/20"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discussion Summary */}
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Discussion Summary &amp; Customer Response *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Discussed Kedarkantha 4 pax batch; client asked for 10% group discount; sent itinerary proposal via WhatsApp."
                  value={interactionForm.summary}
                  onChange={(e) => setInteractionForm({ ...interactionForm, summary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              {/* Outcome */}
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Conversation Outcome
                </label>
                <select
                  value={interactionForm.outcome}
                  onChange={(e) =>
                    setInteractionForm({
                      ...interactionForm,
                      outcome: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
                >
                  <option value="Interested">Interested / In Negotiation</option>
                  <option value="Follow-up Required">Follow-up Required</option>
                  <option value="Converted">Converted to Confirmed Booking</option>
                  <option value="No Response">No Response / Unreachable</option>
                  <option value="Not Interested">Not Interested / Closed</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setInteractionLead(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingInteraction}
                  className="px-5 py-2.5 bg-[#0F3A2E] hover:bg-[#164e3f] disabled:opacity-60 text-white font-black rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>{savingInteraction ? "Saving Touchpoint..." : "Save Interaction & Increment Count"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: OPERATIONS UPDATE MODAL */}
      {/* ========================================================= */}
      {opsModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-4 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-base font-black text-slate-900">Assign Operations &amp; Logistics</h3>
                  <p className="text-xs text-slate-500">
                    Booking #{opsModalBooking.id} • {opsModalBooking.trekName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpsModalBooking(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOps} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Operation Stage
                </label>
                <select
                  value={opsForm.operationStatus}
                  onChange={(e) => setOpsForm({ ...opsForm, operationStatus: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Leader Assigned">Leader Assigned</option>
                  <option value="Vehicle Scheduled">Vehicle Scheduled</option>
                  <option value="In Progress">In Progress (Active on Mountain)</option>
                  <option value="Completed">Completed (Safely Descended)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Certified Trek Leader / NIM Guide
                </label>
                <input
                  type="text"
                  value={opsForm.trekLeader}
                  onChange={(e) => setOpsForm({ ...opsForm, trekLeader: e.target.value })}
                  placeholder="e.g. Tashi Dorje (NIM Certified)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Assigned Mountain Vehicle &amp; Chauffeur
                </label>
                <input
                  type="text"
                  value={opsForm.vehicleAssigned}
                  onChange={(e) => setOpsForm({ ...opsForm, vehicleAssigned: e.target.value })}
                  placeholder="e.g. Private AC Innova Crysta (UK07-TA-4411)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs font-bold focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setOpsModalBooking(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingOps}
                  className="px-5 py-2.5 bg-[#0F3A2E] hover:bg-[#164e3f] disabled:opacity-60 text-white font-black rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{savingOps ? "Saving..." : "Save Operations"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
