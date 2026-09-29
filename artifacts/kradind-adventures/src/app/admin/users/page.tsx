"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Shield,
  ShieldCheck,
  UserPlus,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  Phone,
  Briefcase,
  KeyRound,
  Trash2,
  Edit2,
  RefreshCw,
  Sparkles,
  Check,
  X,
  Compass,
  Headphones,
  Sliders,
  Eye,
  FileText,
} from "lucide-react";
import { AdminUser, AdminRole } from "@/lib/cms-store";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "Sales & Inquiries",
    role: "Sales / CRM Agent" as AdminRole,
    status: "Active" as "Active" | "Suspended",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        setUsers(await res.json());
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to load team users");
      }
    } catch {
      showToast("Network error fetching team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Name, email and password are required.");
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        const created = await res.json();
        showToast(`Staff member ${created.name} invited!`);
        setShowAddModal(false);
        setNewUser({
          name: "",
          email: "",
          password: "",
          phone: "",
          department: "Sales & Inquiries",
          role: "Sales / CRM Agent",
          status: "Active",
        });
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add user");
      }
    } catch {
      alert("Error adding team user");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });

      if (res.ok) {
        showToast(`Updated permissions for ${editingUser.name}`);
        setShowEditModal(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update member");
      }
    } catch {
      alert("Error updating team member");
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from KRADIND staff access?`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showToast(`User ${name} removed from organization.`);
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to remove user");
      }
    } catch {
      alert("Deletion request failed");
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const nextStatus = user.status === "Active" ? "Suspended" : "Active";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, status: nextStatus }),
      });
      if (res.ok) {
        showToast(`${user.name} is now ${nextStatus}`);
        fetchUsers();
      }
    } catch {
      alert("Failed to toggle status");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.department || "").toLowerCase().includes(q) ||
        (u.phone || "").includes(q);

      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const getRoleBadge = (role?: AdminRole) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "Operations Manager":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "Sales / CRM Agent":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "Expedition Leader":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      default:
        return "bg-white/10 text-white/70 border-white/20";
    }
  };

  const getRoleIcon = (role?: AdminRole) => {
    switch (role) {
      case "Super Admin":
        return <ShieldCheck className="w-4 h-4 text-purple-400" />;
      case "Operations Manager":
        return <Sliders className="w-4 h-4 text-blue-400" />;
      case "Sales / CRM Agent":
        return <Headphones className="w-4 h-4 text-emerald-400" />;
      case "Expedition Leader":
        return <Compass className="w-4 h-4 text-amber-400" />;
      default:
        return <Users className="w-4 h-4 text-white/50" />;
    }
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
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Shield className="w-3 h-3 text-purple-400" /> RBAC & Security Control
            </span>
            <span className="text-white/40 text-xs">•</span>
            <span className="text-white/60 text-xs font-medium">Team Roles & Permission Hierarchy</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">KRADIND Staff & Access Management</h1>
          <p className="text-xs text-white/70 max-w-xl">
            Configure role-based access control (RBAC), department authorization boundaries, invite new adventure staff, and inspect permission matrices.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => fetchUsers()}
            title="Refresh Users"
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Team Member</span>
          </button>
        </div>
      </div>

      {/* Role Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="bg-[#0B231B]/60 p-4 rounded-xl border border-purple-500/20 backdrop-blur-md space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300">Super Admin</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-[11px] text-white/60">
            Unrestricted root authority. Manages team staff, customer deletes, payment reconciliation, and system keys.
          </div>
          <div className="text-[10px] text-purple-400/80 font-semibold pt-1">Permission: Full Unrestricted</div>
        </div>

        <div className="bg-[#0B231B]/60 p-4 rounded-xl border border-blue-500/20 backdrop-blur-md space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-300">Operations Manager</span>
            <Sliders className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-[11px] text-white/60">
            Ground expeditions control, departure batches, Trail Radar emergency updates, booking payments & customer registry.
          </div>
          <div className="text-[10px] text-blue-400/80 font-semibold pt-1">Permission: Ops & Logistics Master</div>
        </div>

        <div className="bg-[#0B231B]/60 p-4 rounded-xl border border-emerald-500/20 backdrop-blur-md space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300">Sales / CRM Agent</span>
            <Headphones className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-[11px] text-white/60">
            Inbound leads, WhatsApp touches, quotation dispatch, customer notes, pipeline advancement, and follow-up tasks.
          </div>
          <div className="text-[10px] text-emerald-400/80 font-semibold pt-1">Permission: CRM & Inquiries</div>
        </div>

        <div className="bg-[#0B231B]/60 p-4 rounded-xl border border-amber-500/20 backdrop-blur-md space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300">Expedition Leader</span>
            <Compass className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-[11px] text-white/60">
            Read-only batch rosters, customer medical alerts, emergency contacts, high-altitude notes, and live radar reports.
          </div>
          <div className="text-[10px] text-amber-400/80 font-semibold pt-1">Permission: Roster & Safety View</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0B231B]/40 p-3.5 rounded-xl border border-white/10 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search team member by name, email, department, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#05140F] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#05140F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Operations Manager">Operations Manager</option>
            <option value="Sales / CRM Agent">Sales / CRM Agent</option>
            <option value="Expedition Leader">Expedition Leader</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#0B231B]/40 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-[#05140F]/80 text-[11px] font-semibold text-white/50 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Permissions</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/50">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400" />
                    Loading team accounts...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/50">
                    No team members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.03] transition-colors">
                    {/* User */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-700 to-indigo-900 text-white flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.email === "admin@kradind.com" && (
                              <span title="Primary Root Account" className="text-purple-400 text-[10px] font-bold">
                                (Root)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-white/50 truncate flex items-center gap-2">
                            <span>{user.email}</span>
                            {user.phone && (
                              <>
                                <span>•</span>
                                <span>{user.phone}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {getRoleIcon(user.role)}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadge(user.role)}`}>
                          {user.role || "Super Admin"}
                        </span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4">
                      <span className="text-white/80 font-medium">{user.department || "Operations"}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        title="Click to toggle status"
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-opacity hover:opacity-80 ${
                          user.status === "Suspended"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status === "Suspended" ? "bg-red-400" : "bg-emerald-400"
                          }`}
                        />
                        <span>{user.status || "Active"}</span>
                      </button>
                    </td>

                    {/* Permissions */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(user.permissions || ["all"]).map((p, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-white/70 border border-white/10"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowEditModal(true);
                          }}
                          title="Edit Role & Permissions"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {user.email !== "admin@kradind.com" && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            title="Remove Member"
                            className="p-1.5 rounded-lg bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Visual Permissions Matrix */}
      <div className="bg-[#0B231B]/40 rounded-2xl border border-white/10 p-5 space-y-4">
        <div className="pb-3 border-b border-white/10">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>Interactive RBAC Permission Matrix</span>
          </h3>
          <p className="text-xs text-white/50">
            Authorization boundaries mapped across administrative capabilities and organizational roles.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-[#05140F]/80 text-[10px] text-white/50 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-2.5 px-3">System Module</th>
                <th className="py-2.5 px-3 text-purple-300 font-bold">Super Admin</th>
                <th className="py-2.5 px-3 text-blue-300 font-bold">Operations Manager</th>
                <th className="py-2.5 px-3 text-emerald-300 font-bold">Sales / CRM Agent</th>
                <th className="py-2.5 px-3 text-amber-300 font-bold">Expedition Leader</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[11px]">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white/80">CRM & Customer 360 Records</td>
                <td className="py-2.5 px-3 text-purple-300">✓ Full (Create, Edit, Delete)</td>
                <td className="py-2.5 px-3 text-blue-300">✓ Manage & Edit</td>
                <td className="py-2.5 px-3 text-emerald-300">✓ Log Notes & Stage</td>
                <td className="py-2.5 px-3 text-white/40">👁️ View Only (Roster)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white/80">Bookings & Payments Processing</td>
                <td className="py-2.5 px-3 text-purple-300">✓ Full Reconciliation</td>
                <td className="py-2.5 px-3 text-blue-300">✓ Manage Batches & Status</td>
                <td className="py-2.5 px-3 text-emerald-300">✓ Create & Quotations</td>
                <td className="py-2.5 px-3 text-white/40">👁️ View Participant List</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white/80">Inbound Leads & WhatsApp Hub</td>
                <td className="py-2.5 px-3 text-purple-300">✓ Full Control</td>
                <td className="py-2.5 px-3 text-blue-300">✓ View & Assign</td>
                <td className="py-2.5 px-3 text-emerald-300">✓ Primary Owner</td>
                <td className="py-2.5 px-3 text-white/30">— Restricted</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white/80">Mountain Trail Radar Alerts</td>
                <td className="py-2.5 px-3 text-purple-300">✓ Full Broadcast</td>
                <td className="py-2.5 px-3 text-blue-300">✓ Publish Ground Reports</td>
                <td className="py-2.5 px-3 text-white/40">👁️ View Trail Status</td>
                <td className="py-2.5 px-3 text-amber-300">✓ Submit Live Reports</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white/80">Medical & Emergency Profiles</td>
                <td className="py-2.5 px-3 text-purple-300">✓ View & Audit</td>
                <td className="py-2.5 px-3 text-blue-300">✓ Safety Verification</td>
                <td className="py-2.5 px-3 text-emerald-300">✓ Intake Collection</td>
                <td className="py-2.5 px-3 text-amber-300">✓ Vital On-Field Access</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white/80">Adventure CMS & Web Pages</td>
                <td className="py-2.5 px-3 text-purple-300">✓ Full Publisher</td>
                <td className="py-2.5 px-3 text-blue-300">✓ Itineraries & Dates</td>
                <td className="py-2.5 px-3 text-white/30">— Restricted</td>
                <td className="py-2.5 px-3 text-white/30">— Restricted</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white/80">Team Members & RBAC Control</td>
                <td className="py-2.5 px-3 text-purple-300">✓ Sole Administrator</td>
                <td className="py-2.5 px-3 text-white/30">— Restricted</td>
                <td className="py-2.5 px-3 text-white/30">— Restricted</td>
                <td className="py-2.5 px-3 text-white/30">— Restricted</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD TEAM MEMBER */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#081C15] border border-emerald-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Invite New Staff Member</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-white/60 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Negi"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-white/60 font-semibold">Staff Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="vikram@kradind.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-white/60 font-semibold">Temporary Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-white/60 font-semibold">Assigned Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminRole })}
                    className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none"
                  >
                    <option value="Sales / CRM Agent">Sales / CRM Agent</option>
                    <option value="Operations Manager">Operations Manager</option>
                    <option value="Expedition Leader">Expedition Leader</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-white/60 font-semibold">Department</label>
                  <input
                    type="text"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-white/60 font-semibold">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 00000"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-950"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT TEAM MEMBER */}
      {/* ========================================================= */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#081C15] border border-emerald-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-emerald-400" />
                <span>Edit Staff Permissions: {editingUser.name}</span>
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="p-1 rounded-lg text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-white/60 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-white/60 font-semibold">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as AdminRole })}
                    className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Operations Manager">Operations Manager</option>
                    <option value="Sales / CRM Agent">Sales / CRM Agent</option>
                    <option value="Expedition Leader">Expedition Leader</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-white/60 font-semibold">Department</label>
                  <input
                    type="text"
                    value={editingUser.department || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                    className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-white/60 font-semibold">Account Status</label>
                  <select
                    value={editingUser.status || "Active"}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-white/60 font-semibold">Phone</label>
                  <input
                    type="tel"
                    value={editingUser.phone || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full bg-[#05140F] border border-white/10 rounded-lg p-2 text-white text-xs mt-1 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-950"
                >
                  Save Member Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
