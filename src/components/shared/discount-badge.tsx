import { cn } from "@/lib/cn";
import { discountPercent } from "@/lib/formatters";

/**
 * "N% OFF" pill. Pass either an explicit `percent`, or list+sale prices to
 * derive it. Renders nothing when there is no positive discount.
 */
export function DiscountBadge({
  percent,
  listPrice,
  salePrice,
  className,
}: {
  percent?: number;
  listPrice?: number;
  salePrice?: number;
  className?: string;
}) {
  const value =
    percent ?? (listPrice != null && salePrice != null ? discountPercent(listPrice, salePrice) : 0);

  if (!value || value <= 0) return null;

  return (
    <span
      className={cn(
        "bg-cta text-cta-foreground inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold",
        className,
      )}
    >
      {value}% OFF
    </span>
  );
}
