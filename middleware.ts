import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /dashboard deep-links
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Attempt to read NextAuth JWT token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "soptosur-constitutional-secure-jwt-secret-key-2026",
  });

  // Read fallback cookies (for dev simulator and direct sessions)
  const tierCookie = request.cookies.get("soptosur_tier")?.value;
  const userCookie = request.cookies.get("soptosur_user")?.value;

  const isAuthenticated = Boolean(
    token || (userCookie && tierCookie && userCookie !== "authenticating")
  );

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Resolve user tier from token or cookie
  const userTier =
    token?.tier !== undefined
      ? Number(token.tier)
      : parseInt(tierCookie || "5", 10);

  // Deep-Link Route Protection by Constitutional Tier (Return 403 status)
  if (pathname.startsWith("/dashboard/advisor") && userTier !== 1) {
    const unauthUrl = new URL("/unauthorized", request.url);
    unauthUrl.searchParams.set("required", "Tier 1: Faculty Advisor");
    unauthUrl.searchParams.set("activeTier", String(userTier));
    unauthUrl.searchParams.set("path", pathname);
    return NextResponse.rewrite(unauthUrl, { status: 403 });
  }

  if (pathname.startsWith("/dashboard/president") && userTier > 2) {
    const unauthUrl = new URL("/unauthorized", request.url);
    unauthUrl.searchParams.set("required", "Tier 2: Club President");
    unauthUrl.searchParams.set("activeTier", String(userTier));
    unauthUrl.searchParams.set("path", pathname);
    return NextResponse.rewrite(unauthUrl, { status: 403 });
  }

  if (pathname.startsWith("/dashboard/executive") && userTier > 3) {
    const unauthUrl = new URL("/unauthorized", request.url);
    unauthUrl.searchParams.set("required", "Tier 3: Executive Officers");
    unauthUrl.searchParams.set("activeTier", String(userTier));
    unauthUrl.searchParams.set("path", pathname);
    return NextResponse.rewrite(unauthUrl, { status: 403 });
  }

  if (pathname.startsWith("/dashboard/departments") && userTier > 4) {
    const unauthUrl = new URL("/unauthorized", request.url);
    unauthUrl.searchParams.set("required", "Tier 4: Department Heads");
    unauthUrl.searchParams.set("activeTier", String(userTier));
    unauthUrl.searchParams.set("path", pathname);
    return NextResponse.rewrite(unauthUrl, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
