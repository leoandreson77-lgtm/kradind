"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Mountain,
  Radio,
  Sliders,
  CalendarCheck,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Inbox,
  Sparkles,
  MapPin,
  Globe,
  Users,
  UserCheck,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<{
    id?: string;
    name: string;
    email: string;
    role?: string;
    department?: string;
    permissions?: string[];
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kradind_admin_sidebar_collapsed");
      if (saved === "true") setSidebarCollapsed(true);
    }
  }, []);

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("kradind_admin_sidebar_collapsed", String(next));
      }
      return next;
    });
  };

  // If on login page, render children directly without admin shell
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;

    let isMounted = true;
    async function checkAuth() {
      try {
        const savedToken = typeof window !== "undefined" ? localStorage.getItem("kradind_admin_token") : null;
        const headers: Record<string, string> = {};
        if (savedToken) {
          headers["x-admin-token"] = savedToken;
          headers["Authorization"] = `Bearer ${savedToken}`;
        }

        const res = await fetch("/api/admin/auth", {
          credentials: "include",
          headers,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.token && typeof window !== "undefined") {
            try {
              localStorage.setItem("kradind_admin_token", data.token);
            } catch {}
          }
          if (isMounted) {
            setAuthenticated(true);
            setAdminUser(data.user);
          }
        } else {
          if (isMounted) {
            setAuthenticated(false);
            router.push("/admin/login");
          }
        }
      } catch {
        if (isMounted) {
          setAuthenticated(false);
          router.push("/admin/login");
        }
      }
    }
    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400 text-sm">
          <svg className="animate-spin h-6 w-6 text-[#FF6B35]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Authenticating Session...</span>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("kradind_admin_token");
      }
      await fetch("/api/admin/auth", { method: "DELETE", credentials: "include" });
      router.push("/admin/login");
    } catch {
      if (typeof window !== "undefined") {
        localStorage.removeItem("kradind_admin_token");
      }
      router.push("/admin/login");
    }
  };

  const [currentQuery, setCurrentQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentQuery(window.location.search || "");
    }
  }, [pathname]);

  const navGroups = [
    {
      group: "OPERATIONS & CRM",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "CRM & Customers", href: "/admin/crm", icon: Users, badge: "New" },
        { label: "Customer Leads", href: "/admin/leads", icon: Inbox },
        { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
      ],
    },
    {
      group: "PACKAGES MANAGEMENT",
      items: [
        { label: "🏔️ Trek Packages", href: "/admin/treks?type=treks", icon: Mountain, badge: "Treks" },
        { label: "🏖️ Destination Packages", href: "/admin/treks?type=domestic", icon: MapPin, badge: "Tours" },
        { label: "📍 Destinations Explorer", href: "/admin/destinations", icon: Sparkles },
        { label: "🌐 International CMS", href: "/admin/international", icon: Globe },
      ],
    },
    {
      group: "CONTENT & MARKETING",
      items: [
        { label: "Landing Pages", href: "/admin/landing-pages", icon: Sparkles },
        { label: "Live Trail Radar", href: "/admin/radar", icon: Radio },
        { label: "Home Sections", href: "/admin/sections", icon: Sliders },
      ],
    },
    {
      group: "TEAM & SYSTEM",
      items: [
        { label: "Team Internal Chat", href: "/admin/chat", icon: MessageSquare, badge: "Live" },
        { label: "Team & RBAC", href: "/admin/users", icon: UserCheck },
        { label: "Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  const isItemActive = (href: string) => {
    const [targetPath, targetQuery] = href.split("?");
    if (pathname !== targetPath) return false;
    if (!targetQuery) {
      if (pathname === "/admin/treks") {
        return !currentQuery || currentQuery.includes("type=treks");
      }
      return true;
    }
    return currentQuery.includes(targetQuery);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800 font-sans">
      
      {/* Mobile Top Navigation */}
      <div className="md:hidden sticky top-0 z-30 bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-sm print:hidden">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo-emblem.webp"
            alt="KRAD Global tour and travel company logo"
            width={32}
            height={32}
            className="w-7 h-7 object-contain"
          />
          <span className="font-bold text-sm tracking-wide">KRADIND CMS</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity print:hidden"
        />
      )}

      {/* Admin Sidebar - Permanently FIXED on Desktop with Collapsible Width, Smooth Slide Drawer on Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out print:hidden ${
          sidebarOpen
            ? "translate-x-0 shadow-2xl w-64"
            : `-translate-x-full md:translate-x-0 ${sidebarCollapsed ? "md:w-20" : "md:w-64"}`
        }`}
      >
        <div>
          {/* Logo & Brand */}
          <div
            className={`flex items-center ${
              sidebarCollapsed ? "justify-center px-3" : "justify-between px-5"
            } py-4 border-b border-slate-800/80 transition-all`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Image
                src="/logo-emblem.webp"
                alt="KRAD Global tour and travel company logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain drop-shadow-sm shrink-0"
              />
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <div className="font-bold text-white text-sm tracking-wide truncate">KRADIND</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" /> Admin Portal
                  </div>
                </div>
              )}
            </div>

            {/* Mobile close button inside drawer */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop collapse toggle */}
            {!sidebarCollapsed && (
              <button
                onClick={toggleSidebarCollapse}
                className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Collapse sidebar for wider workspace"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Desktop Expand Icon Button when collapsed */}
          {sidebarCollapsed && (
            <div className="hidden md:flex justify-center py-2 border-b border-slate-800/50">
              <button
                onClick={toggleSidebarCollapse}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Navigation Groups */}
          <nav className="p-3 space-y-4">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {!sidebarCollapsed && (
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-300">
                    {group.group}
                  </div>
                )}
                {group.items.map((item) => {
                  const active = isItemActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        setSidebarOpen(false);
                        const [, q] = item.href.split("?");
                        setCurrentQuery(q ? `?${q}` : "");
                      }}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`flex items-center ${
                        sidebarCollapsed ? "justify-center px-2 py-2" : "justify-between px-3 py-2"
                      } rounded-xl text-xs font-semibold transition ${
                        active
                          ? "bg-[#0F3A2E] text-emerald-300 shadow-sm border border-emerald-500/30"
                          : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                      }`}
                    >
                      <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-2.5"}`}>
                        <Icon className={`w-4 h-4 shrink-0 ${active ? "text-emerald-400" : "text-slate-400"}`} />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!sidebarCollapsed && item.badge && (
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shrink-0 ${
                            item.badge === "Treks"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : item.badge === "Tours"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-slate-700/60 text-slate-300"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* User Info & Footer Actions */}
        <div className={`p-3 border-t border-slate-800/80 space-y-2 shrink-0 bg-slate-900`}>
          {!sidebarCollapsed ? (
            <>
              <div className="px-2 space-y-1">
                <div className="flex items-center justify-between gap-1.5">
                  <div className="text-xs font-bold text-white truncate">
                    {adminUser?.name || "Head of Expeditions"}
                  </div>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    {adminUser?.role || "Super Admin"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {adminUser?.email || "admin@kradind.com"}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span>View Public Site</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/40 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/"
                target="_blank"
                title="View Public Site"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area - with responsive offset respecting collapsible sidebar */}
      <main
        className={`flex-1 min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        } p-3 sm:p-5 lg:p-6 print:m-0 print:p-0 print:ml-0 print:w-full`}
      >
        {children}
      </main>

    </div>
  );
}
