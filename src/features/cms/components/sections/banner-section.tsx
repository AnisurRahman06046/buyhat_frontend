import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { routes } from "@/config/routes";
import type { HomepageSection } from "@/types/cms";

function str(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function BannerSection({ section }: { section: HomepageSection }) {
  const cfg = section.config ?? {};
  const imageUrl = str(cfg.imageUrl);
  const title = str(cfg.title) ?? section.title ?? undefined;
  const subtitle = str(cfg.subtitle);
  const ctaText = str(cfg.ctaText) ?? "Shop Now";
  const ctaUrl = str(cfg.ctaUrl) ?? routes.shop;

  if (!imageUrl && !title) return null;

  return (
    <section className="container-page py-6">
      <Link
        href={ctaUrl}
        className="rounded-card bg-primary text-primary-foreground relative block overflow-hidden"
      >
        {imageUrl ? (
          <ImageWithFallback
            src={imageUrl}
            alt={title ?? "Promotion"}
            wrapperClassName="absolute inset-0 bg-primary opacity-50"
            fill
          />
        ) : null}
        <div className="relative flex flex-col items-start gap-3 p-8 sm:p-12">
          {title ? <h2 className="text-headline-lg">{title}</h2> : null}
          {subtitle ? <p className="text-body-md text-primary-foreground/80">{subtitle}</p> : null}
          <span className="inline-flex items-center gap-1 font-semibold">
            {ctaText} <ArrowRight className="size-4" aria-hidden />
          </span>
        </div>
      </Link>
    </section>
  );
}
