import { NextResponse, type NextRequest } from "next/server";

import { clearRefreshCookie, REFRESH_COOKIE, setRefreshCookie } from "@/lib/server/auth-cookies";
import { backendPost } from "@/lib/server/backend";
import type { AuthTokens } from "@/types/auth";

/**
 * BFF refresh. Reads the httpOnly refresh cookie, exchanges it for a new token
 * pair, rotates the cookie, and returns the fresh access token. Called by the
 * api-client on 401 and on app boot to restore the session.
 */
export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) {
    return NextResponse.json({ message: "No active session" }, { status: 401 });
  }

  const { status, data } = await backendPost("/auth/refresh", { refreshToken });

  if (status >= 400) {
    const res = NextResponse.json(data, { status });
    clearRefreshCookie(res);
    return res;
  }

  const tokens = data as AuthTokens;
  const res = NextResponse.json({ accessToken: tokens.accessToken });
  setRefreshCookie(res, tokens.refreshToken);
  return res;
}
