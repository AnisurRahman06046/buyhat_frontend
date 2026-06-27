---
title: "BuyHat Frontend — Phase 2: Shared UI Component Library"
author: "Principal Frontend Architecture"
date: "2026-06-27"
---

# Phase 2 — Shared UI Component Library

> Part of [`FRONTEND_PROJECT_PLAN.md`](./FRONTEND_PROJECT_PLAN.md). Prerequisite: **Phase 1 complete**.
> Design source of truth: nexus _SaaS Commerce Velocity_. All components consume Phase-1 tokens.

---

## 1. Objective

Build the **reusable, accessible, typed, responsive** component library that every page in Phases
5–13 composes. Three layers: shadcn/Radix **primitives** (`components/ui`), cross-feature
**composites** (`components/shared`), and **layout shells** (`components/layout`). No feature/business
logic here — presentational, prop-driven, design-faithful building blocks only.

---

## 2. Approach

- **Primitives** via shadcn (Radix UI under the hood) added against our existing token system — we do
  **not** let the CLI rewrite `globals.css`; tokens stay Phase-1 canonical. `cn` resolves to
  `@/lib/cn`. `tw-animate-css` powers Radix enter/exit transitions.
- **Button** gets a brand **`cta`** variant (orange, conversion-only) + `success`; **Badge** gets
  tone variants matching `BadgeTone` (`neutral/info/success/warning/destructive`).
- **Composites & layout** are hand-authored to the reference screens.
- **DataTable** is a generic, headless wrapper over **TanStack Table** (sort, paginate, row-select,
  empty/loading) reused across all admin tables.

---

## 3. Component Inventory

### 3.1 Primitives — `src/components/ui/`

`button` (variants: default·cta·secondary·outline·ghost·destructive·success·link; sizes sm·default·lg·icon) ·
`input` · `textarea` · `label` · `badge` (tones) · `skeleton` · `separator` · `select` · `checkbox` ·
`radio-group` · `switch` · `slider` · `dialog` · `sheet` (drawer) · `dropdown-menu` · `tabs` ·
`tooltip` · `avatar` · `accordion` · `sonner` (Phase 1).

### 3.2 Composites — `src/components/shared/`

| Component           | Purpose                                                                  |
| ------------------- | ------------------------------------------------------------------------ |
| `PriceTag`          | price + compare-at (strike) + optional discount %, BDT via formatter     |
| `DiscountBadge`     | `% OFF` pill (CTA/accent)                                                |
| `RatingStars`       | gold stars (full/half), optional count, sizes; accessible label          |
| `StatusBadge`       | maps `BadgeTone` status meta → `Badge` (orders/payments/returns/reviews) |
| `StockStatus`       | In Stock / Low Stock (N left) / Out of Stock with tone + bar             |
| `QuantityStepper`   | −/＋ with min/max/disabled, keyboard + aria                              |
| `Countdown`         | flash-sale timer (days/hrs/min/sec), client, cleans up; `onComplete`     |
| `EmptyState`        | icon + title + description + primary action                              |
| `ErrorState`        | error icon + message + retry                                             |
| `Spinner`           | accessible loading spinner                                               |
| `SectionHeader`     | eyebrow + title + description + trailing action                          |
| `Breadcrumbs`       | semantic nav + JSON-LD-ready trail                                       |
| `ImageWithFallback` | `next/image` wrapper: skeleton while loading, fallback on error          |
| `Pagination`        | page list + prev/next (storefront load-more & admin tables)              |
| `DataTable<T>`      | TanStack Table: columns, sorting, pagination, selection, empty/loading   |

### 3.3 Layout shells — `src/components/layout/`

| Component         | Purpose                                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `AnnouncementBar` | dismissible top promo bar (CMS-driven later)                                                    |
| `ShopHeader`      | sticky, blurred; logo, primary nav, search, account/wishlist/cart (badge) + mobile `Sheet` menu |
| `ShopFooter`      | 4-column links + newsletter + brand + legal                                                     |
| `AdminSidebar`    | role-aware nav (active state), brand, user block, support/logout                                |
| `AdminTopbar`     | global search, notifications, help, user dropdown                                               |

---

## 4. Dependencies (Phase 2)

`class-variance-authority`, `@tanstack/react-table`, `tw-animate-css`, and the Radix packages pulled in
by the primitives (`react-slot`, `react-dialog`, `react-dropdown-menu`, `react-select`,
`react-checkbox`, `react-radio-group`, `react-switch`, `react-slider`, `react-tabs`, `react-tooltip`,
`react-avatar`, `react-accordion`, `react-label`, `react-separator`). `lucide-react` already present.

## 5. Files to Create

`components.json` (shadcn config, no globals rewrite) · ~19 `components/ui/*` · ~15
`components/shared/*` · 5 `components/layout/*` · `src/hooks/use-media-query.ts`,
`src/hooks/use-mounted.ts` (support hooks) · light component showcase in `app/page.tsx` (proof).

## 6. Files to Modify

`src/app/globals.css` (add `@import "tw-animate-css"`) · `package.json` (deps) ·
`src/components/ui/button.tsx` & `badge.tsx` (brand variants).

## 7. Accessibility & Quality Bar

Keyboard operable (focus-visible ring token), correct ARIA/roles (Radix provides most), semantic HTML,
`aria-label` on icon-only controls, color contrast AA, reduced-motion respected, responsive at
360/768/1280, no `any`, every component typed + `displayName`, no duplication (composites reuse
primitives; tones reuse `BadgeTone`).

## 8. Validation Checklist

- [ ] `npm run lint` / `typecheck` / `format:check` green; `build` succeeds.
- [ ] Button renders all variants incl. `cta` (orange) and `icon` size; Badge renders all tones.
- [ ] Dialog/Sheet/Dropdown/Tooltip open, trap focus, close on Esc/outside, animate.
- [ ] `PriceTag`/`RatingStars`/`StockStatus`/`QuantityStepper`/`Countdown` match the design.
- [ ] `DataTable` sorts, paginates, selects rows; shows empty + loading states.
- [ ] `ShopHeader` sticky + blur + mobile menu; `AdminSidebar` active state + role gating prop.
- [ ] Icon-only buttons have `aria-label`; keyboard nav works.

## 9. Self-Review Criteria

Reusability/composition (composites built from primitives) · DRY (single source for variants/tones) ·
Accessibility (WCAG AA, keyboard, ARIA, focus) · Type safety (generics for DataTable; no `any`) ·
Responsiveness · Performance (client only where needed; tree-shakeable) · Design fidelity to screens.

## 10. Out of Scope (later phases)

Data wiring (cart count, auth menu, search results, nav from CMS) — shells take props/placeholders now
and are wired in their feature phases. Feature-specific components (filters, variant selector, checkout
steps, CMS builder canvas) live in their feature folders.
