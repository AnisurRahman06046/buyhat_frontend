"use client";

import { RotateCcw, ShieldCheck } from "lucide-react";

import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/formatters";
import type { Cart } from "@/types/cart";

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("text-foreground font-medium", accent && "text-success")}>{value}</span>
    </div>
  );
}

export function CheckoutSummary({
  cart,
  deliveryFee,
  onConfirm,
  isPlacing,
  canConfirm,
}: {
  cart: Cart;
  deliveryFee: number;
  onConfirm: () => void;
  isPlacing: boolean;
  canConfirm: boolean;
}) {
  const subtotal = cart.totals.subtotal;
  const discount = cart.totals.discount ?? 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  return (
    <div className="rounded-card border-border bg-card shadow-card space-y-4 border p-5">
      <h2 className="text-headline-md text-foreground">Order Summary</h2>

      <ul className="max-h-64 space-y-3 overflow-y-auto">
        {cart.items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <div className="border-border relative size-12 shrink-0 overflow-hidden rounded-md border">
              <ImageWithFallback
                src={item.imageUrl}
                alt={item.productName}
                wrapperClassName="size-full"
                sizes="48px"
              />
              <span className="bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full text-[10px] font-bold">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-medium">{item.productName}</p>
              {item.variantLabel ? (
                <p className="text-muted-foreground text-xs">{item.variantLabel}</p>
              ) : null}
            </div>
            <span className="text-foreground text-sm font-semibold">
              {formatMoney(item.lineTotal ?? item.unitPrice * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <Separator />

      <div className="space-y-2 text-sm">
        <Row label="Subtotal" value={formatMoney(subtotal)} />
        {discount > 0 ? <Row label="Discount" value={`−${formatMoney(discount)}`} accent /> : null}
        <Row label="Delivery" value={formatMoney(deliveryFee)} />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <span className="text-foreground text-base font-semibold">Total</span>
        <span className="text-price-xl text-primary">{formatMoney(total)}</span>
      </div>

      <Button
        variant="cta"
        size="lg"
        className="w-full"
        onClick={onConfirm}
        disabled={!canConfirm || isPlacing}
      >
        {isPlacing ? "Placing order…" : "Confirm Order"}
      </Button>

      <div className="text-muted-foreground flex justify-center gap-4 text-xs">
        <span className="flex items-center gap-1">
          <ShieldCheck className="text-success size-3.5" aria-hidden /> Secure payment
        </span>
        <span className="flex items-center gap-1">
          <RotateCcw className="text-success size-3.5" aria-hidden /> Free returns
        </span>
      </div>
    </div>
  );
}
