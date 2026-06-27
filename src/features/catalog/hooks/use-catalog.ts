"use client";

import { useInfiniteQuery, useQuery, type InfiniteData } from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";
import { catalogService } from "@/services/catalog.service";
import type { Brand, ProductDetail, ProductSearchParams, ProductSummary } from "@/types/catalog";
import type { CursorPage, Paginated } from "@/types/common";

export const PRODUCTS_PAGE_SIZE = 12;

export type ProductListParams = Record<string, string | number | undefined>;

/** Page-based infinite product list (PLP / category). Seedable via `initialData`. */
export function useInfiniteProducts(
  params: ProductListParams,
  initialData?: InfiniteData<Paginated<ProductSummary>, number>,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: ({ pageParam, signal }) =>
      catalogService.getProducts({ ...params, page: pageParam, limit: PRODUCTS_PAGE_SIZE }, signal),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const limit = last.limit ?? PRODUCTS_PAGE_SIZE;
      const totalPages = last.totalPages ?? Math.ceil((last.total ?? 0) / limit);
      const current = last.page ?? 1;
      return current < totalPages ? current + 1 : undefined;
    },
    initialData,
  });
}

/** Cursor-based infinite search (faceted `/products/search`). */
export function useInfiniteSearch(params: ProductSearchParams) {
  return useInfiniteQuery({
    queryKey: queryKeys.products.search(params),
    queryFn: ({ pageParam, signal }) =>
      catalogService.searchProducts({ ...params, cursor: pageParam }, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last: CursorPage<ProductSummary>) =>
      last.hasMore ? (last.nextCursor ?? undefined) : undefined,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: ({ signal }) => catalogService.getCategories(signal),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBrands() {
  return useQuery<Brand[]>({
    queryKey: queryKeys.brands.all,
    queryFn: ({ signal }) => catalogService.getBrands(signal),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(slug: string, initialData?: ProductDetail) {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: ({ signal }) => catalogService.getProductBySlug(slug, signal),
    enabled: Boolean(slug),
    initialData,
  });
}
