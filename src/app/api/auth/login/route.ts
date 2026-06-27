import { NextResponse } from "next/server";

import { setRefreshCookie } from "@/lib/server/auth-cookies";
import { backendPost } from "@/lib/server/backend";
import type { AuthTokens } from "@/types/auth";

/**
 * BFF login proxy. Forwards credentials to the backend, stores the refresh token
 * in an httpOnly cookie, and returns only the access token to the browser.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { status, data } = await backendPost("/auth/login", body);

  if (status >= 400) {
    return NextResponse.json(data, { status });
  }

  const tokens = data as AuthTokens;
  const res = NextResponse.json({ accessToken: tokens.accessToken, tokenType: tokens.tokenType });
  setRefreshCookie(res, tokens.refreshToken);
  return res;
}
