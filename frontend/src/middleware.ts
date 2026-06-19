// src/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_ROUTES = [
  "/profile",
  "/jobs",
  "/resumes",
];

export async function middleware(
  request: NextRequest,
) {
  const { response, user } =
    await updateSession(request);

  const pathname =
    request.nextUrl.pathname;

  const isProtectedRoute =
    PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route),
    );

  if (isProtectedRoute && !user) {
    const loginUrl = new URL(
      "/login",
      request.url,
    );

    loginUrl.searchParams.set(
      "redirect",
      pathname,
    );

    return NextResponse.redirect(
      loginUrl,
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/jobs/:path*",
    "/resumes/:path*",
  ],
};