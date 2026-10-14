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
  Shield,
  ArrowUpRight,
  Maximize2,
  Minimize2,
  MapPin,
  User,
  RotateCcw,
} from "lucide-react";
import type {
  CustomerRecord,
  CustomerLifecycleStage,
  CustomerStatus,
  LoyaltyTier,
  CustomerTimelineEvent,
  CustomerTask,
  AuditLogRecord,
  TimelineEventType,
  AdminRole,
  CustomerItineraryProposal,
  TrekData,
} from "@/lib/cms-store";
import { getPackageSection } from "@/lib/package-sections";
import { ProposalVoucherModal } from "@/components/admin/crm/proposal-voucher-modal";
import { ItineraryStudio } from "@/components/admin/crm/itinerary-studio";
import { SavedProposalsArchive } from "@/components/admin/crm/saved-proposals-archive";

export default function AdminCRMPage() {
  // State
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [tasks, setTasks] = useState<CustomerTask[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [packages, setPackages] = useState<TrekData[]>([]);
  const [proposals, setProposals] = useState<CustomerItineraryProposal[]>([]);
  const [recycledProposals, setRecycledProposals] = useState<CustomerItineraryProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  // Views & Filters
  const [activeTab, setActiveTab] = useState<
    "directory" | "itinerary-builder" | "proposals" | "recycle-bin" | "kanban" | "tasks" | "audit"
  >("directory");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState("All");
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");

  // Proposals & Itinerary Studio State
  const [builderProposal, setBuilderProposal] = useState<CustomerItineraryProposal | null>(null);
  const [previewProposal, setPreviewProposal] = useState<CustomerItineraryProposal | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [savingProposal, setSavingProposal] = useState(false);

  // Customer 360 Full Popup Panel
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isModalExpanded, setIsModalExpanded] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"timeline" | "collab" | "medical" | "edit">("timeline");
  const [customerTimeline, setCustomerTimeline] = useState<CustomerTimelineEvent[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  // Multi-Agent Collaboration & Handover state
  const [collabMessages, setCollabMessages] = useState<any[]>([]);
  const [loadingCollab, setLoadingCollab] = useState(false);
  const [collabInput, setCollabInput] = useState("");
  const [collabPersona, setCollabPersona] = useState<{ id: string; name: string; role: AdminRole }>({
    id: "admin-sales",
    name: "Priya Sharma",
    role: "Sales / CRM Agent",
  });
  const [handoverAgent, setHandoverAgent] = useState("Vikram Rawat");
  const [handoverNote, setHandoverNote] = useState("");
  const [submittingHandover, setSubmittingHandover] = useState(false);

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

  // Auto-save new customer draft so closing or leaving modal doesn't lose inputs
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("kradind_crm_new_customer_draft");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.name || parsed.phone || parsed.email)) {
            setNewCustomer((prev) => ({ ...prev, ...parsed }));
          }
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if (newCustomer.name || newCustomer.phone || newCustomer.email) {
          localStorage.setItem("kradind_crm_new_customer_draft", JSON.stringify(newCustomer));
        }
      } catch {}
    }
  }, [newCustomer]);

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

  // URL query synchronizer
  const changeTab = (tab: "directory" | "itinerary-builder" | "proposals" | "recycle-bin" | "kanban" | "tasks" | "audit") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState(null, "", url.toString());
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (
        tabParam &&
        ["directory", "itinerary-builder", "proposals", "recycle-bin", "kanban", "tasks", "audit"].includes(tabParam)
      ) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  // Fetch Core Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [custRes, taskRes, auditRes, pkgRes, propRes, recRes] = await Promise.all([
        fetch("/api/admin/crm/customers"),
        fetch("/api/admin/crm/tasks"),
        fetch("/api/admin/crm/audit"),
        fetch("/api/admin/treks"),
        fetch("/api/admin/crm/proposals"),
        fetch("/api/admin/crm/proposals?status=Recycled"),
      ]);

      if (custRes.ok) setCustomers(await custRes.json());
      if (taskRes.ok) setTasks(await taskRes.json());
      if (auditRes.ok) setAuditLogs(await auditRes.json());
      if (pkgRes.ok) {
        const pkgs = await pkgRes.json();
        setPackages(Array.isArray(pkgs) ? pkgs : []);
      }
      if (propRes.ok) {
        const props = await propRes.json();
        setProposals(Array.isArray(props) ? props : []);
      }
      if (recRes.ok) {
        const recs = await recRes.json();
        setRecycledProposals(Array.isArray(recs) ? recs : []);
      }
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

    const fetchCollab = async () => {
      setLoadingCollab(true);
      try {
        const res = await fetch("/api/admin/chat?channelId=all-team-ops");
        if (res.ok) {
          const data = await res.json();
          const msgs = data.messages || [];
          setCollabMessages(msgs.filter((m: any) => m.taggedCustomerId === selectedCustomerId));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCollab(false);
      }
    };

    fetchTimeline();
    fetchCollab();
  }, [selectedCustomerId, customers]);

  // Close full modal popup on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedCustomerId) {
        setSelectedCustomerId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCustomerId]);

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
    const totalProposals = proposals.length;
    const vipCount = customers.filter(
      (c) =>
        c.lifecycleStage === "VIP Explorer" ||
        c.loyaltyTier.includes("Legend") ||
        c.loyaltyTier.includes("Alpinist")
    ).length;

    return { totalCustomers, leadsCount, totalCLV, pendingTasks, vipCount, totalProposals };
  }, [customers, tasks, proposals]);

  // Proposal Actions
  const handleSaveProposal = async (proposal: CustomerItineraryProposal) => {
    setSavingProposal(true);
    try {
      const res = await fetch("/api/admin/crm/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proposal),
      });

      if (res.ok) {
        const saved = await res.json();
        showToast(`Itinerary Proposal "${saved.packageTitle}" saved!`);
        setProposals((prev) => {
          const idx = prev.findIndex((p) => p.id === saved.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = saved;
            return next;
          }
          return [saved, ...prev];
        });
        setBuilderProposal(saved);
        setPreviewProposal(saved);
        setShowPreviewModal(true);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save proposal");
      }
    } catch {
      alert("Error saving proposal");
    } finally {
      setSavingProposal(false);
    }
  };

  const handleDeleteProposal = async (id: string, title: string) => {
    if (!confirm(`Move itinerary proposal "${title}" (${id}) to the Recycle Bin?`)) return;
    try {
      const res = await fetch(`/api/admin/crm/proposals?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(`Proposal "${title}" moved to Recycle Bin.`);
        setProposals((prev) => prev.filter((p) => p.id !== id));
        const recRes = await fetch("/api/admin/crm/proposals?status=Recycled");
        if (recRes.ok) {
          const recs = await recRes.json();
          setRecycledProposals(Array.isArray(recs) ? recs : []);
        }
      } else {
        alert("Failed to move proposal to recycle bin");
      }
    } catch {
      alert("Error recycling proposal");
    }
  };

  const handleRestoreProposal = async (id: string, title: string) => {
    try {
      const res = await fetch("/api/admin/crm/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", id }),
      });
      if (res.ok) {
        const restored = await res.json();
        showToast(`Restored "${title}" to Active Proposals!`);
        setRecycledProposals((prev) => prev.filter((p) => p.id !== id));
        setProposals((prev) => [restored, ...prev]);
      } else {
        alert("Failed to restore proposal");
      }
    } catch {
      alert("Error restoring proposal");
    }
  };

  const handlePermanentDeleteProposal = async (id: string, title: string) => {
    if (!confirm(`Permanently destroy proposal "${title}" (${id})? This CANNOT be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/crm/proposals?id=${id}&permanent=true`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(`Proposal ${id} permanently deleted.`);
        setRecycledProposals((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to permanently delete proposal");
      }
    } catch {
      alert("Error deleting proposal permanently");
    }
  };

  const handleEmptyRecycleBin = async () => {
    if (recycledProposals.length === 0) return;
    if (!confirm(`Permanently empty recycle bin (${recycledProposals.length} item${recycledProposals.length !== 1 ? "s" : ""})? This cannot be undone.`)) return;
    try {
      const res = await fetch("/api/admin/crm/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "empty_recycle" }),
      });
      if (res.ok) {
        showToast("Recycle bin emptied.");
        setRecycledProposals([]);
      } else {
        alert("Failed to empty recycle bin");
      }
    } catch {
      alert("Error emptying recycle bin");
    }
  };

  const handleProposalStatusChange = async (id: string, newStatus: string) => {
    const existing = proposals.find((p) => p.id === id);
    if (!existing) return;
    const updated = { ...existing, status: newStatus as any };

    try {
      const res = await fetch("/api/admin/crm/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        showToast(`Proposal status updated to ${newStatus}`);
        setProposals((prev) => prev.map((p) => (p.id === id ? updated : p)));
      }
    } catch {
      alert("Failed to update proposal status");
    }
  };

  const handleEditProposal = (proposal: CustomerItineraryProposal) => {
    setBuilderProposal(proposal);
    changeTab("itinerary-builder");
  };

  const handlePreviewProposal = (proposal: CustomerItineraryProposal) => {
    setPreviewProposal(proposal);
    setShowPreviewModal(true);
  };

  const handleWhatsAppProposal = (proposal: CustomerItineraryProposal) => {
    const digits = (proposal.customerPhone || "").replace(/\D/g, "");
    const phone = digits.length === 10 ? `91${digits}` : digits;
    const msg = `Hi ${proposal.customerName}, here is your customized travel proposal for *${proposal.packageTitle}* (${proposal.duration}) from KRADIND Adventures.\n\nTotal Quoted: ₹${proposal.totalQuotedPrice.toLocaleString("en-IN")}\nAdvance to Reserve: ₹${(proposal.advanceDepositRequired || 0).toLocaleString("en-IN")}\n\nPlease review your day-by-day itinerary and let us know if you need any adjustments!`;
    const encoded = encodeURIComponent(msg);
    const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
  };

  const handleStartProposalForCustomer = (cust: CustomerRecord) => {
    setSelectedCustomerId(null);
    setBuilderProposal({
      id: `KRAD-PROP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      customerEmail: cust.email,
      customerCity: cust.city,
      packageTitle: "",
      basePackageSlug: "",
      destination: "",
      duration: "",
      startDate: "",
      endDate: "",
      adultsCount: 2,
      childrenCount: 0,
      pickupLocation: "",
      dropLocation: "",
      hotelCategory: "Standard 3-Star / Alpine Camp",
      vehicleType: "Private AC Sedan / Ertiga",
      itinerary: [],
      inclusions: [],
      exclusions: [],
      basePricePerPerson: 0,
      totalQuotedPrice: 0,
      advanceDepositRequired: 0,
      validUntil: "",
      specialNotes: cust.dietaryPreference ? `Dietary Preference: ${cust.dietaryPreference}` : "",
      status: "Draft",
      author: "Sales CRM Agent",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    changeTab("itinerary-builder");
  };

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
        try {
          localStorage.removeItem("kradind_crm_new_customer_draft");
        } catch {}
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

  const handleTransferLead = async () => {
    if (!selectedCustomerId || !handoverAgent) return;
    setSubmittingHandover(true);
    try {
      const res = await fetch("/api/admin/crm/customers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedCustomerId, assignedTo: handoverAgent }),
      });

      if (res.ok) {
        await fetch("/api/admin/crm/timeline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: selectedCustomerId,
            type: "stage_changed",
            title: `Lead Transferred to ${handoverAgent}`,
            description: handoverNote || `Case assigned to ${handoverAgent} by ${collabPersona.name}.`,
            author: collabPersona.name,
          }),
        });

        await fetch("/api/admin/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channelId: "multi-agent-lead-handover",
            senderId: collabPersona.id,
            senderName: collabPersona.name,
            senderRole: collabPersona.role,
            content: `🤝 Customer Handover: @${handoverAgent} Customer ${selectedCustomer?.name} transferred to your queue. Instructions: ${handoverNote || "Please review itinerary and confirm."}`,
            taggedCustomerId: selectedCustomerId,
            taggedCustomerName: selectedCustomer?.name,
          }),
        });

        showToast(`Customer assigned to ${handoverAgent}!`);
        setHandoverNote("");
        fetchData();
      }
    } catch {
      alert("Handover failed");
    } finally {
      setSubmittingHandover(false);
    }
  };

  const handlePostCollabNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collabInput.trim() || !selectedCustomerId) return;
    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId: "multi-agent-lead-handover",
          senderId: collabPersona.id,
          senderName: collabPersona.name,
          senderRole: collabPersona.role,
          content: collabInput.trim(),
          taggedCustomerId: selectedCustomerId,
          taggedCustomerName: selectedCustomer?.name,
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        setCollabMessages((prev) => [...prev, saved]);
        setCollabInput("");
        showToast("Multi-Agent note saved!");
      }
    } catch {
      alert("Failed to save note");
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

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kradind_crm_customers_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Customer directory exported to CSV!");
  };

  // Formatting helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cleanPhoneForWhatsApp = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) return `91${digits}`;
    return digits;
  };

  const getStageBadgeClasses = (stage: CustomerLifecycleStage) => {
    switch (stage) {
      case "VIP Explorer":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Repeat Customer":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "First-Time Explorer":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Prospect":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Lead":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "Blacklisted":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getPriorityBadgeClasses = (p: string) => {
    switch (p) {
      case "Urgent / VIP":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "High":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Medium":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getRoleBadgeClasses = (role?: AdminRole | string) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Operations Manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Sales / CRM Agent":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Expedition Leader":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
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
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner - High contrast clean card with KRADIND green accents */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Enterprise CRM 360°
            </span>
            <span className="text-slate-300 text-xs">•</span>
            <span className="text-slate-500 text-xs font-medium">Customer Intelligence & Lifecycle</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Relationship Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Track customer lifetime value (CLV), expedition history, WhatsApp touchpoints, medical profiles, and sales
            pipelines in one unified command center.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => fetchData()}
            title="Refresh All Records"
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={exportCSV}
            className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <a
            href="/admin/chat"
            className="px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Team Chat</span>
          </a>
          <button
            onClick={() => changeTab("itinerary-builder")}
            className="px-3.5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold rounded-xl border border-purple-200 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>+ Itinerary Studio</span>
          </button>
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-200 transition-colors flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>+ Follow-Up</span>
          </button>
          <button
            onClick={() => setShowAddCustomerModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Customer</span>
          </button>
        </div>
      </div>

      {/* 4 Packages & Tours Sections (Domestic, International, Fixed Departure, Treks) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <span>📦 Packages Catalog:</span>
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            4 Strictly Separated Product Sections
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="/admin/treks?type=domestic"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition shadow-2xs"
          >
            <span>🏖️ Domestic Tours</span>
            <span className="bg-amber-200/80 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {packages.filter((p) => getPackageSection(p) === "Domestic").length}
            </span>
          </a>
          <a
            href="/admin/treks?type=international"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition shadow-2xs"
          >
            <span>🌐 International Tours</span>
            <span className="bg-blue-200/80 text-blue-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {packages.filter((p) => getPackageSection(p) === "International").length}
            </span>
          </a>
          <a
            href="/admin/treks?type=fixed"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition shadow-2xs"
          >
            <span>📅 Fixed Departures</span>
            <span className="bg-purple-200/80 text-purple-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {packages.filter((p) => getPackageSection(p) === "Fixed").length}
            </span>
          </a>
          <a
            href="/admin/treks?type=treks"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition shadow-2xs"
          >
            <span>🏔️ Himalayan Treks</span>
            <span className="bg-emerald-200/80 text-emerald-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {packages.filter((p) => getPackageSection(p) === "Trek").length}
            </span>
          </a>
        </div>
      </div>

      {/* Top Executive KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">
            <span>Total Customers</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{metrics.totalCustomers}</div>
          <div className="text-[11px] text-slate-400 mt-1">Full database records</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-cyan-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">
            <span>Pipeline Leads</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-cyan-700">{metrics.leadsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active leads & prospects</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">
            <span>Proposals Created</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-700">{metrics.totalProposals}</div>
          <div className="text-[11px] text-slate-400 mt-1">Itinerary vouchers issued</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">
            <span>Customer Lifetime Val</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-amber-700 truncate">{formatCurrency(metrics.totalCLV)}</div>
          <div className="text-[11px] text-slate-400 mt-1">Aggregated booking spend</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-300 transition-colors col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">
            <span>Pending Follow-ups</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-orange-600">{metrics.pendingTasks}</div>
          <div className="text-[11px] text-slate-400 mt-1">Calls & actions due</div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => changeTab("directory")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "directory"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Customer Directory</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === "directory" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {filteredCustomers.length}
            </span>
          </button>

          <button
            onClick={() => changeTab("itinerary-builder")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "itinerary-builder"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>✨ Itinerary Studio</span>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                activeTab === "itinerary-builder" ? "bg-white/20 text-white" : "bg-purple-100 text-purple-800"
              }`}
            >
              Creator
            </span>
          </button>

          <button
            onClick={() => changeTab("proposals")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "proposals"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>📄 Saved Proposals</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === "proposals" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {proposals.length}
            </span>
          </button>

          <button
            onClick={() => changeTab("recycle-bin")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "recycle-bin"
                ? "bg-rose-700 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>♻️ Recycle Bin</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === "recycle-bin" ? "bg-white/20 text-white" : "bg-rose-100 text-rose-700"
              }`}
            >
              {recycledProposals.length}
            </span>
          </button>

          <button
            onClick={() => changeTab("kanban")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "kanban"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Pipeline Kanban</span>
          </button>

          <button
            onClick={() => changeTab("tasks")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "tasks"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Follow-Up Tasks</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === "tasks" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {tasks.length}
            </span>
          </button>

          <button
            onClick={() => changeTab("audit")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "audit"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
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
          {/* Search, Filter Toolbar & Density Controls */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer name, phone, email, city, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns and Layout Controls */}
            <div className="flex items-center gap-2 flex-wrap justify-between xl:justify-end">
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
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
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
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
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
                >
                  <option value="All">All Loyalty Tiers</option>
                  <option value="Explorer (Bronze)">Explorer (Bronze)</option>
                  <option value="Summiteer (Silver)">Summiteer (Silver)</option>
                  <option value="Alpinist (Gold)">Alpinist (Gold)</option>
                  <option value="Legend (Platinum)">Legend (Platinum)</option>
                </select>

                {(search || stageFilter !== "All" || priorityFilter !== "All" || tierFilter !== "All") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setStageFilter("All");
                      setPriorityFilter("All");
                      setTierFilter("All");
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition flex items-center gap-1"
                    title="Clear All Filters"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Density Toggle (Spacious vs Compact) */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 ml-auto xl:ml-0">
                <button
                  type="button"
                  onClick={() => setDensity("comfortable")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    density === "comfortable"
                      ? "bg-white text-emerald-800 shadow-2xs font-extrabold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Comfortable Spacious Layout"
                >
                  Spacious
                </button>
                <button
                  type="button"
                  onClick={() => setDensity("compact")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    density === "compact"
                      ? "bg-white text-emerald-800 shadow-2xs font-extrabold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Compact Density"
                >
                  Compact
                </button>
              </div>
            </div>
          </div>

          {/* Customer Table - Spacious, Modern, Zero Awkward Text Wrapping */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-xs min-w-[1020px]">
                <thead className="bg-slate-50/90 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200/90 select-none">
                  <tr>
                    <th className="py-3 px-4 w-[28%]">Customer Details</th>
                    <th className="py-3 px-3.5 w-[16%]">Lifecycle Stage</th>
                    <th className="py-3 px-3.5 w-[16%]">Loyalty & Priority</th>
                    <th className="py-3 px-3.5 w-[14%]">Spend & Trips</th>
                    <th className="py-3 px-3.5 w-[14%]">Assigned Agent</th>
                    <th className="py-3 px-4 w-[12%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
                        Loading customer registry...
                      </td>
                    </tr>
                  ) : filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400">
                        <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        No customer records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => (
                      <tr
                        key={cust.id}
                        className="hover:bg-emerald-50/30 transition-colors group cursor-pointer"
                        onClick={() => setSelectedCustomerId(cust.id)}
                      >
                        {/* Customer Details */}
                        <td className={`${density === "compact" ? "py-2 px-4" : "py-3.5 px-4"}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0 select-none">
                              {cust.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 text-xs sm:text-[13px] group-hover:text-emerald-700 transition-colors flex items-center gap-1.5 truncate">
                                <span className="truncate">{cust.name}</span>
                                {cust.idProofVerified && (
                                  <span title="ID Verified" className="text-emerald-600 font-bold text-xs shrink-0">
                                    ✓
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-1.5 mt-0.5">
                                <span className="font-semibold text-slate-600">{cust.phone}</span>
                                <span className="text-slate-300">•</span>
                                <span className="truncate">{cust.city}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Lifecycle Stage */}
                        <td className={`${density === "compact" ? "py-2 px-3.5" : "py-3.5 px-3.5"} whitespace-nowrap`}>
                          <div className="flex flex-col gap-1 items-start">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap shadow-2xs ${getStageBadgeClasses(
                                cust.lifecycleStage
                              )}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  cust.status === "Active"
                                    ? "bg-emerald-500"
                                    : cust.status === "Follow-Up Needed"
                                    ? "bg-amber-500"
                                    : "bg-slate-400"
                                }`}
                              />
                              <span>{cust.lifecycleStage}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium pl-1">
                              Status: {cust.status}
                            </span>
                          </div>
                        </td>

                        {/* Loyalty & Priority */}
                        <td className={`${density === "compact" ? "py-2 px-3.5" : "py-3.5 px-3.5"} whitespace-nowrap`}>
                          <div className="flex flex-col gap-1 items-start">
                            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span>{getTierIcon(cust.loyaltyTier)}</span>
                              <span>{cust.loyaltyTier.split(" ")[0]}</span>
                            </div>
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${getPriorityBadgeClasses(
                                cust.priority
                              )}`}
                            >
                              {cust.priority}
                            </span>
                          </div>
                        </td>

                        {/* Spend & Trips */}
                        <td className={`${density === "compact" ? "py-2 px-3.5" : "py-3.5 px-3.5"} whitespace-nowrap`}>
                          <div className="font-extrabold text-slate-900 text-xs sm:text-[13px]">
                            {formatCurrency(cust.totalSpent)}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {cust.totalTrips} {cust.totalTrips === 1 ? "trip" : "trips"}
                          </div>
                        </td>

                        {/* Assigned Agent */}
                        <td className={`${density === "compact" ? "py-2 px-3.5" : "py-3.5 px-3.5"} whitespace-nowrap`}>
                          <div className="text-xs text-slate-800 font-bold flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {(cust.assignedTo || "U").charAt(0).toUpperCase()}
                            </span>
                            <span className="truncate max-w-[110px]">{cust.assignedTo || "Unassigned"}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 pl-6.5 mt-0.5">
                            via {cust.source}
                          </div>
                        </td>

                        {/* Quick Actions */}
                        <td className={`${density === "compact" ? "py-2 px-4" : "py-3.5 px-4"} text-right whitespace-nowrap`} onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`https://wa.me/${cleanPhoneForWhatsApp(cust.phone)}?text=Hi%20${encodeURIComponent(
                                cust.name
                              )},%20greetings%20from%20KRADIND%20Adventures!%20How%20can%20we%20assist%20your%20next%20expedition?`}
                              target="_blank"
                              rel="noreferrer"
                              title="Chat on WhatsApp"
                              className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200/90 flex items-center justify-center transition-colors shadow-2xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`tel:${cust.phone}`}
                              title="Direct Phone Call"
                              className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200/90 flex items-center justify-center transition-colors shadow-2xs"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => setSelectedCustomerId(cust.id)}
                              title="Open Customer 360 Profile"
                              className="h-8 px-2.5 rounded-lg bg-slate-900 hover:bg-[#0F3A2E] text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-emerald-400" />
                              <span>View 360</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                              title="Delete Record"
                              className="w-8 h-8 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
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

      {/* TAB: ITINERARY & QUOTATION STUDIO */}
      <div style={{ display: activeTab === "itinerary-builder" ? "block" : "none" }}>
        <ItineraryStudio
          packages={packages}
          customers={customers}
          initialProposal={builderProposal}
          onSave={handleSaveProposal}
          onPreview={handlePreviewProposal}
          onWhatsApp={handleWhatsAppProposal}
          onReset={() => {
            setBuilderProposal(null);
          }}
          saving={savingProposal}
        />
      </div>

      {/* TAB: SAVED PROPOSALS ARCHIVE */}
      {activeTab === "proposals" && (
        <SavedProposalsArchive
          proposals={proposals}
          onPreview={handlePreviewProposal}
          onWhatsApp={handleWhatsAppProposal}
          onEdit={handleEditProposal}
          onDelete={handleDeleteProposal}
          onStatusChange={handleProposalStatusChange}
          onCreateNew={() => {
            setBuilderProposal(null);
            changeTab("itinerary-builder");
          }}
        />
      )}

      {/* TAB: RECYCLE BIN FOR PROPOSALS & ITINERARIES */}
      {activeTab === "recycle-bin" && (
        <div className="space-y-4">
          {/* Header & Controls Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                  <Trash2 className="w-4 h-4" />
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Proposal &amp; Itinerary Recycle Bin
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  {recycledProposals.length} Items
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Drafts and proposals deleted from your pipeline are archived here safely. You can restore them anytime or purge permanently.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleEmptyRecycleBin}
                disabled={recycledProposals.length === 0}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
                title="Permanently remove all items in recycle bin"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Empty Recycle Bin</span>
              </button>
            </div>
          </div>

          {/* Recycled List */}
          {recycledProposals.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Recycle Bin is Empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No draft proposals or customer itineraries are currently in the recycle bin. Active proposals are safe in your main archive.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recycledProposals.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white rounded-2xl border border-rose-200 hover:border-rose-300 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    {/* Header: ID & Status */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-[11px] font-bold text-slate-500">{prop.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        Recycled
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                      {prop.packageTitle}
                    </h3>
                    <div className="text-xs font-semibold text-slate-700 mt-1 flex items-center gap-1.5">
                      <span>Traveler:</span>
                      <span className="text-slate-800 font-bold">{prop.customerName}</span>
                    </div>

                    {/* Meta details */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-medium mt-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{prop.destination || "Destination TBD"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{prop.duration || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{prop.adultsCount} Pax</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{prop.packageType || "Package"}</span>
                      </div>
                    </div>

                    {/* Commercials Box */}
                    <div className="bg-slate-50 rounded-xl p-3 mt-3 flex items-center justify-between border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Quoted Price</span>
                        <span className="text-sm font-black text-slate-900">{formatCurrency(prop.totalQuotedPrice)}</span>
                      </div>
                      {prop.recycledAt && (
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Recycled On</span>
                          <span className="text-[11px] font-semibold text-slate-600">
                            {new Date(prop.recycledAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 text-xs">
                    <button
                      onClick={() => handleRestoreProposal(prop.id, prop.packageTitle)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                      title="Restore proposal back to active drafts"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePreviewProposal(prop)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Preview Proposal Voucher"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handlePermanentDeleteProposal(prop.id, prop.packageTitle)}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 font-bold border border-rose-200 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Permanently Delete (Cannot be undone)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Destroy</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: PIPELINE KANBAN BOARD */}
      {activeTab === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 overflow-x-auto pb-4">
          {(
            [
              {
                stage: "Lead" as CustomerLifecycleStage,
                label: "1. Inbound Leads",
                color: "text-cyan-800 bg-cyan-100 border-cyan-200",
              },
              {
                stage: "Prospect" as CustomerLifecycleStage,
                label: "2. Warm Prospects",
                color: "text-amber-800 bg-amber-100 border-amber-200",
              },
              {
                stage: "First-Time Explorer" as CustomerLifecycleStage,
                label: "3. First-Time Explorers",
                color: "text-blue-800 bg-blue-100 border-blue-200",
              },
              {
                stage: "Repeat Customer" as CustomerLifecycleStage,
                label: "4. Repeat Trekkers",
                color: "text-emerald-800 bg-emerald-100 border-emerald-200",
              },
              {
                stage: "VIP Explorer" as CustomerLifecycleStage,
                label: "5. VIP Expeditionists",
                color: "text-purple-800 bg-purple-100 border-purple-200",
              },
            ] as const
          ).map((col) => {
            const columnCustomers = customers.filter((c) => c.lifecycleStage === col.stage);
            const columnValue = columnCustomers.reduce((acc, curr) => acc + (curr.totalSpent || 0), 0);

            return (
              <div
                key={col.stage}
                className="bg-slate-100/90 rounded-2xl border border-slate-200 p-3.5 flex flex-col min-h-[580px]"
              >
                {/* Column Header */}
                <div className="pb-3 border-b border-slate-200 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-800">{col.label}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${col.color}`}
                    >
                      {columnCustomers.length}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-1">
                    Value: {formatCurrency(columnValue)}
                  </div>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[620px] pr-1">
                  {columnCustomers.length === 0 ? (
                    <div className="h-28 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium">
                      Empty stage
                    </div>
                  ) : (
                    columnCustomers.map((cust) => (
                      <div
                        key={cust.id}
                        onClick={() => setSelectedCustomerId(cust.id)}
                        className="p-3.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                            {cust.name}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${getPriorityBadgeClasses(cust.priority)}`}>
                            {cust.priority}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 font-medium mb-2 truncate">
                          {cust.phone} • {cust.city}
                        </div>

                        {cust.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2.5">
                            {cust.tags.slice(0, 2).map((t, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          <span className="font-bold text-emerald-700">{formatCurrency(cust.totalSpent)}</span>
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={`https://wa.me/${cleanPhoneForWhatsApp(cust.phone)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 transition-colors border border-emerald-200"
                            >
                              <MessageSquare className="w-3 h-3" />
                            </a>
                            <select
                              value={cust.lifecycleStage}
                              onChange={(e) =>
                                handleQuickStageChange(cust.id, e.target.value as CustomerLifecycleStage)
                              }
                              className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 focus:outline-none"
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
            <div className="text-xs text-slate-500 font-medium">
              Manage proactive customer touches, quotation check-ins, medical form requests, and post-trek feedback calls.
            </div>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Follow-Up</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tasks.length === 0 ? (
              <div className="col-span-3 py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-50" />
                No follow-up tasks currently pending. You are all caught up!
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all ${
                    task.status === "Completed"
                      ? "bg-slate-50 border-slate-200 opacity-60"
                      : "bg-white border-slate-200 hover:border-emerald-400 shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleTaskStatus(task)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          task.status === "Completed"
                            ? "bg-emerald-600 border-emerald-500 text-white"
                            : "border-slate-300 hover:border-emerald-600 text-transparent"
                        }`}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </button>
                      <h4
                        className={`text-xs font-bold text-slate-900 ${
                          task.status === "Completed" ? "line-through text-slate-400" : ""
                        }`}
                      >
                        {task.title}
                      </h4>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${getPriorityBadgeClasses(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  <div className="pl-7 space-y-1 text-xs text-slate-500">
                    <div className="font-bold text-slate-800 flex items-center gap-1">
                      <span>👤 {task.customerName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>Due: {task.dueDate}</span>
                      <span>•</span>
                      <span>Assigned: {task.assignedTo}</span>
                    </div>
                  </div>

                  {task.customerPhone && (
                    <div className="mt-3 pl-7 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                      <a
                        href={`https://wa.me/${cleanPhoneForWhatsApp(task.customerPhone)}?text=Hi%20${encodeURIComponent(
                          task.customerName
                        )},%20following%20up%20regarding%20your%20adventure%20inquiry%20with%20KRADIND!`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1 border border-emerald-200"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp Customer</span>
                      </a>
                      <a
                        href={`tel:${task.customerPhone}`}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-600 text-blue-800 hover:text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1 border border-blue-200"
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
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Enterprise CRM & RBAC Audit Trail</span>
              </h3>
              <p className="text-xs text-slate-500">
                Immutable chronological log of all customer modifications, role assignments, and interactions.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {auditLogs.length} Events Logged
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {auditLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">No audit events recorded yet.</div>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.actorName}</span>
                      <span className="text-[10px] text-slate-400">({log.actorEmail})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {log.action}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white text-slate-600 border border-slate-200">
                        {log.targetEntity}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">{log.details}</div>
                  </div>
                  <div className="text-[11px] text-slate-400 font-semibold whitespace-nowrap">
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
      {/* CUSTOMER 360 FULL POPUP PANEL (FULL PROFILE & HISTORY) */}
      {/* ========================================================= */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 bg-black/75 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedCustomerId(null)}
        >
          <div
            className={`w-full ${
              isModalExpanded
                ? "h-full max-h-none rounded-none max-w-none"
                : "max-w-6xl xl:max-w-7xl h-[92vh] max-h-[95vh] rounded-3xl"
            } bg-white border border-slate-200/90 flex flex-col shadow-2xl overflow-hidden animate-scale-up text-slate-800 transition-all duration-200`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Forest green brand gradient */}
            <div className="px-6 py-5 bg-gradient-to-r from-[#0a2f24] via-[#0F3A2E] to-[#124235] text-white flex items-center justify-between shadow-sm relative shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg ring-2 ring-white/20 shrink-0">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {selectedCustomer.name}
                    </h2>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono font-bold tracking-wider">
                      {selectedCustomer.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${getPriorityBadgeClasses(
                        selectedCustomer.priority
                      )}`}
                    >
                      {selectedCustomer.priority} Priority
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${getStageBadgeClasses(
                        selectedCustomer.lifecycleStage
                      )}`}
                    >
                      {selectedCustomer.lifecycleStage}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-200 flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                      {selectedCustomer.city}, {selectedCustomer.state || "India"}
                    </span>
                    <span>•</span>
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {selectedCustomer.loyaltyTier}
                    </span>
                    <span>•</span>
                    <span className="text-slate-200 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-300" />
                      Assigned: {selectedCustomer.assignedTo || "Unassigned"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalExpanded(!isModalExpanded)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title={isModalExpanded ? "Exit Fullscreen" : "Fullscreen Panel"}
                >
                  {isModalExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCustomerId(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Action Ribbon */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 overflow-x-auto text-xs shrink-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <a
                  href={`https://wa.me/${cleanPhoneForWhatsApp(selectedCustomer.phone)}?text=Hi%20${encodeURIComponent(
                    selectedCustomer.name
                  )},%20greetings%20from%20KRADIND%20Adventures!`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
                <a
                  href={`tel:${selectedCustomer.phone}`}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedCustomer.phone}</span>
                </a>
                {selectedCustomer.email && (
                  <a
                    href={`mailto:${selectedCustomer.email}`}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl flex items-center gap-2 transition-colors border border-slate-200 shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email ({selectedCustomer.email})</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleStartProposalForCustomer(selectedCustomer)}
                  className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                  <span>Create Itinerary Proposal</span>
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-500 font-medium text-xs">Customer Status:</span>
                <span
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                    selectedCustomer.status === "Active"
                      ? "bg-emerald-100 text-emerald-800"
                      : selectedCustomer.status === "Won"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {selectedCustomer.status}
                </span>
              </div>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 bg-white border-b border-slate-200 text-xs shrink-0">
              <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100 text-center">
                <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Total Spend</div>
                <div className="font-extrabold text-amber-900 text-base mt-0.5">
                  {formatCurrency(selectedCustomer.totalSpent)}
                </div>
              </div>
              <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-center">
                <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Trips Taken</div>
                <div className="font-extrabold text-emerald-900 text-base mt-0.5">
                  {selectedCustomer.totalTrips} Treks
                </div>
              </div>
              <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-center">
                <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Touchpoints</div>
                <div className="font-extrabold text-blue-900 text-base mt-0.5">
                  {customerTimeline.length || selectedCustomer.notesCount || 0} Logs
                </div>
              </div>
              <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100 text-center">
                <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Lead Source</div>
                <div className="font-bold text-purple-900 text-xs truncate mt-1">
                  {selectedCustomer.source || "Direct Entry"}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assigned Agent</div>
                <div className="font-bold text-slate-800 text-xs truncate mt-1">
                  {selectedCustomer.assignedTo || "Unassigned"}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dietary / Health</div>
                <div className="font-bold text-slate-800 text-xs truncate mt-1">
                  {selectedCustomer.dietaryPreference || "Standard"}
                </div>
              </div>
            </div>

            {/* Subtabs Header */}
            <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50/80 shrink-0 overflow-x-auto">
              <button
                type="button"
                onClick={() => setDrawerTab("timeline")}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  drawerTab === "timeline"
                    ? "border-emerald-600 text-emerald-800 bg-emerald-50/30"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Timeline History</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-mono">
                  {customerTimeline.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDrawerTab("collab")}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  drawerTab === "collab"
                    ? "border-emerald-600 text-emerald-800 bg-emerald-50/30"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Multi-Agent Notes & Handover</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-mono">
                  {collabMessages.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDrawerTab("medical")}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  drawerTab === "medical"
                    ? "border-emerald-600 text-emerald-800 bg-emerald-50/30"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <span>Medical & Emergency Info</span>
              </button>

              <button
                type="button"
                onClick={() => setDrawerTab("edit")}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  drawerTab === "edit"
                    ? "border-emerald-600 text-emerald-800 bg-emerald-50/30"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Edit3 className="w-4 h-4 text-blue-500" />
                <span>Profile & Lifecycle Settings</span>
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/60">
              {/* SUBTAB 1: TIMELINE HISTORY */}
              {drawerTab === "timeline" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Form + Quick Info */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Log Touchpoint Form */}
                    <form
                      onSubmit={handleAddTimelineLog}
                      className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5 text-emerald-600" />
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
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                newLogType === item.type
                                  ? "bg-emerald-600 text-white shadow-xs"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Brief headline (e.g. Discussed Chadar trek acclimatization, sent itinerary)"
                        value={newLogTitle}
                        onChange={(e) => setNewLogTitle(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />

                      <textarea
                        placeholder="Detailed notes or customer feedback..."
                        rows={3}
                        value={newLogDesc}
                        onChange={(e) => setNewLogDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
                      />

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={submittingLog || !newLogTitle.trim()}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>{submittingLog ? "Logging..." : "Save Interaction"}</span>
                        </button>
                      </div>
                    </form>

                    {/* Quick Customer Profile Card */}
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5 text-xs">
                      <div className="font-extrabold text-slate-900 text-xs border-b border-slate-100 pb-2">
                        Quick Dossier
                      </div>
                      <div className="space-y-1.5 text-slate-600">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Phone:</span>
                          <span className="font-bold text-slate-800">{selectedCustomer.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Email:</span>
                          <span className="font-bold text-slate-800">{selectedCustomer.email || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Location:</span>
                          <span className="font-bold text-slate-800">{selectedCustomer.city}, {selectedCustomer.state || "India"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tags:</span>
                          <span className="font-bold text-emerald-700">{selectedCustomer.tags?.join(", ") || "General"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Timeline Stream */}
                  <div className="lg:col-span-7 space-y-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Touchpoints & Interactions ({customerTimeline.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const fetchTimeline = async () => {
                            setLoadingTimeline(true);
                            try {
                              const res = await fetch(`/api/admin/crm/timeline?customerId=${selectedCustomerId}`);
                              if (res.ok) setCustomerTimeline(await res.json());
                            } finally {
                              setLoadingTimeline(false);
                            }
                          };
                          fetchTimeline();
                        }}
                        className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3 h-3 ${loadingTimeline ? "animate-spin" : ""}`} />
                        <span>Refresh</span>
                      </button>
                    </div>

                    <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
                      {loadingTimeline ? (
                        <div className="py-12 text-center text-slate-400 text-xs">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
                          Loading interaction history...
                        </div>
                      ) : customerTimeline.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200 p-6">
                          No activity recorded for this customer yet. Use the form on the left to log the first call or note!
                        </div>
                      ) : (
                        customerTimeline.map((item) => (
                          <div key={item.id} className="relative pl-7 group">
                            <div className="absolute left-1.5 top-2.5 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-xs" />
                            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                                <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">
                                  {new Date(item.timestamp).toLocaleString("en-IN", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              {item.description && <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>}
                              <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400 font-semibold">
                                <span>Logged by: <strong className="text-slate-600">{item.author}</strong></span>
                                <span>•</span>
                                <span className="uppercase tracking-wider px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                                  {item.type.replace("_", " ")}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: MULTI-AGENT INTERNAL NOTES & HANDOVER */}
              {drawerTab === "collab" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Handover Form + Persona + Note Input */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Lead Handover Box */}
                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                          <span>Multi-Agent Lead Handover</span>
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Current: <strong className="text-slate-800">{selectedCustomer.assignedTo || "Unassigned"}</strong>
                        </span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Transfer Case To
                          </label>
                          <select
                            value={handoverAgent}
                            onChange={(e) => setHandoverAgent(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                          >
                            <option value="Vikram Rawat">Vikram Rawat (Operations Manager)</option>
                            <option value="Priya Sharma">Priya Sharma (Sales / CRM Agent)</option>
                            <option value="Tashi Dorje">Tashi Dorje (Expedition Leader)</option>
                            <option value="Admin User">Admin User (Super Admin)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Handover Instructions / Note
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Quotation accepted, verify hotel slot..."
                            value={handoverNote}
                            onChange={(e) => setHandoverNote(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleTransferLead}
                        disabled={submittingHandover}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                      >
                        {submittingHandover ? "Transferring..." : `Transfer Case to ${handoverAgent}`}
                      </button>
                    </div>

                    {/* Speaking Persona Switcher */}
                    <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <span className="font-bold text-slate-600 text-[11px] block">Post Internal Note As:</span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "admin-sales", name: "Priya Sharma", role: "Sales / CRM Agent" as AdminRole },
                          { id: "admin-ops", name: "Vikram Rawat", role: "Operations Manager" as AdminRole },
                          { id: "admin-guide", name: "Tashi Dorje", role: "Expedition Leader" as AdminRole },
                          { id: "admin-root", name: "Admin User", role: "Super Admin" as AdminRole },
                        ].map((p) => {
                          const isSelected = collabPersona.name === p.name;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setCollabPersona(p)}
                              className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all border text-left ${
                                isSelected
                                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-200"
                              }`}
                            >
                              <div>{p.name}</div>
                              <div className={`text-[9px] font-normal ${isSelected ? "text-slate-300" : "text-slate-500"}`}>{p.role}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Post Internal Note Input */}
                    <form onSubmit={handlePostCollabNote} className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        New Internal Discussion Note
                      </label>
                      <textarea
                        rows={3}
                        value={collabInput}
                        onChange={(e) => setCollabInput(e.target.value)}
                        placeholder={`Add internal note as ${collabPersona.name} (e.g. @Vikram Rawat cab quotes finalized)...`}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
                      />
                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          disabled={!collabInput.trim()}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5"
                        >
                          <Send className="w-3 h-3" />
                          <span>Post Note</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Right Column: Discussion Thread */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Internal Discussion Thread ({collabMessages.length})
                      </span>
                    </div>

                    <div className="space-y-3">
                      {loadingCollab ? (
                        <div className="py-12 text-center text-slate-400 text-xs">Loading notes...</div>
                      ) : collabMessages.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200 p-6">
                          No internal multi-agent notes recorded for this customer yet. Post the first one using the form on the left!
                        </div>
                      ) : (
                        collabMessages.map((m: any) => (
                          <div key={m.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900">{m.senderName}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${getRoleBadgeClasses(m.senderRole)}`}>
                                  {m.senderRole}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {new Date(m.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })} •{" "}
                                {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">{m.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: MEDICAL & EMERGENCY */}
              {drawerTab === "medical" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  {/* Emergency Contact */}
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-xs font-bold text-rose-700 flex items-center gap-2 border-b border-rose-100 pb-3">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>Primary Emergency Contact</span>
                    </h3>

                    {selectedCustomer.emergencyContact?.name ? (
                      <div className="space-y-3 text-xs">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Person</div>
                          <div className="font-bold text-slate-900 text-sm mt-0.5">
                            {selectedCustomer.emergencyContact.name}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Relationship</div>
                          <div className="font-semibold text-slate-700 mt-0.5">
                            {selectedCustomer.emergencyContact.relation || "Family"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Emergency Phone</div>
                          <a
                            href={`tel:${selectedCustomer.emergencyContact.phone}`}
                            className="font-bold text-emerald-700 hover:underline mt-0.5 block text-sm"
                          >
                            📞 {selectedCustomer.emergencyContact.phone}
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic py-4">
                        No emergency contact provided yet. You can add it in the Profile & Lifecycle tab.
                      </div>
                    )}
                  </div>

                  {/* Dietary & Clothing Requirements */}
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-xs font-bold text-amber-700 flex items-center gap-2 border-b border-amber-100 pb-3">
                      <HeartPulse className="w-4 h-4 text-amber-600" />
                      <span>Dietary & Expedition Sizing</span>
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Dietary Preference:
                        </span>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">
                          {selectedCustomer.dietaryPreference || "Vegetarian"}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          T-Shirt / Expedition Layer Size:
                        </span>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedCustomer.tShirtSize || "L"}</div>
                      </div>
                    </div>
                  </div>

                  {/* High Altitude & Medical Conditions */}
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-xs font-bold text-blue-700 flex items-center gap-2 border-b border-blue-100 pb-3">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>Medical Conditions & Altitude Alerts</span>
                    </h3>
                    <div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        {selectedCustomer.medicalNotes ||
                          "No past medical alerts or asthma/cardiac contraindications recorded for this traveler."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 4: EDIT PROFILE & LIFECYCLE */}
              {drawerTab === "edit" && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900">Edit Customer 360 Information</h3>
                    <p className="text-xs text-slate-500">Update lifecycle stages, tags, emergency details, and sales assignments.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editFormData.name !== undefined ? editFormData.name : selectedCustomer.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={editFormData.phone !== undefined ? editFormData.phone : selectedCustomer.phone}
                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editFormData.email !== undefined ? editFormData.email : selectedCustomer.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Lifecycle Stage
                      </label>
                      <select
                        value={editFormData.lifecycleStage || selectedCustomer.lifecycleStage}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            lifecycleStage: e.target.value as CustomerLifecycleStage,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
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
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Status</label>
                      <select
                        value={editFormData.status || selectedCustomer.status}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, status: e.target.value as CustomerStatus })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                      >
                        <option value="Active">Active</option>
                        <option value="Follow-Up Needed">Follow-Up Needed</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                        <option value="Dormant">Dormant</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Priority Level
                      </label>
                      <select
                        value={editFormData.priority || selectedCustomer.priority}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, priority: e.target.value as any })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent / VIP">Urgent / VIP</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Loyalty Tier
                      </label>
                      <select
                        value={editFormData.loyaltyTier || selectedCustomer.loyaltyTier}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, loyaltyTier: e.target.value as LoyaltyTier })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                      >
                        <option value="Explorer (Bronze)">Explorer (Bronze)</option>
                        <option value="Summiteer (Silver)">Summiteer (Silver)</option>
                        <option value="Alpinist (Gold)">Alpinist (Gold)</option>
                        <option value="Legend (Platinum)">Legend (Platinum)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">City</label>
                      <input
                        type="text"
                        value={editFormData.city !== undefined ? editFormData.city : selectedCustomer.city}
                        onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Assigned Agent
                      </label>
                      <input
                        type="text"
                        value={
                          editFormData.assignedTo !== undefined
                            ? editFormData.assignedTo
                            : selectedCustomer.assignedTo
                        }
                        onChange={(e) => setEditFormData({ ...editFormData, assignedTo: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      Medical / Dietary Notes
                    </label>
                    <textarea
                      rows={2}
                      value={
                        editFormData.medicalNotes !== undefined
                          ? editFormData.medicalNotes
                          : selectedCustomer.medicalNotes || ""
                      }
                      onChange={(e) => setEditFormData({ ...editFormData, medicalNotes: e.target.value })}
                      placeholder="Allergies, past high-altitude AMS notes, dietary preferences..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleUpdateCustomer}
                      disabled={savingEdit}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative space-y-4 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Register New Customer</span>
              </h3>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Phone (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9797941414"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    placeholder="rahul.v@gmail.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    placeholder="Delhi / Dehradun"
                    value={newCustomer.city}
                    onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Stage</label>
                  <select
                    value={newCustomer.lifecycleStage}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        lifecycleStage: e.target.value as CustomerLifecycleStage,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Prospect">Prospect</option>
                    <option value="First-Time Explorer">First-Time Explorer</option>
                    <option value="Repeat Customer">Repeat Customer</option>
                    <option value="VIP Explorer">VIP Explorer</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Priority</label>
                  <select
                    value={newCustomer.priority}
                    onChange={(e) => setNewCustomer({ ...newCustomer, priority: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent / VIP">Urgent / VIP</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Loyalty Tier</label>
                  <select
                    value={newCustomer.loyaltyTier}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, loyaltyTier: e.target.value as LoyaltyTier })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="Explorer (Bronze)">Bronze</option>
                    <option value="Summiteer (Silver)">Silver</option>
                    <option value="Alpinist (Gold)">Gold</option>
                    <option value="Legend (Platinum)">Platinum</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Kashmir Great Lakes, High Spender, Corporate"
                  value={newCustomer.tags}
                  onChange={(e) => setNewCustomer({ ...newCustomer, tags: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Schedule Follow-Up Task</span>
              </h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Select Customer *
                </label>
                <select
                  required
                  value={newTask.customerId}
                  onChange={(e) => setNewTask({ ...newTask, customerId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
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
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Task Objective *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Call to finalize Rupin Pass batch slot"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
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
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Branded Proposal Voucher Modal */}
      <ProposalVoucherModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        proposal={previewProposal}
      />
    </div>
  );
}
