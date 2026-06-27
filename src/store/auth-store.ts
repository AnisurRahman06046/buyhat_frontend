import { create } from "zustand";

import type { AuthUser } from "@/types/auth";

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  setSession: (user: AuthUser) => void;
  clearSession: () => void;
  setStatus: (status: AuthStatus) => void;
}

/**
 * Global session snapshot. Holds the *user* (id/email/roles), not the token —
 * the access token lives in `token-storage`, the refresh token in the httpOnly
 * cookie. `status` drives loading gates and route guards.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "idle",
  setSession: (user) => set({ user, status: "authenticated" }),
  clearSession: () => set({ user: null, status: "unauthenticated" }),
  setStatus: (status) => set({ status }),
}));
