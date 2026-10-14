import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getAdminUsersAsync,
  saveAdminUserAsync,
  deleteAdminUserAsync,
  hashPassword,
  AdminUser,
  AdminRole,
} from "@/lib/cms-store";

const VALID_AUTHORITY_KEYS = [
  "view_all_reports",
  "manage_sales",
  "manage_payments",
  "manage_operations",
  "manage_leads",
  "itinerary_studio",
  "cms_editor",
  "user_management",
];

const DEFAULT_ROLE_PERMS: Record<string, string[]> = {
  "Super Admin": VALID_AUTHORITY_KEYS,
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
  "Expedition Leader": ["manage_operations"],
};

function normalizePermissions(perms?: string[], role?: string): string[] {
  if (!perms || perms.length === 0) {
    return DEFAULT_ROLE_PERMS[role || "Sales / CRM Agent"] || [];
  }
  if (perms.includes("all")) {
    return [...VALID_AUTHORITY_KEYS];
  }

  const result = new Set<string>();
  for (const p of perms) {
    if (VALID_AUTHORITY_KEYS.includes(p)) {
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

  if (result.size === 0 && role && DEFAULT_ROLE_PERMS[role]) {
    return [...DEFAULT_ROLE_PERMS[role]];
  }

  return Array.from(result);
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admins = await getAdminUsersAsync();
    // Strip sensitive passwordHash and salt before returning, and normalize permissions
    const safeUsers = admins.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role || "Super Admin",
      department: u.department || "Executive",
      status: u.status || "Active",
      permissions: normalizePermissions(u.permissions, u.role),
      phone: u.phone || "",
      avatar: u.avatar || "",
      lastLogin: u.lastLogin || "",
      createdAt: u.createdAt,
    }));

    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error("Admin Users GET error:", error);
    return NextResponse.json({ error: "Failed to fetch admin users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // RBAC: Only Super Admin can invite/add new team members
    const userRole = session.user?.role || "Super Admin";
    if (userRole !== "Super Admin") {
      return NextResponse.json(
        { error: "Access Denied: Only Super Admin can add team members." },
        { status: 403 }
      );
    }

    const body = await request.json();
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const admins = await getAdminUsersAsync();
    const existing = admins.find(
      (a) => a.email.toLowerCase() === body.email.toLowerCase().trim()
    );
    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 400 }
      );
    }

    const { hash, salt } = hashPassword(body.password);
    const role: AdminRole = body.role || "Sales / CRM Agent";

    // Set default permissions based on role if not explicitly provided
    const defaultPerms: string[] = normalizePermissions(body.permissions, role);

    const newUser: AdminUser = {
      id: `admin-${Date.now().toString().slice(-4)}`,
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      role,
      department: body.department || "Operations",
      status: body.status || "Active",
      permissions: defaultPerms,
      phone: body.phone?.trim() || "",
      passwordHash: hash,
      salt,
      createdAt: new Date().toISOString(),
    };

    const saved = await saveAdminUserAsync(newUser, session.user?.name || "Super Admin");
    return NextResponse.json(
      {
        id: saved.id,
        name: saved.name,
        email: saved.email,
        role: saved.role,
        department: saved.department,
        status: saved.status,
        permissions: saved.permissions,
        phone: saved.phone,
        createdAt: saved.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin Users POST error:", error);
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // RBAC: Only Super Admin can edit roles and permissions
    const userRole = session.user?.role || "Super Admin";
    if (userRole !== "Super Admin") {
      return NextResponse.json(
        { error: "Access Denied: Only Super Admin can modify team roles and permissions." },
        { status: 403 }
      );
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const admins = await getAdminUsersAsync();
    const existing = admins.find((a) => a.id === body.id);
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update fields
    const updatedRole = body.role !== undefined ? body.role : existing.role;
    const updatedPerms =
      body.permissions !== undefined
        ? normalizePermissions(body.permissions, updatedRole)
        : normalizePermissions(existing.permissions, updatedRole);

    const updatedUser: AdminUser = {
      ...existing,
      name: body.name !== undefined ? body.name : existing.name,
      role: updatedRole,
      department: body.department !== undefined ? body.department : existing.department,
      status: body.status !== undefined ? body.status : existing.status,
      permissions: updatedPerms,
      phone: body.phone !== undefined ? body.phone : existing.phone,
    };

    // If new password provided, rehash
    if (body.password && body.password.length >= 6) {
      const { hash, salt } = hashPassword(body.password);
      updatedUser.passwordHash = hash;
      updatedUser.salt = salt;
    }

    const saved = await saveAdminUserAsync(updatedUser, session.user?.name || "Super Admin");
    return NextResponse.json({
      id: saved.id,
      name: saved.name,
      email: saved.email,
      role: saved.role,
      department: saved.department,
      status: saved.status,
      permissions: saved.permissions,
      phone: saved.phone,
    });
  } catch (error) {
    console.error("Admin Users PUT error:", error);
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user?.role || "Super Admin";
    if (userRole !== "Super Admin") {
      return NextResponse.json(
        { error: "Access Denied: Only Super Admin can delete team members." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    try {
      await deleteAdminUserAsync(id, session.user?.name || "Super Admin");
      return NextResponse.json({ success: true, message: "User deleted successfully" });
    } catch (err: any) {
      return NextResponse.json({ error: err?.message || "Failed to delete user" }, { status: 400 });
    }
  } catch (error) {
    console.error("Admin Users DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
