"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/config/query-keys";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import type { RequestReturnPayload } from "@/types/order";

const ORDERS_PAGE_SIZE = 10;

export function useOrders() {
  return useInfiniteQuery({
    queryKey: queryKeys.orders.list({}),
    queryFn: ({ pageParam, signal }) =>
      orderService.getOrders({ page: pageParam, limit: ORDERS_PAGE_SIZE }, signal),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const limit = last.limit ?? ORDERS_PAGE_SIZE;
      const totalPages = last.totalPages ?? Math.ceil((last.total ?? 0) / limit);
      const current = last.page ?? 1;
      return current < totalPages ? current + 1 : undefined;
    },
  });
}

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

export function useOrderReturns(orderId: string) {
  return useQuery({
    queryKey: queryKeys.orders.returns(orderId),
    queryFn: ({ signal }) => orderService.getReturns(orderId, signal),
    enabled: Boolean(orderId),
  });
}

export function useCancelOrder(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reason?: string) => orderService.cancelOrder(id, { reason }),
    meta: { silentError: true },
    onSuccess: (order) => {
      queryClient.setQueryData(queryKeys.orders.detail(id), order);
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success("Order cancelled");
    },
  });
}

export function useRequestReturn(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestReturnPayload) => orderService.requestReturn(orderId, payload),
    meta: { silentError: true },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.returns(orderId) });
      toast.success("Return requested");
    },
  });
}
