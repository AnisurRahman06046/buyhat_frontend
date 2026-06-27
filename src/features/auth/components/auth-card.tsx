import Link from "next/link";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

/** Shared shell for auth screens — brand mark + titled card + optional footer. */
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <Link
          href={routes.home}
          className="font-heading text-primary text-2xl font-extrabold tracking-tight"
        >
          {siteConfig.name}
        </Link>
      </div>

      <div className="rounded-card border-border bg-card shadow-card border p-6 sm:p-8">
        <h1 className="text-headline-md text-foreground text-center">{title}</h1>
        {subtitle ? (
          <p className="text-body-sm text-muted-foreground mt-1.5 text-center">{subtitle}</p>
        ) : null}
        <div className="mt-6">{children}</div>
      </div>

      {footer ? (
        <p className="text-body-sm text-muted-foreground mt-6 text-center">{footer}</p>
      ) : null}
    </div>
  );
}

/** Inline server-error banner for auth forms. */
export function FormErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="border-destructive/20 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm"
    >
      {message}
    </div>
  );
}
