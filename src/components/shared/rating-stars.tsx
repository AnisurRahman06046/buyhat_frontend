import { Star } from "lucide-react";

import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/formatters";

type StarSize = "sm" | "md" | "lg";

const SIZE_CLASS: Record<StarSize, string> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
};

/**
 * Gold star rating with accurate fractional fill (overlay clipped to the rating
 * percentage). Renders an accessible `role="img"` label; stars are decorative.
 */
export function RatingStars({
  rating,
  count,
  size = "md",
  showValue = false,
  className,
}: {
  rating: number;
  count?: number;
  size?: StarSize;
  showValue?: boolean;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(5, rating || 0));
  const fillPct = (clamped / 5) * 100;
  const sizeClass = SIZE_CLASS[size];

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span
        role="img"
        aria-label={`Rated ${clamped.toFixed(1)} out of 5`}
        className="relative inline-flex"
      >
        <span className="text-muted-foreground/40 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={sizeClass} aria-hidden />
          ))}
        </span>
        <span
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillPct}%` }}
          aria-hidden
        >
          <span className="text-gold flex w-max gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={cn(sizeClass, "fill-gold")} />
            ))}
          </span>
        </span>
      </span>

      {showValue ? <span className="text-sm font-medium">{clamped.toFixed(1)}</span> : null}
      {count != null ? (
        <span className="text-muted-foreground text-sm">({formatNumber(count)})</span>
      ) : null}
    </div>
  );
}
