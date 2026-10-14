import { AdminRole } from "./cms-store";

export interface AuthorityItem {
  key: string;
  label: string;
  desc: string;
  category: string;
}

export const SYSTEM_AUTHORITIES: AuthorityItem[] = [
  {
    key: "view_all_reports",
    label: "View All Reports (Company-Wide Sabka)",
    desc: "View company-wide sales, operations, and all agents' leads (Super Admin view). If disabled, user only sees their own assigned records.",
    category: "Reports & Visibility",
  },
  {
    key: "manage_sales",
    label: "Sales & Bookings Management",
    desc: "Create bookings, manage customer orders, and convert commercial proposals.",
    category: "Sales & Commercials",
  },
  {
    key: "manage_payments",
    label: "Payment Updates & Proof Verification",
    desc: "Update payment status (Paid, Partial, Under Verification), enter UTR, and attach/view proof documents.",
    category: "Financials & Payments",
  },
  {
    key: "manage_operations",
    label: "Operations, Guides & Fleet",
    desc: "Assign trek leaders, dispatch chauffeur/vehicles, inspect equipment kits, and update trail progress.",
    category: "Ground Operations",
  },
  {
    key: "manage_leads",
    label: "Inbound Leads & Interaction Logging",
    desc: "View leads, log interactions (Call, WhatsApp, Email, Notes), and track engagement frequency.",
    category: "CRM & Leads",
  },
  {
    key: "itinerary_studio",
    label: "Itinerary Studio & PDF Builder",
    desc: "Build custom day-by-day itineraries, generate branded PDF vouchers, and share WhatsApp quotes.",
    category: "Itineraries",
  },
  {
    key: "cms_editor",
    label: "CMS & Adventure Packages",
    desc: "Create, edit and publish trek packages, itineraries, hero banners, and seasonal specials.",
    category: "Content Management",
  },
  {
    key: "user_management",
    label: "Staff Accounts & Login Control",
    desc: "Create staff users, configure authority permissions, activate/suspend logins, and reset passwords.",
    category: "System Admin",
  },
];

export const VALID_AUTHORITY_KEYS = SYSTEM_AUTHORITIES.map((a) => a.key);

export const DEFAULT_PERMISSIONS_BY_ROLE: Record<AdminRole, string[]> = {
  "Super Admin": [
    "view_all_reports",
    "manage_sales",
    "manage_payments",
    "manage_operations",
    "manage_leads",
    "itinerary_studio",
    "cms_editor",
    "user_management",
  ],
  "Operations Manager": [
    "view_all_reports",
    "manage_operations",
    "manage_sales",
    "manage_leads",
    "itinerary_studio",
  ],
  "Sales / CRM Agent": [
    "manage_sales",
    "manage_leads",
    "manage_payments",
    "itinerary_studio",
  ],
  "Expedition Leader": [
    "manage_operations",
  ],
};

export function normalizeUserPermissions(perms?: string[], role?: AdminRole): string[] {
  if (!perms || perms.length === 0) {
    return DEFAULT_PERMISSIONS_BY_ROLE[role || "Sales / CRM Agent"] || [];
  }
  if (perms.includes("all")) {
    return SYSTEM_AUTHORITIES.map((a) => a.key);
  }

  const validKeys = new Set(SYSTEM_AUTHORITIES.map((a) => a.key));
  const result = new Set<string>();

  for (const p of perms) {
    if (validKeys.has(p)) {
      result.add(p);
    } else if (p.startsWith("crm") || p.startsWith("leads")) {
      result.add("manage_leads");
      result.add("manage_sales");
    } else if (p.startsWith("bookings")) {
      result.add("manage_sales");
      result.add("manage_payments");
    } else if (p.startsWith("radar") || p.startsWith("treks")) {
      result.add("manage_operations");
    } else if (p.startsWith("cms")) {
      result.add("cms_editor");
    }
  }

  if (result.size === 0 && role && DEFAULT_PERMISSIONS_BY_ROLE[role]) {
    return [...DEFAULT_PERMISSIONS_BY_ROLE[role]];
  }

  return Array.from(result);
}
