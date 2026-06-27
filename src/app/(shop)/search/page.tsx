import type { Metadata } from "next";
import { Search } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { SearchResults } from "@/features/catalog/components/search-results";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  return (
    <div className="container-page py-8">
      <h1 className="text-headline-lg text-foreground">
        Search
        {query ? <span className="text-muted-foreground"> · &ldquo;{query}&rdquo;</span> : null}
      </h1>

      <div className="mt-6">
        {query ? (
          <SearchResults query={query} />
        ) : (
          <EmptyState
            icon={Search}
            title="Search our catalog"
            description="Enter a product name, brand, or keyword in the search bar above."
          />
        )}
      </div>
    </div>
  );
}
