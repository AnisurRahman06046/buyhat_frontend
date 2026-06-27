"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Accessible quantity control. Controlled: owns no state. Clamps to [min, max]
 * and disables the relevant button at each bound. Icon buttons are labelled for
 * screen readers; the value is announced politely.
 */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = "md",
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));
  const btnSize = size === "sm" ? "icon-sm" : "icon-sm";
  const valueWidth = size === "sm" ? "w-8" : "w-10";

  return (
    <div
      role="group"
      aria-label="Quantity selector"
      className={cn("border-input bg-card inline-flex items-center rounded-md border", className)}
    >
      <Button
        type="button"
        variant="ghost"
        size={btnSize}
        onClick={decrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus />
      </Button>
      <span
        aria-live="polite"
        className={cn("text-center text-sm font-semibold tabular-nums", valueWidth)}
      >
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size={btnSize}
        onClick={increment}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus />
      </Button>
    </div>
  );
}
