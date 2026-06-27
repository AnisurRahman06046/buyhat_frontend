import { cn } from "@/lib/cn";

type StockLevel = "in" | "low" | "out";

interface LevelMeta {
  label: (n: number) => string;
  dot: string;
  text: string;
  bar: string;
}

const LEVEL: Record<StockLevel, LevelMeta> = {
  in: { label: () => "In Stock", dot: "bg-success", text: "text-success", bar: "bg-success" },
  low: {
    label: (n) => (n > 0 ? `Only ${n} left` : "Low Stock"),
    dot: "bg-destructive",
    text: "text-destructive",
    bar: "bg-destructive",
  },
  out: {
    label: () => "Out of Stock",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    bar: "bg-muted-foreground",
  },
};

function levelOf(available: number, threshold: number): StockLevel {
  if (available <= 0) return "out";
  if (available <= threshold) return "low";
  return "in";
}

/**
 * Stock availability indicator. Dot + label by default; pass `showBar` with
 * `maxStock` for the thin urgency bar seen on product cards. DESIGN.md: low
 * stock uses the urgency red.
 */
export function StockStatus({
  available,
  lowStockThreshold = 10,
  showBar = false,
  maxStock,
  className,
}: {
  available: number;
  lowStockThreshold?: number;
  showBar?: boolean;
  maxStock?: number;
  className?: string;
}) {
  const level = levelOf(available, lowStockThreshold);
  const meta = LEVEL[level];
  const ceiling = maxStock ?? Math.max(lowStockThreshold * 2, available);
  const barPct = level === "out" ? 0 : Math.max(8, Math.min(100, (available / ceiling) * 100));

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", meta.text)}>
        <span className={cn("size-1.5 rounded-full", meta.dot)} aria-hidden />
        {meta.label(available)}
      </span>
      {showBar ? (
        <span className="bg-muted block h-1 w-full overflow-hidden rounded-full" aria-hidden>
          <span
            className={cn("block h-full rounded-full transition-all", meta.bar)}
            style={{ width: `${barPct}%` }}
          />
        </span>
      ) : null}
    </div>
  );
}
