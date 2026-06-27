import axios from "axios";

import type { ApiError, NestErrorBody } from "@/types/common";

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";
const NETWORK_MESSAGE = "Network error. Check your connection and try again.";

/**
 * Normalize any thrown value into a typed {@link ApiError}. The api-client
 * rejects with this, so every `catch` (and TanStack Query `error`) is typed and
 * UI-ready — no raw Axios objects leak into components.
 */
export function normalizeError(error: unknown): ApiError {
  if (axios.isCancel(error)) {
    return { status: 0, message: "Request cancelled", isCancelled: true, code: "CANCELLED" };
  }

  if (axios.isAxiosError(error)) {
    if (error.code === "ERR_CANCELED") {
      return { status: 0, message: "Request cancelled", isCancelled: true, code: "CANCELLED" };
    }

    const status = error.response?.status ?? 0;
    const body = error.response?.data as NestErrorBody | undefined;

    if (!error.response) {
      return { status: 0, message: NETWORK_MESSAGE, code: "NETWORK" };
    }

    let message = FALLBACK_MESSAGE;
    let details: string[] | undefined;

    if (body?.message) {
      if (Array.isArray(body.message)) {
        details = body.message;
        message = body.message[0] ?? FALLBACK_MESSAGE;
      } else if (typeof body.message === "string") {
        message = body.message;
      }
    }

    return { status, message, details, code: body?.error };
  }

  if (error instanceof Error) {
    return { status: 0, message: error.message || FALLBACK_MESSAGE };
  }

  return { status: 0, message: FALLBACK_MESSAGE };
}

/**
 * Build an {@link ApiError} from a raw response status + parsed body. Used by the
 * BFF auth calls (fetch-based), which receive the backend's error body verbatim.
 */
export function apiErrorFromBody(status: number, body: unknown): ApiError {
  const b = body as NestErrorBody | undefined;
  let message = FALLBACK_MESSAGE;
  let details: string[] | undefined;

  if (b?.message) {
    if (Array.isArray(b.message)) {
      details = b.message;
      message = b.message[0] ?? FALLBACK_MESSAGE;
    } else if (typeof b.message === "string") {
      message = b.message;
    }
  }

  return { status, message, details, code: b?.error };
}

/** Type guard for the normalized error shape. */
export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    "message" in value &&
    typeof (value as ApiError).message === "string"
  );
}
