import { cn } from "@/lib/cn";

/**
 * Storefront/admin section heading: optional eyebrow + title + description with a
 * trailing action slot (e.g. "View all"). Keeps heading rhythm consistent.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("space-y-1", align === "center" && "mx-auto")}>
        {eyebrow ? <p className="text-label-caps text-cta">{eyebrow}</p> : null}
        <h2 className="text-headline-lg text-foreground">{title}</h2>
        {description ? <p className="text-body-md text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
