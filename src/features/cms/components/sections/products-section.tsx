import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { getProductsServer } from "@/features/catalog/api/catalog-server";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import type { HomepageSection } from "@/types/cms";

const DEFAULT_TITLE: Record<string, string> = {
  FEATURED_PRODUCTS: "Featured Products",
  BEST_SELLERS: "Best Sellers",
  NEW_ARRIVALS: "New Arrivals",
};

const SORT_HINT: Record<string, string> = {
  BEST_SELLERS: "best-sellers",
  NEW_ARRIVALS: "newest",
};

export async function ProductsSection({ section }: { section: HomepageSection }) {
  let products = section.products ?? [];

  if (products.length === 0) {
    const sort = SORT_HINT[section.type];
    const page = await getProductsServer({ limit: 8, ...(sort ? { sort } : {}) }).catch(() => null);
    products = page?.items ?? [];
  }

  if (products.length === 0) return null;

  return (
    <section className="container-page py-10">
      <SectionHeader
        title={section.title ?? DEFAULT_TITLE[section.type] ?? "Products"}
        action={
          <Button variant="link" asChild>
            <Link href={routes.shop}>
              View all <ArrowRight />
            </Link>
          </Button>
        }
        className="mb-6"
      />
      <ProductGrid products={products.slice(0, 8)} />
    </section>
  );
}
