import { OrderStatus } from "@/constants/status";

const CANCELLABLE = new Set<string>([OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PAID]);

/** Can the customer still cancel (pre-fulfilment)? Backend is authoritative. */
export function isCancellable(status?: string): boolean {
  return Boolean(status && CANCELLABLE.has(status));
}

/** Returns are requestable after delivery. */
export function isReturnable(status?: string): boolean {
  return status === OrderStatus.DELIVERED;
}
