import type { NextResponse } from "next/server";

/** httpOnly refresh-token cookie — never readable by client JS. */
export const REFRESH_COOKIE = "buyhat_rt";

const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7;

const baseOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function setRefreshCookie(res: NextResponse, token: string): void {
  res.cookies.set(REFRESH_COOKIE, token, { ...baseOptions, maxAge: SEVEN_DAYS_SECONDS });
}

export function clearRefreshCookie(res: NextResponse): void {
  res.cookies.set(REFRESH_COOKIE, "", { ...baseOptions, maxAge: 0 });
}
