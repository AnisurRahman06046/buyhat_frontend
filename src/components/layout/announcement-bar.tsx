"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import { cn } from "@/lib/cn";

const storageKey = (id: string) => `buyhat:announce:${id}`;

/**
 * Dismissible promo bar (CMS-driven later). Renders by default (SSR-friendly)
 * and self-hides on mount if previously dismissed — dismissal persists per `id`.
 */
export function AnnouncementBar({
  id = "default",
  message,
  ctaLabel,
  ctaHref,
  className,
}: {
  id?: string;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(storageKey(id)) === "1") setVisible(false);
  }, [id]);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(storageKey(id), "1");
    setVisible(false);
  };

  return (
    <div className={cn("bg-primary text-primary-foreground relative", className)}>
      <div className="container-page flex min-h-9 items-center justify-center gap-2 py-2 text-center text-sm">
        <p>
          {message}
          {ctaHref && ctaLabel ? (
            <Link href={ctaHref} className="ml-2 font-semibold underline underline-offset-2">
              {ctaLabel}
            </Link>
          ) : null}
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="text-primary-foreground/80 hover:text-primary-foreground focus-visible:outline-primary-foreground absolute top-1/2 right-3 -translate-y-1/2 rounded-sm p-1 transition-colors focus-visible:outline-2"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
