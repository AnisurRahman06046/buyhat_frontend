"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: ({ signal }) => orderService.getOrder(id, signal),
    enabled: Boolean(id),
  });
}

export function useOrderPayments(orderId: string, refetchInterval: number | false = false) {
  return useQuery({
    queryKey: queryKeys.payments.byOrder(orderId),
    queryFn: ({ signal }) => paymentService.getByOrder(orderId, signal),
    enabled: Boolean(orderId),
    refetchInterval,
  });
}
