"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, RotateCcw, ShieldCheck, ShoppingCart, Truck } from "lucide-react";

import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useAddToCart } from "@/features/cart/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/cn";
import type { ProductDetail, Variant } from "@/types/catalog";

const TRUST = [
  { icon: Truck, label: "Free shipping over ৳1500" },
  { icon: ShieldCheck, label: "Secure payment" },
  { icon: RotateCcw, label: "30-day easy returns" },
];

export function AddToCartSection({
  product,
  variant,
  available,
  requiresSelection,
}: {
  product: ProductDetail;
  variant?: Variant;
  available?: number;
  requiresSelection: boolean;
}) {
  const router = useRouter();
  const addToCart = useAddToCart();
  const wishlist = useWishlist();
  const [qty, setQty] = useState(1);

  const outOfStock = available === 0;
  const max = typeof available === "number" && available > 0 ? Math.min(available, 99) : 99;
  const blocked = outOfStock || requiresSelection || !variant;
  const wished = wishlist.has(product.id);

  const add = () => {
    if (variant) addToCart.mutate({ variantId: variant.id, quantity: qty });
  };

  const buyNow = () => {
    if (!variant) return;
    addToCart.mutate(
      { variantId: variant.id, quantity: qty },
      { onSuccess: () => router.push(routes.cart) },
    );
  };

  const ctaLabel = outOfStock ? "Sold Out" : requiresSelection ? "Select options" : "Add to Cart";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <QuantityStepper value={qty} onChange={setQty} min={1} max={max} disabled={outOfStock} />
        <Button
          variant="cta"
          size="lg"
          className="flex-1"
          onClick={add}
          disabled={blocked || addToCart.isPending}
        >
          <ShoppingCart />
          {ctaLabel}
        </Button>
        <Button
          variant="outline"
          size="icon-lg"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          onClick={() => wishlist.toggle(product.id)}
        >
          <Heart className={cn("size-5", wished && "fill-cta text-cta")} />
        </Button>
      </div>

      <Button
        variant="default"
        size="lg"
        className="w-full"
        onClick={buyNow}
        disabled={blocked || addToCart.isPending}
      >
        Buy Now
      </Button>

      <ul className="flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap sm:gap-x-5">
        {TRUST.map((item) => (
          <li key={item.label} className="text-muted-foreground flex items-center gap-2 text-sm">
            <item.icon className="text-success size-4" aria-hidden />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
