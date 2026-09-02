import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore, hashPassword, verifyPassword } from "@/lib/cms-store";
import { getAdminSession } from "@/lib/admin-auth";
import { z } from "zod";

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export async function PUT(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = ChangePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const { currentPassword, newPassword } = parsed.data;
    const store = readStore();
    const admin = store.admins.find((a) => a.id === session.user?.id);

    if (!admin) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    const isMatch = verifyPassword(currentPassword, admin.passwordHash, admin.salt);
    if (!isMatch) {
      return NextResponse.json({ error: "Current password does not match" }, { status: 400 });
    }

    const { hash, salt } = hashPassword(newPassword);
    admin.passwordHash = hash;
    admin.salt = salt;

    writeStore(store);
    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
