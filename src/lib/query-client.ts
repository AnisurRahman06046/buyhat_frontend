import { isServer, MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { isApiError } from "@/services/http-error";
import type { ApiError } from "@/types/common";

/** Toast a normalized error on the client; never on the server or for cancels/401. */
function toastError(error: unknown): void {
  if (typeof window === "undefined") return;
  if (!isApiError(error)) return;
  if (error.isCancelled || error.status === 401) return;
  toast.error(error.message);
}

/** Don't retry client errors (4xx) or cancellations; one retry for 5xx/network. */
function shouldRetry(failureCount: number, error: unknown): boolean {
  const e = error as ApiError;
  if (e?.isCancelled) return false;
  if (typeof e?.status === "number" && e.status >= 400 && e.status < 500) return false;
  return failureCount < 1;
}

/**
 * QueryClient factory with production defaults + global error surfacing.
 * Components can opt a query/mutation out of the global toast via
 * `meta: { silentError: true }` (e.g. forms that render inline field errors).
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.meta?.silentError) return;
        // Queries: only surface server/network failures (avoid noisy 404s).
        if (isApiError(error) && error.status >= 500) toastError(error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _vars, _ctx, mutation) => {
        if (mutation.meta?.silentError) return;
        toastError(error);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * One client per request on the server (no cross-request leakage); a singleton in
 * the browser (survives re-renders). Standard Next.js App Router pattern.
 */
export function getQueryClient(): QueryClient {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
