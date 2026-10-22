import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore, BookingRecord } from "@/lib/cms-store";
import { getAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getMongoIdFilter(id: string) {
  const cleanId = String(id).trim();
  const filters: any[] = [{ id: cleanId }];
  if (ObjectId.isValid(cleanId) && cleanId.length === 24) {
    try {
      filters.push({ _id: new ObjectId(cleanId) });
    } catch {}
  }
  return { $or: filters };
}

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
        return {
          ...rest,
          id: rest.id || String(_id),
        } as BookingRecord;
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

    const cleanId = String(id).trim();

    // 1. Check local store
    const store = readStore();
    if (!store.bookings) store.bookings = [];
    const localIndex = store.bookings.findIndex((b) => String(b.id).trim() === cleanId);

    // 2. Check MongoDB
    let mongoBooking: BookingRecord | null = null;
    let dbInstance: any = null;
    try {
      dbInstance = await getDb();
      const doc = await dbInstance.collection("kradind_bookings").findOne(getMongoIdFilter(cleanId));
      if (doc) {
        const { _id, ...rest } = doc;
        mongoBooking = {
          ...rest,
          id: rest.id || String(_id),
        } as BookingRecord;
      }
    } catch (mongoErr) {
      console.warn("MongoDB booking find warning:", mongoErr);
    }

    // 3. Resolve existing booking from either store or MongoDB
    const existing = (localIndex !== -1 ? store.bookings[localIndex] : null) || mongoBooking;
    if (!existing) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // 4. Merge updated fields
    const updated: BookingRecord = {
      ...existing,
      id: cleanId,
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

    // 5. Update local store
    if (localIndex !== -1) {
      store.bookings[localIndex] = updated;
    } else {
      store.bookings.unshift(updated);
    }
    writeStore(store);

    // 6. Update MongoDB with upsert
    try {
      const db = dbInstance || (await getDb());
      await db.collection("kradind_bookings").updateOne(
        getMongoIdFilter(cleanId),
        { $set: updated },
        { upsert: true }
      );
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

    const cleanId = String(id).trim();

    const store = readStore();
    if (!store.bookings) store.bookings = [];
    store.bookings = store.bookings.filter((b) => String(b.id).trim() !== cleanId);
    writeStore(store);

    try {
      const db = await getDb();
      await db.collection("kradind_bookings").deleteOne(getMongoIdFilter(cleanId));
    } catch (mongoErr) {
      console.warn("MongoDB booking delete warning:", mongoErr);
    }

    return NextResponse.json({ success: true, message: "Booking removed" });
  } catch (error: any) {
    console.error("Failed to remove booking:", error);
    return NextResponse.json({ error: error?.message || "Failed to remove booking" }, { status: 500 });
  }
}
