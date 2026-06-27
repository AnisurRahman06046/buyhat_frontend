---
title: "BuyHat — Frontend Project Plan"
subtitle: "Production-grade Next.js 15 storefront + admin panel · 13-phase roadmap"
author: "Principal Frontend Architecture"
date: "2026-06-27"
---

# BuyHat Frontend — Project Plan

> **Status:** Planning complete. Execution proceeds **phase by phase** (Phase 0 → Phase 13).
> **Single source of truth for UI:** `buyhat_e_commerce_design_system` (nexus — _SaaS Commerce Velocity_).
> **Backend contract:** `Buyhat_backend` (`http://localhost:3000/api/v1`) + `docs/BuyHat.postman_collection.json`.

---

## 1. Objective

Build the complete, production-ready frontend for the BuyHat e-commerce platform: a **public customer storefront** and an **admin panel**, implemented as **one Next.js 15 (App Router) application** with route groups. The codebase must be maintainable, scalable, secure, accessible (WCAG AA), performant (Core Web Vitals), and faithful to the existing Design System. No redesign — implement the provided designs with production-quality code.

This is **not** a prototype.

---

## 2. Tech Stack (locked)

| Concern             | Choice                                                      |
| ------------------- | ----------------------------------------------------------- |
| Framework           | Next.js 15 (App Router, React Server Components)            |
| Language            | TypeScript (strict)                                         |
| Styling             | Tailwind CSS v4 (`@theme` tokens)                           |
| UI primitives       | shadcn/ui + Radix UI + Lucide icons                         |
| Server state        | TanStack Query v5                                           |
| Global client state | Zustand                                                     |
| Local state         | `useState` / `useReducer`                                   |
| Forms               | React Hook Form + Zod                                       |
| HTTP                | Axios (single instance + interceptors)                      |
| Auth                | JWT access (memory) + refresh (httpOnly cookie via BFF)     |
| Charts              | Recharts (admin analytics)                                  |
| DnD                 | `@dnd-kit` (CMS builder, order kanban)                      |
| Tables              | TanStack Table (admin data grids)                           |
| Tooling             | ESLint, Prettier, Husky, lint-staged, commitlint            |
| Testing             | Vitest + Testing Library (unit), Playwright (e2e, optional) |

---

## 3. Architecture

### 3.1 Application model

One Next.js app, three route groups:

- `app/(shop)/…` — public + authenticated customer storefront
- `app/(admin)/…` — role-guarded admin panel
- `app/(auth)/…` — login / register / password flows
- `app/api/…` — **BFF route handlers** (auth proxy, cookie management, image proxy if needed)

### 3.2 Folder structure (feature-based)

```
src/
  app/                      # Next.js routes (thin — compose features)
    (shop)/ (admin)/ (auth)/ api/
  components/
    ui/                     # shadcn primitives (button, input, dialog…)
    shared/                 # cross-feature composites (DataTable, EmptyState, Pagination, PriceTag, RatingStars, Countdown…)
    layout/                 # headers, footers, sidebars, shells
  features/
    auth/ catalog/ cart/ checkout/ orders/ profile/
    reviews/ promotions/ cms/ inventory/ payments/ admin-dashboard/ search/
      <feature>/
        components/         # feature-owned UI
        hooks/              # TanStack Query hooks
        api/                # service functions (typed)
        schemas/            # Zod schemas
        types.ts
  services/                 # api-client + low-level domain services
  hooks/                    # generic reusable hooks (useDebounce, useMediaQuery…)
  store/                    # Zustand stores (auth, ui, wishlist, cart-drawer)
  lib/                      # query-client, utils, formatters, cn, guards
  types/                    # shared/global types + API DTOs
  config/                   # env, routes, query-keys, site config
  constants/                # enums, role maps, status maps
  providers/                # QueryProvider, ThemeProvider, AuthProvider…
  styles/                   # globals.css (@theme tokens)
  assets/
```

### 3.3 Data-flow contract

`Component → Feature Hook (TanStack Query) → Service (typed) → Axios api-client → Backend`.
UI never calls `fetch`/`axios` directly. Services never contain React. Hooks own caching/invalidation.

### 3.4 State ownership rules

