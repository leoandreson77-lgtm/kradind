"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Check,
  CheckCircle2,
  Compass,
  Copy,
  Edit2,
  Eye,
  EyeOff,
  Headphones,
  KeyRound,
  Lock,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Sliders,
  Sparkles,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { AdminUser, AdminRole } from "@/lib/cms-store";

import {
  SYSTEM_AUTHORITIES,
  DEFAULT_PERMISSIONS_BY_ROLE,
  normalizeUserPermissions,
  AuthorityItem,
} from "@/lib/authorities";

const renderAuthorityIcon = (key: string, isEnabled: boolean) => {
  const iconClass = `w-4 h-4 transition-colors ${isEnabled ? "text-emerald-700" : "text-slate-500"}`;
  switch (key) {
    case "view_all_reports":
      return <Compass className={iconClass} />;
    case "manage_sales":
      return <KeyRound className={iconClass} />;
    case "manage_payments":
      return <ShieldCheck className={iconClass} />;
    case "manage_operations":
      return <Sliders className={iconClass} />;
    case "manage_leads":
      return <Headphones className={iconClass} />;
    case "itinerary_studio":
      return <Edit2 className={iconClass} />;
    case "cms_editor":
      return <Shield className={iconClass} />;
    case "user_management":
      return <Users className={iconClass} />;
    default:
      return <ShieldCheck className={iconClass} />;
  }
};

