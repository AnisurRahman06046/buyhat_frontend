import type { Role } from "@/constants/roles";

/** Backend token pair (register/login/refresh). Refresh token is BFF-only. */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
}

/** The authenticated principal from `GET /auth/me`. */
export interface AuthUser {
  id: string;
  email: string;
  roles: Role[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface VerifyEmailPayload {
  token: string;
}

/** What the BFF returns to the browser — the refresh token stays in the cookie. */
export interface SessionResponse {
  accessToken: string;
  tokenType?: string;
}
