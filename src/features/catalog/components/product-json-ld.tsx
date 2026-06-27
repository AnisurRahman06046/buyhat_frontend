import { siteConfig } from "@/config/site";
import type { ProductDetail } from "@/types/catalog";

/** Product + Offer + AggregateRating structured data for rich results. */
export function ProductJsonLd({ product }: { product: ProductDetail }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: product.primaryImageUrl ? [product.primaryImageUrl] : undefined,
    sku: product.id,
    brand: product.brandName ? { "@type": "Brand", name: product.brandName } : undefined,
    aggregateRating:
      typeof product.rating === "number" && product.rating > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount ?? 0,
          }
        : undefined,
    offers: {
      "@type": "Offer",
      price: product.basePrice,
      priceCurrency: siteConfig.currency,
      availability:
        product.available === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: `${siteConfig.url}/products/${product.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      // Structured data must be serialized into the DOM.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
