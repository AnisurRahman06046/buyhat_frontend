---
title: "BuyHat Frontend — Phase 1: Design Foundation & Configuration"
author: "Principal Frontend Architecture"
date: "2026-06-27"
---

# Phase 1 — Design Foundation & Configuration

> Part of [`FRONTEND_PROJECT_PLAN.md`](./FRONTEND_PROJECT_PLAN.md). Prerequisite: **Phase 0 complete**.
> Design source of truth: nexus _SaaS Commerce Velocity_ (`buyhat_e_commerce_design_system`).

---

## 1. Objective

Encode the **Design System** and the app's **core runtime configuration** into the codebase so that
**every** subsequent component is token-driven and consistent. After this phase, a developer can
build any screen using semantic Tailwind classes (`bg-primary`, `text-cta`, `font-heading`,
`rounded-card`, `shadow-card`) and the global providers (data, theme, toasts) are mounted.

No feature UI is built here — this is the foundation Phases 2–13 consume.

---

## 2. Scope

1. **Design tokens** — Tailwind v4 `@theme` mapping of the full nexus palette, typography, radii,
   shadows, container, and z-index, exposed as semantic CSS variables + shadcn-compatible names.
2. **Fonts** — Manrope (headings/prices), Inter (body/UI), JetBrains Mono (SKU/meta) via
   `next/font/google`, wired as CSS variables with `display: swap` (no CLS).
3. **`cn()` utility** — `clsx` + `tailwind-merge` for safe conditional class composition.
4. **Formatters** — BDT money (`৳`), dates, relative time, compact numbers, percentages (locale `en-BD`).
5. **Config** — `site.ts` (brand/SEO defaults), `routes.ts` (typed route map), `query-keys.ts`
   (centralized TanStack Query key factory).
6. **Constants** — roles, order/payment/review status → label + tone maps (single source for badges).
7. **Providers** — `QueryProvider` (TanStack Query client + hydration + Devtools in dev),
   `ThemeProvider` (light-first, class strategy, dark-ready tokens), `Toaster` (sonner). Composed in a
   single `AppProviders` and mounted in the root layout.
8. **SEO base** — shared `metadata` defaults, `viewport`, OpenGraph/Twitter scaffolding, theme-color.

---

## 3. Design Token Mapping (nexus → CSS var → Tailwind)

Light theme (canonical). Values chosen from `DESIGN.md` + the reference screens.

| Semantic role                                              | Hex                         | CSS var                                  | Tailwind class examples      |
| ---------------------------------------------------------- | --------------------------- | ---------------------------------------- | ---------------------------- |
| Page background                                            | `#F8FAFC`                   | `--background`                           | `bg-background`              |
| Foreground text                                            | `#0F172A`                   | `--foreground`                           | `text-foreground`            |
| Card surface                                               | `#FFFFFF`                   | `--card`                                 | `bg-card`                    |
| Muted surface                                              | `#F1F5F9`                   | `--muted`                                | `bg-muted`                   |
| Muted text                                                 | `#64748B`                   | `--muted-foreground`                     | `text-muted-foreground`      |
| Border / divider                                           | `#E2E8F0`                   | `--border`                               | `border-border`              |
| Input border                                               | `#E2E8F0`                   | `--input`                                | —                            |
| Focus ring                                                 | `#1E3A8A`                   | `--ring`                                 | `ring-ring`                  |
| **Primary** (structure, nav, brand, price, default button) | `#1E3A8A`                   | `--primary`                              | `bg-primary`, `text-primary` |
| Primary foreground                                         | `#FFFFFF`                   | `--primary-foreground`                   | `text-primary-foreground`    |
| **CTA / Accent** (Add to Cart, Checkout — conversion only) | `#F97316`                   | `--cta`                                  | `bg-cta`, `text-cta`         |
| CTA foreground                                             | `#FFFFFF`                   | `--cta-foreground`                       | `text-cta-foreground`        |
| Secondary (slate chips/surfaces)                           | `#0F172A` text on `#F1F5F9` | `--secondary` / `--secondary-foreground` | `bg-secondary`               |
| **Success** (in-stock, paid, active)                       | `#059669`                   | `--success`                              | `bg-success`, `text-success` |
| **Warning** (low-stock, urgency)                           | `#D97706`                   | `--warning`                              | `text-warning`               |
| **Destructive** (errors, delete, sold-out)                 | `#DC2626`                   | `--destructive`                          | `bg-destructive`             |
| **Gold** (star ratings)                                    | `#FACC15`                   | `--gold`                                 | `text-gold`, `fill-gold`     |
| Accent surface (hover/active subtle)                       | `#EEF2FF`                   | `--accent`                               | `bg-accent`                  |

Each color also carries a `-foreground` pair where it can host text. Tokens are declared in `:root`
and exposed via `@theme inline` so Tailwind generates the utilities. A `.dark` block mirrors the
structure (deferred styling — light is the shipped theme).

### Typography scale (utility classes)

| Token         | Font           | Size / Line / Weight      | Usage                         |
| ------------- | -------------- | ------------------------- | ----------------------------- |
| `display-lg`  | Manrope        | 48/56, 800 (mobile 32/40) | hero headlines                |
| `headline-lg` | Manrope        | 32/40, 700                | section titles                |
| `headline-md` | Manrope        | 24/32, 700                | card/group titles             |
| `price-xl`    | Manrope        | 30/36, 700                | primary price                 |
| `body-lg`     | Inter          | 18/28, 400                | lead paragraphs               |
| `body-md`     | Inter          | 16/24, 400                | default body/UI               |
| `body-sm`     | Inter          | 14/20, 400                | secondary text                |
| `label-caps`  | JetBrains Mono | 12/16, 600, `0.05em`      | SKU, metadata, eyebrow labels |
| `button-text` | Inter          | 16/20, 600                | buttons                       |

