import { NextRequest, NextResponse } from "next/server";
import { readStore, verifyPassword } from "@/lib/cms-store";
import {
  createSessionToken,
  getAdminSession,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/admin-auth";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please provide a valid email and password." },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;
    const store = readStore();
    const admin = store.admins?.find((a) => a.email.toLowerCase() === email.toLowerCase());

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const isValid = verifyPassword(password, admin.passwordHash, admin.salt);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const token = createSessionToken(admin);
    const cookieOptions = getSessionCookieOptions(request);
    const response = NextResponse.json({
      success: true,
      token, // Return token for client-side storage backup
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, cookieOptions);
    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated || !session.user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Generate a token so client can synchronize in localStorage
  let token: string | undefined;
  try {
    const store = readStore();
    const admin =
      store.admins?.find(
        (a) =>
          a.id === session.user?.id ||
          a.email.toLowerCase() === session.user?.email?.toLowerCase(),
      ) || store.admins?.[0];
    if (admin) {
      token = createSessionToken(admin);
    }
  } catch {}

  const response = NextResponse.json({
    authenticated: true,
    user: session.user,
    token,
  });

  // Re-affirm cookie with updated options
  if (token) {
    response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions(request));
  }

  return response;
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}