- **Server data** (products, cart, orders, inventory, reviews, promotions, profile) → TanStack Query only.
- **Global client UI** (auth session snapshot, cart drawer, mobile menu, wishlist ids, theme, filter-panel open) → Zustand only.
- **Ephemeral component state** (inputs, modal open, checkout step) → local React state.
- Never Zustand for server data; never TanStack Query for UI state; never Redux.

---

## 4. Design System Reference (tokens)

| Role         | Token                                                            | Usage                                               |
| ------------ | ---------------------------------------------------------------- | --------------------------------------------------- |
| Primary      | Deep Blue `#1E3A8A`                                              | structure, nav, brand, prices                       |
| CTA / Accent | Orange `#F97316`                                                 | **only** primary conversion (Add to Cart, Checkout) |
| Success      | Emerald `#006C49`                                                | in-stock, paid, active                              |
| Urgency      | Red `#BA1A1A`                                                    | low stock, countdowns, destructive                  |
| Stars        | Gold `#FACC15`                                                   | ratings                                             |
| Surface base | `#F8FAFC`                                                        | page background                                     |
| Card         | `#FFFFFF` + 1px `#E2E8F0` + soft shadow                          | level-1 elevation                                   |
| Fonts        | Manrope (head/price), Inter (body/UI), JetBrains Mono (SKU/meta) | typography                                          |
| Radius       | 12px card/input, 8px button, pill chips                          | shapes                                              |
| Grid         | 8pt scale, 12-col desktop, 24px gutter, 1280px max               | layout                                              |
| Currency     | **BDT (৳)**                                                      | locale = Bangladesh single-seller                   |

Elevation = tonal layers + soft ambient shadows; overlays use 8px backdrop blur. Skeletons mirror component radius. Empty states centered with a primary action.

---

## 5. Backend Contract (locked)

- Base URL `http://localhost:3000/api/v1` (global prefix `api`, URI version `v1`). CORS `*`.
- Auth: `register`/`login`/`refresh` → `{ accessToken, refreshToken, tokenType }`; `refresh` & `logout` take `{ refreshToken }` in body; `GET /auth/me` → `{ id, email, roles[] }`.
- Roles: `CUSTOMER, ADMIN, INVENTORY_MANAGER, CUSTOMER_SUPPORT, MARKETING_MANAGER`.
- Guest cart via `X-Guest-Id` header; `POST /cart/merge` on login.
- Endpoint families: auth, users(+addresses), categories, attributes(+options), brands, products(+detail/publish/variants/attribute-values/media), variants, cart(+coupon/merge), inventory(+movements/reserve/release/confirm), orders(+status/cancel/returns), payments(+initiate/webhook/refund/capture), coupons, flash-sales(+active), promotions, cms(homepage/sections/banners/popups/landing-pages), reviews(+moderation), notifications(prefs/templates), reports(sales/products/customers/inventory), audit, health.

---

## 6. Locked Decisions (Decisions Log)

| #   | Decision           | Choice                                                                                                                                                                                                         | Rationale                                                                                |
| --- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| FD1 | App topology       | Single Next.js app, route groups `(shop)/(admin)/(auth)`                                                                                                                                                       | Shared components, one build, simpler ops; matches brief `src/`.                         |
| FD2 | Auth token storage | **BFF httpOnly cookies** — refresh token in httpOnly+Secure+SameSite cookie via Next route handlers; access token in memory                                                                                    | XSS-safe, silent refresh + rotation, SSR can read session.                               |
| FD3 | Payments UI        | **Show bKash/Nagad/Card/COD**; COD fully wired; online methods routed through MOCK gateway + webhook                                                                                                           | Designs preserved; full flow works today; swap to real adapters later with no UI change. |
| FD4 | Design language    | nexus _SaaS Commerce Velocity_ tokens are canonical; premium-storefront screens used only for page **layouts** nexus lacks (product detail, wishlist, profile, order confirmation), re-skinned to nexus tokens | Brief names nexus as the design system.                                                  |
| FD5 | Brand              | "BuyHat" replaces mock placeholders ("LUXE RETAIL"/"Commerce Velocity")                                                                                                                                        | Real brand.                                                                              |
| FD6 | Currency/locale    | BDT `৳`, `en-BD` number formatting                                                                                                                                                                             | Matches checkout design + payment methods.                                               |
| FD7 | Rendering strategy | RSC + SSR for SEO pages (home, PLP, PDP), ISR for CMS homepage, CSR islands for interactive widgets                                                                                                            | Core Web Vitals + SEO.                                                                   |

