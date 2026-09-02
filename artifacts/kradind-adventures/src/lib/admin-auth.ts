import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import crypto from "crypto";
import { readStore, AdminUser } from "./cms-store";

const SESSION_COOKIE = "kradind_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "kradind-secure-secret-key-himalayan-adventures-2026";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function signData(data: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("hex");
}

export function createSessionToken(user: AdminUser): string {
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      issuedAt: Date.now(),
    }),
  ).toString("base64url");
  const signature = signData(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): { valid: boolean; user?: Partial<AdminUser> } {
  if (!token || !token.includes(".")) return { valid: false };
  const [payload, signature] = token.split(".");
  const expectedSignature = signData(payload);

  if (signature !== expectedSignature) {
    return { valid: false };
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    // Check age (7 days)
    if (Date.now() - data.issuedAt > MAX_AGE_SECONDS * 1000) {
      return { valid: false };
    }
    return { valid: true, user: data };
  } catch {
    return { valid: false };
  }
}

export async function getAdminSession(req?: NextRequest): Promise<{ authenticated: boolean; user?: Partial<AdminUser> }> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(SESSION_COOKIE)?.value;
  } else {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE)?.value;
    } catch {
      token = undefined;
    }
  }

  if (!token) return { authenticated: false };

  const verification = verifySessionToken(token);
  if (!verification.valid || !verification.user) {
    return { authenticated: false };
  }

  // Verify that the user still exists in the store
  const store = readStore();
  const exists = store.admins.find((a) => a.id === verification.user?.id);
  if (!exists) return { authenticated: false };

  return {
    authenticated: true,
    user: {
      id: exists.id,
      email: exists.email,
      name: exists.name,
    },
  };
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};
