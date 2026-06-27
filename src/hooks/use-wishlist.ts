"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useWishlistStore } from "@/store/wishlist-store";

/**
 * Wishlist accessor with a mount guard so the persisted state never causes a
 * hydration mismatch (server renders "not wishlisted", client reconciles after
 * mount).
 */
export function useWishlist() {
  const mounted = useMounted();
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);

  return {
    ids: mounted ? ids : [],
    count: mounted ? ids.length : 0,
    has: (id: string) => mounted && ids.includes(id),
    toggle,
  };
}
