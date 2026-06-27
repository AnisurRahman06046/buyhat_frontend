"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";

export function useRecentlyViewed() {
  const mounted = useMounted();
  const items = useRecentlyViewedStore((s) => s.items);
  const add = useRecentlyViewedStore((s) => s.add);
  return { items: mounted ? items : [], add };
}
