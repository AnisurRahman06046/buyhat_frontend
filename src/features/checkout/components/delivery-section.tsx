"use client";

import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/formatters";

export type DeliveryOptionId = "standard" | "express";

export const DELIVERY_OPTIONS: {
  id: DeliveryOptionId;
  label: string;
  eta: string;
  fee: number;
}[] = [
  { id: "standard", label: "Standard Delivery", eta: "3–5 business days", fee: 60 },
  { id: "express", label: "Express Delivery", eta: "1–2 business days", fee: 120 },
];

export function deliveryFee(id: DeliveryOptionId): number {
  return DELIVERY_OPTIONS.find((o) => o.id === id)?.fee ?? 0;
}

export function DeliverySection({
  value,
  onChange,
}: {
  value: DeliveryOptionId;
  onChange: (value: DeliveryOptionId) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {DELIVERY_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "rounded-md border p-4 text-left transition-colors",
            value === option.id
              ? "border-primary bg-primary/5 ring-primary ring-1"
              : "border-input hover:border-primary",
          )}
        >
          <p className="text-foreground font-semibold">{option.label}</p>
          <p className="text-muted-foreground text-sm">{option.eta}</p>
          <p className="text-primary mt-1 font-semibold">{formatMoney(option.fee)}</p>
        </button>
      ))}
    </div>
  );
}
