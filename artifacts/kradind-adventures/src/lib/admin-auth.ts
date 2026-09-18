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

export function getSessionCookieOptions(req?: NextRequest) {
  // Only enforce secure if COOKIE_SECURE is explicitly true, or on HTTPS protocol
  const isExplicitSecure = process.env.COOKIE_SECURE === "true";
  const isHttps = req
    ? req.nextUrl?.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https"
    : false;
  const isProductionHttps =
    process.env.NODE_ENV === "production" &&
    (process.env.VERCEL === "1" || (Boolean(process.env.NEXT_PUBLIC_SITE_URL) && process.env.NEXT_PUBLIC_SITE_URL!.startsWith("https://")));

  const secure = isExplicitSecure || isHttps || isProductionHttps;

  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

export async function getAdminSession(req?: NextRequest): Promise<{ authenticated: boolean; user?: Partial<AdminUser> }> {
  let token: string | undefined;

  // 1. Check req.cookies if req is passed
  if (req) {
    try {
      token = req.cookies.get(SESSION_COOKIE)?.value;
    } catch {}

    // 2. Fallback: Parse raw Cookie header from req
    if (!token) {
      try {
        const cookieHeader = req.headers.get("cookie") || "";
        const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
        if (match && match[1]) {
          token = decodeURIComponent(match[1].trim());
        }
      } catch {}
    }

    // 3. Fallback: Check x-admin-token or Authorization header
    if (!token) {
      const customToken = req.headers.get("x-admin-token");
      if (customToken) {
        token = customToken.trim();
      } else {
        const authHeader = req.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.substring(7).trim();
        }
      }
    }
  }

  // 4. Fallback: Next.js cookies() from next/headers
  if (!token) {
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

  // 5. Verify that the user still exists in the store
  try {
    const store = readStore();
    const exists = store.admins?.find(
      (a) =>
        (verification.user?.id && a.id === verification.user.id) ||
        (verification.user?.email && a.email?.toLowerCase() === verification.user.email.toLowerCase())
    );

    if (exists) {
      return {
        authenticated: true,
        user: {
          id: exists.id,
          email: exists.email,
          name: exists.name,
        },
      };
    }

    // Fallback: Default admin match
    if (verification.user?.email?.toLowerCase() === "admin@kradind.com") {
      return {
        authenticated: true,
        user: {
          id: "admin-1",
          email: "admin@kradind.com",
          name: verification.user.name || "Head of Expeditions",
        },
      };
    }
  } catch (err) {
    console.error("Error verifying admin against store:", err);
    // If store read failed but token signature is valid and belongs to admin
    if (verification.user?.email?.toLowerCase() === "admin@kradind.com") {
      return {
        authenticated: true,
        user: {
          id: "admin-1",
          email: "admin@kradind.com",
          name: verification.user.name || "Head of Expeditions",
        },
      };
    }
  }

  return { authenticated: false };
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  // Only require secure if explicit or on Vercel production
  secure: process.env.COOKIE_SECURE === "true" || (process.env.NODE_ENV === "production" && process.env.VERCEL === "1"),
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};

