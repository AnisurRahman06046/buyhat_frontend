"use client";

import { hasRole, isStaff, type Role } from "@/constants/roles";
import { useAuthStore } from "@/store/auth-store";

/** Read the current session + derived flags. */
export function useSession() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  return {
    user,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "idle" || status === "loading",
  };
}

/** True if the current user has any of the given roles. */
export function useHasRole(...roles: Role[]): boolean {
  const user = useAuthStore((s) => s.user);
  return hasRole(user?.roles, ...roles);
}

/** True if the current user can access the admin panel at all. */
export function useIsStaff(): boolean {
  const user = useAuthStore((s) => s.user);
  return isStaff(user?.roles);
}
