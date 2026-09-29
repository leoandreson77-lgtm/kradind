import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getCustomersAsync,
  saveCustomerAsync,
  deleteCustomerAsync,
  CustomerRecord,
} from "@/lib/cms-store";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();
    const stage = searchParams.get("stage");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const assignedTo = searchParams.get("assignedTo");
    const tier = searchParams.get("tier");

    let customers = await getCustomersAsync();

    if (q) {
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (stage && stage !== "All") {
      customers = customers.filter((c) => c.lifecycleStage === stage);
    }

    if (status && status !== "All") {
      customers = customers.filter((c) => c.status === status);
    }

    if (priority && priority !== "All") {
      customers = customers.filter((c) => c.priority === priority);
    }

    if (assignedTo && assignedTo !== "All") {
      customers = customers.filter((c) => c.assignedTo === assignedTo);
    }

    if (tier && tier !== "All") {
      customers = customers.filter((c) => c.loyaltyTier === tier);
    }

    return NextResponse.json(customers);
  } catch (error) {
    console.error("CRM Customers GET error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: "Customer name and phone number are required" },
        { status: 400 }
      );
    }

    const newCustomer: CustomerRecord = {
      id: body.id || `CUST-${Date.now().toString().slice(-4)}`,
      name: body.name.trim(),
      email: body.email?.trim() || "",
      phone: body.phone.trim(),
      city: body.city?.trim() || "Dehradun",
      state: body.state?.trim() || "Uttarakhand",
      country: body.country?.trim() || "India",
      avatar: body.avatar || "",
      lifecycleStage: body.lifecycleStage || "Lead",
      status: body.status || "Active",
      source: body.source || "Direct Manual Entry",
      tags: Array.isArray(body.tags) ? body.tags : ["New Customer"],
      assignedTo: body.assignedTo || session.user?.name || "Priya Sharma",
      priority: body.priority || "Medium",
      totalSpent: Number(body.totalSpent) || 0,
      totalTrips: Number(body.totalTrips) || 0,
      loyaltyTier: body.loyaltyTier || "Explorer (Bronze)",
      emergencyContact: body.emergencyContact || undefined,
      medicalNotes: body.medicalNotes || "",
      dietaryPreference: body.dietaryPreference || "Vegetarian",
      tShirtSize: body.tShirtSize || "L",
      idProofVerified: Boolean(body.idProofVerified),
      notesCount: 1,
      lastContactDate: new Date().toISOString(),
      nextFollowUpDate: body.nextFollowUpDate || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveCustomerAsync(newCustomer, session.user?.name || "Admin");
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("CRM Customers POST error:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    const allCustomers = await getCustomersAsync();
    const existing = allCustomers.find((c) => c.id === body.id);
    if (!existing) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const updatedCustomer: CustomerRecord = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveCustomerAsync(updatedCustomer, session.user?.name || "Admin");
    return NextResponse.json(saved);
  } catch (error) {
    console.error("CRM Customers PUT error:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // RBAC: Check if user has permission to delete customers (Super Admin only)
    const userRole = session.user?.role || "Super Admin";
    if (userRole !== "Super Admin") {
      return NextResponse.json(
        { error: "Access Denied: Only Super Admin can delete customer records." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing customer id" }, { status: 400 });
    }

    const deleted = await deleteCustomerAsync(id, session.user?.name || "Admin");
    if (!deleted) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    console.error("CRM Customers DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
