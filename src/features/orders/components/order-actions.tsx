"use client";

import type { Order } from "@/types/order";

import { isCancellable, isReturnable } from "../lib/order-utils";
import { CancelOrderDialog } from "./cancel-order-dialog";
import { ReturnRequestDialog } from "./return-request-dialog";

export function OrderActions({ order }: { order: Order }) {
  const cancellable = isCancellable(order.status);
  const returnable = isReturnable(order.status);

  if (!cancellable && !returnable) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {returnable ? <ReturnRequestDialog order={order} /> : null}
      {cancellable ? <CancelOrderDialog orderId={order.id} /> : null}
    </div>
  );
}
