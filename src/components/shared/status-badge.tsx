import { Badge } from "@/components/ui/badge";
import { statusMeta, type BadgeTone, type StatusMeta } from "@/constants/status";
import { cn } from "@/lib/cn";

/** Soft-tinted styles per tone — matches the reference status pills. */
const TONE_CLASS: Record<BadgeTone, string> = {
  neutral: "border-transparent bg-muted text-muted-foreground",
  info: "border-transparent bg-primary/10 text-primary",
  success: "border-transparent bg-success/10 text-success",
  warning: "border-transparent bg-warning/10 text-warning",
  destructive: "border-transparent bg-destructive/10 text-destructive",
};

/** Render a status pill directly from a tone + label. */
export function StatusBadge({
  tone,
  label,
  className,
}: {
  tone: BadgeTone;
  label: string;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn(TONE_CLASS[tone], "font-semibold", className)}>
      {label}
    </Badge>
  );
}

/**
 * Render a status pill from a status meta map + raw value
 * (e.g. `ORDER_STATUS_META`, `PAYMENT_STATE_META`). Unknown values degrade to a
 * neutral pill with the raw value.
 */
export function StatusBadgeFor({
  map,
  value,
  className,
}: {
  map: Record<string, StatusMeta>;
  value: string | null | undefined;
  className?: string;
}) {
  const meta = statusMeta(map, value);
  return <StatusBadge tone={meta.tone} label={meta.label} className={className} />;
}
