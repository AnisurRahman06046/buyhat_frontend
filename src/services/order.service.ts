import type { Paginated, PaginationParams } from "@/types/common";
import type {
  CancelOrderPayload,
  CreateOrderPayload,
  Order,
  OrderReturn,
  OrderSummary,
  RequestReturnPayload,
  UpdateOrderStatusPayload,
  UpdateReturnPayload,
} from "@/types/order";

import { httpGet, httpPatch, httpPost } from "./http";

export const orderService = {
  createOrder: (payload: CreateOrderPayload) => httpPost<Order>("/orders", payload),

  getOrders: (params?: PaginationParams & Record<string, unknown>, signal?: AbortSignal) =>
    httpGet<Paginated<OrderSummary>>("/orders", { params, signal }),

  getOrder: (id: string, signal?: AbortSignal) => httpGet<Order>(`/orders/${id}`, { signal }),

  cancelOrder: (id: string, payload: CancelOrderPayload) =>
    httpPost<Order>(`/orders/${id}/cancel`, payload),

  updateStatus: (id: string, payload: UpdateOrderStatusPayload) =>
    httpPatch<Order>(`/orders/${id}/status`, payload),

  // ── Returns ────────────────────────────────────────────────────────────
  requestReturn: (orderId: string, payload: RequestReturnPayload) =>
    httpPost<OrderReturn>(`/orders/${orderId}/returns`, payload),

  getReturns: (orderId: string, signal?: AbortSignal) =>
    httpGet<OrderReturn[]>(`/orders/${orderId}/returns`, { signal }),

  updateReturn: (returnId: string, payload: UpdateReturnPayload) =>
    httpPatch<OrderReturn>(`/orders/returns/${returnId}`, payload),
};
