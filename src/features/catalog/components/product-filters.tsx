"use client";

import { RatingStars } from "@/components/shared/rating-stars";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/formatters";

import { useBrands } from "../hooks/use-catalog";
import {
  countActiveFilters,
  DEFAULT_FILTERS,
  PRICE_CEILING,
  type CatalogFilters,
} from "../lib/filters";

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-border space-y-3 border-t pt-5 first:border-0 first:pt-0">
      <h3 className="text-foreground text-sm font-semibold">{title}</h3>
      {children}
    </section>
  );
}

export function ProductFilters({
  filters,
  onChange,
}: {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
}) {
  const { data: brands, isLoading } = useBrands();
  const active = countActiveFilters(filters);
  const min = filters.minPrice ?? 0;
  const max = filters.maxPrice ?? PRICE_CEILING;

  const toggleBrand = (id: string) => {
    const has = filters.brands.includes(id);
    onChange({
      ...filters,
      brands: has ? filters.brands.filter((b) => b !== id) : [...filters.brands, id],
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-md text-foreground">Filters</h2>
        {active > 0 ? (
          <Button
            variant="link"
            className="h-auto p-0 text-sm"
            onClick={() => onChange({ ...DEFAULT_FILTERS, sort: filters.sort })}
          >
            Clear all
          </Button>
        ) : null}
      </div>

      <FilterSection title="Price Range">
        <Slider
          min={0}
          max={PRICE_CEILING}
          step={500}
          value={[min, max]}
          onValueChange={(values) => {
            const lo = values[0] ?? 0;
            const hi = values[1] ?? PRICE_CEILING;
            onChange({
              ...filters,
              minPrice: lo > 0 ? lo : undefined,
              maxPrice: hi < PRICE_CEILING ? hi : undefined,
            });
          }}
          aria-label="Price range"
        />
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>{formatMoney(min)}</span>
          <span>
            {formatMoney(max)}
            {max >= PRICE_CEILING ? "+" : ""}
          </span>
        </div>
      </FilterSection>

      <FilterSection title="Brand">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-32" />
            ))}
          </div>
        ) : brands && brands.length > 0 ? (
          <ul className="space-y-2.5">
            {brands.map((brand) => (
              <li key={brand.id}>
                <label className="text-foreground flex cursor-pointer items-center gap-2.5 text-sm">
                  <Checkbox
                    checked={filters.brands.includes(brand.id)}
                    onCheckedChange={() => toggleBrand(brand.id)}
                  />
                  {brand.name}
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">No brands available.</p>
        )}
      </FilterSection>

      <FilterSection title="Rating">
        <div className="space-y-1">
          {[4, 3].map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={filters.minRating === r}
              onClick={() =>
                onChange({ ...filters, minRating: filters.minRating === r ? undefined : r })
              }
              className={cn(
                "hover:bg-muted flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                filters.minRating === r && "bg-accent",
              )}
            >
              <RatingStars rating={r} size="sm" />
              <span className="text-muted-foreground">&amp; Up</span>
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <label className="text-foreground flex cursor-pointer items-center gap-2.5 text-sm">
          <Checkbox
            checked={filters.inStock}
            onCheckedChange={(v) => onChange({ ...filters, inStock: v === true })}
          />
          In Stock only
        </label>
      </FilterSection>
    </div>
  );
}
