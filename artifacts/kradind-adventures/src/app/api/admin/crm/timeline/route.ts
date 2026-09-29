import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getCustomerTimelineAsync,
  addTimelineEventAsync,
  TimelineEventType,
} from "@/lib/cms-store";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    const events = await getCustomerTimelineAsync(customerId || undefined);
    return NextResponse.json(events);
  } catch (error) {
    console.error("CRM Timeline GET error:", error);
    return NextResponse.json({ error: "Failed to fetch timeline" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.customerId || !body.title) {
      return NextResponse.json(
        { error: "customerId and title are required" },
        { status: 400 }
      );
    }

    const event = await addTimelineEventAsync({
      customerId: body.customerId,
      type: (body.type as TimelineEventType) || "note_added",
      title: body.title,
      description: body.description || "",
      author: session.user?.name || body.author || "Admin User",
      metadata: body.metadata || undefined,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("CRM Timeline POST error:", error);
    return NextResponse.json({ error: "Failed to add timeline event" }, { status: 500 });
  }
}
