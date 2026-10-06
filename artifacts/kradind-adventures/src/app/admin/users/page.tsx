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

  const getRoleBadgeClasses = (role?: AdminRole) => {
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

  const getRoleIcon = (role?: AdminRole) => {
    switch (role) {
      case "Super Admin":
        return <ShieldCheck className="w-4 h-4 text-purple-600" />;
      case "Operations Manager":
        return <Sliders className="w-4 h-4 text-blue-600" />;
      case "Sales / CRM Agent":
        return <Headphones className="w-4 h-4 text-emerald-600" />;
      case "Expedition Leader":
        return <Compass className="w-4 h-4 text-amber-600" />;
      default:
        return <Users className="w-4 h-4 text-slate-500" />;
    }
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

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-600" /> RBAC & Security Control
            </span>
            <span className="text-slate-300 text-xs">•</span>
            <span className="text-slate-500 text-xs font-medium">Team Roles & Permission Hierarchy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Staff & Access Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Configure role-based access control (RBAC), department authorization boundaries, invite new adventure staff,
            and inspect live permission matrices.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => fetchUsers()}
            title="Refresh Users"
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Team Member</span>
          </button>
        </div>
      </div>

      {/* Role Architecture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-purple-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-900">Super Admin</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Unrestricted root authority. Manages team staff, customer deletes, payment reconciliation, and system keys.
          </div>
          <div className="text-[10px] text-purple-700 font-bold pt-1">Permission: Full Unrestricted</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-blue-900">Operations Manager</span>
            <Sliders className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Ground expeditions control, departure batches, Trail Radar emergency updates, booking payments & customer registry.
          </div>
          <div className="text-[10px] text-blue-700 font-bold pt-1">Permission: Ops & Logistics Master</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-900">Sales / CRM Agent</span>
            <Headphones className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Inbound leads, WhatsApp touches, quotation dispatch, customer notes, pipeline advancement, and follow-up tasks.
          </div>
          <div className="text-[10px] text-emerald-700 font-bold pt-1">Permission: CRM & Inquiries</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-900">Expedition Leader</span>
            <Compass className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Read-only batch rosters, customer medical alerts, emergency contacts, high-altitude notes, and live radar reports.
          </div>
          <div className="text-[10px] text-amber-700 font-bold pt-1">Permission: Roster & Safety View</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search team member by name, email, department, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-600"
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
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Permissions</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
                    Loading team accounts...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    No team members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* User */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 to-indigo-900 text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.email === "admin@kradind.com" && (
                              <span title="Primary Root Account" className="text-purple-700 text-[10px] font-bold">
                                (Root)
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-medium truncate flex items-center gap-1.5 mt-0.5">
                            <span>{user.email}</span>
                            {user.phone && (
                              <>
                                <span className="text-slate-300">•</span>
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
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getRoleBadgeClasses(
                            user.role
                          )}`}
                        >
                          {user.role || "Super Admin"}
                        </span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4">
                      <span className="text-slate-800 font-bold text-xs">{user.department || "Operations"}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        title="Click to toggle status"
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-opacity hover:opacity-80 border ${
                          user.status === "Suspended"
                            ? "bg-rose-100 text-rose-800 border-rose-200"
                            : "bg-emerald-100 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status === "Suspended" ? "bg-rose-500" : "bg-emerald-500"
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
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
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
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {user.email !== "admin@kradind.com" && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            title="Remove Member"
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 transition-colors"
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
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <span>Interactive RBAC Permission Matrix</span>
          </h3>
          <p className="text-xs text-slate-500">
            Authorization boundaries mapped across administrative capabilities and organizational roles.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">System Module</th>
                <th className="py-2.5 px-3 text-purple-900 font-bold">Super Admin</th>
                <th className="py-2.5 px-3 text-blue-900 font-bold">Operations Manager</th>
                <th className="py-2.5 px-3 text-emerald-900 font-bold">Sales / CRM Agent</th>
                <th className="py-2.5 px-3 text-amber-900 font-bold">Expedition Leader</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">CRM & Customer 360 Records</td>
                <td className="py-2.5 px-3 text-purple-700 font-bold">✓ Full (Create, Edit, Delete)</td>
                <td className="py-2.5 px-3 text-blue-700 font-bold">✓ Manage & Edit</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">✓ Log Notes & Stage</td>
                <td className="py-2.5 px-3 text-slate-400">👁️ View Only (Roster)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">Bookings & Payments Processing</td>
                <td className="py-2.5 px-3 text-purple-700 font-bold">✓ Full Reconciliation</td>
                <td className="py-2.5 px-3 text-blue-700 font-bold">✓ Manage Batches & Status</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">✓ Create & Quotations</td>
                <td className="py-2.5 px-3 text-slate-400">👁️ View Participant List</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">Inbound Leads & WhatsApp Hub</td>
                <td className="py-2.5 px-3 text-purple-700 font-bold">✓ Full Control</td>
                <td className="py-2.5 px-3 text-blue-700 font-bold">✓ View & Assign</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">✓ Primary Owner</td>
                <td className="py-2.5 px-3 text-slate-300">— Restricted</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">Mountain Trail Radar Alerts</td>
                <td className="py-2.5 px-3 text-purple-700 font-bold">✓ Full Broadcast</td>
                <td className="py-2.5 px-3 text-blue-700 font-bold">✓ Publish Ground Reports</td>
                <td className="py-2.5 px-3 text-slate-400">👁️ View Trail Status</td>
                <td className="py-2.5 px-3 text-amber-700 font-bold">✓ Submit Live Reports</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">Medical & Emergency Profiles</td>
                <td className="py-2.5 px-3 text-purple-700 font-bold">✓ View & Audit</td>
                <td className="py-2.5 px-3 text-blue-700 font-bold">✓ Safety Verification</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">✓ Intake Collection</td>
                <td className="py-2.5 px-3 text-amber-700 font-bold">✓ Vital On-Field Access</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">Adventure CMS & Web Pages</td>
                <td className="py-2.5 px-3 text-purple-700 font-bold">✓ Full Publisher</td>
                <td className="py-2.5 px-3 text-blue-700 font-bold">✓ Itineraries & Dates</td>
                <td className="py-2.5 px-3 text-slate-300">— Restricted</td>
                <td className="py-2.5 px-3 text-slate-300">— Restricted</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">Team Members & RBAC Control</td>
                <td className="py-2.5 px-3 text-purple-700 font-bold">✓ Sole Administrator</td>
                <td className="py-2.5 px-3 text-slate-300">— Restricted</td>
                <td className="py-2.5 px-3 text-slate-300">— Restricted</td>
                <td className="py-2.5 px-3 text-slate-300">— Restricted</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD TEAM MEMBER */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <span>Invite New Staff Member</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Negi"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Staff Work Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="vikram@kradind.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Temporary Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Assigned Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminRole })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="Sales / CRM Agent">Sales / CRM Agent</option>
                    <option value="Operations Manager">Operations Manager</option>
                    <option value="Expedition Leader">Expedition Leader</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Department</label>
                  <input
                    type="text"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 9797941414"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-emerald-600" />
                <span>Edit Staff Permissions: {editingUser.name}</span>
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as AdminRole })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Operations Manager">Operations Manager</option>
                    <option value="Sales / CRM Agent">Sales / CRM Agent</option>
                    <option value="Expedition Leader">Expedition Leader</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Department</label>
                  <input
                    type="text"
                    value={editingUser.department || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Account Status
                  </label>
                  <select
                    value={editingUser.status || "Active"}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Phone</label>
                  <input
                    type="tel"
                    value={editingUser.phone || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
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
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
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
