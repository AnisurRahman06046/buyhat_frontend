import type { InitiatePaymentPayload, Payment, RefundPaymentPayload } from "@/types/payment";

import { httpGet, httpPost } from "./http";

export const paymentService = {
  initiate: (payload: InitiatePaymentPayload) => httpPost<Payment>("/payments/initiate", payload),

  getByOrder: (orderId: string, signal?: AbortSignal) =>
    httpGet<Payment[]>(`/payments/order/${orderId}`, { signal }),

  refund: (payload: RefundPaymentPayload) => httpPost<Payment>("/payments/refund", payload),

  capture: (paymentId: string) => httpPost<Payment>(`/payments/${paymentId}/capture`),
};
