"use client";

import { useState } from "react";

import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { cn } from "@/lib/cn";
import type { ProductMedia } from "@/types/catalog";

export function ProductGallery({ media, alt }: { media: ProductMedia[]; alt: string }) {
  const images =
    media.length > 0 ? [...media].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) : [];
  const [active, setActive] = useState(0);
  const main = images[active];

  return (
    <div className="space-y-3">
      <div className="rounded-card border-border bg-card overflow-hidden border">
        <ImageWithFallback
          src={main?.url}
          alt={main?.alt ?? alt}
          wrapperClassName="aspect-square"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {images.length > 1 ? (
        <ul className="flex gap-2 overflow-x-auto pb-1" aria-label="Product images">
          {images.map((image, i) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "size-16 overflow-hidden rounded-md border-2 transition-colors",
                  i === active ? "border-primary" : "border-border hover:border-input",
                )}
              >
                <ImageWithFallback
                  src={image.url}
                  alt={image.alt ?? `${alt} thumbnail ${i + 1}`}
                  wrapperClassName="size-full"
                  sizes="64px"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
