export type PaymentGateway = "COD" | "MOCK" | "BKASH" | "NAGAD" | "CARD";

export interface Payment {
  id: string;
  orderId: string;
  gateway: string;
  status: string;
  amount: number;
  currency?: string;
  gatewayReference?: string | null;
  gatewayTxnId?: string | null;
  /** Some gateways return a redirect/checkout URL to complete payment. */
  redirectUrl?: string | null;
  createdAt: string;
}

export interface InitiatePaymentPayload {
  orderId: string;
  gateway: PaymentGateway;
  idempotencyKey?: string;
}

export interface RefundPaymentPayload {
  orderId: string;
  amount?: number | null;
  reason?: string;
}
