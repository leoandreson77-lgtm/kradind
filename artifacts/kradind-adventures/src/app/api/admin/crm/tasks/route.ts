import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getCustomerTasksAsync,
  saveCustomerTaskAsync,
  deleteCustomerTaskAsync,
  CustomerTask,
} from "@/lib/cms-store";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const status = searchParams.get("status");

    let tasks = await getCustomerTasksAsync();

    if (customerId) {
      tasks = tasks.filter((t) => t.customerId === customerId);
    }

    if (status && status !== "All") {
      tasks = tasks.filter((t) => t.status === status);
    }

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("CRM Tasks GET error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.title || !body.customerId) {
      return NextResponse.json(
        { error: "customerId and title are required" },
        { status: 400 }
      );
    }

    const newTask: CustomerTask = {
      id: body.id || `TSK-${Date.now().toString().slice(-4)}`,
      customerId: body.customerId,
      customerName: body.customerName || "Customer",
      customerPhone: body.customerPhone || "",
      title: body.title.trim(),
      dueDate: body.dueDate || new Date(Date.now() + 86400000).toISOString().split("T")[0],
      priority: body.priority || "Medium",
      status: body.status || "Pending",
      assignedTo: body.assignedTo || session.user?.name || "Staff",
      createdAt: new Date().toISOString(),
    };

    const saved = await saveCustomerTaskAsync(newTask);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("CRM Tasks POST error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
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
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const tasks = await getCustomerTasksAsync();
    const existing = tasks.find((t) => t.id === body.id);
    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updatedTask: CustomerTask = {
      ...existing,
      ...body,
    };

    const saved = await saveCustomerTaskAsync(updatedTask);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("CRM Tasks PUT error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 });
    }

    const deleted = await deleteCustomerTaskAsync(id);
    if (!deleted) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CRM Tasks DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
