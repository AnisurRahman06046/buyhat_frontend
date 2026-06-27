---
title: "BuyHat Frontend — Phase 9: Profile & Account"
author: "Principal Frontend Architecture"
date: "2026-06-27"
---

# Phase 9 — Profile & Account

> Part of [`FRONTEND_PROJECT_PLAN.md`](./FRONTEND_PROJECT_PLAN.md). Prerequisite: **Phase 8 complete**.
> Builds the self-service account area + wishlist, reusing the Phase-7 `AddressForm`.

---

## 1. Objective

Complete the customer account: a dashboard with sidebar nav, profile editing, full **address book**
(CRUD + set-default), **notification preferences**, the **wishlist** page, and the ability to **write a
review** on the product page.

---

## 2. Architecture

```
app/(shop)/account/layout.tsx          # refactor: RequireAuth + AccountSidebar + content
app/(shop)/account/page.tsx            # dashboard
app/(shop)/account/profile/page.tsx    # profile edit
app/(shop)/account/addresses/page.tsx  # address book
app/(shop)/account/notifications/page.tsx
app/(shop)/wishlist/page.tsx           # wishlist (top-level; client-only, no auth)
features/profile/
  schemas/profile-schema.ts
  hooks/use-profile.ts                 # useProfile, useUpdateProfile
  hooks/use-addresses.ts (extend)      # + useUpdateAddress, useDeleteAddress, useSetDefaultAddress
  hooks/use-notification-preferences.ts
  components/account-sidebar.tsx · account-dashboard.tsx · profile-form.tsx
             address-book.tsx · notification-preferences-form.tsx
features/wishlist/components/wishlist-view.tsx
features/reviews/
  hooks/use-reviews.ts                 # useCreateReview
  components/review-form.tsx           # star input + title + body (authed users; PDP reviews tab)
```

### Wishlist store refactor

The Phase-5 wishlist stored only ids; there is **no batch get-products-by-ids** endpoint, so the
wishlist page would need N fetches. Refactor the store to persist a **product snapshot**
(`ProductSummary`) so the wishlist page renders instantly from the store (and works offline). Update
`ProductCard` / `AddToCartSection` (pass the product) and the header count (items.length).

### Notes / API limits

- **"My Reviews" list page is omitted** — the backend exposes no per-user review list. Instead, review
  _writing/editing_ happens on the PDP (`createReview`), rounding out the reviews feature.

---

## 3. Behavior details

| Concern       | Behavior                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------- |
| Dashboard     | greeting + quick-link cards (Orders, Addresses, Profile, Notifications, Wishlist)               |
| Profile       | RHF+Zod (`firstName/lastName/displayName/phone/marketingOptIn`); email read-only; toast on save |
| Addresses     | list with default badges; add/edit (`AddressForm` in dialog), delete (confirm), set default     |
| Notifications | switches for `marketingEmail/Sms/Push`; optimistic-free PUT; toast                              |
| Wishlist      | grid of `ProductCard` from the store; remove via heart; empty state                             |
| Reviews       | star + title + body form on PDP for authed users; "sign in to review" otherwise                 |
| Nav           | `AccountSidebar` active state via `usePathname`; logout action                                  |

---

## 4. Files to Modify

`store/wishlist-store.ts` · `hooks/use-wishlist.ts` · `features/catalog/.../product-card.tsx` ·
`features/catalog/.../add-to-cart-section.tsx` · `components/layout/shop-header-container.tsx` ·
`features/profile/hooks/use-addresses.ts` · `features/catalog/.../product-tabs.tsx` (mount review form).

## 5. Validation Checklist

- [ ] `lint` / `typecheck` / `format` / `build` green.
- [ ] Account sidebar nav with active states; all sections reachable; logout works.
- [ ] Profile loads + saves; address CRUD + set-default work and refresh.
- [ ] Notification switches persist.
- [ ] Wishlist add/remove reflects on the page + header count; survives reload.
- [ ] Authed user can submit a review on a PDP; list refreshes; guests see a sign-in prompt.
- [ ] Guests redirected to login from `/account/*`; `/wishlist` works for guests.

## 6. Self-Review Criteria

Reuse (AddressForm, ProductCard, status/switch primitives) · DRY (one wishlist source) · A11y (forms,
dialogs, switches, star input) · Type safety · Resilience (empty/error) · Separation (hooks vs UI).

## 7. Out of Scope

Staff/admin (Phases 11–12) · CMS homepage (Phase 10) · review moderation (Phase 12) · per-user review
list (no API) · avatar upload.
