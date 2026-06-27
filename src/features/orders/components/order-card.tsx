import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { StatusBadgeFor } from "@/components/shared/status-badge";
import { routes } from "@/config/routes";
import { ORDER_STATUS_META } from "@/constants/status";
import { formatDate, formatMoney } from "@/lib/formatters";
import type { OrderSummary } from "@/types/order";

export function OrderCard({ order }: { order: OrderSummary }) {
  return (
    <Link
      href={routes.account.order(order.id)}
      className="rounded-card border-border bg-card shadow-card hover:shadow-card-hover block border p-4 transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-foreground font-semibold">#{order.orderNumber}</p>
          <p className="text-muted-foreground text-sm">{formatDate(order.createdAt)}</p>
        </div>
        <StatusBadgeFor map={ORDER_STATUS_META} value={order.status} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {order.itemCount ? `${order.itemCount} item${order.itemCount === 1 ? "" : "s"}` : " "}
        </p>
        <span className="text-primary inline-flex items-center gap-1 text-sm font-bold">
          {formatMoney(order.total)}
          <ChevronRight className="text-muted-foreground size-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
