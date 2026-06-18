// src/middleware.ts

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_ROUTES = [
  "/profile",
  "/settings",
  "/jobs",
  "/resumes",
];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  const hasSession =
    request.cookies.has("sb-access-token") ||
    request.cookies
      .getAll()
      .some((cookie) => cookie.name.startsWith("sb-"));

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set(
      "redirect",
      request.nextUrl.pathname,
    );

    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/settings/:path*",
    "/jobs/:path*",
    "/resumes/:path*",
  ],
};