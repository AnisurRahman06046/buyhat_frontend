---
title: "BuyHat Frontend — Phase 10: CMS Homepage & Promotions"
author: "Principal Frontend Architecture"
date: "2026-06-27"
---

# Phase 10 — CMS-Driven Homepage & Promotions

> Part of [`FRONTEND_PROJECT_PLAN.md`](./FRONTEND_PROJECT_PLAN.md). Prerequisite: **Phase 9 complete**.
> Consumes `GET /cms/homepage`, `GET /cms/popups/active`, `GET /flash-sales/active`.

---

## 1. Objective

Replace the interim homepage with a **CMS-driven, section-registry** homepage rendered from
`GET /cms/homepage` (ISR), add the **promotion popup engine** (trigger/frequency/audience rules), the
**flash-sale** surface, and a **recently-viewed** strip. Unknown section types degrade gracefully; an
empty/unavailable CMS falls back to a sensible default homepage.

---

## 2. Architecture

```
features/cms/
  api/cms-server.ts                 # getHomepageServer (RSC, revalidated)
  hooks/use-cms.ts                  # useActivePopups
  components/
    homepage.tsx                    # fetch sections → sort/filter → render via registry (+ fallback)
    homepage-section.tsx            # registry: section.type → component
    promotion-popup.tsx             # rules engine (mounted in (shop) layout)
    sections/
      hero-slider.tsx               # client carousel (config slides; default fallback)
      flash-sale-section.tsx        # client; active flash sale + Countdown + item cards
      category-grid.tsx             # server; category tiles
      products-section.tsx          # server; FEATURED / BEST_SELLERS / NEW_ARRIVALS
      brands-section.tsx            # server; brand tiles
      banner-section.tsx            # promotional banner (config-driven)
      newsletter-section.tsx        # heading + NewsletterForm
features/promotions/hooks/use-promotions.ts   # useActiveFlashSales
store/recently-viewed-store.ts      # persisted ProductSummary[] (max 12)
hooks/use-recently-viewed.ts        # mount-guarded { items, add }
features/catalog/components/recently-viewed-strip.tsx
```

### Rendering

- `Homepage` (server, ISR) fetches `getHomepageServer`, filters `isActive`, sorts by `position`, and
  maps each to `HomepageSection`. Product/category/brand sections fetch their own data server-side
  (`serverApi`); hero/flash-sale are client islands. **No sections / fetch error → default homepage**
  (hero + featured), so the page is never blank.
- Section product data uses `section.products` when the backend hydrates it, else fetches by sort hint.

### Promotion popup engine (`promotion-popup.tsx`)

Fetches active popups; selects the first **eligible** one by:

- **audience** — `GUESTS` (logged-out) · `USERS` (logged-in) · `EVERYONE`
- **frequency** — `ONCE` (localStorage) · `EVERY_SESSION` (sessionStorage) · `ALWAYS`
- **trigger** — `AFTER_DELAY` (`delaySeconds`) · `ON_LOAD` · `EXIT_INTENT` (mouse leaves viewport top)
  Shows a `Dialog` with image/content/CTA; marks "shown" on close.

### Recently viewed

PDP records the product into a persisted store (dedupe, most-recent-first, cap 12). A client strip
renders them on the homepage (and can be reused on the PDP).

---

## 3. Files to Modify

`app/(shop)/page.tsx` (→ `Homepage`) · `app/(shop)/layout.tsx` (mount `PromotionPopup`) ·
`features/catalog/.../product-detail-view.tsx` (record recently-viewed) ·
`features/catalog/api/catalog-server.ts` (+`getBrandsServer`).

## 4. Validation Checklist

- [ ] `lint` / `typecheck` / `format` / `build` green.
- [ ] Homepage renders CMS sections in order; unknown types skipped; fallback when empty/unavailable.
- [ ] Flash-sale section shows countdown + items; hides when none active.
- [ ] Popup honors audience + frequency + trigger; "once" never re-shows; exit-intent fires on leave.
- [ ] Recently-viewed records on PDP visit and shows on the homepage; survives reload.
- [ ] All client islands hydrate without mismatch; images optimized; ISR revalidates.

## 5. Self-Review Criteria

Extensibility (registry; new section = one component + case) · Resilience (graceful degradation +
fallback) · Performance (server sections + ISR; client only where needed) · A11y (carousel controls,
dialog) · DRY (reuse ProductGrid/Card/Countdown/SectionHeader/NewsletterForm) · Type safety (defensive
config parsing).

## 6. Out of Scope

Admin CMS builder / banner & popup management (Phase 12) · landing pages · the static announcement bar
stays as-is (CMS banners power homepage promos; CMS-driven announcement deferred).
