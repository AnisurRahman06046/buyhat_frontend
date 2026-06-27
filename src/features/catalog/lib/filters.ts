import type { ProductListParams } from "../hooks/use-catalog";

export interface CatalogFilters {
  sort: string;
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock: boolean;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  sort: "featured",
  brands: [],
  inStock: false,
};

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top Rated" },
] as const;

/** Upper bound (BDT) for the price-range slider. */
export const PRICE_CEILING = 50_000;

type SearchParamsBag = Record<string, string | string[] | undefined>;

function firstValue(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function toNumber(v: string | string[] | undefined): number | undefined {
  const raw = firstValue(v);
  if (raw === undefined || raw === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

/** Parse raw URL search params into typed filters (server + client). */
export function parseFilters(sp: SearchParamsBag): CatalogFilters {
  const brandsRaw = firstValue(sp.brands);
  return {
    sort: firstValue(sp.sort) ?? "featured",
    brands: brandsRaw ? brandsRaw.split(",").filter(Boolean) : [],
    minPrice: toNumber(sp.minPrice),
    maxPrice: toNumber(sp.maxPrice),
    minRating: toNumber(sp.minRating),
    inStock: firstValue(sp.inStock) === "true",
  };
}

/** Map filters to the backend query params (omitting defaults). */
export function filtersToParams(
  f: CatalogFilters,
  extra: ProductListParams = {},
): ProductListParams {
  return {
    ...extra,
    sort: f.sort && f.sort !== "featured" ? f.sort : undefined,
    brands: f.brands.length ? f.brands.join(",") : undefined,
    minPrice: f.minPrice,
    maxPrice: f.maxPrice,
    minRating: f.minRating,
    inStock: f.inStock ? "true" : undefined,
  };
}

/** Serialize filters to a URL query string (for shareable links). */
export function filtersToSearchString(f: CatalogFilters): string {
  const sp = new URLSearchParams();
  if (f.sort && f.sort !== "featured") sp.set("sort", f.sort);
  if (f.brands.length) sp.set("brands", f.brands.join(","));
  if (f.minPrice != null) sp.set("minPrice", String(f.minPrice));
  if (f.maxPrice != null) sp.set("maxPrice", String(f.maxPrice));
  if (f.minRating != null) sp.set("minRating", String(f.minRating));
  if (f.inStock) sp.set("inStock", "true");
  return sp.toString();
}

export function countActiveFilters(f: CatalogFilters): number {
  let n = 0;
  n += f.brands.length;
  if (f.minPrice != null || f.maxPrice != null) n += 1;
  if (f.minRating != null) n += 1;
  if (f.inStock) n += 1;
  return n;
}
