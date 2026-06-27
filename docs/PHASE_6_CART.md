---
title: "BuyHat Frontend — Phase 6: Cart"
author: "Principal Frontend Architecture"
date: "2026-06-27"
---

# Phase 6 — Cart (Guest + Customer)

> Part of [`FRONTEND_PROJECT_PLAN.md`](./FRONTEND_PROJECT_PLAN.md). Prerequisite: **Phase 5 complete**.
> Builds on the Phase-3 `cartService`, the guest-id mechanism, and the Phase-4 merge-on-login.

---

## 1. Objective

Deliver the full cart experience: a server-synced cart (guest + customer), a slide-over **cart drawer**
and a full **cart page**, **optimistic** quantity/remove with rollback, **coupon** apply/remove,
price/availability **revalidation** annotations, and the live **mini-cart count** in the header.

---

## 2. Architecture

```
store/cart-ui-store.ts            # ephemeral drawer open/close (Zustand)
features/cart/
  lib/cart-utils.ts               # item count + optimistic recompute helpers
  hooks/use-cart.ts               # useCart, useCartCount, useAddToCart, useUpdateCartItem,
                                  # useRemoveCartItem, useClearCart, useApplyCoupon, useRemoveCoupon
  components/
    cart-line-item.tsx            # image, title, variant, price, QuantityStepper, remove, annotations
    cart-summary.tsx              # subtotal/discount/total + coupon + checkout CTA
    coupon-form.tsx               # apply / applied+remove
    cart-drawer.tsx               # Sheet (right) — items + mini summary
    empty-cart.tsx                # empty state
    cart-revalidation-banner.tsx  # price-changed / out-of-stock notice
app/(shop)/cart/page.tsx          # full cart page
```

### Data flow

- `useCart` = `useQuery(queryKeys.cart.current)` → `cartService.getCart()`. Errors (e.g. no cart yet)
  degrade to an **empty cart** — never a blocking error screen.
- **Optimistic** `useUpdateCartItem` / `useRemoveCartItem`: `onMutate` cancels in-flight, snapshots the
  cart, applies the change locally (recompute line + subtotal/total), rolls back `onError`, and
  `invalidate`s `onSettled` (server is source of truth).
- `useAddToCart` invalidates + toasts + **opens the drawer** (so quick-add gives instant feedback).
- Coupons: `useApplyCoupon` / `useRemoveCoupon` → invalidate cart; errors shown inline (silentError).

### Header wiring

`ShopHeaderContainer` reads `useCartCount` → header badge, mounts `<CartDrawer/>`, and passes
`onCartClick` so the header cart icon opens the drawer (instead of navigating).

---

## 3. Behavior details

| Concern        | Behavior                                                                          |
| -------------- | --------------------------------------------------------------------------------- |
| Guest cart     | `X-Guest-Id` attached by interceptor; `cartService.addItem` ensures the id exists |
| Merge on login | already wired (Phase 4) — `mergeGuestCart` + `clearGuestId` + invalidate          |
| Revalidation   | per-item `priceChanged` / `outOfStock` flags surface a banner + line annotation   |
| Availability   | quantity stepper `max` clamped to `available`; out-of-stock disables controls     |
| Buy Now        | adds, closes drawer, routes to `/cart` (checkout flow = Phase 7)                  |
| Empty states   | drawer + page show a friendly empty state with a "Start shopping" CTA             |

---

## 4. Files to Modify

`features/cart/hooks/use-cart.ts` (extend) · `components/layout/shop-header.tsx` (+`onCartClick`) ·
`components/layout/shop-header-container.tsx` (count + drawer) · `features/catalog/.../add-to-cart-section.tsx`
(Buy Now closes drawer).

## 5. Validation Checklist

- [ ] `lint` / `typecheck` / `format` / `build` green.
- [ ] Add-to-cart updates the cart, opens the drawer, badge increments.
- [ ] Quantity +/- and remove are optimistic and roll back on failure.
- [ ] Coupon apply shows discount; remove reverts; invalid code shows inline error.
- [ ] Cart page + drawer render line items, totals, empty state; price/stock annotations show when flagged.
- [ ] Guest cart persists across reload; merges on login (count reflects merge).
- [ ] Keyboard + screen-reader accessible (stepper, remove buttons, drawer focus trap).

## 6. Self-Review Criteria

State boundaries (server cart = TanStack; drawer open = Zustand) · Optimistic correctness (snapshot +
rollback + reconcile) · DRY (CartLineItem/CartSummary reused in drawer + page) · A11y · Resilience
(empty/error tolerance) · Type safety.

## 7. Out of Scope

Checkout/address/payment (Phase 7) · abandoned-cart prompts (later) · saved-for-later/wishlist move
(Phase 9).
