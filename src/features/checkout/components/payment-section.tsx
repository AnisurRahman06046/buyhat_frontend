"use client";

import { TextField } from "@/components/shared/text-field";
import { cn } from "@/lib/cn";

import { PAYMENT_METHODS, type PaymentMethodId } from "../lib/payment-methods";

export function PaymentSection({
  value,
  onChange,
}: {
  value: PaymentMethodId;
  onChange: (value: PaymentMethodId) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            type="button"
            aria-pressed={value === method.id}
            onClick={() => onChange(method.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-md border p-4 text-center text-sm font-semibold transition-colors",
              value === method.id
                ? "border-primary bg-primary/5 ring-primary ring-1"
                : "border-input hover:border-primary",
            )}
          >
            {method.label}
          </button>
        ))}
      </div>

      {value === "card" ? (
        <div className="border-border bg-muted/40 space-y-3 rounded-md border p-4">
          <p className="text-muted-foreground text-xs">
            Demo card payment — processed via the mock gateway (no real charge).
          </p>
          <TextField label="Card number" placeholder="XXXX XXXX XXXX XXXX" inputMode="numeric" />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Expiry" placeholder="MM / YY" />
            <TextField label="CVV" placeholder="XXX" inputMode="numeric" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
