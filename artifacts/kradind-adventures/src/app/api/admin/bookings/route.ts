import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore, BookingRecord } from "@/lib/cms-store";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const store = readStore();
  return NextResponse.json(store.bookings);
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id, status }: { id: string; status: BookingRecord["status"] } = await request.json();
    const store = readStore();
    const index = store.bookings.findIndex((b) => b.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    store.bookings[index].status = status;
    writeStore(store);

    return NextResponse.json(store.bookings[index]);
  } catch {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing booking id" }, { status: 400 });
  }

  const store = readStore();
  store.bookings = store.bookings.filter((b) => b.id !== id);
  writeStore(store);

  return NextResponse.json({ success: true, message: "Booking removed" });
}
