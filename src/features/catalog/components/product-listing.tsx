"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { InfiniteData } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";

import { ErrorState } from "@/components/shared/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatNumber } from "@/lib/formatters";
import type { ProductSummary } from "@/types/catalog";
import type { Paginated } from "@/types/common";

import { useInfiniteProducts } from "../hooks/use-catalog";
import {
  countActiveFilters,
  filtersToParams,
  filtersToSearchString,
  type CatalogFilters,
} from "../lib/filters";
import { ProductFilters } from "./product-filters";
import { ProductGrid } from "./product-grid";
import { SortSelect } from "./sort-select";

export function ProductListing({
  initialFilters,
  initialData,
  categoryId,
}: {
  initialFilters: CatalogFilters;
  initialData?: InfiniteData<Paginated<ProductSummary>, number>;
  categoryId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState<CatalogFilters>(initialFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const params = filtersToParams(filters, categoryId ? { categoryId } : {});
  const query = useInfiniteProducts(params, initialData);

  const applyFilters = (next: CatalogFilters) => {
    setFilters(next);
    const qs = filtersToSearchString(next);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const products = query.data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const total = query.data?.pages[0]?.total ?? products.length;
  const activeCount = countActiveFilters(filters);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <ProductFilters filters={filters} onChange={applyFilters} />
      </aside>

      <div className="min-w-0">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal />
                  Filters
                  {activeCount > 0 ? (
                    <Badge variant="default" className="ml-1 px-1.5">
                      {activeCount}
                    </Badge>
                  ) : null}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="sr-only">Filters</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-8">
                  <ProductFilters filters={filters} onChange={applyFilters} />
                </div>
              </SheetContent>
            </Sheet>

            <p className="text-muted-foreground text-sm">
              Showing <span className="text-foreground font-semibold">{formatNumber(total)}</span>{" "}
              products
            </p>
          </div>

          <SortSelect
            value={filters.sort}
            onChange={(sort) => applyFilters({ ...filters, sort })}
          />
        </div>

        {query.isError ? (
          <ErrorState onRetry={() => query.refetch()} />
        ) : (
          <>
            <ProductGrid products={products} isLoading={query.isLoading} />
            {query.hasNextPage ? (
              <div className="mt-10 flex flex-col items-center gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => query.fetchNextPage()}
                  disabled={query.isFetchingNextPage}
                >
                  {query.isFetchingNextPage ? "Loading…" : "Load More"}
                </Button>
                <p className="text-muted-foreground text-sm">
                  Showing {products.length} of {formatNumber(total)} products
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
