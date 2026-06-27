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
  const items = useWishlistStore((s) => s.items);
  const toggle = useWishlistStore((s) => s.toggle);
  const remove = useWishlistStore((s) => s.remove);

  return {
    items: mounted ? items : [],
    count: mounted ? items.length : 0,
    has: (id: string) => mounted && items.some((i) => i.id === id),
    toggle,
    remove,
  };
}
