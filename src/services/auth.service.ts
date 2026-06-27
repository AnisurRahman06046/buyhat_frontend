import type {
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  SessionResponse,
  VerifyEmailPayload,
} from "@/types/auth";

import { httpGet, httpPost } from "./http";
import { apiErrorFromBody } from "./http-error";
import { clearAccessToken, setAccessToken } from "./token-storage";

/** Same-origin call to a BFF auth route handler (sets/reads the httpOnly cookie). */
async function bff<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await res.json().catch(() => ({}))) as unknown;
  if (!res.ok) throw apiErrorFromBody(res.status, data);
  return data as T;
}

/**
 * Auth service. Credentialed flows (login/register/refresh/logout) go through the
 * BFF so the refresh token stays in the httpOnly cookie; the returned access
 * token is held in memory. Public/Bearer flows use the api-client directly.
 */
export const authService = {
  async login(payload: LoginPayload): Promise<SessionResponse> {
    const session = await bff<SessionResponse>("/api/auth/login", payload);
    setAccessToken(session.accessToken);
    return session;
  },

  async register(payload: RegisterPayload): Promise<SessionResponse> {
    const session = await bff<SessionResponse>("/api/auth/register", payload);
    setAccessToken(session.accessToken);
    return session;
  },

  /** Restore the session from the refresh cookie (boot + 401 recovery). */
  async refresh(): Promise<string | null> {
    try {
      const session = await bff<SessionResponse>("/api/auth/refresh");
      setAccessToken(session.accessToken);
      return session.accessToken;
    } catch {
      clearAccessToken();
      return null;
    }
  },

  async logout(): Promise<void> {
    await bff<{ ok: boolean }>("/api/auth/logout").catch(() => undefined);
    clearAccessToken();
  },

  getMe(signal?: AbortSignal): Promise<AuthUser> {
    return httpGet<AuthUser>("/auth/me", { signal });
  },

  verifyEmail(payload: VerifyEmailPayload): Promise<void> {
    return httpPost<void>("/auth/verify-email", payload);
  },

  resendVerification(): Promise<void> {
    return httpPost<void>("/auth/resend-verification");
  },

  forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    return httpPost<void>("/auth/forgot-password", payload);
  },

  resetPassword(payload: ResetPasswordPayload): Promise<void> {
    return httpPost<void>("/auth/reset-password", payload);
  },
};
