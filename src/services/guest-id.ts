/**
 * Guest identity for the guest cart. The backend correlates anonymous carts via
 * the `X-Guest-Id` header. We persist the id in localStorage (durable) and mirror
 * it to a cookie so SSR/route handlers can read it too.
 *
 * `getGuestId` only *peeks* (never creates) so the request interceptor doesn't
 * mint an id for every visitor. `ensureGuestId` creates on demand — call it right
 * before the first guest mutation (e.g. add-to-cart).
 */

const GUEST_ID_KEY = "buyhat_guest_id";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function getGuestId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(GUEST_ID_KEY);
}

export function ensureGuestId(): string {
  if (typeof window === "undefined") {
    throw new Error("ensureGuestId() is browser-only.");
  }
  let id = window.localStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(GUEST_ID_KEY, id);
    document.cookie = `${GUEST_ID_KEY}=${id}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
  }
  return id;
}

export function clearGuestId(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(GUEST_ID_KEY);
  document.cookie = `${GUEST_ID_KEY}=; path=/; max-age=0; samesite=lax`;
}
