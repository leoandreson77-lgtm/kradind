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

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admins = await getAdminUsersAsync();
    // Strip sensitive passwordHash and salt before returning
    const safeUsers = admins.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role || "Super Admin",
      department: u.department || "Executive",
      status: u.status || "Active",
      permissions: u.permissions || ["all"],
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
    let defaultPerms: string[] = body.permissions;
    if (!defaultPerms || defaultPerms.length === 0) {
      if (role === "Super Admin") defaultPerms = ["all"];
      else if (role === "Operations Manager")
        defaultPerms = ["crm:read", "crm:write", "bookings:manage", "radar:manage", "cms:edit", "treks:manage"];
      else if (role === "Sales / CRM Agent")
        defaultPerms = ["crm:read", "crm:write", "leads:manage", "bookings:read", "bookings:write"];
      else if (role === "Expedition Leader")
        defaultPerms = ["crm:read", "bookings:read", "radar:manage"];
    }

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
    const updatedUser: AdminUser = {
      ...existing,
      name: body.name !== undefined ? body.name : existing.name,
      role: body.role !== undefined ? body.role : existing.role,
      department: body.department !== undefined ? body.department : existing.department,
      status: body.status !== undefined ? body.status : existing.status,
      permissions: body.permissions !== undefined ? body.permissions : existing.permissions,
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
