import { PackageSearch } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import type { ProductSummary } from "@/types/catalog";

import { ProductCard } from "./product-card";

const GRID = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-card border-border bg-card shadow-card overflow-hidden border">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

export function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 8,
  emptyState,
  className,
}: {
  products: ProductSummary[];
  isLoading?: boolean;
  skeletonCount?: number;
  emptyState?: React.ReactNode;
  className?: string;
}) {
  if (isLoading && products.length === 0) {
    return (
      <div className={cn(GRID, className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <>
        {emptyState ?? (
          <EmptyState
            icon={PackageSearch}
            title="No products found"
            description="Try adjusting your filters or search for something else."
          />
        )}
      </>
    );
  }

  return (
    <div className={cn(GRID, className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
