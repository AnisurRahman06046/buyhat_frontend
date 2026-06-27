"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";

import { ProductGrid } from "./product-grid";

/** Recently-viewed products. Hidden until at least two are recorded. */
export function RecentlyViewedStrip({ excludeId }: { excludeId?: string }) {
  const { items } = useRecentlyViewed();
  const products = items.filter((p) => p.id !== excludeId).slice(0, 8);
  if (products.length < 2) return null;

  return (
    <section className="container-page py-10">
      <SectionHeader title="Recently Viewed" className="mb-6" />
      <ProductGrid products={products} />
    </section>
  );
}
