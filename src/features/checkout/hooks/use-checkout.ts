"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";

import { gatewayFor, type PaymentMethodId } from "../lib/payment-methods";

interface PlaceOrderInput {
  shippingAddressId: string;
  customerNote?: string;
  method: PaymentMethodId;
}

/**
 * Place an order: the backend's `POST /orders` atomically converts the current
 * cart (price lock + stock reservation), then we initiate payment. Stock/price
 * failures surface as a normalized error (shown inline at checkout).
 */
export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ shippingAddressId, customerNote, method }: PlaceOrderInput) => {
      const order = await orderService.createOrder({
        shippingAddressId,
        billingAddressId: null,
        customerNote,
      });
      const payment = await paymentService.initiate({
        orderId: order.id,
        gateway: gatewayFor(method),
        idempotencyKey: crypto.randomUUID(),
      });
      return { order, payment };
    },
    meta: { silentError: true },
    onSuccess: () => {
      // Cart is consumed by the order conversion.
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current });
    },
  });
}
