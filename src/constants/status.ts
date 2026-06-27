/**
 * Status → human label + badge tone, single-sourced from the backend enums:
 *   OrderStatus / PaymentState / ReturnStatus / ReviewStatus.
 * The Phase-2 `Badge`/`StatusBadge` maps `BadgeTone` to token-driven classes, so
 * status colors stay consistent everywhere (storefront timeline ↔ admin kanban).
 */

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "destructive";

export interface StatusMeta {
  label: string;
  tone: BadgeTone;
}

export const OrderStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PAID: "PAID",
  PROCESSING: "PROCESSING",
  PACKED: "PACKED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  RETURN_REQUESTED: "RETURN_REQUESTED",
  RETURNED: "RETURNED",
  REFUNDED: "REFUNDED",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const ORDER_STATUS_META: Record<OrderStatus, StatusMeta> = {
  PENDING: { label: "Pending", tone: "warning" },
  CONFIRMED: { label: "Confirmed", tone: "info" },
  PAID: { label: "Paid", tone: "success" },
  PROCESSING: { label: "Processing", tone: "info" },
  PACKED: { label: "Packed", tone: "info" },
  SHIPPED: { label: "Shipped", tone: "info" },
  DELIVERED: { label: "Delivered", tone: "success" },
  CANCELLED: { label: "Cancelled", tone: "destructive" },
  RETURN_REQUESTED: { label: "Return Requested", tone: "warning" },
  RETURNED: { label: "Returned", tone: "neutral" },
  REFUNDED: { label: "Refunded", tone: "neutral" },
};

/** Customer-facing fulfilment timeline (happy path), in order. */
export const ORDER_TIMELINE: readonly OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PAID",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
];

export const PaymentState = {
  INITIATED: "INITIATED",
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;
export type PaymentState = (typeof PaymentState)[keyof typeof PaymentState];

export const PAYMENT_STATE_META: Record<PaymentState, StatusMeta> = {
  INITIATED: { label: "Initiated", tone: "neutral" },
  PENDING: { label: "Pending", tone: "warning" },
  SUCCESS: { label: "Paid", tone: "success" },
  FAILED: { label: "Failed", tone: "destructive" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
  REFUNDED: { label: "Refunded", tone: "info" },
};

export const ReturnStatus = {
  REQUESTED: "REQUESTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  RECEIVED: "RECEIVED",
  REFUNDED: "REFUNDED",
} as const;
export type ReturnStatus = (typeof ReturnStatus)[keyof typeof ReturnStatus];

export const RETURN_STATUS_META: Record<ReturnStatus, StatusMeta> = {
  REQUESTED: { label: "Requested", tone: "warning" },
  APPROVED: { label: "Approved", tone: "info" },
  REJECTED: { label: "Rejected", tone: "destructive" },
  RECEIVED: { label: "Received", tone: "info" },
  REFUNDED: { label: "Refunded", tone: "success" },
};

export const ReviewStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus];

export const REVIEW_STATUS_META: Record<ReviewStatus, StatusMeta> = {
  PENDING: { label: "Pending", tone: "warning" },
  APPROVED: { label: "Approved", tone: "success" },
  REJECTED: { label: "Rejected", tone: "destructive" },
};

/** Safe lookup with a neutral fallback for unrecognized values. */
export function statusMeta(
  map: Record<string, StatusMeta>,
  value: string | null | undefined,
): StatusMeta {
  if (value && map[value]) return map[value];
  return { label: value ?? "Unknown", tone: "neutral" };
}
