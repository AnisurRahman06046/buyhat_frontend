"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

import { Countdown } from "@/components/shared/countdown";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { Badge } from "@/components/ui/badge";
import { routes } from "@/config/routes";
import { useActiveFlashSales } from "@/features/promotions/hooks/use-promotions";
import { discountPercent, formatMoney } from "@/lib/formatters";
import type { HomepageSection } from "@/types/cms";

export function FlashSaleSection({ section }: { section: HomepageSection }) {
  const { data: sales } = useActiveFlashSales();
  const sale = sales?.[0];
  if (!sale) return null;

  return (
    <section className="container-page py-10">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge variant="destructive" className="gap-1">
          <Zap className="size-3" aria-hidden /> FLASH SALE
        </Badge>
        <h2 className="text-headline-lg text-foreground">{section.title ?? sale.name}</h2>
        <div className="ms-auto flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Ends in</span>
          <Countdown to={sale.endsAt} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {sale.items.slice(0, 8).map((item) => {
          const discount = item.originalPrice
            ? discountPercent(item.originalPrice, item.salePrice)
            : 0;
          const href = item.productSlug ? routes.product(item.productSlug) : routes.shop;
          return (
            <Link
              key={item.variantId}
              href={href}
              className="rounded-card border-border bg-card shadow-card hover:shadow-card-hover border p-3 transition-shadow"
            >
              <div className="relative mb-2 aspect-square overflow-hidden rounded-md">
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={item.productName ?? "Product"}
                  wrapperClassName="size-full"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                {discount > 0 ? (
                  <Badge variant="destructive" className="absolute top-1 left-1">
                    {discount}% OFF
                  </Badge>
                ) : null}
              </div>
              <p className="text-foreground truncate text-sm font-medium">{item.productName}</p>
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold">{formatMoney(item.salePrice)}</span>
                {item.originalPrice ? (
                  <span className="text-muted-foreground text-xs line-through">
                    {formatMoney(item.originalPrice)}
                  </span>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
