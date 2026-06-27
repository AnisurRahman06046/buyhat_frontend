"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";
import type { HomepageSection } from "@/types/cms";

interface Slide {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
}

const DEFAULT_SLIDE: Slide = {
  title: "Premium products, effortless shopping.",
  subtitle: "Discover curated electronics, fashion, and home essentials.",
  ctaText: "Shop Now",
  ctaUrl: routes.shop,
};

function parseSlides(section: HomepageSection): Slide[] {
  const raw = section.config?.slides;
  return Array.isArray(raw) ? (raw as Slide[]) : [];
}

export function HeroSlider({ section }: { section: HomepageSection }) {
  const slides = parseSlides(section);
  const list = slides.length > 0 ? slides : [DEFAULT_SLIDE];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (list.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % list.length), 6000);
    return () => clearInterval(timer);
  }, [list.length]);

  const slide = list[index] ?? DEFAULT_SLIDE;

  return (
    <section className="bg-primary text-primary-foreground relative overflow-hidden">
      {slide.imageUrl ? (
        <ImageWithFallback
          src={slide.imageUrl}
          alt={slide.title ?? "Promotion"}
          wrapperClassName="absolute inset-0 bg-primary opacity-40"
          fill
        />
      ) : null}

      <div className="container-page relative py-16 lg:py-24">
        <div className="max-w-xl space-y-5">
          <h1 className="text-display-lg">{slide.title}</h1>
          {slide.subtitle ? (
            <p className="text-body-lg text-primary-foreground/80">{slide.subtitle}</p>
          ) : null}
          <Button variant="cta" size="lg" asChild>
            <Link href={slide.ctaUrl ?? routes.shop}>
              {slide.ctaText ?? "Shop Now"} <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>

      {list.length > 1 ? (
        <>
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "bg-primary-foreground w-6" : "bg-primary-foreground/40 w-2",
                )}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + list.length) % list.length)}
            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground absolute top-1/2 left-3 -translate-y-1/2"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % list.length)}
            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground absolute top-1/2 right-3 -translate-y-1/2"
          >
            <ChevronRight />
          </Button>
        </>
      ) : null}
    </section>
  );
}
