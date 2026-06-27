"use client";

import { useQuery } from "@tanstack/react-query";

import { RatingStars } from "@/components/shared/rating-stars";
import { Spinner } from "@/components/shared/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryKeys } from "@/config/query-keys";
import { formatDate } from "@/lib/formatters";
import { reviewService } from "@/services/review.service";
import type { ProductDetail } from "@/types/catalog";

function ReviewsTab({ productId }: { productId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.reviews.byProduct(productId, { page: 1, limit: 10 }),
    queryFn: ({ signal }) =>
      reviewService.getProductReviews(productId, { page: 1, limit: 10 }, signal),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  const reviews = data?.items ?? [];
  if (reviews.length === 0) {
    return (
      <p className="text-body-sm text-muted-foreground">
        No reviews yet. Be the first to review this product.
      </p>
    );
  }

  return (
    <ul className="space-y-6">
      {reviews.map((review) => (
        <li key={review.id} className="border-border space-y-1.5 border-b pb-5 last:border-0">
          <div className="flex items-center justify-between">
            <RatingStars rating={review.rating} size="sm" />
            <span className="text-muted-foreground text-xs">{formatDate(review.createdAt)}</span>
          </div>
          {review.title ? (
            <p className="text-foreground text-sm font-semibold">{review.title}</p>
          ) : null}
          {review.body ? <p className="text-body-sm text-muted-foreground">{review.body}</p> : null}
          {review.authorName ? (
            <p className="text-muted-foreground text-xs">
              — {review.authorName}
              {review.verifiedPurchase ? " · Verified Purchase" : ""}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function ProductTabs({ product }: { product: ProductDetail }) {
  const specs = product.specifications ?? [];

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specs">Specifications</TabsTrigger>
        <TabsTrigger value="reviews">
          Reviews{product.reviewCount ? ` (${product.reviewCount})` : ""}
        </TabsTrigger>
        <TabsTrigger value="shipping">Shipping &amp; Returns</TabsTrigger>
      </TabsList>

      <div className="pt-6">
        <TabsContent value="description">
          <p className="text-body-md text-muted-foreground whitespace-pre-line">
            {product.description ?? "No description available."}
          </p>
        </TabsContent>

        <TabsContent value="specs">
          {specs.length > 0 ? (
            <dl className="divide-border divide-y">
              {specs.map((spec, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 py-3 text-sm">
                  <dt className="text-foreground font-medium">{spec.label}</dt>
                  <dd className="text-muted-foreground col-span-2">{spec.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-body-sm text-muted-foreground">No specifications listed.</p>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsTab productId={product.id} />
        </TabsContent>

        <TabsContent value="shipping">
          <div className="text-body-sm text-muted-foreground space-y-2">
            <p>Standard delivery: 3–5 business days. Express: 1–2 business days.</p>
            <p>Free shipping on orders over ৳1,500.</p>
            <p>30-day hassle-free returns on eligible items.</p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
