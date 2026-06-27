---
title: "BuyHat Frontend — Phase 3: API Layer & Networking"
author: "Principal Frontend Architecture"
date: "2026-06-27"
---

# Phase 3 — API Layer & Networking

> Part of [`FRONTEND_PROJECT_PLAN.md`](./FRONTEND_PROJECT_PLAN.md). Prerequisite: **Phase 2 complete**.
> Backend contract: `http://localhost:3000/api/v1` (Bearer tokens in body; `X-Guest-Id` for guest cart).

---

## 1. Objective

Build the **single, centralized networking layer** so UI never touches HTTP directly. Establish the
data-flow contract end to end: `Component → Hook (TanStack Query) → Service (typed) → api-client
(Axios) → Backend`, plus the **BFF auth** that keeps the refresh token in an httpOnly cookie (FD2).

---

## 2. Architecture

### 2.1 Token model (FD2 — BFF httpOnly cookies)

- **Access token** lives in memory only (`token-storage.ts`), attached as `Authorization: Bearer`.
- **Refresh token** never reaches JS — it lives in an httpOnly, Secure, SameSite cookie set by Next
  **BFF route handlers** (`app/api/auth/*`), which proxy the backend's body-token endpoints.
- **Silent refresh:** on a `401`, the api-client calls same-origin `POST /api/auth/refresh` (cookie
  sent automatically), gets a fresh access token, retries the original request — **single-flight** so
  concurrent 401s trigger exactly one refresh. On boot (Phase 4) the same call restores the session.

### 2.2 Two transports

- **`apiClient`** (Axios, browser) — all client-side queries/mutations. Interceptors attach the Bearer
  token + `X-Guest-Id`, normalize errors, refresh on 401, and retry idempotent GETs with backoff.
- **`serverApi`** (fetch, RSC/route handlers) — server-side fetching for SEO pages (SSR/ISR) using
  Next's cache/revalidate. No per-request module state (no cross-request leakage).

### 2.3 Error model

Every failure is normalized to a typed `ApiError { status, message, details?, fieldErrors?, code? }`.
NestJS validation arrays map to `details`; forms consume `fieldErrors`. Cancellations are tagged and
never retried. Global toasts: mutation errors always, query errors only for ≥500 (401 is silent).

---

## 3. Files to Create

### 3.1 Core networking — `src/services/`

| File               | Responsibility                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `token-storage.ts` | in-memory access token holder + subscribe (no persistence)                                            |
| `http-error.ts`    | `normalizeError(unknown) → ApiError` (axios/Nest aware)                                               |
| `api-client.ts`    | Axios instance, request/response interceptors, single-flight refresh, GET retry+backoff, cancellation |
| `guest-id.ts`      | `getGuestId()` (peek) / `ensureGuestId()` (create) — `X-Guest-Id` for guest cart                      |

### 3.2 BFF auth — `src/app/api/auth/*` + `src/lib/server/`

`lib/server/auth-cookies.ts` (set/clear refresh cookie) · `lib/server/backend.ts` (`serverApi` + backend
proxy helper) · route handlers `login`, `register`, `refresh`, `logout` (`route.ts` each).

### 3.3 Domain services — `src/services/*.service.ts`

`auth` · `user` · `catalog` (categories/brands/attributes/products/variants/media) · `cart` ·
`inventory` · `order` · `payment` · `promotion` (coupons/flash-sales/campaigns) · `cms` · `review` ·
`notification` · `report` · `audit`. Each method is typed, returns `response.data`, accepts an optional
`AbortSignal`. `services/index.ts` barrel.

### 3.4 Domain types — `src/types/*.ts`

Typed request payloads + response entities per domain (auth, user, catalog, cart, inventory, order,
payment, promotion, cms, review, notification, report, audit). Pragmatic now; refined against live
responses in each feature phase.

### 3.5 Query layer

Update `lib/query-client.ts` with `QueryCache`/`MutationCache` `onError` → toast (client-guarded);
document the hook convention (`features/<feature>/hooks/*` using `queryKeys` + services).

## 4. Files to Modify

`src/types/common.ts` (extend `ApiError` with `details`) · `src/lib/query-client.ts` (global error
handling) · `.env.example` already covers `BACKEND_API_URL`.

## 5. Endpoint Coverage (from Postman)

auth(9) · users+addresses(11) · categories(8) · attributes(7) · brands(5) · products(12) · variants(2) ·
media(6) · cart(8) · inventory(11) · orders(8) · payments(5) · coupons(5) · flash-sales(6) ·
promotions(5) · cms homepage/sections/banners/popups/landing(20) · reviews(8) · notifications(8) ·
reports(4) · audit(1) · health(3). Every path maps to exactly one typed service method.

## 6. Security

- Refresh token httpOnly + Secure(prod) + SameSite=Lax; never in JS/localStorage.
- Access token in memory only (XSS-resilient; lost on reload → silent refresh restores).
- No secrets in client bundle; BFF uses `BACKEND_API_URL` (server env).
- `withCredentials=false` on backend calls (CORS `*` + Bearer); cookies only on same-origin `/api/auth/*`.

## 7. Validation Checklist

- [ ] `lint` / `typecheck` / `format:check` / `build` green.
- [ ] No `fetch`/`axios` import in any component (only services/BFF).
- [ ] Single-flight refresh: concurrent 401s → one `/api/auth/refresh` call; original requests retried.
- [ ] GET retry on network/5xx with backoff; 4xx + cancellations never retried.
- [ ] BFF sets/rotates/clears httpOnly refresh cookie; access token returned in body only.
- [ ] Errors normalized to `ApiError`; validation arrays surfaced; toasts behave (mutations always, 401 silent).
- [ ] Every service method typed (no `any`), `AbortSignal`-ready.

## 8. Self-Review Criteria

Separation of concerns (HTTP isolated) · DRY (one client, one error normalizer, one token holder) ·
Type safety (typed services + DTOs) · Security (httpOnly refresh, memory access token) · Scalability
(swap baseURL only) · Performance (dedup refresh, GET retry, cancellation, server cache via `serverApi`).

## 9. Out of Scope (later phases)

Feature hooks + optimistic updates (their phases) · auth store/session UI & route guards (Phase 4) ·
exhaustive DTO field coverage (refined per feature) · search cursor specifics (Phase 5).
