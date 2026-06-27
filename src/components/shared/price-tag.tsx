import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/formatters";

import { DiscountBadge } from "./discount-badge";

type PriceSize = "sm" | "md" | "lg";

const PRICE_CLASS: Record<PriceSize, string> = {
  sm: "text-base font-bold",
  md: "text-lg font-bold",
  lg: "text-price-xl",
};

const COMPARE_CLASS: Record<PriceSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-body-md",
};

/**
 * Price display: current price (primary), optional strikethrough compare-at, and
 * an optional discount badge. BDT-formatted. Single source for price rendering.
 */
export function PriceTag({
  price,
  compareAtPrice,
  size = "md",
  showDiscount = false,
  className,
}: {
  price: number;
  compareAtPrice?: number | null;
  size?: PriceSize;
  showDiscount?: boolean;
  className?: string;
}) {
  const hasCompare = compareAtPrice != null && compareAtPrice > price;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span className={cn("font-heading text-primary", PRICE_CLASS[size])}>
        {formatMoney(price)}
      </span>
      {hasCompare ? (
        <span className={cn("text-muted-foreground line-through", COMPARE_CLASS[size])}>
          {formatMoney(compareAtPrice)}
        </span>
      ) : null}
      {showDiscount && hasCompare ? (
        <DiscountBadge listPrice={compareAtPrice} salePrice={price} />
      ) : null}
    </div>
  );
}