---

## 7. Phase Roadmap (0 → 13)

Each phase ends with a **self-review** (architecture, code quality, SOLID/DRY, a11y, performance, security, responsiveness, type-safety, reusability) and must satisfy production-quality before the next begins.

### Phase 0 — Repository & Toolchain Bootstrap

**Objective:** Create the Next.js 15 + TS app and all engineering guardrails.
**Scope:** `create-next-app` (App Router, TS, Tailwind v4, ESLint); Prettier + import-sort; Husky + lint-staged + commitlint; `tsconfig` paths (`@/*`); env schema (`env.ts` with Zod validation); `.env.example`; folder skeleton from §3.2; CI lint/typecheck workflow; README.
**Deliverables:** Bootable app, green `lint`/`typecheck`/`build`.
**Validation:** `npm run build` passes; pre-commit hook blocks bad commits; strict TS on.

### Phase 1 — Design Foundation & Configuration

**Objective:** Encode the Design System and core config.
**Scope:** Tailwind v4 `@theme` tokens (colors, fonts, radius, spacing, shadows) from §4; fonts via `next/font` (Manrope, Inter, JetBrains Mono); `globals.css`; `cn()` util; site config, route constants, query-key factory; providers (QueryProvider with hydration, ThemeProvider, Toaster); base metadata + SEO defaults; money/date/number formatters (BDT).
**Deliverables:** Themed shell renders; tokens usable as Tailwind classes.
**Validation:** Token parity with DESIGN.md; fonts load with no CLS; providers mounted.

### Phase 2 — Shared UI Component Library

**Objective:** Build the reusable, accessible primitives + composites every page consumes.
**Scope:** shadcn primitives (Button w/ CTA/secondary/ghost variants, Input, Select, Checkbox, Radio, Dialog, Sheet/Drawer, Dropdown, Tabs, Tooltip, Badge, Toast, Skeleton, Pagination, Accordion, Avatar, Switch, Slider). Shared composites: `PriceTag`, `RatingStars`, `DiscountBadge`, `StockStatus`, `QuantityStepper`, `Countdown`, `EmptyState`, `ErrorState`, `DataTable` (sort/filter/paginate/select), `SectionHeader`, `Breadcrumbs`, `ImageWithFallback` (next/image wrapper). Layout shells: `ShopHeader` (sticky, blur, search, account/wishlist/cart), `AnnouncementBar`, `ShopFooter`, `AdminSidebar`, `AdminTopbar`.
**Deliverables:** Storybook-less but documented component set; all keyboard + screen-reader accessible.
**Validation:** A11y pass (focus rings, ARIA, semantics); responsive at 360/768/1280; zero duplication.

### Phase 3 — API Layer & Networking

**Objective:** The only place HTTP lives.
**Scope:** `api-client.ts` (Axios instance, `withCredentials`, request/response interceptors, 401→silent refresh queue, retry w/ backoff for idempotent GETs, request cancellation via AbortSignal, typed error normalization); BFF route handlers `app/api/auth/[login|refresh|logout]` setting httpOnly cookies; guest-id provider (cookie + header injection); all domain services (`auth, user, catalog, cart, order, payment, promotion, review, cms, notification, inventory, report, audit`) with typed DTOs in `types/`; TanStack Query client config (staleTime, retry, error boundary integration).
**Deliverables:** End-to-end typed call path; refresh works under concurrent 401s.
**Validation:** No `fetch`/axios in components; single-flight refresh; typed responses; cancellation on unmount.

### Phase 4 — Authentication & Authorization

