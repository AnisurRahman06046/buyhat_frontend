"use client";

import Link from "next/link";

import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { routes } from "@/config/routes";
import { formatMoney } from "@/lib/formatters";
import { useCartUiStore } from "@/store/cart-ui-store";

import { useCart } from "../hooks/use-cart";
import { cartItemCount } from "../lib/cart-utils";
import { CartLineItem } from "./cart-line-item";
import { EmptyCart } from "./empty-cart";

export function CartDrawer() {
  const isOpen = useCartUiStore((s) => s.isOpen);
  const setOpen = useCartUiStore((s) => s.setOpen);
  const close = useCartUiStore((s) => s.close);

  const { data: cart, isLoading } = useCart();
  const count = cartItemCount(cart);
  const items = cart?.items ?? [];

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-border border-b">
          <SheetTitle>Your Cart ({count})</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner className="size-8" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyCart onAction={close} />
          </div>
        ) : (
          <>
            <div className="divide-border flex-1 divide-y overflow-y-auto px-4">
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} />
              ))}
            </div>
            <SheetFooter className="border-border border-t">
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-primary text-base font-bold">
                    {formatMoney(cart?.totals.subtotal ?? 0)}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Shipping &amp; taxes calculated at checkout.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild onClick={close}>
                    <Link href={routes.cart}>View Cart</Link>
                  </Button>
                  <Button variant="cta" className="flex-1" asChild onClick={close}>
                    <Link href={routes.checkout}>Checkout</Link>
                  </Button>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
