"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { reviewService } from "@/services/review.service";
import type { CreateReviewPayload } from "@/types/review";

export function useCreateReview(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewService.createReview(productId, payload),
    meta: { silentError: true },
    onSuccess: () => {
      // Prefix match invalidates every paginated variant of this product's reviews.
      queryClient.invalidateQueries({ queryKey: ["reviews", "product", productId] });
      toast.success("Review submitted");
    },
  });
}
