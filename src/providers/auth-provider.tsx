"use client";

import { useEffect } from "react";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";

/**
 * Restores the session on boot. The access token is memory-only (lost on
 * reload), so we attempt a silent refresh via the httpOnly cookie, then hydrate
 * the user from `/auth/me`. Renders children immediately — guards handle the
 * `loading` window so there is no blocking and no flash for logged-out users.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setSession = useAuthStore((s) => s.setSession);
  const setStatus = useAuthStore((s) => s.setStatus);

  useEffect(() => {
    let active = true;
    setStatus("loading");

    (async () => {
      const token = await authService.refresh();
      if (!active) return;
      if (!token) {
        setStatus("unauthenticated");
        return;
      }
      try {
        const user = await authService.getMe();
        if (active) setSession(user);
      } catch {
        if (active) setStatus("unauthenticated");
      }
    })();

    return () => {
      active = false;
    };
  }, [setSession, setStatus]);

  return <>{children}</>;
}
