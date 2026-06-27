import { SectionHeader } from "@/components/shared/section-header";
import type { ProductSummary } from "@/types/catalog";

import { ProductGrid } from "./product-grid";

/** "You might also like" — presentational; the page fetches `products`. */
export function RelatedProducts({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) return null;
  return (
    <section className="mt-16">
      <SectionHeader title="You might also like" className="mb-6" />
      <ProductGrid products={products} />
    </section>
  );
}
