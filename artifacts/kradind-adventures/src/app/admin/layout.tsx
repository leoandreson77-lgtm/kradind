"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, render children directly without admin shell
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;

    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        if (res.ok) {
          const data = await res.json();
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
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Customer Leads", href: "/admin/leads", icon: Inbox },
    { label: "Treks CMS", href: "/admin/treks", icon: Mountain },
    { label: "Live Trail Radar", href: "/admin/radar", icon: Radio },
    { label: "Home Sections", href: "/admin/sections", icon: Sliders },
    { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800 font-sans">
      
      {/* Mobile Top Navigation */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0F3A2E] text-emerald-400 flex items-center justify-center font-bold text-sm">
            K
          </div>
          <span className="font-bold text-sm tracking-wide">KRADIND CMS</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-slate-900 text-slate-300 shrink-0 border-r border-slate-800 flex flex-col justify-between`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="hidden md:flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
            <div className="w-9 h-9 rounded-xl bg-[#0F3A2E] text-emerald-400 flex items-center justify-center font-extrabold text-base shadow-sm">
              K
            </div>
            <div>
              <div className="font-bold text-white text-sm tracking-wide">KRADIND</div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Admin CMS
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? "bg-[#0F3A2E] text-emerald-300 shadow-sm"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-emerald-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="px-2">
            <div className="text-xs font-semibold text-white truncate">
              {adminUser?.name || "Admin"}
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
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/40 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

    </div>
  );
}
