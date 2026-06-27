"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/config/query-keys";
import { cartService } from "@/services/cart.service";
import { isApiError } from "@/services/http-error";
import { useCartUiStore } from "@/store/cart-ui-store";
import type { AddCartItemPayload, Cart } from "@/types/cart";

import { applyItemQuantity, cartItemCount, removeItemFromCart } from "../lib/cart-utils";

const CART_KEY = queryKeys.cart.current;

const EMPTY_CART: Cart = {
  id: "",
  items: [],
  totals: { subtotal: 0, total: 0 },
  itemCount: 0,
};

/** The current cart (guest or customer). A missing cart (404) resolves to empty. */
export function useCart() {
  return useQuery({
    queryKey: CART_KEY,
    queryFn: async ({ signal }) => {
      try {
        return await cartService.getCart(signal);
      } catch (error) {
        if (isApiError(error) && error.status === 404) return EMPTY_CART;
        throw error;
      }
    },
    staleTime: 30 * 1000,
  });
}

/** Total units in the cart — for the header badge. */
export function useCartCount(): number {
  const { data } = useCart();
  return cartItemCount(data);
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddCartItemPayload) => cartService.addItem(payload),
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_KEY, cart);
      queryClient.invalidateQueries({ queryKey: CART_KEY });
      toast.success("Added to cart");
      useCartUiStore.getState().open();
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      cartService.updateItem(id, { quantity }),
    onMutate: async ({ id, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_KEY });
      const previous = queryClient.getQueryData<Cart>(CART_KEY);
      if (previous) {
        queryClient.setQueryData(CART_KEY, applyItemQuantity(previous, id, quantity));
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(CART_KEY, context.previous);
    },
    onSuccess: (cart) => queryClient.setQueryData(CART_KEY, cart),
    onSettled: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cartService.removeItem(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CART_KEY });
      const previous = queryClient.getQueryData<Cart>(CART_KEY);
      if (previous) queryClient.setQueryData(CART_KEY, removeItemFromCart(previous, id));
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(CART_KEY, context.previous);
    },
    onSuccess: (cart) => queryClient.setQueryData(CART_KEY, cart),
    onSettled: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_KEY, cart);
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

export function useApplyCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => cartService.applyCoupon({ code }),
    meta: { silentError: true },
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_KEY, cart);
      toast.success("Coupon applied");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useRemoveCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cartService.removeCoupon(),
    onSuccess: (cart) => queryClient.setQueryData(CART_KEY, cart),
    onSettled: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}
