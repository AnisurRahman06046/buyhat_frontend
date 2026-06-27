import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ProductSummary } from "@/types/catalog";

const MAX_ITEMS = 12;

interface RecentlyViewedState {
  items: ProductSummary[];
  add: (item: ProductSummary) => void;
  clear: () => void;
}

/** Recently viewed products (snapshot), most-recent-first, capped + persisted. */
export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((s) => ({
          items: [item, ...s.items.filter((i) => i.id !== item.id)].slice(0, MAX_ITEMS),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "buyhat-recently-viewed" },
  ),
);
