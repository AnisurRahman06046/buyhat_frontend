/**
 * Shared, transport-level types. Domain DTOs (Product, Order, …) live with their
 * feature in Phase 3+. These are deliberately defensive about the pagination
 * envelope; the exact backend shape is pinned when services are built (Phase 3).
 */

export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;
export type ID = string;

/** Common list query params used across paginated endpoints. */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

/** Page/limit-style paginated response (admin lists, orders, reviews…). */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

/** Keyset/cursor paging (faceted product search). */
export interface CursorPage<T> {
  items: T[];
  nextCursor: Nullable<string>;
  hasMore: boolean;
}

/** Normalized error surfaced by the api-client interceptor (Phase 3). */
export interface ApiError {
  status: number;
  message: string;
  /** All validation messages (NestJS returns an array of strings). */
  details?: string[];
  /** Field → messages, for form validation mapping. */
  fieldErrors?: Record<string, string[]>;
  code?: string;
  /** True for aborted/cancelled requests — callers should ignore these. */
  isCancelled?: boolean;
}

/** NestJS default error body shape (for the interceptor to normalize). */
export interface NestErrorBody {
  statusCode: number;
  message: string | string[];
  error?: string;
}
