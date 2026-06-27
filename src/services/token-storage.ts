/**
 * In-memory access-token holder. The access token is deliberately NOT persisted
 * (no localStorage) — it is XSS-resilient and short-lived. The durable credential
 * is the httpOnly refresh cookie managed by the BFF; on reload the session is
 * restored via silent refresh (Phase 4 AuthProvider).
 *
 * This is a plain module (no React) so the api-client can read it without a
 * provider. The Zustand auth store (Phase 4) keeps this in sync on login/refresh.
 */

let accessToken: string | null = null;

type Listener = (token: string | null) => void;
const listeners = new Set<Listener>();

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
  for (const listener of listeners) listener(token);
}

export function clearAccessToken(): void {
  setAccessToken(null);
}

/** Subscribe to token changes; returns an unsubscribe function. */
export function subscribeAccessToken(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
