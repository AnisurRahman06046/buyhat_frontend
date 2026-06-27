"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/formatters";
import { isApiError } from "@/services/http-error";
import type { AppliedCoupon } from "@/types/cart";

import { useApplyCoupon, useRemoveCoupon } from "../hooks/use-cart";

export function CouponForm({ coupon }: { coupon?: AppliedCoupon | null }) {
  const [code, setCode] = useState("");
  const apply = useApplyCoupon();
  const remove = useRemoveCoupon();

  if (coupon) {
    return (
      <div className="border-success/30 bg-success/10 flex items-center justify-between rounded-md border px-3 py-2 text-sm">
        <span className="text-success flex items-center gap-2 font-medium">
          <Tag className="size-4" aria-hidden />
          {coupon.code}
          {coupon.discount ? ` (−${formatMoney(coupon.discount)})` : ""}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Remove coupon"
          onClick={() => remove.mutate()}
          disabled={remove.isPending}
        >
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  const error = apply.isError && isApiError(apply.error) ? apply.error.message : null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (code.trim()) apply.mutate(code.trim());
      }}
      className="space-y-1.5"
      noValidate
    >
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Coupon code"
          aria-label="Coupon code"
          aria-invalid={error ? true : undefined}
        />
        <Button type="submit" variant="outline" disabled={apply.isPending || !code.trim()}>
          {apply.isPending ? "Applying…" : "Apply"}
        </Button>
      </div>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </form>
  );
}
