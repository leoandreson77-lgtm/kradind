import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getProposalsAsync,
  saveProposalAsync,
  deleteProposalAsync,
  CustomerItineraryProposal,
} from "@/lib/cms-store";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId") || undefined;
    const q = (searchParams.get("q") || "").toLowerCase().trim();
    const status = searchParams.get("status");

    let proposals = await getProposalsAsync(customerId);

    if (q) {
      proposals = proposals.filter(
        (p) =>
          p.packageTitle.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q) ||
          p.destination.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          (p.customerPhone && p.customerPhone.includes(q))
      );
    }

    if (status && status !== "All") {
      proposals = proposals.filter((p) => p.status === status);
    }

    return NextResponse.json(proposals);
  } catch (error) {
    console.error("CRM Proposals GET error:", error);
    return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.packageTitle || !body.customerName || !body.itinerary || !Array.isArray(body.itinerary)) {
      return NextResponse.json(
        { error: "Missing required fields: packageTitle, customerName, and itinerary array." },
        { status: 400 }
      );
    }

    const proposal: CustomerItineraryProposal = {
      id: body.id || `KRAD-PROP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: body.customerId || undefined,
      customerName: body.customerName.trim(),
      customerPhone: body.customerPhone?.trim() || "",
      customerEmail: body.customerEmail?.trim() || "",
      customerCity: body.customerCity?.trim() || "",
      packageTitle: body.packageTitle.trim(),
      basePackageSlug: body.basePackageSlug || "",
      destination: body.destination?.trim() || "",
      duration: body.duration?.trim() || `${body.itinerary.length} Days`,
      startDate: body.startDate || "",
      endDate: body.endDate || "",
      adultsCount: Number(body.adultsCount) || 1,
      childrenCount: Number(body.childrenCount) || 0,
      pickupLocation: body.pickupLocation?.trim() || "",
      dropLocation: body.dropLocation?.trim() || "",
      hotelCategory: body.hotelCategory || "Standard (3-Star)",
      vehicleType: body.vehicleType || "Private AC Sedan",
      itinerary: body.itinerary,
      inclusions: Array.isArray(body.inclusions) ? body.inclusions : [],
      exclusions: Array.isArray(body.exclusions) ? body.exclusions : [],
      basePricePerPerson: Number(body.basePricePerPerson) || 0,
      totalQuotedPrice: Number(body.totalQuotedPrice) || 0,
      advanceDepositRequired: Number(body.advanceDepositRequired) || 0,
      validUntil: body.validUntil || "",
      specialNotes: body.specialNotes?.trim() || "",
      status: body.status || "Draft",
      author: session.user?.name || "Admin Agent",
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveProposalAsync(proposal, session.user?.name || "Admin Agent");
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("CRM Proposals POST error:", error);
    return NextResponse.json({ error: "Failed to save proposal" }, { status: 500 });
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
      return NextResponse.json({ error: "Missing proposal ID" }, { status: 400 });
    }

    const success = await deleteProposalAsync(id, session.user?.name || "Admin Agent");
    return NextResponse.json({ success });
  } catch (error) {
    console.error("CRM Proposals DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete proposal" }, { status: 500 });
  }
}
