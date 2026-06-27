import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ProductSummary } from "@/types/catalog";

interface WishlistState {
  items: ProductSummary[];
  toggle: (item: ProductSummary) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

/**
 * Wishlist is a client-only convenience. It persists a product *snapshot*
 * (not just the id) so the wishlist page renders instantly from localStorage —
 * there is no batch get-products-by-ids endpoint. Read via `useWishlist`
 * (mount-guarded to avoid hydration flash).
 */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((s) =>
          s.items.some((i) => i.id === item.id)
            ? { items: s.items.filter((i) => i.id !== item.id) }
            : { items: [...s.items, item] },
        ),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      has: (id) => get().items.some((i) => i.id === id),
      clear: () => set({ items: [] }),
    }),
    { name: "buyhat-wishlist", version: 2 },
  ),
);
