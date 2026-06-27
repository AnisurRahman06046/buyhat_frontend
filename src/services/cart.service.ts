import type {
  AddCartItemPayload,
  ApplyCouponPayload,
  Cart,
  MergeCartPayload,
  UpdateCartItemPayload,
} from "@/types/cart";

import { ensureGuestId, getGuestId } from "./guest-id";
import { httpDelete, httpGet, httpPost, httpPut } from "./http";
import { getAccessToken } from "./token-storage";

export const cartService = {
  getCart: (signal?: AbortSignal) => httpGet<Cart>("/cart", { signal }),

  addItem: (payload: AddCartItemPayload) => {
    // Guests need a stable id before the cart is created server-side.
    if (!getAccessToken()) ensureGuestId();
    return httpPost<Cart>("/cart/items", payload);
  },

  updateItem: (cartItemId: string, payload: UpdateCartItemPayload) =>
    httpPut<Cart>(`/cart/items/${cartItemId}`, payload),

  removeItem: (cartItemId: string) => httpDelete<Cart>(`/cart/items/${cartItemId}`),

  clearCart: () => httpDelete<Cart>("/cart"),

  applyCoupon: (payload: ApplyCouponPayload) => httpPost<Cart>("/cart/coupon", payload),

  removeCoupon: () => httpDelete<Cart>("/cart/coupon"),

  /** Merge the guest cart into the user cart after login. */
  mergeGuestCart: (guestId?: string) => {
    const id = guestId ?? getGuestId();
    if (!id) return Promise.resolve<null>(null);
    const payload: MergeCartPayload = { guestId: id };
    return httpPost<Cart>("/cart/merge", payload);
  },
};
