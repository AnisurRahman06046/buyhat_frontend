"use client";

import { SearchX } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/formatters";

import { useInfiniteSearch } from "../hooks/use-catalog";
import { ProductGrid } from "./product-grid";

export function SearchResults({ query }: { query: string }) {
  const search = useInfiniteSearch({ q: query });
  const products = search.data?.pages.flatMap((page) => page.items ?? []) ?? [];

  if (search.isError) {
    return <ErrorState onRetry={() => search.refetch()} />;
  }

  return (
    <div>
      {!search.isLoading ? (
        <p className="text-muted-foreground mb-6 text-sm">
          {formatNumber(products.length)}
          {search.hasNextPage ? "+" : ""} result{products.length === 1 ? "" : "s"} for{" "}
          <span className="text-foreground font-semibold">&ldquo;{query}&rdquo;</span>
        </p>
      ) : null}

      <ProductGrid
        products={products}
        isLoading={search.isLoading}
        emptyState={
          <EmptyState
            icon={SearchX}
            title="No results found"
            description={`We couldn't find anything for "${query}". Try a different search.`}
          />
        }
      />

      {search.hasNextPage ? (
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => search.fetchNextPage()}
            disabled={search.isFetchingNextPage}
          >
            {search.isFetchingNextPage ? "Loading…" : "Load More"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
