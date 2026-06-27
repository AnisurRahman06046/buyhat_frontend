import { NextResponse } from "next/server";

import { setRefreshCookie } from "@/lib/server/auth-cookies";
import { backendPost } from "@/lib/server/backend";
import type { AuthTokens } from "@/types/auth";

/** BFF register proxy — same cookie handling as login (backend returns a pair). */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { status, data } = await backendPost("/auth/register", body);

  if (status >= 400) {
    return NextResponse.json(data, { status });
  }

  const tokens = data as AuthTokens;
  const res = NextResponse.json({ accessToken: tokens.accessToken, tokenType: tokens.tokenType });
  setRefreshCookie(res, tokens.refreshToken);
  return res;
}
