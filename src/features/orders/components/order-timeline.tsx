import { Check } from "lucide-react";

import { ORDER_STATUS_META, ORDER_TIMELINE } from "@/constants/status";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/formatters";
import type { Order } from "@/types/order";

export function OrderTimeline({ order }: { order: Order }) {
  if (order.status === "CANCELLED") {
    return (
      <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-4 py-3 text-sm font-medium">
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = ORDER_TIMELINE.findIndex((s) => s === order.status);
  // Post-delivery states (returned/refunded) render as fully delivered.
  const effectiveIndex = currentIndex >= 0 ? currentIndex : ORDER_TIMELINE.length - 1;
  const historyMap = new Map((order.history ?? []).map((h) => [h.status, h.createdAt]));

  return (
    <ol>
      {ORDER_TIMELINE.map((step, i) => {
        const done = i < effectiveIndex;
        const current = i === effectiveIndex;
        const isLast = i === ORDER_TIMELINE.length - 1;
        const timestamp = historyMap.get(step);

        return (
          <li key={step} className="relative flex gap-3 pb-6 last:pb-0">
            {!isLast ? (
              <span
                className={cn(
                  "absolute top-6 left-[11px] h-full w-px",
                  done ? "bg-success" : "bg-border",
                )}
                aria-hidden
              />
            ) : null}
            <span
              className={cn(
                "z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                done
                  ? "border-success bg-success text-success-foreground"
                  : current
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground",
              )}
            >
              {done ? (
                <Check className="size-3.5" aria-hidden />
              ) : (
                <span className="size-2 rounded-full bg-current" aria-hidden />
              )}
            </span>
            <div>
              <p
                className={cn(
                  "text-sm font-semibold",
                  done || current ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {ORDER_STATUS_META[step].label}
              </p>
              {timestamp ? (
                <p className="text-muted-foreground text-xs">{formatDateTime(timestamp)}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
