import { NextResponse, type NextRequest } from "next/server";

import { REFRESH_COOKIE } from "@/lib/server/auth-cookies";

/**
 * Coarse, server-side route gate. Protected areas require the presence of the
 * refresh cookie — logged-out users are redirected to login before the page
 * renders (no flash). Role checks (which need `/auth/me`) happen client-side in
 * `RequireRole`. This is defense-in-depth, not the only guard.
 */
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has(REFRESH_COOKIE);

  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