function AuthoritySwitchSection({
  title = "Authority & Permissions (Enable / Disable)",
  subtitle = "Enable or disable individual system capabilities for this staff member.",
  selectedKeys,
  assignedRole,
  onChange,
}: {
  title?: string;
  subtitle?: string;
  selectedKeys: string[];
  assignedRole: AdminRole;
  onChange: (keys: string[]) => void;
}) {
  const enabledCount = SYSTEM_AUTHORITIES.filter((a) => selectedKeys.includes(a.key)).length;
  const pct = Math.round((enabledCount / SYSTEM_AUTHORITIES.length) * 100);

  const handleToggle = (key: string) => {
    if (selectedKeys.includes(key)) {
      onChange(selectedKeys.filter((k) => k !== key));
    } else {
      onChange([...selectedKeys, key]);
    }
  };

  const handleEnableAll = () => {
    onChange(SYSTEM_AUTHORITIES.map((a) => a.key));
  };

  const handleDisableAll = () => {
    onChange([]);
  };

  const handleResetDefault = () => {
    onChange(DEFAULT_PERMISSIONS_BY_ROLE[assignedRole] || []);
  };

  return (
    <div className="space-y-3 pt-3 border-t border-slate-200">
      {/* Section Header with Quick Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
              <span>{title}</span>
            </span>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              {enabledCount} of {SYSTEM_AUTHORITIES.length} Enabled ({pct}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleEnableAll}
            className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 transition-colors cursor-pointer"
          >
            ✓ Enable All (8)
          </button>
          <button
            type="button"
            onClick={handleDisableAll}
            className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
          >
            ✕ Disable All
          </button>
          <button
            type="button"
            onClick={handleResetDefault}
            className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300 transition-colors cursor-pointer"
          >
            ↺ Role Default
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Grid of Authority Cards with iOS Toggle Switches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {SYSTEM_AUTHORITIES.map((auth) => {
          const isEnabled = selectedKeys.includes(auth.key);
          return (
            <div
              key={auth.key}
              onClick={() => handleToggle(auth.key)}
              className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3.5 cursor-pointer select-none ${
                isEnabled
                  ? "bg-emerald-50/70 border-emerald-500 shadow-2xs ring-1 ring-emerald-500/30"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    isEnabled
                      ? "bg-emerald-100 border border-emerald-300 text-emerald-800 shadow-2xs"
                      : "bg-slate-100 border border-slate-200 text-slate-500"
                  }`}
                >
                  {renderAuthorityIcon(auth.key, isEnabled)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-xs leading-tight ${
                        isEnabled ? "font-bold text-emerald-950" : "font-semibold text-slate-700"
                      }`}
                    >
                      {auth.label}
                    </span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        isEnabled
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {auth.tag}
                    </span>
                  </div>
                  <p
                    className={`text-[10.5px] mt-0.5 leading-snug line-clamp-2 ${
                      isEnabled ? "text-emerald-900/80 font-medium" : "text-slate-400"
                    }`}
                  >
                    {auth.desc}
                  </p>
                </div>
              </div>

              {/* iOS Toggle Switch + Explicit Text Badge */}
              <div className="flex items-center gap-2.5 shrink-0">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md transition-colors ${
                    isEnabled
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isEnabled ? "✓ ENABLED" : "✕ DISABLED"}
                </span>

                <div
                  className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex items-center p-0.5 ${
                    isEnabled ? "bg-emerald-600 shadow-2xs" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 transform ${
                      isEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState("");

  // Modals & Inline form
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInlineAdd, setShowInlineAdd] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Password Reset state
  const [resetModalUser, setResetModalUser] = useState<AdminUser | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // In edit modal: optional new password field
  const [editNewPassword, setEditNewPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Helper: Generate strong temporary password
  const generateStrongPassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
    const specials = "@#$!";
    let pass = "Kradind@" + Math.floor(100 + Math.random() * 900);
    for (let i = 0; i < 2; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    pass += specials.charAt(Math.floor(Math.random() * specials.length));
    return pass;
  };

  const handleCopyCredentials = (email: string, pass: string) => {
    const text = `KRADIND Staff Login Credentials\nPortal: https://kradind.com/admin/login\nEmail: ${email}\nPassword: ${pass}`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "Sales & Inquiries",
    role: "Sales / CRM Agent" as AdminRole,
    status: "Active" as "Active" | "Suspended",
    permissions: DEFAULT_PERMISSIONS_BY_ROLE["Sales / CRM Agent"],
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
        const rawUsers: AdminUser[] = await res.json();
        const mapped = rawUsers.map((u) => ({
          ...u,
          permissions: normalizeUserPermissions(u.permissions, u.role),
        }));
        setUsers(mapped);
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
        setShowInlineAdd(false);
        setNewUser({
          name: "",
          email: "",
          password: "",
          phone: "",
          department: "Sales & Inquiries",
          role: "Sales / CRM Agent",
          status: "Active",
          permissions: DEFAULT_PERMISSIONS_BY_ROLE["Sales / CRM Agent"],
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
      const payload: any = { ...editingUser };
      if (editNewPassword.trim()) {
        if (editNewPassword.trim().length < 6) {
          alert("New password must be at least 6 characters long.");
          return;
        }
        payload.password = editNewPassword.trim();
      }

      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(`Updated profile & permissions for ${editingUser.name}`);
        setShowEditModal(false);
        setEditingUser(null);
        setEditNewPassword("");
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update member");
      }
    } catch {
      alert("Error updating team member");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser) return;
    if (!newPasswordValue || newPasswordValue.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    setResetLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: resetModalUser.id,
          password: newPasswordValue.trim(),
        }),
      });

      if (res.ok) {
        showToast(`Password successfully reset for ${resetModalUser.name}!`);
        setResetModalUser(null);
        setNewPasswordValue("");
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to reset password");
      }
    } catch {
      alert("Network error resetting password");
    } finally {
      setResetLoading(false);
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
            type="button"
            onClick={() => setShowInlineAdd((prev) => !prev)}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 border cursor-pointer ${
              showInlineAdd
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200"
            }`}
          >
            <UserPlus className="w-4 h-4 text-emerald-600" />
            <span>{showInlineAdd ? "✕ Close On-Page Form" : "+ Create Staff On-Page"}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>+ Add Staff (Modal)</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DIRECT ON-PAGE STAFF CREATOR (NO MODAL NEEDED) */}
      {/* ========================================================= */}
      {showInlineAdd && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-500 shadow-xl space-y-5 animate-fade-in">
          <div className="flex items-start justify-between pb-4 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Direct On-Page Creator
                </span>
                <span className="text-xs text-slate-400 font-semibold">• Full-Width &amp; Uncramped</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Create New Staff Member &amp; Authorize System Access
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quickly provision an administrative staff login, configure role presets, and toggle individual feature authorities.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowInlineAdd(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0 cursor-pointer"
              title="Close form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Negi"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Staff Work Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="vikram@kradind.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Temporary Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Assigned Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => {
                    const newRole = e.target.value as AdminRole;
                    setNewUser({
                      ...newUser,
                      role: newRole,
                      permissions: DEFAULT_PERMISSIONS_BY_ROLE[newRole] || [],
                    });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                >
                  <option value="Sales / CRM Agent">Sales / CRM Agent</option>
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Expedition Leader">Expedition Leader</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Authority Switch Section with iOS Sliders */}
            <AuthoritySwitchSection
              title="Individual System Permissions (Enable / Disable)"
              subtitle="Click any card or toggle slider to activate/deactivate capabilities for this user."
              selectedKeys={newUser.permissions}
              assignedRole={newUser.role}
              onChange={(keys) => setNewUser({ ...newUser, permissions: keys })}
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowInlineAdd(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save &amp; Create Staff Account</span>
              </button>
            </div>
          </form>
        </div>
      )}

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
                      <div className="flex flex-col gap-1.5 max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {(user.permissions || []).length} / {SYSTEM_AUTHORITIES.length} Enabled
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {SYSTEM_AUTHORITIES.map((auth) => {
                            const isEnabled = (user.permissions || []).includes(auth.key);
                            return (
                              <span
                                key={auth.key}
                                title={`${auth.label}: ${isEnabled ? "ENABLED" : "DISABLED"}`}
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
                                  isEnabled
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                    : "bg-slate-100 text-slate-400 border-slate-200 line-through opacity-60"
                                }`}
                              >
                                {auth.tag}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setResetModalUser(user);
                            setNewPasswordValue(generateStrongPassword());
                            setShowPasswordText(true);
                          }}
                          title="Reset Staff Password"
                          className="p-2 rounded-xl bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white transition-colors border border-amber-200 cursor-pointer shadow-2xs"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingUser({
                              ...user,
                              permissions: normalizeUserPermissions(user.permissions, user.role),
                            });
                            setEditNewPassword("");
                            setShowEditModal(true);
                          }}
                          title="Edit Role & Permissions"
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {user.email !== "admin@kradind.com" && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            title="Remove Member"
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 transition-colors cursor-pointer"
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
      {/* ========================================================= */}
      {/* MODAL: ADD TEAM MEMBER */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl relative flex flex-col text-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-600" />
                  <span>Invite New Staff Member</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Provision new team credentials and grant custom module permissions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateUser} className="flex flex-col flex-1 min-h-0">
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
                <div>
                  <label className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Negi"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">
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
                    <label className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Assigned Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => {
                        const newRole = e.target.value as AdminRole;
                        setNewUser({
                          ...newUser,
                          role: newRole,
                          permissions: DEFAULT_PERMISSIONS_BY_ROLE[newRole] || [],
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                    >
                      <option value="Sales / CRM Agent">Sales / CRM Agent</option>
                      <option value="Operations Manager">Operations Manager</option>
                      <option value="Expedition Leader">Expedition Leader</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Department</label>
                    <input
                      type="text"
                      value={newUser.department}
                      onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Phone / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Authority Enable / Disable Section with iOS Sliders */}
                <AuthoritySwitchSection
                  title="Authority & Permissions (Enable / Disable)"
                  subtitle="Enable or disable individual system capabilities for this staff member."
                  selectedKeys={newUser.permissions}
                  assignedRole={newUser.role}
                  onChange={(keys) => setNewUser({ ...newUser, permissions: keys })}
                />
              </div>

              {/* Sticky / Pinned Footer */}
              <div className="p-3.5 px-5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition-colors shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl relative flex flex-col text-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-emerald-600" />
                  <span>Edit Staff Permissions: {editingUser.name}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update role assignment, account status, and individual system permission toggles.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleUpdateUser} className="flex flex-col flex-1 min-h-0">
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
                <div>
                  <label className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Role</label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => {
                        const newRole = e.target.value as AdminRole;
                        setEditingUser({
                          ...editingUser,
                          role: newRole,
                          permissions: DEFAULT_PERMISSIONS_BY_ROLE[newRole] || editingUser.permissions,
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Operations Manager">Operations Manager</option>
                      <option value="Sales / CRM Agent">Sales / CRM Agent</option>
                      <option value="Expedition Leader">Expedition Leader</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Department</label>
                    <input
                      type="text"
                      value={editingUser.department || ""}
                      onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                      Account Status
                    </label>
                    <select
                      value={editingUser.status || "Active"}
                      onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs mt-1 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                    >
                      <option value="Active">Active (Login Allowed)</option>
                      <option value="Suspended">Suspended (Login Blocked)</option>
                    </select>
                  </div>
                </div>

                {/* Optional Password Reset section inside Edit Modal */}
                <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/90 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-amber-950">Change Staff Password (Optional)</span>
                    </div>
                    <span className="text-[10px] text-amber-700 font-semibold">
                      Leave blank to keep existing password
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showEditPassword ? "text" : "password"}
                        placeholder="Enter new password (min. 6 chars)..."
                        value={editNewPassword}
                        onChange={(e) => setEditNewPassword(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 pr-10 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditPassword(!showEditPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title={showEditPassword ? "Hide password" : "Show password"}
                      >
                        {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const pass = generateStrongPassword();
                        setEditNewPassword(pass);
                        setShowEditPassword(true);
                      }}
                      className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl text-xs border border-amber-300 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>Auto-Generate</span>
                    </button>
                  </div>
                </div>

                {/* Authority Enable / Disable Section with iOS Sliders */}
                <AuthoritySwitchSection
                  title={`Authority & Permissions: ${editingUser.name}`}
                  subtitle={`Configure granular module access for ${editingUser.name}.`}
                  selectedKeys={editingUser.permissions || []}
                  assignedRole={editingUser.role || "Sales / CRM Agent"}
                  onChange={(keys) => setEditingUser({ ...editingUser, permissions: keys })}
                />
              </div>

              {/* Sticky / Pinned Footer */}
              <div className="p-3.5 px-5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    setEditNewPassword("");
                  }}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Save Member Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DEDICATED PASSWORD RESET */}
      {/* ========================================================= */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl relative flex flex-col text-slate-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-amber-50/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-2xs shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Reset Staff Password
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct password overwrite for {resetModalUser.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setResetModalUser(null);
                  setNewPasswordValue("");
                }}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              {/* User badge */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-xs truncate">
                    {resetModalUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {resetModalUser.email}
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 shrink-0">
                  {resetModalUser.role || "Staff Member"}
                </span>
              </div>

              {/* Password input & controls */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    New Temporary Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const pass = generateStrongPassword();
                      setNewPasswordValue(pass);
                      setShowPasswordText(true);
                    }}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPasswordText ? "text" : "password"}
                    required
                    value={newPasswordValue}
                    onChange={(e) => setNewPasswordValue(e.target.value)}
                    placeholder="Enter min. 6 characters..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPasswordText ? "Hide password" : "Show password"}
                  >
                    {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Copy helper */}
              {newPasswordValue && (
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <span className="text-[11px] text-emerald-800 font-semibold truncate">
                    Ready to share with {resetModalUser.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCredentials(resetModalUser.email, newPasswordValue)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 transition-colors shrink-0 cursor-pointer shadow-2xs"
                  >
                    {copiedNotification ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Login Info</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  The password will be hashed with a secure cryptographic salt. The team member must use this new password on their next login at <code className="bg-amber-100 px-1 py-0.2 rounded font-mono text-amber-950">/admin/login</code>.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setResetModalUser(null);
                    setNewPasswordValue("");
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {resetLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <KeyRound className="w-4 h-4" />
                  )}
                  <span>Save &amp; Reset Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
