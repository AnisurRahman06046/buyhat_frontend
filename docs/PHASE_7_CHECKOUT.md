---
title: "BuyHat Frontend — Phase 7: Checkout & Payments"
author: "Principal Frontend Architecture"
date: "2026-06-27"
---

# Phase 7 — Checkout & Payments

> Part of [`FRONTEND_PROJECT_PLAN.md`](./FRONTEND_PROJECT_PLAN.md). Prerequisite: **Phase 6 complete**.
> Decisions: **D25** checkout requires login · **FD3** show bKash/Nagad/Card/COD (COD real; online via MOCK).

---

## 1. Objective

Convert the cart into a paid order with a low-friction, single-page **3-section checkout** (shipping ·
delivery · payment) + sticky order summary, then an **order success** page. Order creation runs the
backend's atomic cart→order conversion (price lock + reservation); the UI surfaces its result.

---

## 2. Flow & contract

Backend `POST /orders` body is `{ shippingAddressId, billingAddressId?, customerNote? }` — it converts
the **current cart** server-side (no items in the body) and returns the `Order` with final totals.
Addresses live under `/users/me/addresses`, so **checkout requires auth** (guest carts merge on login).

```
Cart → /checkout (RequireAuth; guest → login?redirect=/checkout → cart merges)
  Section 1 Shipping  : pick saved address (cards) OR add new (AddressForm → POST address)
  Section 2 Delivery  : Standard / Express (display estimate)
  Section 3 Payment   : bKash · Nagad · Card · COD
Confirm Order:
  createOrder({ shippingAddressId, customerNote })           // backend revalidates stock + locks price
  initiatePayment({ orderId, gateway, idempotencyKey })      // COD→COD ; bKash/Nagad/Card→MOCK
  if payment.redirectUrl → redirect ; else → /checkout/success/:orderId
  invalidate cart (it is now consumed)
```

Payment completion is intentionally defensive (MOCK gateway behavior may vary): follow a `redirectUrl`
if present, otherwise land on the success page which reads (and, while pending, polls) payment status.

---

## 3. Architecture

```
features/profile/
  schemas/address-schema.ts        # Zod address (reused in Phase 9)
  hooks/use-addresses.ts           # useAddresses, useAddAddress (Phase 9 extends)
  components/address-form.tsx      # reusable RHF address form
features/orders/
  hooks/use-orders.ts              # useOrder, useOrderPayments (Phase 8 extends)
features/checkout/
  hooks/use-checkout.ts            # usePlaceOrder (create order + initiate payment)
  lib/payment-methods.ts           # method → gateway map + metadata
  components/
    checkout-view.tsx              # orchestrator: sections + summary + place-order
    address-card.tsx               # selectable saved address
    shipping-section.tsx           # saved list + add-new
    delivery-section.tsx           # Standard / Express
    payment-section.tsx            # method cards (+ card fields when Card)
    checkout-summary.tsx           # items + totals + Confirm Order + trust
    order-success.tsx              # confirmation + payment status (polls if pending)
app/(shop)/checkout/page.tsx                    # RequireAuth + CheckoutView
app/(shop)/checkout/success/[orderId]/page.tsx  # RequireAuth + OrderSuccess
```

---

## 4. Behavior details

| Concern     | Behavior                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------- |
| Auth gate   | `/checkout` wrapped in `RequireAuth`; guests bounce to login then return (cart merges)            |
| Empty cart  | redirect/empty-state to `/products` (cannot checkout an empty cart)                               |
| Addresses   | select saved (radio cards, default pre-selected) or add new (`AddressForm` → saved → auto-select) |
| Delivery    | Standard ৳60 / Express ৳120 — display estimate; backend total is authoritative                    |
| Payment     | bKash/Nagad/Card/COD; gateway = `COD` or `MOCK`; idempotencyKey = `crypto.randomUUID()`           |
| Stock/price | enforced by `POST /orders` (atomic); failures surfaced inline (e.g. "item out of stock")          |
| Success     | order number, items, totals, address, payment status; polls `getByOrder` while pending            |

---

## 5. Files to Modify

`config/routes.ts` already has `checkout` + `orderSuccess`. No header/layout changes (checkout lives in
the `(shop)` group). Cart "Checkout" links now resolve.

## 6. Validation Checklist

- [ ] `lint` / `typecheck` / `format` / `build` green.
- [ ] Guest at `/checkout` → login → returns, cart merged.
- [ ] Saved-address select + add-new both work; default address pre-selected.
- [ ] COD places order → success page shows confirmed order.
- [ ] Online method initiates payment (redirect or pending→poll on success page).
- [ ] Order-create errors (stock/price) shown inline; cart invalidated after success.
- [ ] All inputs accessible (radio groups, labels, focus); summary is keyboard-usable.

## 7. Self-Review Criteria

Conversion UX (single page, sticky summary, minimal friction) · Correctness (server-authoritative
totals/stock; idempotent payment) · DRY (AddressForm reused; CartLineItem reused in summary) · Security
(auth-gated, no card data sent to MOCK) · Resilience (redirect/poll/pending) · Type safety · A11y.

## 8. Out of Scope

Order history / tracking / returns (Phase 8) · full address CRUD + default toggle (Phase 9) · real
gateway adapters (backend) · saved cards.
