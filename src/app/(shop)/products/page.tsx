import type { Metadata } from "next";

import { getProductsServer } from "@/features/catalog/api/catalog-server";
import { ProductListing } from "@/features/catalog/components/product-listing";
import { filtersToParams, parseFilters } from "@/features/catalog/lib/filters";
import type { ProductSummary } from "@/types/catalog";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse the full BuyHat catalog — electronics, fashion, home & living, and more.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const params = filtersToParams(filters);
  const firstPage = await getProductsServer(params).catch(() => ({
    items: [] as ProductSummary[],
    total: 0,
    page: 1,
    limit: 12,
  }));

  return (
    <div className="container-page py-8">
      <h1 className="text-headline-lg text-foreground mb-6">Shop All</h1>
      <ProductListing
        initialFilters={filters}
        initialData={{ pages: [firstPage], pageParams: [1] }}
      />
    </div>
  );
}
