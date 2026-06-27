"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";

import { ErrorState } from "@/components/shared/error-state";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { Spinner } from "@/components/shared/spinner";
import { StatusBadgeFor } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { queryKeys } from "@/config/query-keys";
import { routes } from "@/config/routes";
import { ORDER_STATUS_META, PAYMENT_STATE_META } from "@/constants/status";
import { useOrder } from "@/features/orders/hooks/use-orders";
import { formatDate, formatMoney } from "@/lib/formatters";
import { paymentService } from "@/services/payment.service";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

export function OrderSuccess({ orderId }: { orderId: string }) {
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);

  const payments = useQuery({
    queryKey: queryKeys.payments.byOrder(orderId),
    queryFn: ({ signal }) => paymentService.getByOrder(orderId, signal),
    enabled: Boolean(orderId),
    refetchInterval: (query) => {
      const latest = query.state.data?.[0];
      const pending = latest && (latest.status === "PENDING" || latest.status === "INITIATED");
      return pending ? 4000 : false;
    },
  });

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

  const latestPayment = payments.data?.[0];
  const paymentPending =
    latestPayment && (latestPayment.status === "PENDING" || latestPayment.status === "INITIATED");

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <div className="bg-success/10 text-success mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
          <CheckCircle2 className="size-9" aria-hidden />
        </div>
        <h1 className="text-headline-lg text-foreground">Order placed successfully!</h1>
        <p className="text-muted-foreground mt-1">
          Thank you for your purchase. Order{" "}
          <span className="text-foreground font-semibold">#{order.orderNumber}</span> has been
          received.
        </p>
      </div>

      <div className="rounded-card border-border bg-card shadow-card mt-8 border p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-label-caps text-muted-foreground">Order</p>
            <p className="text-foreground font-semibold">#{order.orderNumber}</p>
            <p className="text-muted-foreground text-sm">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadgeFor map={ORDER_STATUS_META} value={order.status} />
            {latestPayment ? (
              <StatusBadgeFor map={PAYMENT_STATE_META} value={latestPayment.status} />
            ) : null}
          </div>
        </div>

        {paymentPending ? (
          <div className="border-warning/30 bg-warning/10 text-warning mt-4 flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
            <Spinner className="size-4" label="Confirming payment" />
            Awaiting payment confirmation…
          </div>
        ) : null}

        <Separator className="my-4" />

        <ul className="space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <div className="border-border size-12 shrink-0 overflow-hidden rounded-md border">
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={item.productName}
                  wrapperClassName="size-full"
                  sizes="48px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-medium">{item.productName}</p>
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

        <Separator className="my-4" />

        <div className="space-y-1.5 text-sm">
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
          <div className="flex items-center justify-between pt-1 text-base font-semibold">
            <span className="text-foreground">Total</span>
            <span className="text-primary">{formatMoney(order.total)}</span>
          </div>
        </div>

        {order.shippingAddress ? (
          <>
            <Separator className="my-4" />
            <div className="text-sm">
              <p className="text-label-caps text-muted-foreground mb-1">Shipping to</p>
              <p className="text-foreground font-medium">{order.shippingAddress.recipientName}</p>
              <p className="text-muted-foreground">
                {order.shippingAddress.line1}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
            </div>
          </>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button variant="outline" asChild>
          <Link href={routes.account.order(order.id)}>Track Order</Link>
        </Button>
        <Button variant="cta" asChild>
          <Link href={routes.shop}>Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