Implemented as composable component classes in `globals.css` (`@layer components`) e.g. `.text-display-lg`.

### Radii, shadows, container

- `--radius`: `0.75rem` (12px) base → `--radius-sm 0.25rem`, `--radius-md 0.5rem`, `--radius-lg 0.75rem`, `--radius-xl 1rem`, `rounded-card`, `rounded-button` (0.5rem), `rounded-full`.
- Shadows: `--shadow-card` (`0 4px 12px rgba(15,23,42,.05)`), `--shadow-card-hover` (`0 8px 20px rgba(15,23,42,.08)`), `--shadow-overlay` (deep diffuse). Classes `shadow-card`, `shadow-card-hover`, `shadow-overlay`.
- Container: `max-width 1280px`, gutter `24px` (mobile `16px`) via a `.container-page` helper / Tailwind container config.

---

## 4. Files to Create

| File                                                 | Purpose                                             |
| ---------------------------------------------------- | --------------------------------------------------- |
| `src/styles/theme.css` (or extend `app/globals.css`) | `@theme` tokens + component typography layer        |
| `src/lib/cn.ts`                                      | `cn()` class-merge utility                          |
| `src/lib/formatters.ts`                              | money/date/number/relative formatters (BDT, en-BD)  |
| `src/config/site.ts`                                 | brand, description, social, SEO defaults            |
| `src/config/routes.ts`                               | typed route constants (shop/admin/auth)             |
| `src/config/query-keys.ts`                           | TanStack Query key factory                          |
| `src/constants/roles.ts`                             | `Role` enum mirror + role labels/guard helpers      |
| `src/constants/status.ts`                            | order/payment/review status → label + badge tone    |
| `src/lib/query-client.ts`                            | `makeQueryClient()` (staleTime, retry, gcTime)      |
| `src/providers/query-provider.tsx`                   | TanStack Query provider (+ Devtools in dev)         |
| `src/providers/theme-provider.tsx`                   | next-themes wrapper (light default)                 |
| `src/providers/app-providers.tsx`                    | composes Query + Theme + Toaster                    |
| `src/components/ui/sonner.tsx`                       | Toaster component (shadcn sonner)                   |
| `src/types/common.ts`                                | shared API/result types (Paginated, ApiError, etc.) |

## 5. Files to Modify

| File                  | Change                                                                         |
| --------------------- | ------------------------------------------------------------------------------ |
| `src/app/layout.tsx`  | wire 3 fonts as CSS vars; mount `<AppProviders>`; expand metadata + `viewport` |
| `src/app/globals.css` | replace Phase-0 baseline with full token system + base layer                   |
| `src/app/page.tsx`    | restyle boot screen using new tokens/typography (proof tokens work)            |
| `package.json`        | add Phase-1 deps                                                               |

## 6. Dependencies (Phase 1)

`clsx`, `tailwind-merge`, `next-themes`, `@tanstack/react-query`, `@tanstack/react-query-devtools`,
`sonner`, `lucide-react`. (Zustand, Axios, shadcn primitives, RHF/Zod arrive in their phases — Zod
already present from Phase 0.)

---

## 7. Implementation Steps

1. Install Phase-1 dependencies.
2. Author the token system in `globals.css` (`:root`, `@theme inline`, `@layer base`, typography
   `@layer components`, `.dark` skeleton).
3. Add fonts in `layout.tsx` via `next/font/google` → CSS variables `--font-sans/-heading/-mono`.
4. Implement `cn()`, formatters, config (site/routes/query-keys), constants (roles/status), common types.
5. Build `query-client`, the three providers, the sonner Toaster; compose `AppProviders`.
6. Mount providers + fonts in root layout; expand metadata/viewport.
7. Restyle the boot page to validate tokens render correctly.
8. Run `validate` (lint + typecheck + format) and `build`; smoke-test runtime.

---

## 8. Validation Checklist

- [ ] `bg-primary`, `text-cta`, `bg-success`, `text-gold`, `rounded-card`, `shadow-card`, `font-heading` all resolve.
- [ ] Three fonts load with `display: swap`; no layout shift; headings = Manrope, body = Inter, mono = JetBrains.
- [ ] `cn()` dedupes conflicting Tailwind classes correctly.
- [ ] `formatMoney(21795)` → `৳21,795.00`; dates/relative/percent format per `en-BD`.
- [ ] Providers mounted once at root; Query Devtools appear only in dev; toasts render.
- [ ] `npm run validate` and `npm run build` green; runtime serves 200.
- [ ] No `any`; all config strongly typed; tokens documented.

## 9. Self-Review Criteria

Architecture (tokens single-sourced) · Code quality/DRY (no duplicated color literals in components —
always via tokens) · Type safety (typed routes, query-keys, formatters) · Accessibility (color
contrast AA for text tokens; focus ring token) · Performance (font swap, no CLS; QueryClient created
per-request safe pattern) · Reusability (formatters/cn/config consumed everywhere) · Security (no
secrets; providers client-only where needed).

---

## 10. Out of Scope (later phases)

shadcn primitives & component variants (Phase 2) · Axios api-client & services (Phase 3) · auth/session
& Zustand stores (Phase 4) · any page/feature UI. Dark-theme visual tuning is deferred (tokens are
structured to support it).
