import type { PaymentGateway } from "@/types/payment";

export type PaymentMethodId = "bkash" | "nagad" | "card" | "cod";

export interface PaymentMethodMeta {
  id: PaymentMethodId;
  label: string;
  description: string;
}

/**
 * UI methods. Per FD3, COD is real; bKash/Nagad/Card are routed through the MOCK
 * gateway so the flow works end-to-end today and swaps to real adapters later
 * with no UI change.
 */
export const PAYMENT_METHODS: PaymentMethodMeta[] = [
  { id: "bkash", label: "bKash", description: "Pay with bKash mobile wallet" },
  { id: "nagad", label: "Nagad", description: "Pay with Nagad mobile wallet" },
  { id: "card", label: "Card", description: "Credit or debit card" },
  { id: "cod", label: "Cash on Delivery", description: "Pay when your order arrives" },
];

export function gatewayFor(method: PaymentMethodId): PaymentGateway {
  return method === "cod" ? "COD" : "MOCK";
}