**Objective:** Secure login/register/session + route guards.
**Scope:** `(auth)` pages (login, register, forgot-password, reset-password, verify-email) with RHF+Zod; auth Zustand store (session snapshot, not tokens); `AuthProvider` hydrating session from `/auth/me`; middleware + layout guards for `(admin)` (role check) and authenticated `(shop)` routes; logout; **guest-cart merge on login**; role-based UI gating helper (`useHasRole`).
**Deliverables:** Working auth with cookie-based refresh; admin routes blocked for non-staff.
**Validation:** Protected routes redirect; refresh rotation; merge fires once; no token in JS-readable storage.

### Phase 5 — Catalog (Listing · Detail · Search)

**Objective:** Product discovery.
**Scope:** Category/PLP with sidebar filters (dynamic attributes, price range, brand, rating, availability), sort, **keyset/load-more**; PDP (gallery, dynamic variant selectors from attribute model, qty stepper, sticky Add-to-Cart + Buy Now, trust badges, tabs: description/specs/reviews/shipping, related products, recently-viewed); faceted Search page (`/products/search`); breadcrumbs; SEO metadata + JSON-LD Product/Breadcrumb; image optimization; skeletons.
**Deliverables:** SSR PLP/PDP, filterable, add-to-cart wired.
**Validation:** <3 clicks to product; SEO tags + structured data; variant logic matches dynamic attribute model.

### Phase 6 — Cart (Guest + Customer)

**Objective:** Cart with guest support and merge.
**Scope:** Cart drawer (Zustand open state) + full cart page; guest cart via `X-Guest-Id`; add/update/remove/clear; price-snapshot + revalidation banners; availability annotations; coupon apply/remove; optimistic updates with rollback; mini-cart badge count.
**Deliverables:** Persistent guest cart; coupons; optimistic UX.
**Validation:** Guest→login merge; optimistic rollback on error; stock/price revalidation surfaced.

### Phase 7 — Checkout & Payments

**Objective:** Low-friction conversion.
**Scope:** 3-step single-page checkout (shipping info — inline + saved address; delivery options; payment methods) per design; RHF+Zod per step with local step state; order summary sidebar (subtotal/shipping/tax/total, BDT); place order → `POST /orders`; payment initiate (COD confirm-at-placement; bKash/Nagad/Card → MOCK initiate + webhook poll/redirect); inventory revalidation before pay; error/empty states.
**Deliverables:** Working checkout → order → payment → confirmation.
**Validation:** COD + MOCK flows complete; price lock; reservation respected; guest checkout allowed (login at payment step).

### Phase 8 — Orders (Tracking · History · Returns)

**Objective:** Post-purchase.
**Scope:** Order success page (confirmation + summary + JSON-LD); order history list; order detail with lifecycle timeline (Pending→…→Delivered, plus cancel/return/refund paths); cancel order; request return (RETURN flow); track order.
**Deliverables:** Full order lifecycle UI.
**Validation:** Timeline matches backend states; cancel/return guarded by status; optimistic refresh.

### Phase 9 — Profile & Account

**Objective:** Self-service account.
**Scope:** Customer dashboard; profile edit (RHF+Zod, `PATCH /users/me`); address book (CRUD + set default); my reviews; notification preferences; my orders entry; wishlist page (Zustand ids + product hydration).
**Deliverables:** Complete account area.
**Validation:** Address default toggle; optimistic profile save; wishlist persists.

### Phase 10 — CMS-Driven Homepage & Promotions Surface

**Objective:** Configurable storefront home.
**Scope:** Render `GET /cms/homepage` sections (hero slider, flash-sale countdown, category grid, featured/best-sellers, brands, banner, newsletter) via a **section registry** (type→component); ISR; announcement bar; promotion popup engine (rules: once/session/after-Ns/exit-intent; audience guests/users/all); active banners; flash-sale countdown + active products; related/recently-viewed surfaces.
**Deliverables:** Dynamic, admin-controlled homepage.
**Validation:** Unknown section types degrade gracefully; popup rules honored; ISR revalidation.

### Phase 11 — Admin: Catalog, Inventory, Orders, Customers

