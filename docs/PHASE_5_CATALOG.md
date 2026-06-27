---
title: "BuyHat Frontend — Phase 5: Catalog (Listing · Detail · Search)"
author: "Principal Frontend Architecture"
date: "2026-06-27"
---

# Phase 5 — Catalog (Listing · Detail · Search)

> Part of [`FRONTEND_PROJECT_PLAN.md`](./FRONTEND_PROJECT_PLAN.md). Prerequisite: **Phase 4 complete**.
> First phase to render real backend data. SEO-critical (SSR + JSON-LD on PDP).

---

## 1. Objective

Build product discovery end to end: the storefront chrome (`(shop)` layout), the homepage shell,
the Product Listing Page (filters + sort + load-more), the Product Detail Page (gallery, dynamic
variant selector, sticky add-to-cart, tabs, related), faceted Search, and Category pages — all
token-driven, accessible, responsive, and SEO-optimized.

---

## 2. Rendering & SEO strategy

- **PDP** = **SSR** via `serverApi` (revalidated) + `generateMetadata` (title/description/OG) +
  **JSON-LD** (`Product` + `BreadcrumbList`). Interactive parts (gallery, variant selector,
  add-to-cart, tabs) are client islands.
- **PLP / Category / Search** = server page provides `generateMetadata` + fetches the **first page**
  server-side and seeds it as `initialData` into a client listing (SSR first paint → SEO + no flash),
  which then owns filtering, sorting, and **load-more** (`useInfiniteQuery`).
- Images via `next/image` (`ImageWithFallback`); skeletons mirror the grid.

---

## 3. Architecture

```
app/(shop)/
  layout.tsx                 # AnnouncementBar + ShopHeader + main + ShopFooter
  page.tsx                   # interim homepage (hero + featured) — CMS in Phase 10
  products/page.tsx          # PLP (SSR seed → client listing)
  products/[slug]/page.tsx   # PDP (SSR + JSON-LD)
  categories/[slug]/page.tsx # category PLP
  search/page.tsx            # faceted search
features/catalog/
  api/catalog-server.ts      # serverApi fetchers (RSC)
  hooks/use-catalog.ts       # useInfiniteProducts, useProductSearch, useCategories, useBrands, useProduct
  components/                # ProductCard, ProductGrid, ProductCardSkeleton, ProductListing,
                             # ProductFilters, SortSelect, ActiveFilters,
                             # ProductGallery, VariantSelector, AddToCartSection, ProductTabs,
                             # RelatedProducts, ProductBreadcrumbs, ProductJsonLd
```

Cross-feature enablers built here (minimal; expanded later):

- `store/wishlist-store.ts` (Zustand + persist) — ProductCard heart; full page in Phase 9.
- `features/cart/hooks/use-cart.ts` → `useAddToCart` (cartService.addItem + toast + invalidate) —
  full cart/drawer in Phase 6.
- `components/layout/shop-header-container.tsx` — wires wishlist/cart counts into `ShopHeader`.

---

## 4. Components (key behavior)

| Component          | Behavior                                                                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `ProductCard`      | image + badges (discount/new/low-stock) + brand + title + `RatingStars` + `PriceTag` + Add-to-Cart (cta) + wishlist toggle; links to PDP |
| `ProductGrid`      | responsive grid (2→4 cols), loading skeletons, empty state                                                                               |
| `ProductFilters`   | price range (Slider + inputs), brand checkboxes (`useBrands`), rating, availability; URL-synced; mobile = `Sheet`                        |
| `SortSelect`       | Featured / Price ↑↓ / Newest / Top rated                                                                                                 |
| `ProductListing`   | composes filters + sort + grid + load-more; reads/writes URL search params; seeded by SSR `initialData`                                  |
| `ProductGallery`   | thumbnail rail + main image, keyboard-navigable                                                                                          |
| `VariantSelector`  | renders variant-defining attributes (swatch/button/select); resolves the selected `Variant` → price/stock/add-to-cart                    |
| `AddToCartSection` | `QuantityStepper` + Add to Cart + Buy Now + wishlist + trust badges; sticky on mobile                                                    |
| `ProductTabs`      | Description / Specifications / Reviews (read-only) / Shipping                                                                            |
| `RelatedProducts`  | "You might also like" grid                                                                                                               |
| `ProductJsonLd`    | structured data injection                                                                                                                |

---

## 5. Files to Modify

Remove root `app/page.tsx` (moves into `(shop)/page.tsx`) · `ShopHeader` consumed via container.

## 6. Validation Checklist

- [ ] `lint` / `typecheck` / `format` / `build` green.
- [ ] PDP SSR'd with correct `<title>`, meta, and `Product` + `BreadcrumbList` JSON-LD.
- [ ] PLP/category/search SSR first paint; filters + sort update URL + results; load-more appends.
- [ ] Variant selection updates price/stock/availability; out-of-stock disables add-to-cart.
- [ ] Add-to-cart hits API + toasts; wishlist toggle persists.
- [ ] `< 3 clicks` to any product; breadcrumbs present; images optimized; skeletons + empty/error states.
- [ ] Keyboard + screen-reader accessible (gallery, variant buttons, filters).

## 7. Self-Review Criteria

Reuse (ProductCard/Grid everywhere) · Performance (SSR seed, `next/image`, infinite query, skeletons) ·
SEO (metadata + JSON-LD + canonical + breadcrumbs) · A11y · Type safety (defensive against partial
DTOs) · Responsiveness (mobile filter sheet, sticky CTA).

## 8. Out of Scope

CMS homepage sections (Phase 10) · cart drawer/page/coupons (Phase 6) · wishlist page (Phase 9) ·
write reviews (Phase 9) · recently-viewed (Phase 10).
