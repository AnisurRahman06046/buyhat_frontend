import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { clientEnv } from "@/config/env";

import { getGuestId } from "./guest-id";
import { normalizeError } from "./http-error";
import { clearAccessToken, getAccessToken, setAccessToken } from "./token-storage";

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _retryCount?: number;
};

const MAX_GET_RETRIES = 2;

/**
 * The single Axios instance — the ONLY place HTTP to the backend lives.
 * `withCredentials` is false: backend auth is Bearer (CORS `*`), and the refresh
 * cookie is same-origin (handled by the BFF fetch, not this client).
 */
export const apiClient = axios.create({
  baseURL: clientEnv.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// ── Request: attach access token + guest id ────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const guestId = getGuestId();
  if (guestId) config.headers["X-Guest-Id"] = guestId;

  return config;
});

// ── Single-flight refresh ──────────────────────────────────────────────────
let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch("/api/auth/refresh", { method: "POST" });
    if (!res.ok) return null;
    const data = (await res.json()) as { accessToken?: string };
    if (data.accessToken) {
      setAccessToken(data.accessToken);
      return data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

/** Concurrent 401s share one in-flight refresh. */
function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function isRetriableGet(error: AxiosError, config: RetryableConfig): boolean {
  if ((config.method ?? "get").toLowerCase() !== "get") return false;
  const status = error.response?.status;
  // Network failure (no response) or transient server error.
  return status === undefined || status >= 500;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Response: refresh-on-401, retry idempotent GETs, normalize errors ──────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;

    if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
      return Promise.reject(normalizeError(error));
    }

    const status = error.response?.status;

    // 401 → attempt a single silent refresh, then replay the request.
    if (status === 401 && config && !config._retry) {
      config._retry = true;
      const token = await refreshAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        return apiClient(config);
      }
      clearAccessToken();
      return Promise.reject(normalizeError(error));
    }

    // Transient GET failures → exponential backoff retry.
    if (config && isRetriableGet(error, config)) {
      const attempt = config._retryCount ?? 0;
      if (attempt < MAX_GET_RETRIES) {
        config._retryCount = attempt + 1;
        await delay(300 * 2 ** attempt);
        return apiClient(config);
      }
    }

    return Promise.reject(normalizeError(error));
  },
);
