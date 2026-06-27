---
title: "BuyHat Frontend — Phase 4: Authentication & Authorization"
author: "Principal Frontend Architecture"
date: "2026-06-27"
---

# Phase 4 — Authentication & Authorization

> Part of [`FRONTEND_PROJECT_PLAN.md`](./FRONTEND_PROJECT_PLAN.md). Prerequisite: **Phase 3 complete**.
> Builds on the BFF httpOnly-cookie auth (FD2) and the typed `authService` from Phase 3.

---

## 1. Objective

Deliver the full authentication experience and authorization guards: session bootstrap (silent
refresh), login/register/password flows (RHF + Zod), a global session store, role-based route guards
for admin + account areas, logout, and **guest-cart merge on login**.

---

## 2. Architecture

### 2.1 Session state

- **`store/auth-store.ts`** (Zustand) holds the session snapshot `{ user, status }` —
  `idle → loading → authenticated | unauthenticated`. The access token stays in `token-storage`
  (single source); the store mirrors the _user_, not the token.
- **`AuthProvider`** runs once on mount: calls `authService.refresh()` (httpOnly cookie → fresh access
  token); on success fetches `GET /auth/me` and sets the session, else marks unauthenticated. This
  restores the session after a reload (access token is memory-only).

### 2.2 Auth actions (hooks)

`useLogin` / `useRegister` / `useLogout` (TanStack mutations) orchestrate: call BFF via `authService`
→ hydrate `/auth/me` → set store → **merge guest cart** (`cartService.mergeGuestCart` then
`clearGuestId`) → invalidate `cart`/`auth` queries. `meta.silentError` keeps auth errors inline (no
global toast). `useSession` / `useHasRole` are the read selectors.

### 2.3 Guards (defense in depth)

- **`middleware.ts`** — coarse, fast, server-side: routes under `/admin/*` and `/account/*` require the
  presence of the refresh cookie, else redirect to `/login?redirect=…`. (No flash for logged-out users.)
- **`RequireAuth` / `RequireRole`** — client guards that wait for hydration, then enforce auth/roles
  (roles need `/auth/me`, which middleware can't see). Admin layout uses `RequireRole(STAFF_ROLES)`.

---

## 3. Files to Create

### State & providers

`store/auth-store.ts` · `providers/auth-provider.tsx` · `middleware.ts`.

### Feature — `features/auth/`

`schemas/auth-schemas.ts` (login/register/forgot/reset Zod) · `hooks/use-auth.ts`
(login/register/logout) · `hooks/use-session.ts` (`useSession`, `useHasRole`) ·
`components/{auth-card,login-form,register-form,forgot-password-form,reset-password-form,verify-email-content,guards}.tsx`.

### Shared

`components/shared/text-field.tsx` (RHF-friendly labelled input + error) ·
`components/shared/password-field.tsx` (show/hide toggle).

### Routes — `app/(auth)/`

`layout.tsx` (centered brand card) · `login` · `register` · `forgot-password` · `reset-password` ·
`verify-email` pages. Plus `app/(admin)/layout.tsx` (shell + `RequireRole`) and a minimal
`app/(admin)/page.tsx` placeholder (real dashboard = Phase 11).

## 4. Files to Modify

`providers/app-providers.tsx` (mount `AuthProvider`).

## 5. Dependencies

`react-hook-form`, `@hookform/resolvers` (Zod already present).

## 6. Validation Checklist

- [ ] `lint` / `typecheck` / `format:check` / `build` green.
- [ ] Boot refresh restores session after reload; status transitions correct; no hydration mismatch.
- [ ] Login/register validate (Zod), show inline server errors, redirect to `?redirect` or home.
- [ ] Logout revokes refresh cookie + clears session + query cache.
- [ ] Guest cart merges into user cart on login, exactly once; guest id cleared after.
- [ ] `/admin/*` blocked for guests (middleware) and for authed non-staff (RequireRole); `/account/*`
      requires auth.
- [ ] All icon/inputs accessible (labels, `aria-invalid`, `aria-describedby`, focus, keyboard).

## 7. Self-Review Criteria

Security (memory access token, httpOnly refresh, role checks server+client) · Type safety (Zod-inferred
form types, typed store) · UX (loading gates, no content flash, inline errors) · DRY (one TextField,
one guard pattern) · Accessibility (labelled fields, error association) · Separation (store vs hooks vs
UI).

## 8. Out of Scope

Account pages/content (Phase 9) · admin dashboard content (Phase 11) · cart UI (Phase 6 — merge logic
lands here, cart rendering later).
