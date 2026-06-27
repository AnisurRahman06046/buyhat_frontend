import { PackageOpen, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

/**
 * Centered empty state — icon + title + description + optional primary action.
 * Use for empty carts, no results, no orders, etc. (DESIGN.md "Empty States").
 */
export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}
    >
      <div className="bg-muted text-muted-foreground mb-4 flex size-14 items-center justify-center rounded-full">
        <Icon className="size-7" aria-hidden />
      </div>
      <h3 className="text-headline-md text-foreground">{title}</h3>
      {description ? (
        <p className="text-body-sm text-muted-foreground mt-1.5 max-w-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
