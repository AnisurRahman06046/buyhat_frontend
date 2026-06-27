"use client";

import { useEffect, useMemo, useState } from "react";

import { PriceTag } from "@/components/shared/price-tag";
import { RatingStars } from "@/components/shared/rating-stars";
import { StockStatus } from "@/components/shared/stock-status";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import type { ProductDetail } from "@/types/catalog";

import { AddToCartSection } from "./add-to-cart-section";
import { ProductGallery } from "./product-gallery";
import { ProductTabs } from "./product-tabs";
import { optionsFromVariant, resolveVariant, VariantSelector } from "./variant-selector";

export function ProductDetailView({ product }: { product: ProductDetail }) {
  const recordRecentlyViewed = useRecentlyViewedStore((s) => s.add);
  useEffect(() => {
    recordRecentlyViewed(product);
  }, [product, recordRecentlyViewed]);

  const variants = useMemo(() => product.variants ?? [], [product.variants]);
  const variantAttributes = useMemo(
    () =>
      (product.attributes ?? []).filter((a) => a.isVariantDefining && (a.options?.length ?? 0) > 0),
    [product.attributes],
  );

  const firstVariant = variants[0];
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() =>
    optionsFromVariant(firstVariant),
  );

  const selectedVariant = useMemo(() => {
    const matched = resolveVariant(variants, selectedOptions);
    if (matched) return matched;
    return variants.length === 1 ? firstVariant : undefined;
  }, [variants, selectedOptions, firstVariant]);

  const price = selectedVariant?.price ?? product.basePrice;
  const compareAt = selectedVariant?.compareAtPrice ?? product.compareAtPrice;
  const available = selectedVariant?.available ?? product.available;
  const requiresSelection = variantAttributes.length > 0 && !selectedVariant;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <ProductGallery media={product.media ?? []} alt={product.name} />

      <div className="space-y-5">
        {product.brandName ? <p className="text-label-caps text-cta">{product.brandName}</p> : null}
        <h1 className="text-headline-lg text-foreground">{product.name}</h1>

        <div className="flex flex-wrap items-center gap-4">
          {typeof product.rating === "number" ? (
            <RatingStars rating={product.rating} count={product.reviewCount} showValue />
          ) : null}
          {typeof available === "number" ? (
            <StockStatus available={available} lowStockThreshold={10} />
          ) : null}
        </div>

        <PriceTag price={price} compareAtPrice={compareAt} size="lg" showDiscount />

        {variantAttributes.length > 0 ? (
          <VariantSelector
            attributes={variantAttributes}
            variants={variants}
            selectedOptions={selectedOptions}
            onSelectOption={(attributeId, optionId) =>
              setSelectedOptions((prev) => ({ ...prev, [attributeId]: optionId }))
            }
          />
        ) : null}

        <AddToCartSection
          product={product}
          variant={selectedVariant}
          available={available}
          requiresSelection={requiresSelection}
        />
      </div>

      <div className="lg:col-span-2">
        <ProductTabs product={product} />
      </div>
    </div>
  );
}
