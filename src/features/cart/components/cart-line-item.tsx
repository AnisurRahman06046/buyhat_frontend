"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";

import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { formatMoney } from "@/lib/formatters";
import type { CartItem } from "@/types/cart";

import { useRemoveCartItem, useUpdateCartItem } from "../hooks/use-cart";

export function CartLineItem({ item }: { item: CartItem }) {
  const update = useUpdateCartItem();
  const remove = useRemoveCartItem();

  const max =
    typeof item.available === "number" && item.available > 0 ? Math.min(item.available, 99) : 99;
  const href = item.productSlug ? routes.product(item.productSlug) : undefined;
  const lineTotal = item.lineTotal ?? item.unitPrice * item.quantity;

  return (
    <div className="flex gap-3 py-4">
      <div className="border-border size-20 shrink-0 overflow-hidden rounded-md border">
        <ImageWithFallback
          src={item.imageUrl}
          alt={item.productName}
          wrapperClassName="size-full"
          sizes="80px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {href ? (
              <Link
                href={href}
                className="text-foreground hover:text-primary line-clamp-2 text-sm font-semibold"
              >
                {item.productName}
              </Link>
            ) : (
              <p className="text-foreground line-clamp-2 text-sm font-semibold">
                {item.productName}
              </p>
            )}
            {item.variantLabel ? (
              <p className="text-muted-foreground text-xs">{item.variantLabel}</p>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Remove ${item.productName}`}
            onClick={() => remove.mutate(item.id)}
            disabled={remove.isPending}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        {item.outOfStock || item.priceChanged ? (
          <div className="mt-1 flex flex-wrap gap-1">
            {item.outOfStock ? <Badge variant="destructive">Out of stock</Badge> : null}
            {item.priceChanged ? <Badge variant="warning">Price updated</Badge> : null}
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between pt-2">
          <QuantityStepper
            value={item.quantity}
            onChange={(quantity) => update.mutate({ id: item.id, quantity })}
            min={1}
            max={max}
            size="sm"
            disabled={update.isPending || item.outOfStock}
          />
          <div className="text-right">
            <p className="text-primary text-sm font-bold">{formatMoney(lineTotal)}</p>
            {item.quantity > 1 ? (
              <p className="text-muted-foreground text-xs">{formatMoney(item.unitPrice)} each</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
