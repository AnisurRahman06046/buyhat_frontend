import { serverApi } from "@/lib/server/backend";
import type { Brand, Category, ProductDetail, ProductSummary } from "@/types/catalog";
import type { Paginated } from "@/types/common";

/** Build a query string from a params bag, dropping empty values. */
function toQuery(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") sp.set(key, String(value));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** RSC fetchers (cached/revalidated) used by SEO pages for SSR first paint. */
export function getProductsServer(
  params: Record<string, unknown> = {},
): Promise<Paginated<ProductSummary>> {
  return serverApi<Paginated<ProductSummary>>(
    `/products${toQuery({ page: 1, limit: 12, ...params })}`,
    { revalidate: 60 },
  );
}

export function getProductBySlugServer(slug: string): Promise<ProductDetail> {
  return serverApi<ProductDetail>(`/products/${encodeURIComponent(slug)}`, { revalidate: 60 });
}

export function getCategoriesServer(): Promise<Category[]> {
  return serverApi<Category[]>("/categories", { revalidate: 300 });
}

export function getBrandsServer(): Promise<Brand[]> {
  return serverApi<Brand[]>("/brands", { revalidate: 300 });
}
