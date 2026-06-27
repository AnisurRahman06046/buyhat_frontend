"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/config/query-keys";
import { cartService } from "@/services/cart.service";
import type { AddCartItemPayload } from "@/types/cart";

/**
 * Add a variant to the cart. Minimal here (toast + invalidate); the full cart
 * experience — drawer, optimistic updates, coupons, totals — arrives in Phase 6,
 * which extends this file with `useCart`, `useUpdateCartItem`, etc.
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddCartItemPayload) => cartService.addItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current });
      toast.success("Added to cart");
    },
  });
}
