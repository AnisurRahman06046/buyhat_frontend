import { NextResponse, type NextRequest } from "next/server";

import { clearRefreshCookie, REFRESH_COOKIE } from "@/lib/server/auth-cookies";
import { backendPost } from "@/lib/server/backend";

/** BFF logout — revokes the refresh token server-side and clears the cookie. */
export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (refreshToken) {
    await backendPost("/auth/logout", { refreshToken }).catch(() => undefined);
  }

  const res = NextResponse.json({ ok: true });
  clearRefreshCookie(res);
  return res;
}
