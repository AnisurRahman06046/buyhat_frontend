"use client";

import { useState } from "react";
import { CheckCircle2, Star } from "lucide-react";

import { TextField } from "@/components/shared/text-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";
import { isApiError } from "@/services/http-error";

import { useCreateReview } from "../hooks/use-reviews";

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          aria-pressed={value >= n}
          className="rounded-sm"
        >
          <Star
            className={cn(
              "size-6 transition-colors",
              value >= n ? "fill-gold text-gold" : "text-muted-foreground/40",
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const create = useCreateReview(productId);

  if (create.isSuccess) {
    return (
      <div className="border-success/30 bg-success/10 text-success flex items-center gap-2 rounded-md border px-3 py-2.5 text-sm">
        <CheckCircle2 className="size-4 shrink-0" aria-hidden />
        Thanks! Your review was submitted and may be shown after approval.
      </div>
    );
  }

  const error = create.isError && isApiError(create.error) ? create.error.message : null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return;
    create.mutate({ rating, title: title || undefined, body: body || undefined });
  };

  return (
    <form onSubmit={submit} className="border-border space-y-3 rounded-md border p-4" noValidate>
      <p className="text-foreground text-sm font-semibold">Write a review</p>

      {error ? (
        <div
          role="alert"
          className="border-destructive/20 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm"
        >
          {error}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label>Your rating</Label>
        <StarInput value={rating} onChange={setRating} />
      </div>

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Sum it up in a few words"
      />

      <div className="space-y-1.5">
        <Label htmlFor="review-body">Review</Label>
        <Textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did you like or dislike?"
        />
      </div>

      <Button type="submit" disabled={create.isPending || rating < 1}>
        {create.isPending ? "Submitting…" : "Submit review"}
      </Button>
    </form>
  );
}
