"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { ErrorState } from "@/components/shared/error-state";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { Spinner } from "@/components/shared/spinner";
import { StatusBadgeFor } from "@/components/shared/status-badge";
import { Separator } from "@/components/ui/separator";
import { routes } from "@/config/routes";
import { ORDER_STATUS_META, PAYMENT_STATE_META } from "@/constants/status";
import { formatDate, formatMoney } from "@/lib/formatters";

import { useOrder, useOrderPayments } from "../hooks/use-orders";
import { OrderActions } from "./order-actions";
import { OrderReturns } from "./order-returns";
import { OrderTimeline } from "./order-timeline";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

export function OrderDetail({ orderId }: { orderId: string }) {
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);
  const { data: payments } = useOrderPayments(orderId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (isError || !order) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const latestPayment = payments?.[0];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={routes.account.orders}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
        >
          <ChevronLeft className="size-4" aria-hidden /> Back to orders
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-headline-lg text-foreground">Order #{order.orderNumber}</h1>
            <p className="text-muted-foreground text-sm">Placed {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadgeFor map={ORDER_STATUS_META} value={order.status} />
            {latestPayment ? (
              <StatusBadgeFor map={PAYMENT_STATE_META} value={latestPayment.status} />
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-card border-border bg-card shadow-card border p-5">
            <h2 className="text-headline-md text-foreground mb-4">Order Status</h2>
            <OrderTimeline order={order} />
          </section>

          <section className="rounded-card border-border bg-card shadow-card border p-5">
            <h2 className="text-headline-md text-foreground mb-2">Items</h2>
            <ul className="divide-border divide-y">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-3">
                  <div className="border-border size-14 shrink-0 overflow-hidden rounded-md border">
                    <ImageWithFallback
                      src={item.imageUrl}
                      alt={item.productName}
                      wrapperClassName="size-full"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {item.productName}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Qty {item.quantity}
                      {item.variantLabel ? ` · ${item.variantLabel}` : ""}
                    </p>
                  </div>
                  <span className="text-foreground text-sm font-semibold">
                    {formatMoney(item.lineTotal ?? item.unitPrice * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <OrderReturns orderId={orderId} />
        </div>

        <div className="space-y-6">
          <section className="rounded-card border-border bg-card shadow-card border p-5">
            <h2 className="text-headline-md text-foreground mb-3">Summary</h2>
            <div className="space-y-2 text-sm">
              <Row label="Subtotal" value={formatMoney(order.subtotal)} />
              {order.discount ? (
                <Row label="Discount" value={`−${formatMoney(order.discount)}`} />
              ) : null}
              {typeof order.shipping === "number" ? (
                <Row
                  label="Shipping"
                  value={order.shipping > 0 ? formatMoney(order.shipping) : "Free"}
                />
              ) : null}
              {typeof order.tax === "number" && order.tax > 0 ? (
                <Row label="Tax" value={formatMoney(order.tax)} />
              ) : null}
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between text-base font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">{formatMoney(order.total)}</span>
            </div>
          </section>

          {order.shippingAddress ? (
            <section className="rounded-card border-border bg-card shadow-card border p-5 text-sm">
              <h2 className="text-headline-md text-foreground mb-3">Shipping Address</h2>
              <p className="text-foreground font-medium">{order.shippingAddress.recipientName}</p>
              <p className="text-muted-foreground">
                {order.shippingAddress.line1}
                {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
              </p>
              <p className="text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
            </section>
          ) : null}

          <OrderActions order={order} />
        </div>
      </div>
    </div>
  );
}
