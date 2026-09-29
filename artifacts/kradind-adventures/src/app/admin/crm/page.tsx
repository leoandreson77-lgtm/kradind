"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Users,
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  Award,
  TrendingUp,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Edit3,
  Trash2,
  X,
  FileSpreadsheet,
  Activity,
  Check,
  Send,
  UserCheck,
  Flame,
  HeartPulse,
  Kanban,
  List,
  Sparkles,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Bookmark,
} from "lucide-react";
import {
  CustomerRecord,
  CustomerLifecycleStage,
  CustomerStatus,
  LoyaltyTier,
  CustomerTimelineEvent,
  CustomerTask,
  AuditLogRecord,
  TimelineEventType,
} from "@/lib/cms-store";

export default function AdminCRMPage() {
  // State
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [tasks, setTasks] = useState<CustomerTask[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  // Views & Filters
  const [activeTab, setActiveTab] = useState<"directory" | "kanban" | "tasks" | "audit">("directory");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState("All");

  // Customer 360 Slide-Over
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<"timeline" | "trips" | "medical" | "edit">("timeline");
  const [customerTimeline, setCustomerTimeline] = useState<CustomerTimelineEvent[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  // New Interaction Form
  const [newLogType, setNewLogType] = useState<TimelineEventType>("note_added");
  const [newLogTitle, setNewLogTitle] = useState("");
  const [newLogDesc, setNewLogDesc] = useState("");
  const [submittingLog, setSubmittingLog] = useState(false);

  // New Customer Modal
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Dehradun",
    state: "Uttarakhand",
    lifecycleStage: "Lead" as CustomerLifecycleStage,
    status: "Active" as CustomerStatus,
    priority: "Medium" as "Low" | "Medium" | "High" | "Urgent / VIP",
    loyaltyTier: "Explorer (Bronze)" as LoyaltyTier,
    source: "Direct Manual Entry",
    tags: "Himalayan Trekker",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    medicalNotes: "",
    dietaryPreference: "Vegetarian" as const,
  });

  // Edit Customer in 360 Form
  const [editFormData, setEditFormData] = useState<Partial<CustomerRecord>>({});
  const [savingEdit, setSavingEdit] = useState(false);

  // New Task Modal
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    customerId: "",
    title: "",
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    priority: "Medium" as "Low" | "Medium" | "High",
    assignedTo: "Staff",
  });

  // Notification Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Fetch Core Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [custRes, taskRes, auditRes] = await Promise.all([
        fetch("/api/admin/crm/customers"),
        fetch("/api/admin/crm/tasks"),
        fetch("/api/admin/crm/audit"),
      ]);

      if (custRes.ok) setCustomers(await custRes.json());
      if (taskRes.ok) setTasks(await taskRes.json());
      if (auditRes.ok) setAuditLogs(await auditRes.json());
    } catch (err) {
      console.error("Failed to load CRM data:", err);
      showToast("Error loading CRM records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch Timeline when selected customer changes
  useEffect(() => {
    if (!selectedCustomerId) {
      setCustomerTimeline([]);
      setEditFormData({});
      return;
    }

    const currentCustomer = customers.find((c) => c.id === selectedCustomerId);
    if (currentCustomer) {
      setEditFormData(currentCustomer);
    }

    const fetchTimeline = async () => {
      setLoadingTimeline(true);
      try {
        const res = await fetch(`/api/admin/crm/timeline?customerId=${selectedCustomerId}`);
        if (res.ok) {
          setCustomerTimeline(await res.json());
        }
      } catch (err) {
        console.error("Failed to load customer timeline:", err);
      } finally {
        setLoadingTimeline(false);
      }
    };

    fetchTimeline();
  }, [selectedCustomerId, customers]);

  // Selected customer computed
  const selectedCustomer = useMemo(() => {
    return customers.find((c) => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q));

      const matchesStage = stageFilter === "All" || c.lifecycleStage === stageFilter;
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || c.priority === priorityFilter;
      const matchesTier = tierFilter === "All" || c.loyaltyTier === tierFilter;

      return matchesSearch && matchesStage && matchesStatus && matchesPriority && matchesTier;
    });
  }, [customers, search, stageFilter, statusFilter, priorityFilter, tierFilter]);

  // Executive Metrics
  const metrics = useMemo(() => {
    const totalCustomers = customers.length;
    const leadsCount = customers.filter((c) => c.lifecycleStage === "Lead" || c.lifecycleStage === "Prospect").length;
    const totalCLV = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
    const vipCount = customers.filter((c) => c.lifecycleStage === "VIP Explorer" || c.loyaltyTier.includes("Legend") || c.loyaltyTier.includes("Alpinist")).length;

    return { totalCustomers, leadsCount, totalCLV, pendingTasks, vipCount };
  }, [customers, tasks]);

  // Handlers
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) {
      alert("Please provide customer name and phone number.");
      return;
    }

    try {
      const payload = {
        ...newCustomer,
        tags: newCustomer.tags.split(",").map((t) => t.trim()).filter(Boolean),
        emergencyContact: newCustomer.emergencyName
          ? {
              name: newCustomer.emergencyName,
              relation: newCustomer.emergencyRelation,
              phone: newCustomer.emergencyPhone,
            }
          : undefined,
      };

      const res = await fetch("/api/admin/crm/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        showToast(`Customer ${saved.name} added successfully!`);
        setShowAddCustomerModal(false);
        setNewCustomer({
          name: "",
          email: "",
          phone: "",
          city: "Dehradun",
          state: "Uttarakhand",
          lifecycleStage: "Lead",
          status: "Active",
          priority: "Medium",
          loyaltyTier: "Explorer (Bronze)",
          source: "Direct Manual Entry",
          tags: "Himalayan Trekker",
          emergencyName: "",
          emergencyRelation: "",
          emergencyPhone: "",
          medicalNotes: "",
          dietaryPreference: "Vegetarian",
        });
        fetchData();
        setSelectedCustomerId(saved.id);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create customer");
      }
    } catch {
      alert("Error saving customer record");
    }
  };

  const handleUpdateCustomer = async () => {
    if (!selectedCustomerId || !editFormData) return;
    setSavingEdit(true);
    try {
      const res = await fetch("/api/admin/crm/customers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedCustomerId, ...editFormData }),
      });

      if (res.ok) {
        showToast("Customer 360 profile updated!");
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update customer");
      }
    } catch {
      alert("Error saving updates");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleQuickStageChange = async (id: string, newStage: CustomerLifecycleStage) => {
    try {
      const res = await fetch("/api/admin/crm/customers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, lifecycleStage: newStage }),
      });
      if (res.ok) {
        showToast(`Customer stage shifted to ${newStage}`);
        fetchData();
      }
    } catch {
      alert("Stage update failed");
    }
  };

  const handleDeleteCustomer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete ${name}? This action is logged in audit trail.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/crm/customers?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(`Customer ${name} deleted.`);
        if (selectedCustomerId === id) setSelectedCustomerId(null);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete customer");
      }
    } catch {
      alert("Deletion error");
    }
  };

  const handleAddTimelineLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !newLogTitle.trim()) return;

    setSubmittingLog(true);
    try {
      const res = await fetch("/api/admin/crm/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          type: newLogType,
          title: newLogTitle,
          description: newLogDesc,
        }),
      });

      if (res.ok) {
        const addedEvent = await res.json();
        setCustomerTimeline((prev) => [addedEvent, ...prev]);
        setNewLogTitle("");
        setNewLogDesc("");
        showToast("Interaction logged to customer history!");
        // Update customer notes count locally
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === selectedCustomerId
              ? { ...c, notesCount: (c.notesCount || 0) + 1, lastContactDate: new Date().toISOString() }
              : c
          )
        );
      }
    } catch {
      alert("Failed to add interaction");
    } finally {
      setSubmittingLog(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.customerId || !newTask.title.trim()) {
      alert("Customer and task title required");
      return;
    }

    const cust = customers.find((c) => c.id === newTask.customerId);

    try {
      const res = await fetch("/api/admin/crm/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: newTask.customerId,
          customerName: cust?.name || "Customer",
          customerPhone: cust?.phone || "",
          title: newTask.title,
          dueDate: newTask.dueDate,
          priority: newTask.priority,
          assignedTo: newTask.assignedTo,
        }),
      });

      if (res.ok) {
        showToast("Follow-up task scheduled!");
        setShowAddTaskModal(false);
        setNewTask({
          customerId: "",
          title: "",
          dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
          priority: "Medium",
          assignedTo: "Staff",
        });
        fetchData();
      }
    } catch {
      alert("Failed to schedule task");
    }
  };

  const handleToggleTaskStatus = async (task: CustomerTask) => {
    const nextStatus = task.status === "Completed" ? "Pending" : "Completed";
    try {
      const res = await fetch("/api/admin/crm/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, status: nextStatus }),
      });
      if (res.ok) {
        showToast(`Task marked as ${nextStatus}`);
        fetchData();
      }
    } catch {
      alert("Failed to update task");
    }
  };

  const exportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "City",
      "Stage",
      "Status",
      "Priority",
      "Loyalty Tier",
      "Total Spent (INR)",
      "Total Trips",
      "Source",
      "Assigned To",
      "Created At",
    ];

    const rows = filteredCustomers.map((c) => [
      c.id,
      `"${c.name}"`,
      c.email,
      c.phone,
      `"${c.city}"`,
      c.lifecycleStage,
      c.status,
      c.priority,
      c.loyaltyTier,
      c.totalSpent,
      c.totalTrips,
      `"${c.source}"`,
      `"${c.assignedTo}"`,
      c.createdAt,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kradind_crm_customers_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Customer directory exported to CSV!");
  };

  // Helper formatting
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
  };

  const cleanPhoneForWhatsApp = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) return `91${digits}`;
    return digits;
  };

  const getStageColor = (stage: CustomerLifecycleStage) => {
    switch (stage) {
      case "VIP Explorer":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "Repeat Customer":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "First-Time Explorer":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Prospect":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "Lead":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      case "Blacklisted":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "Urgent / VIP":
        return "text-red-400 bg-red-950/40 border-red-800/40";
      case "High":
        return "text-amber-400 bg-amber-950/40 border-amber-800/40";
      case "Medium":
        return "text-emerald-400 bg-emerald-950/40 border-emerald-800/40";
      default:
        return "text-slate-400 bg-slate-900 border-slate-700/50";
    }
  };

  const getTierIcon = (tier: LoyaltyTier) => {
    if (tier.includes("Legend")) return "👑";
    if (tier.includes("Alpinist")) return "⭐";
    if (tier.includes("Summiteer")) return "🏔️";
    return "🧭";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F3A2E] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in border border-emerald-500/40 backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0B231B] via-[#0F3A2E] to-[#081C15] p-6 rounded-2xl border border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" /> Enterprise CRM 360°
            </span>
            <span className="text-white/40 text-xs">•</span>
            <span className="text-white/60 text-xs font-medium">Customer Relationship & Lifecycle Platform</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">KRADIND Adventure Customer Center</h1>
          <p className="text-xs text-white/70 max-w-xl">
            Complete Customer 360° intelligence, chronological expedition logs, WhatsApp touchpoints, loyalty tiers, and proactive follow-up workflows.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 flex-wrap">
          <button
            onClick={() => fetchData()}
            title="Refresh All Records"
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-xl border border-white/10 transition-colors flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 text-xs font-medium rounded-xl border border-emerald-600/40 transition-colors flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>+ Follow-Up</span>
          </button>
          <button
            onClick={() => setShowAddCustomerModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Customer</span>
          </button>
        </div>
      </div>

      {/* Top Executive KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-[#0B231B]/60 p-4 rounded-xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-white/50 text-[11px] font-medium mb-1">
            <span>Total Customers</span>
            <Users className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">{metrics.totalCustomers}</div>
          <div className="text-[10px] text-white/40 mt-1">Full database records</div>
        </div>

        <div className="bg-[#0B231B]/60 p-4 rounded-xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-white/50 text-[11px] font-medium mb-1">
            <span>Pipeline Leads</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-300">{metrics.leadsCount}</div>
          <div className="text-[10px] text-white/40 mt-1">Active leads & prospects</div>
        </div>

        <div className="bg-[#0B231B]/60 p-4 rounded-xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-white/50 text-[11px] font-medium mb-1">
            <span>Customer Lifetime Val</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300">{formatCurrency(metrics.totalCLV)}</div>
          <div className="text-[10px] text-white/40 mt-1">Aggregated booking spend</div>
        </div>

        <div className="bg-[#0B231B]/60 p-4 rounded-xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-white/50 text-[11px] font-medium mb-1">
            <span>Pending Follow-ups</span>
            <Clock className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-xl font-bold text-orange-300">{metrics.pendingTasks}</div>
          <div className="text-[10px] text-white/40 mt-1">Calls & actions due</div>
        </div>

        <div className="bg-[#0B231B]/60 p-4 rounded-xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-white/50 text-[11px] font-medium mb-1">
            <span>VIP & Repeat</span>
            <Flame className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-300">{metrics.vipCount}</div>
          <div className="text-[10px] text-white/40 mt-1">High-value alumni</div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("directory")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "directory"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Customer Directory</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">{filteredCustomers.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("kanban")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "kanban"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Pipeline Kanban</span>
          </button>

          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "tasks"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Follow-Up Tasks</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">{tasks.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "audit"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CUSTOMER DIRECTORY */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-[#0B231B]/40 p-3.5 rounded-xl border border-white/10 flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search by customer name, phone, email, city, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#05140F] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="bg-[#05140F] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="All">All Stages</option>
                <option value="Lead">Lead</option>
                <option value="Prospect">Prospect</option>
                <option value="First-Time Explorer">First-Time Explorer</option>
                <option value="Repeat Customer">Repeat Customer</option>
                <option value="VIP Explorer">VIP Explorer</option>
                <option value="Inactive">Inactive</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-[#05140F] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="All">All Priority</option>
                <option value="Urgent / VIP">Urgent / VIP</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="bg-[#05140F] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="All">All Loyalty Tiers</option>
                <option value="Explorer (Bronze)">Explorer (Bronze)</option>
                <option value="Summiteer (Silver)">Summiteer (Silver)</option>
                <option value="Alpinist (Gold)">Alpinist (Gold)</option>
                <option value="Legend (Platinum)">Legend (Platinum)</option>
              </select>
            </div>
          </div>

          {/* Customer Table */}
          <div className="bg-[#0B231B]/40 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white">
                <thead className="bg-[#05140F]/80 text-[11px] font-semibold text-white/50 uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Lifecycle Stage</th>
                    <th className="py-3 px-4">Loyalty & Priority</th>
                    <th className="py-3 px-4">Spend & Trips</th>
                    <th className="py-3 px-4">Assigned Agent</th>
                    <th className="py-3 px-4 text-right">Quick Contact / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-white/50">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400" />
                        Loading CRM customer registry...
                      </td>
                    </tr>
                  ) : filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-white/50">
                        <Users className="w-8 h-8 text-white/20 mx-auto mb-2" />
                        No customer records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => (
                      <tr
                        key={cust.id}
                        className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                        onClick={() => setSelectedCustomerId(cust.id)}
                      >
                        {/* Customer */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0">
                              {cust.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-white flex items-center gap-1.5">
                                <span>{cust.name}</span>
                                {cust.idProofVerified && (
                                  <span title="ID Verified" className="text-emerald-400 text-xs">
                                    ✓
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-white/50 truncate flex items-center gap-2">
                                <span>{cust.phone}</span>
                                <span>•</span>
                                <span>{cust.city}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Lifecycle Stage */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStageColor(
                                cust.lifecycleStage
                              )}`}
                            >
                              {cust.lifecycleStage}
                            </span>
                            <div className="text-[10px] text-white/40 flex items-center gap-1">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  cust.status === "Active"
                                    ? "bg-emerald-400"
                                    : cust.status === "Follow-Up Needed"
                                    ? "bg-amber-400"
                                    : "bg-gray-400"
                                }`}
                              />
                              <span>{cust.status}</span>
                            </div>
                          </div>
                        </td>

                        {/* Loyalty & Priority */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="text-[11px] font-medium text-amber-200/90 flex items-center gap-1">
                              <span>{getTierIcon(cust.loyaltyTier)}</span>
                              <span>{cust.loyaltyTier.split(" ")[0]}</span>
                            </div>
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getPriorityColor(
                                cust.priority
                              )}`}
                            >
                              {cust.priority}
                            </span>
                          </div>
                        </td>

                        {/* Spend & Trips */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{formatCurrency(cust.totalSpent)}</div>
                          <div className="text-[10px] text-white/40">
                            {cust.totalTrips} expedition{cust.totalTrips !== 1 ? "s" : ""}
                          </div>
                        </td>

                        {/* Assigned Agent */}
                        <td className="py-3 px-4">
                          <div className="text-[11px] text-white/80 font-medium">{cust.assignedTo || "Unassigned"}</div>
                          <div className="text-[10px] text-white/40 truncate">Src: {cust.source}</div>
                        </td>

                        {/* Quick Actions */}
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`https://wa.me/${cleanPhoneForWhatsApp(cust.phone)}?text=Hi%20${encodeURIComponent(
                                cust.name
                              )},%20greetings%20from%20KRADIND%20Adventures!%20How%20can%20we%20assist%20your%20next%20expedition?`}
                              target="_blank"
                              rel="noreferrer"
                              title="Chat on WhatsApp"
                              className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`tel:${cust.phone}`}
                              title="Direct Phone Call"
                              className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => setSelectedCustomerId(cust.id)}
                              title="Open Customer 360"
                              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-[11px] font-medium transition-colors flex items-center gap-1 border border-white/10"
                            >
                              <Eye className="w-3 h-3 text-emerald-400" />
                              <span>View 360</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                              title="Delete Record"
                              className="p-1.5 rounded-lg bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PIPELINE KANBAN BOARD */}
      {activeTab === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 overflow-x-auto pb-4">
          {(
            [
              { stage: "Lead" as CustomerLifecycleStage, label: "1. Inbound Leads", color: "border-cyan-500/40 text-cyan-300" },
              { stage: "Prospect" as CustomerLifecycleStage, label: "2. Warm Prospects", color: "border-amber-500/40 text-amber-300" },
              {
                stage: "First-Time Explorer" as CustomerLifecycleStage,
                label: "3. First-Time Explorers",
                color: "border-blue-500/40 text-blue-300",
              },
              {
                stage: "Repeat Customer" as CustomerLifecycleStage,
                label: "4. Repeat Trekkers",
                color: "border-emerald-500/40 text-emerald-300",
              },
              {
                stage: "VIP Explorer" as CustomerLifecycleStage,
                label: "5. VIP Expeditionists",
                color: "border-purple-500/40 text-purple-300",
              },
            ] as const
          ).map((col) => {
            const columnCustomers = customers.filter((c) => c.lifecycleStage === col.stage);
            const columnValue = columnCustomers.reduce((acc, curr) => acc + (curr.totalSpent || 0), 0);

            return (
              <div key={col.stage} className="bg-[#0B231B]/40 rounded-2xl border border-white/10 p-3.5 flex flex-col min-h-[580px]">
                {/* Column Header */}
                <div className="pb-3 border-b border-white/10 mb-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${col.color}`}>{col.label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">
                      {columnCustomers.length}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/40 mt-1">Pipeline Val: {formatCurrency(columnValue)}</div>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[620px] pr-1">
                  {columnCustomers.length === 0 ? (
                    <div className="h-28 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-[11px] text-white/30">
                      Empty stage
                    </div>
                  ) : (
                    columnCustomers.map((cust) => (
                      <div
                        key={cust.id}
                        onClick={() => setSelectedCustomerId(cust.id)}
                        className="p-3 bg-[#05140F] hover:bg-[#071D15] rounded-xl border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer shadow-md group relative"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-xs text-white group-hover:text-emerald-300 transition-colors truncate">
                            {cust.name}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${getPriorityColor(cust.priority)}`}>
                            {cust.priority}
                          </span>
                        </div>

                        <div className="text-[10px] text-white/50 mb-2 truncate">
                          {cust.phone} • {cust.city}
                        </div>

                        {cust.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {cust.tags.slice(0, 2).map((t, idx) => (
                              <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-white/60">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                          <span className="font-semibold text-emerald-400">{formatCurrency(cust.totalSpent)}</span>
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={`https://wa.me/${cleanPhoneForWhatsApp(cust.phone)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded bg-white/5 hover:bg-emerald-600 hover:text-white text-emerald-400 transition-colors"
                            >
                              <MessageSquare className="w-3 h-3" />
                            </a>
                            <select
                              value={cust.lifecycleStage}
                              onChange={(e) => handleQuickStageChange(cust.id, e.target.value as CustomerLifecycleStage)}
                              className="bg-black/40 border border-white/10 rounded px-1 text-[9px] text-white/70 focus:outline-none"
                            >
                              <option value="Lead">Lead</option>
                              <option value="Prospect">Prospect</option>
                              <option value="First-Time Explorer">Explorer</option>
                              <option value="Repeat Customer">Repeat</option>
                              <option value="VIP Explorer">VIP</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: FOLLOW-UP TASKS */}
      {activeTab === "tasks" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/60">
              Manage proactive customer touches, quotation check-ins, medical form requests, and post-trek feedback calls.
            </div>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Follow-Up</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tasks.length === 0 ? (
              <div className="col-span-3 py-16 text-center text-white/40 bg-[#0B231B]/40 rounded-2xl border border-white/10">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-50" />
                No follow-up tasks currently pending. You are all caught up!
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all ${
                    task.status === "Completed"
                      ? "bg-[#05140F]/40 border-white/5 opacity-60"
                      : "bg-[#0B231B]/60 border-white/10 hover:border-emerald-500/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleTaskStatus(task)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          task.status === "Completed"
                            ? "bg-emerald-600 border-emerald-500 text-white"
                            : "border-white/30 hover:border-emerald-400 text-transparent"
                        }`}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </button>
                      <h4
                        className={`text-xs font-semibold text-white ${
                          task.status === "Completed" ? "line-through text-white/40" : ""
                        }`}
                      >
                        {task.title}
                      </h4>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  <div className="pl-7 space-y-1 text-[11px] text-white/60">
                    <div className="font-medium text-emerald-300 flex items-center gap-1">
                      <span>👤 {task.customerName}</span>
                    </div>
                    <div className="text-[10px] text-white/40 flex items-center gap-2">
                      <span>Due: {task.dueDate}</span>
                      <span>•</span>
                      <span>Assigned: {task.assignedTo}</span>
                    </div>
                  </div>

                  {task.customerPhone && (
                    <div className="mt-3 pl-7 pt-2 border-t border-white/5 flex items-center gap-2">
                      <a
                        href={`https://wa.me/${cleanPhoneForWhatsApp(task.customerPhone)}?text=Hi%20${encodeURIComponent(
                          task.customerName
                        )},%20following%20up%20regarding%20your%20adventure%20inquiry%20with%20KRADIND!`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[10px] rounded-lg font-medium transition-colors flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp Customer</span>
                      </a>
                      <a
                        href={`tel:${task.customerPhone}`}
                        className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-[10px] rounded-lg font-medium transition-colors flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL */}
      {activeTab === "audit" && (
        <div className="bg-[#0B231B]/40 rounded-2xl border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Enterprise CRM & RBAC Audit Trail</span>
              </h3>
              <p className="text-xs text-white/50">
                Immutable chronological log of all customer modifications, role assignments, and interactions.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {auditLogs.length} Events Logged
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {auditLogs.length === 0 ? (
              <div className="py-12 text-center text-white/40 text-xs">No audit events recorded yet.</div>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-[#05140F] rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{log.actorName}</span>
                      <span className="text-[10px] text-white/40">({log.actorEmail})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                        {log.action}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/5 text-white/50">
                        {log.targetEntity}
                      </span>
                    </div>
                    <div className="text-[11px] text-white/70">{log.details}</div>
                  </div>
                  <div className="text-[10px] text-white/40 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString("en-IN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CUSTOMER 360 SLIDE-OVER DRAWER (FULL HISTORY & PROFILE) */}
      {/* ========================================================= */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-2xl bg-[#081C15] border-l border-emerald-500/30 h-full flex flex-col shadow-2xl overflow-hidden animate-slide-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 bg-gradient-to-r from-[#0B231B] to-[#0F3A2E] border-b border-white/10 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{selectedCustomer.name}</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      {selectedCustomer.id}
                    </span>
                  </div>
                  <div className="text-xs text-white/60 flex items-center gap-2 mt-0.5">
                    <span>{selectedCustomer.city}, {selectedCustomer.state || "India"}</span>
                    <span>•</span>
                    <span className="text-amber-300 font-semibold">{selectedCustomer.loyaltyTier}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomerId(null)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact & Action Ribbon */}
            <div className="p-3 bg-[#05140F] border-b border-white/5 flex items-center justify-between gap-2 overflow-x-auto text-xs">
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${cleanPhoneForWhatsApp(selectedCustomer.phone)}?text=Hi%20${encodeURIComponent(
                    selectedCustomer.name
                  )},%20greetings%20from%20KRADIND%20Adventures!`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${selectedCustomer.phone}`}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedCustomer.phone}</span>
                </a>
                {selectedCustomer.email && (
                  <a
                    href={`mailto:${selectedCustomer.email}`}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-white/10"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1 text-[11px] text-white/50">
                <span>Priority:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${getPriorityColor(selectedCustomer.priority)}`}>
                  {selectedCustomer.priority}
                </span>
              </div>
            </div>

            {/* Quick Metric Bar */}
            <div className="grid grid-cols-4 gap-2 p-3 bg-[#071E16] border-b border-white/5 text-center text-xs">
              <div>
                <div className="text-[10px] text-white/40">Total Spend</div>
                <div className="font-bold text-amber-300">{formatCurrency(selectedCustomer.totalSpent)}</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40">Trips Taken</div>
                <div className="font-bold text-emerald-400">{selectedCustomer.totalTrips}</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40">Interactions</div>
                <div className="font-bold text-cyan-300">{customerTimeline.length || selectedCustomer.notesCount || 0}</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40">Lead Source</div>
                <div className="font-bold text-white truncate">{selectedCustomer.source}</div>
              </div>
            </div>

            {/* Sub-Tabs Navigation */}
            <div className="flex items-center border-b border-white/10 px-4 bg-[#05140F]">
              <button
                onClick={() => setDrawerTab("timeline")}
                className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                  drawerTab === "timeline"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-white/60 hover:text-white"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Timeline History ({customerTimeline.length})</span>
              </button>

              <button
                onClick={() => setDrawerTab("medical")}
                className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                  drawerTab === "medical"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-white/60 hover:text-white"
                }`}
              >
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Medical & Emergency</span>
              </button>

              <button
                onClick={() => setDrawerTab("edit")}
                className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                  drawerTab === "edit"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-white/60 hover:text-white"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Profile & Lifecycle</span>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* SUBTAB 1: TIMELINE HISTORY */}
              {drawerTab === "timeline" && (
                <div className="space-y-5">
                  {/* New Interaction Form */}
                  <form onSubmit={handleAddTimelineLog} className="p-3.5 bg-[#05140F] rounded-xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Log Touchpoint / Note</span>
                      </span>

                      <div className="flex items-center gap-1">
                        {(
                          [
                            { type: "call_logged" as TimelineEventType, label: "📞 Call" },
                            { type: "whatsapp_sent" as TimelineEventType, label: "💬 WhatsApp" },
                            { type: "note_added" as TimelineEventType, label: "📝 Note" },
                            { type: "email_sent" as TimelineEventType, label: "✉️ Email" },
                          ] as const
                        ).map((item) => (
                          <button
                            key={item.type}
                            type="button"
                            onClick={() => setNewLogType(item.type)}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                              newLogType === item.type
                                ? "bg-emerald-600 text-white font-bold"
                                : "bg-white/5 text-white/60 hover:bg-white/10"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Brief headline (e.g. Discussed Chadar trek acclimatization, sent PDF itinerary)"
                      value={newLogTitle}
                      onChange={(e) => setNewLogTitle(e.target.value)}
                      required
                      className="w-full bg-[#081C15] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-500"
                    />

                    <textarea
                      placeholder="Detailed notes or customer feedback..."
                      rows={2}
                      value={newLogDesc}
                      onChange={(e) => setNewLogDesc(e.target.value)}
                      className="w-full bg-[#081C15] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 resize-none"
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingLog || !newLogTitle.trim()}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Send className="w-3 h-3" />
                        <span>{submittingLog ? "Logging..." : "Save Interaction"}</span>
                      </button>
                    </div>
                  </form>

                  {/* Chronological Feed */}
                  <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-white/10">
                    {loadingTimeline ? (
                      <div className="py-8 text-center text-white/40 text-xs">
                        <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-emerald-400" />
                        Loading activity logs...
                      </div>
                    ) : customerTimeline.length === 0 ? (
                      <div className="py-8 text-center text-white/40 text-xs">
                        No activity recorded for this customer yet. Use the form above to log the first call or note!
                      </div>
                    ) : (
                      customerTimeline.map((item) => (
                        <div key={item.id} className="relative pl-7 group">
                          {/* Marker Icon */}
                          <div className="absolute left-1.5 top-1.5 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0F3A2E] border-2 border-emerald-400 flex items-center justify-center" />

                          <div className="p-3 bg-[#05140F] rounded-xl border border-white/5 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                              <span className="text-[10px] text-white/40">
                                {new Date(item.timestamp).toLocaleString("en-IN", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>

                            {item.description && <p className="text-[11px] text-white/70">{item.description}</p>}

                            <div className="flex items-center gap-2 pt-1 text-[9px] text-white/40">
                              <span>By: {item.author}</span>
                              <span>•</span>
                              <span className="uppercase tracking-wider">{item.type.replace("_", " ")}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* SUBTAB 2: MEDICAL & EMERGENCY */}
              {drawerTab === "medical" && (
                <div className="space-y-4">
                  {/* Emergency Contact */}
                  <div className="p-4 bg-[#05140F] rounded-xl border border-white/10 space-y-3">
                    <h3 className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      <span>Primary Emergency Contact</span>
                    </h3>

                    {selectedCustomer.emergencyContact?.name ? (
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-[10px] text-white/40">Name</div>
                          <div className="font-semibold text-white">{selectedCustomer.emergencyContact.name}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-white/40">Relationship</div>
                          <div className="font-semibold text-white">{selectedCustomer.emergencyContact.relation || "Family"}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-white/40">Contact Phone</div>
                          <a
                            href={`tel:${selectedCustomer.emergencyContact.phone}`}
                            className="font-semibold text-emerald-400 hover:underline"
                          >
                            {selectedCustomer.emergencyContact.phone}
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-white/40 italic">
                        No emergency contact provided yet. You can add it in the Profile & Lifecycle tab.
                      </div>
                    )}
                  </div>

                  {/* High Altitude Medical Notes */}
                  <div className="p-4 bg-[#05140F] rounded-xl border border-white/10 space-y-2">
                    <h3 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <HeartPulse className="w-4 h-4 text-amber-400" />
                      <span>Medical & Dietary Profile</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-white/40">Dietary Preference:</span>
                        <div className="font-medium text-white">{selectedCustomer.dietaryPreference || "Vegetarian"}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/40">T-Shirt Size:</span>
                        <div className="font-medium text-white">{selectedCustomer.tShirtSize || "L"}</div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] text-white/40">Medical Conditions & High Altitude Notes:</span>
                      <p className="text-xs text-white/70 mt-0.5 bg-[#081C15] p-2.5 rounded-lg border border-white/5">
                        {selectedCustomer.medicalNotes || "No past medical alerts or asthma/cardiac contraindications recorded."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: EDIT PROFILE & LIFECYCLE */}
              {drawerTab === "edit" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-white/50 font-medium">Lifecycle Stage</label>
                      <select
                        value={editFormData.lifecycleStage || selectedCustomer.lifecycleStage}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, lifecycleStage: e.target.value as CustomerLifecycleStage })
                        }
                        className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Lead">Lead</option>
                        <option value="Prospect">Prospect</option>
                        <option value="First-Time Explorer">First-Time Explorer</option>
                        <option value="Repeat Customer">Repeat Customer</option>
                        <option value="VIP Explorer">VIP Explorer</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Blacklisted">Blacklisted</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-white/50 font-medium">Status</label>
                      <select
                        value={editFormData.status || selectedCustomer.status}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, status: e.target.value as CustomerStatus })
                        }
                        className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Follow-Up Needed">Follow-Up Needed</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                        <option value="Dormant">Dormant</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-white/50 font-medium">Priority Level</label>
                      <select
                        value={editFormData.priority || selectedCustomer.priority}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, priority: e.target.value as any })
                        }
                        className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent / VIP">Urgent / VIP</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-white/50 font-medium">Loyalty Tier</label>
                      <select
                        value={editFormData.loyaltyTier || selectedCustomer.loyaltyTier}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, loyaltyTier: e.target.value as LoyaltyTier })
                        }
                        className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Explorer (Bronze)">Explorer (Bronze)</option>
                        <option value="Summiteer (Silver)">Summiteer (Silver)</option>
                        <option value="Alpinist (Gold)">Alpinist (Gold)</option>
                        <option value="Legend (Platinum)">Legend (Platinum)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-white/50 font-medium">City</label>
                      <input
                        type="text"
                        value={editFormData.city !== undefined ? editFormData.city : selectedCustomer.city}
                        onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                        className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-white/50 font-medium">Assigned Agent</label>
                      <input
                        type="text"
                        value={editFormData.assignedTo !== undefined ? editFormData.assignedTo : selectedCustomer.assignedTo}
                        onChange={(e) => setEditFormData({ ...editFormData, assignedTo: e.target.value })}
                        className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-white/50 font-medium">Medical / Dietary Notes</label>
                    <textarea
                      rows={2}
                      value={editFormData.medicalNotes !== undefined ? editFormData.medicalNotes : selectedCustomer.medicalNotes || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, medicalNotes: e.target.value })}
                      placeholder="Allergies, past high-altitude AMS notes, dietary preferences..."
                      className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleUpdateCustomer}
                      disabled={savingEdit}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>{savingEdit ? "Updating Profile..." : "Save Customer 360 Changes"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD NEW CUSTOMER */}
      {/* ========================================================= */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#081C15] border border-emerald-500/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Register New Customer</span>
              </h3>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="p-1 rounded-lg text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-white/60 font-semibold">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/60 font-semibold">Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-white/60 font-semibold">Email Address</label>
                  <input
                    type="email"
                    placeholder="rahul.v@gmail.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/60 font-semibold">City</label>
                  <input
                    type="text"
                    placeholder="Delhi / Dehradun"
                    value={newCustomer.city}
                    onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                    className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-white/60 font-semibold">Stage</label>
                  <select
                    value={newCustomer.lifecycleStage}
                    onChange={(e) => setNewCustomer({ ...newCustomer, lifecycleStage: e.target.value as CustomerLifecycleStage })}
                    className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Prospect">Prospect</option>
                    <option value="First-Time Explorer">First-Time Explorer</option>
                    <option value="Repeat Customer">Repeat Customer</option>
                    <option value="VIP Explorer">VIP Explorer</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-white/60 font-semibold">Priority</label>
                  <select
                    value={newCustomer.priority}
                    onChange={(e) => setNewCustomer({ ...newCustomer, priority: e.target.value as any })}
                    className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent / VIP">Urgent / VIP</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-white/60 font-semibold">Loyalty Tier</label>
                  <select
                    value={newCustomer.loyaltyTier}
                    onChange={(e) => setNewCustomer({ ...newCustomer, loyaltyTier: e.target.value as LoyaltyTier })}
                    className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none"
                  >
                    <option value="Explorer (Bronze)">Bronze</option>
                    <option value="Summiteer (Silver)">Silver</option>
                    <option value="Alpinist (Gold)">Gold</option>
                    <option value="Legend (Platinum)">Platinum</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-white/60 font-semibold">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Kashmir Great Lakes, High Spender, Corporate"
                  value={newCustomer.tags}
                  onChange={(e) => setNewCustomer({ ...newCustomer, tags: e.target.value })}
                  className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-950"
                >
                  Save & Open 360
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD FOLLOW-UP TASK */}
      {/* ========================================================= */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#081C15] border border-emerald-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Schedule Follow-Up Task</span>
              </h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="p-1 rounded-lg text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] text-white/60 font-semibold">Select Customer *</label>
                <select
                  required
                  value={newTask.customerId}
                  onChange={(e) => setNewTask({ ...newTask, customerId: e.target.value })}
                  className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none"
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) - {c.lifecycleStage}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-white/60 font-semibold">Task Objective *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Call to finalize Rupin Pass batch slot"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-white/60 font-semibold">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/60 font-semibold">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-950"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
