import { getServerEnv } from "@/config/env";

/** Error thrown by `serverApi` for non-2xx backend responses (RSC/SSR). */
export class ServerApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ServerApiError";
  }
}

interface ServerFetchOptions extends Omit<RequestInit, "cache"> {
  /** ISR window in seconds, or `false` to opt out of caching (dynamic). */
  revalidate?: number | false;
  /** Optional bearer token for authenticated SSR. */
  token?: string;
}

/**
 * Server-side fetch to the backend for RSC / route handlers. Leverages Next's
 * cache + revalidation. No per-request module state, so it is safe across
 * concurrent requests (unlike the browser `apiClient`).
 */
export async function serverApi<T>(path: string, options: ServerFetchOptions = {}): Promise<T> {
  const { BACKEND_API_URL } = getServerEnv();
  const { revalidate, token, headers, ...rest } = options;

  // Next forbids combining `cache: 'no-store'` with `next.revalidate`.
  const cacheControl: RequestInit & { next?: { revalidate: number } } =
    revalidate === undefined
      ? {}
      : revalidate === false
        ? { cache: "no-store" }
        : { next: { revalidate } };

  const res = await fetch(`${BACKEND_API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...cacheControl,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new ServerApiError(res.status, body.message ?? `Backend request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

/**
 * Raw JSON POST proxy used by the BFF auth handlers. Returns the backend status
 * and parsed body untouched so the handler can set cookies and forward errors.
 */
export async function backendPost(
  path: string,
  body: unknown,
): Promise<{ status: number; data: unknown }> {
  const { BACKEND_API_URL } = getServerEnv();
  const res = await fetch(`${BACKEND_API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}
