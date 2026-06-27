"use client";

import { StatusBadgeFor } from "@/components/shared/status-badge";
import { RETURN_STATUS_META } from "@/constants/status";
import { formatDate } from "@/lib/formatters";

import { useOrderReturns } from "../hooks/use-orders";

export function OrderReturns({ orderId }: { orderId: string }) {
  const { data: returns } = useOrderReturns(orderId);
  if (!returns || returns.length === 0) return null;

  return (
    <section className="rounded-card border-border bg-card shadow-card border p-5">
      <h2 className="text-headline-md text-foreground mb-3">Returns</h2>
      <ul className="space-y-3">
        {returns.map((ret) => (
          <li
            key={ret.id}
            className="border-border flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="text-foreground text-sm font-medium">
                {ret.items.length} item{ret.items.length === 1 ? "" : "s"}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {formatDate(ret.createdAt)}
                {ret.reason ? ` · ${ret.reason}` : ""}
              </p>
            </div>
            <StatusBadgeFor map={RETURN_STATUS_META} value={ret.status} />
          </li>
        ))}
      </ul>
    </section>
  );
}
