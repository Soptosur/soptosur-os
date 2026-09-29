import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /dashboard deep-links
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Read session tier from cookie
  const tierCookie = request.cookies.get("soptosur_tier")?.value;
  const userCookie = request.cookies.get("soptosur_user")?.value;

  // If not authenticated, redirect to login
  if (!userCookie || !tierCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userTier = parseInt(tierCookie, 10);

  // Deep-Link Route Protection by Constitutional Tier
  if (pathname.startsWith("/dashboard/advisor") && userTier !== 1) {
    const unauthUrl = new URL("/unauthorized", request.url);
    unauthUrl.searchParams.set("required", "Tier 1: Faculty Advisor");
    unauthUrl.searchParams.set("activeTier", String(userTier));
    unauthUrl.searchParams.set("path", pathname);
    return NextResponse.redirect(unauthUrl);
  }

  if (pathname.startsWith("/dashboard/president") && userTier > 2) {
    const unauthUrl = new URL("/unauthorized", request.url);
    unauthUrl.searchParams.set("required", "Tier 2: Club President");
    unauthUrl.searchParams.set("activeTier", String(userTier));
    unauthUrl.searchParams.set("path", pathname);
    return NextResponse.redirect(unauthUrl);
  }

  if (pathname.startsWith("/dashboard/executive") && userTier > 3) {
    const unauthUrl = new URL("/unauthorized", request.url);
    unauthUrl.searchParams.set("required", "Tier 3: Executive Officers");
    unauthUrl.searchParams.set("activeTier", String(userTier));
    unauthUrl.searchParams.set("path", pathname);
    return NextResponse.redirect(unauthUrl);
  }

  if (pathname.startsWith("/dashboard/departments") && userTier > 4) {
    const unauthUrl = new URL("/unauthorized", request.url);
    unauthUrl.searchParams.set("required", "Tier 4: Department Heads");
    unauthUrl.searchParams.set("activeTier", String(userTier));
    unauthUrl.searchParams.set("path", pathname);
    return NextResponse.redirect(unauthUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
