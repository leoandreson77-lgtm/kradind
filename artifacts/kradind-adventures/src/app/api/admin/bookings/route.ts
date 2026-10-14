import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore, BookingRecord } from "@/lib/cms-store";
import { getAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const docs = await db.collection("kradind_bookings").find({}).sort({ createdAt: -1 }).toArray();
    if (docs && docs.length > 0) {
      const cleanBookings = docs.map((doc: any) => {
        const { _id, ...rest } = doc;
        return rest as BookingRecord;
      });
      return NextResponse.json(cleanBookings, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });
    }
  } catch (err) {
    console.warn("MongoDB bookings fetch warning:", err);
  }

  const store = readStore();
  return NextResponse.json(store.bookings || [], {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const store = readStore();
    if (!store.bookings) store.bookings = [];

    const index = store.bookings.findIndex((b) => b.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Merge updated fields
    const current = store.bookings[index];
    const updated: BookingRecord = {
      ...current,
      ...(body.status !== undefined && { status: body.status }),
      ...(body.paymentStatus !== undefined && { paymentStatus: body.paymentStatus }),
      ...(body.amountPaid !== undefined && { amountPaid: Number(body.amountPaid) }),
      ...(body.advancePaid !== undefined && { advancePaid: Number(body.advancePaid) }),
      ...(body.balanceDue !== undefined && { balanceDue: Number(body.balanceDue) }),
      ...(body.paymentMethod !== undefined && { paymentMethod: body.paymentMethod }),
      ...(body.transactionRef !== undefined && { transactionRef: body.transactionRef }),
      ...(body.paymentProofDoc !== undefined && { paymentProofDoc: body.paymentProofDoc }),
      ...(body.paymentProofName !== undefined && { paymentProofName: body.paymentProofName }),
      ...(body.paymentNotes !== undefined && { paymentNotes: body.paymentNotes }),
      ...(body.paymentHistory !== undefined && { paymentHistory: body.paymentHistory }),
      ...(body.assignedAgent !== undefined && { assignedAgent: body.assignedAgent }),
      ...(body.assignedAgentId !== undefined && { assignedAgentId: body.assignedAgentId }),
      ...(body.operationStatus !== undefined && { operationStatus: body.operationStatus }),
      ...(body.trekLeader !== undefined && { trekLeader: body.trekLeader }),
      ...(body.vehicleAssigned !== undefined && { vehicleAssigned: body.vehicleAssigned }),
    };

    store.bookings[index] = updated;
    writeStore(store);

    try {
      const db = await getDb();
      await db.collection("kradind_bookings").updateOne({ id }, { $set: updated }, { upsert: true });
    } catch (mongoErr) {
      console.warn("MongoDB booking update warning:", mongoErr);
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Failed to update booking:", error);
    return NextResponse.json({ error: error?.message || "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing booking id" }, { status: 400 });
    }

    const store = readStore();
    if (!store.bookings) store.bookings = [];
    store.bookings = store.bookings.filter((b) => b.id !== id);
    writeStore(store);

    try {
      const db = await getDb();
      await db.collection("kradind_bookings").deleteOne({ id });
    } catch (mongoErr) {
      console.warn("MongoDB booking delete warning:", mongoErr);
    }

    return NextResponse.json({ success: true, message: "Booking removed" });
  } catch (error: any) {
    console.error("Failed to remove booking:", error);
    return NextResponse.json({ error: error?.message || "Failed to remove booking" }, { status: 500 });
  }
}
