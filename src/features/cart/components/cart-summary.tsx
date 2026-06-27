"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/formatters";
import type { Cart } from "@/types/cart";

import { CouponForm } from "./coupon-form";

function Row({
  label,
  value,
  muted,
  accent,
}: {
  label: string;
  value: string;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-foreground font-medium",
          muted && "text-muted-foreground",
          accent && "text-success",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function CartSummary({
  cart,
  showCoupon = true,
  onCheckout,
}: {
  cart: Cart;
  showCoupon?: boolean;
  onCheckout?: () => void;
}) {
  const t = cart.totals;

  return (
    <div className="rounded-card border-border bg-card shadow-card space-y-4 border p-5">
      <h2 className="text-headline-md text-foreground">Order Summary</h2>

      {showCoupon ? <CouponForm coupon={cart.coupon} /> : null}

      <div className="space-y-2 text-sm">
        <Row label="Subtotal" value={formatMoney(t.subtotal)} />
        {t.discount ? <Row label="Discount" value={`−${formatMoney(t.discount)}`} accent /> : null}
        {typeof t.shipping === "number" ? (
          <Row label="Shipping" value={t.shipping > 0 ? formatMoney(t.shipping) : "Free"} />
        ) : (
          <Row label="Shipping" value="Calculated at checkout" muted />
        )}
        {typeof t.tax === "number" && t.tax > 0 ? (
          <Row label="Tax" value={formatMoney(t.tax)} />
        ) : null}
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <span className="text-foreground text-base font-semibold">Total</span>
        <span className="text-price-xl text-primary">{formatMoney(t.total)}</span>
      </div>

      <Button variant="cta" size="lg" className="w-full" asChild onClick={onCheckout}>
        <Link href={routes.checkout}>Proceed to Checkout</Link>
      </Button>
    </div>
  );
}
