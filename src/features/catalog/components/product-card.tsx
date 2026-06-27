"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { PriceTag } from "@/components/shared/price-tag";
import { RatingStars } from "@/components/shared/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useAddToCart } from "@/features/cart/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/cn";
import { discountPercent } from "@/lib/formatters";
import type { ProductSummary } from "@/types/catalog";

export function ProductCard({
  product,
  className,
}: {
  product: ProductSummary;
  className?: string;
}) {
  const wishlist = useWishlist();
  const addToCart = useAddToCart();

  const href = routes.product(product.slug);
  const wished = wishlist.has(product.id);
  const discount = product.compareAtPrice
    ? discountPercent(product.compareAtPrice, product.basePrice)
    : 0;
  const outOfStock = product.available === 0;
  const lowStock =
    typeof product.available === "number" && product.available > 0 && product.available <= 5;
  const defaultVariantId = product.defaultVariantId;

  return (
    <div
      className={cn(
        "group rounded-card border-border bg-card shadow-card hover:shadow-card-hover relative flex flex-col overflow-hidden border transition-shadow",
        className,
      )}
    >
      <div className="relative">
        <Link href={href} aria-label={product.name}>
          <ImageWithFallback
            src={product.primaryImageUrl}
            alt={product.name}
            wrapperClassName="aspect-square"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
          {discount > 0 ? <Badge variant="destructive">{discount}% OFF</Badge> : null}
          {lowStock ? <Badge variant="warning">Low Stock</Badge> : null}
          {outOfStock ? <Badge variant="secondary">Sold Out</Badge> : null}
        </div>

        <button
          type="button"
          onClick={() => wishlist.toggle(product)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className="bg-card/90 text-foreground shadow-card hover:text-cta absolute top-2 right-2 flex size-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors"
        >
          <Heart className={cn("size-4", wished && "fill-cta text-cta")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3">
        {product.brandName ? (
          <p className="text-label-caps text-muted-foreground">{product.brandName}</p>
        ) : null}

        <Link
          href={href}
          className="text-foreground hover:text-primary mt-1 line-clamp-2 text-sm font-semibold transition-colors"
        >
          {product.name}
        </Link>

        {typeof product.rating === "number" ? (
          <div className="mt-1.5">
            <RatingStars rating={product.rating} count={product.reviewCount} size="sm" />
          </div>
        ) : null}

        <div className="mt-2">
          <PriceTag price={product.basePrice} compareAtPrice={product.compareAtPrice} size="sm" />
        </div>

        <div className="flex-1 pt-3" />

        {defaultVariantId ? (
          <Button
            variant="cta"
            className="w-full"
            disabled={outOfStock || addToCart.isPending}
            onClick={() => addToCart.mutate({ variantId: defaultVariantId, quantity: 1 })}
          >
            <ShoppingCart />
            {outOfStock ? "Sold Out" : "Add to Cart"}
          </Button>
        ) : (
          <Button variant="cta" className="w-full" asChild>
            <Link href={href}>
              <ShoppingCart />
              {outOfStock ? "View" : "Add to Cart"}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
