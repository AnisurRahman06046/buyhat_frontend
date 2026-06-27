"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";

type ImageWithFallbackProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  wrapperClassName?: string;
};

/**
 * `next/image` wrapper that shows a skeleton while loading and a graceful icon
 * fallback when `src` is missing or fails. Use with `fill` inside an
 * aspect-ratio box for product imagery.
 */
export function ImageWithFallback({
  src,
  alt,
  className,
  wrapperClassName,
  fill = true,
  sizes = "(max-width: 768px) 50vw, 25vw",
  ...props
}: ImageWithFallbackProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  const showFallback = !src || status === "error";

  return (
    <div className={cn("bg-muted relative overflow-hidden", wrapperClassName)}>
      {showFallback ? (
        <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
          <ImageOff className="size-8" aria-hidden />
          <span className="sr-only">{alt}</span>
        </div>
      ) : (
        <>
          {status === "loading" ? <Skeleton className="absolute inset-0 rounded-none" /> : null}
          <Image
            src={src}
            alt={alt}
            fill={fill}
            sizes={sizes}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
            className={cn(
              "object-cover transition-opacity duration-300",
              status === "loaded" ? "opacity-100" : "opacity-0",
              className,
            )}
            {...props}
          />
        </>
      )}
    </div>
  );
}