**Objective:** Operational admin core.
**Scope:** Admin shell (sidebar nav + role gating); Dashboard (KPI cards, revenue chart [Recharts], fulfillment distribution, recent activity, reports endpoints); Products table (bulk actions, inline status toggle, filters, pagination); Product/Variant editor; **Dynamic Attribute Builder** (categories ↔ attributes ↔ options); Categories tree; Inventory (stock table, low-stock alerts, stock-in/out/adjustment/return/damage modals, movements ledger); **Orders kanban** (DnD status transitions, order drawer, returns moderation); Payments tracking + refunds; Customers list/detail (status/roles).
**Deliverables:** Staff can run the store.
**Validation:** Tables sort/filter/paginate/bulk; inline edit; kanban transitions call status API; role guards enforced.

### Phase 12 — Admin: CMS Builder, Promotions, Reviews, Reports, Settings

**Objective:** Marketing + governance admin.
**Scope:** **CMS Homepage Builder** (3-panel: page-structure DnD list with visibility toggles · live device preview · section config panel; save/discard draft); Banner & Popup management (schedule/audience/rules); Coupons / Flash-sales / Campaigns CRUD; Reviews moderation queue (approve/reject); Reports (sales/products/customers/inventory with date ranges + export); Notifications templates; Settings + **Role management**; Audit log viewer.
**Deliverables:** Full marketing + governance suite.
**Validation:** Builder DnD + live preview + persistence; schedule/audience honored; reports parameterized; RBAC.

### Phase 13 — Optimization, Hardening & Release Readiness

**Objective:** Production polish.
**Scope:** Code-splitting + dynamic imports audit; route-level Suspense + streaming; image/CDN tuning; bundle analysis; prefetching + cache headers; Core Web Vitals (LCP/CLS/INP) pass; full a11y audit (axe); SEO (sitemap.xml, robots.txt, canonicals, OG/Twitter, JSON-LD coverage); error boundaries + global error/loading/not-found; security headers (CSP, etc.); skeleton/optimistic coverage; final cross-feature self-review + refactor.
**Deliverables:** Release-ready build.
**Validation:** Lighthouse ≥ targets; axe clean; bundle within budget; all flows resilient offline/slow.

---

## 8. Cross-Cutting Requirements (every phase)

- **Accessibility (WCAG AA):** keyboard nav, focus management, ARIA, semantic HTML, contrast.
- **Performance:** RSC-first, client components only when needed; lazy/dynamic; `next/image`; Suspense + streaming; skeletons; optimistic updates; prefetch.
- **SEO:** metadata, OG/Twitter, JSON-LD, canonical, breadcrumbs, sitemap/robots ready.
- **Security:** httpOnly refresh cookie, no secrets client-side, input validation (Zod), output encoding, RBAC guards, CSRF-safe BFF.
- **Code quality:** SOLID, DRY, KISS, composition over inheritance, strict TS (no `any`), separation of concerns, no duplicated business logic.
- **Output per phase:** Objective · Files to Create · Files to Modify · Implementation Plan · Code · Explanation · Validation Checklist · Self-Review.

---

## 9. Milestones

| Milestone              | Phases | Outcome                                  |
| ---------------------- | ------ | ---------------------------------------- |
| M1 — Foundation        | 0–3    | App boots, design tokens, full API layer |
| M2 — Customer MVP      | 4–7    | Browse → cart → checkout → pay           |
| M3 — Customer Complete | 8–10   | Orders, account, CMS home, promotions    |
| M4 — Admin Complete    | 11–12  | Full operational + marketing admin       |
| M5 — Production Ready  | 13     | Optimized, audited, release-ready        |

---

## 10. Risks & Mitigations

| Risk                                  | Mitigation                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------ |
| Dynamic attribute/variant complexity  | Drive PDP selectors + admin builder from backend attribute model; no hardcoded attributes. |
| Backend evolving (uncommitted phases) | Services typed + isolated; only service files change if API shifts.                        |
| Payment adapters incomplete           | FD3 — MOCK-backed online methods, COD real; UI stable across swap.                         |
| SSR + httpOnly auth interplay         | BFF route handlers + server-readable session; documented in Phase 4.                       |
| Scope size                            | Strict phase gating + per-phase self-review; shared components prevent rework.             |

---

_This plan is the frontend counterpart to the backend `PROJECT_PLAN.md`. Execution begins at Phase 0 and proceeds sequentially; no phase is skipped, and each is self-reviewed to production quality before the next._
