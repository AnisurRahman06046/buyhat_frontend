---
title: "BuyHat Frontend — Phase 8: Orders (Tracking · History · Returns)"
author: "Principal Frontend Architecture"
date: "2026-06-27"
---

# Phase 8 — Orders (Tracking · History · Returns)

> Part of [`FRONTEND_PROJECT_PLAN.md`](./FRONTEND_PROJECT_PLAN.md). Prerequisite: **Phase 7 complete**.
> Extends the Phase-7 `use-orders.ts` and consumes the Phase-1 order status meta + timeline.

---

## 1. Objective

The post-purchase experience for customers: **order history**, **order detail** with a lifecycle
**timeline**, **cancel order**, and **request return** — under the auth-gated `/account` area. This
makes the success page's "Track Order" link real.

---

## 2. Architecture

```
app/(shop)/account/layout.tsx          # RequireAuth wrapper (Phase 9 adds the account nav)
app/(shop)/account/orders/page.tsx     # order history list
app/(shop)/account/orders/[id]/page.tsx# order detail + timeline + actions
features/orders/
  lib/order-utils.ts                   # isCancellable / isReturnable
  hooks/use-orders.ts (extend)         # useOrders (infinite), useCancelOrder, useRequestReturn, useOrderReturns
  components/
    order-card.tsx                     # history list row (number, date, status, total, thumbs)
    order-history-list.tsx             # list + load-more + empty state
    order-timeline.tsx                 # lifecycle stepper (ORDER_TIMELINE + history timestamps)
    order-detail.tsx                   # orchestrator: header + timeline + items + summary + actions
    order-actions.tsx                  # cancel / request-return buttons → dialogs
    cancel-order-dialog.tsx            # reason → cancel
    return-request-dialog.tsx          # pick items + qty + reason → return
    order-returns.tsx                  # existing return requests + status
```

### Data

- `useOrders` — `useInfiniteQuery` over `GET /orders` (page-based, load-more).
- `useOrder` (Phase 7) — order detail.
- `useCancelOrder` / `useRequestReturn` — mutations (silentError → inline), invalidate detail + list.
- `useOrderReturns` — `GET /orders/:id/returns`.

### Lifecycle rules (`order-utils`)

- **Cancellable:** `PENDING | CONFIRMED | PAID` (pre-fulfilment). UI gates; backend is authoritative.
- **Returnable:** `DELIVERED`.
- Timeline = `ORDER_TIMELINE` (Pending → … → Delivered); `CANCELLED` shows a terminal banner;
  `RETURN_REQUESTED/RETURNED/REFUNDED` render as fully-delivered + a returns section.

---

## 3. Behavior details

| Concern  | Behavior                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------ |
| Auth     | `/account/*` middleware-gated (cookie) + `RequireAuth` (account layout)                                |
| History  | order cards (status badge, total, item thumbnails); load-more; empty state → "Start shopping"          |
| Timeline | vertical stepper; completed (check), current (ring), upcoming (muted); timestamps from `order.history` |
| Cancel   | dialog with reason; disabled unless cancellable; optimistic-free (refetch on success)                  |
| Return   | dialog: select items + per-item quantity (≤ ordered) + reason; only when delivered                     |
| Returns  | list existing returns with `ReturnStatus` badges                                                       |
| Errors   | mutations `silentError` → inline alerts; toasts on success                                             |

---

## 4. Files to Modify

`features/orders/hooks/use-orders.ts` (extend with list + mutations + returns).

## 5. Validation Checklist

- [ ] `lint` / `typecheck` / `format` / `build` green.
- [ ] `/account/orders` lists orders, loads more, empty state when none.
- [ ] Order detail shows timeline matching status + history timestamps.
- [ ] Cancel works for eligible statuses, blocked/hidden otherwise; list+detail refresh.
- [ ] Return request submits selected items/qty/reason (delivered only); returns list updates.
- [ ] Guests redirected to login from `/account/*`.
- [ ] Accessible (dialogs focus-trap, labelled controls, keyboard).

## 6. Self-Review Criteria

Reuse (status meta/timeline, ProductImage, DataTable-free simple lists) · Correctness (status gating;
server-authoritative) · A11y (dialogs, labels) · Resilience (empty/error) · Type safety · Separation
(hooks vs UI).

## 7. Out of Scope

Staff order management / kanban / status transitions / return moderation (Phase 11) · account
dashboard, profile, addresses page (Phase 9) · invoices/PDF.
