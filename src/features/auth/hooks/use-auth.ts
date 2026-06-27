"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";
import { authService } from "@/services/auth.service";
import { cartService } from "@/services/cart.service";
import { clearGuestId } from "@/services/guest-id";
import { useAuthStore } from "@/store/auth-store";
import type { LoginPayload, RegisterPayload } from "@/types/auth";

/** Hydrate the session from /auth/me and merge any guest cart into it. */
async function hydrateSessionAndMergeCart(
  setSession: (user: Awaited<ReturnType<typeof authService.getMe>>) => void,
) {
  const user = await authService.getMe();
  setSession(user);
  await cartService.mergeGuestCart().catch(() => null);
  clearGuestId();
}

export function useLogin() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    meta: { silentError: true }, // errors shown inline in the form
    onSuccess: async () => {
      await hydrateSessionAndMergeCart(setSession);
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    meta: { silentError: true },
    onSuccess: async () => {
      await hydrateSessionAndMergeCart(setSession);
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearSession();
      queryClient.clear();
    },
  });
}
