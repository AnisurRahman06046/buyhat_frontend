"use client";

import { ErrorState } from "@/components/shared/error-state";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";

import { useCart, useClearCart } from "../hooks/use-cart";
import { CartLineItem } from "./cart-line-item";
import { CartRevalidationBanner } from "./cart-revalidation-banner";
import { CartSummary } from "./cart-summary";
import { EmptyCart } from "./empty-cart";

export function CartView() {
  const { data: cart, isLoading, isError, refetch } = useCart();
  const clear = useClearCart();

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (isError || !cart) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {cart.items.length} item{cart.items.length === 1 ? "" : "s"}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clear.mutate()}
            disabled={clear.isPending}
          >
            Clear cart
          </Button>
        </div>

        <CartRevalidationBanner cart={cart} />

        <div className="divide-border rounded-card border-border bg-card shadow-card mt-3 divide-y border px-4">
          {cart.items.map((item) => (
            <CartLineItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <CartSummary cart={cart} />
      </div>
    </div>
  );
}
