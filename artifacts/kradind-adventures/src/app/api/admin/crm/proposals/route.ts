import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getProposalsAsync,
  saveProposalAsync,
  deleteProposalAsync,
  recycleProposalAsync,
  restoreProposalAsync,
  getRecycledProposalsAsync,
  emptyRecycleBinAsync,
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

    let proposals: CustomerItineraryProposal[] = [];
    if (status === "Recycled") {
      proposals = await getRecycledProposalsAsync();
    } else {
      proposals = await getProposalsAsync(customerId);
    }

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

    if (status && status !== "All" && status !== "Recycled") {
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

    // Handle restore action
    if (body.action === "restore" && body.id) {
      const restored = await restoreProposalAsync(body.id, session.user?.name || "Admin Agent");
      if (!restored) {
        return NextResponse.json({ error: "Proposal not found in recycle bin" }, { status: 404 });
      }
      return NextResponse.json(restored);
    }

    // Handle empty recycle bin action
    if (body.action === "empty_recycle") {
      await emptyRecycleBinAsync();
      return NextResponse.json({ success: true, message: "Recycle bin emptied" });
    }

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
      packageType: body.packageType || "Trek",
      destination: body.destination?.trim() || "",
      duration: body.duration?.trim() || `${body.itinerary.length} Days`,
      startDate: body.startDate || "",
      endDate: body.endDate || "",
      adultsCount: Number(body.adultsCount) || 1,
      childrenCount: Number(body.childrenCount) || 0,
      pickupLocation: body.pickupLocation?.trim() || "",
      dropLocation: body.dropLocation?.trim() || "",
      hotelCategory: body.hotelCategory || "Standard (3-Star)",
      roomCategory: body.roomCategory || "Standard Room",
      hotelDetails: Array.isArray(body.hotelDetails) ? body.hotelDetails : [],
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
      version: body.version || 1,
      versionHistory: Array.isArray(body.versionHistory) ? body.versionHistory : [],
      inventory: body.inventory || undefined,
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
    const permanent = searchParams.get("permanent") === "true";

    if (!id) {
      return NextResponse.json({ error: "Missing proposal ID" }, { status: 400 });
    }

    if (permanent) {
      const success = await deleteProposalAsync(id, session.user?.name || "Admin Agent");
      return NextResponse.json({ success, message: "Permanently deleted" });
    } else {
      const success = await recycleProposalAsync(id, session.user?.name || "Admin Agent");
      return NextResponse.json({ success, message: "Moved to recycle bin" });
    }
  } catch (error) {
    console.error("CRM Proposals DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete proposal" }, { status: 500 });
  }
}
