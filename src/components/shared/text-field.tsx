"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

export interface TextFieldProps extends React.ComponentProps<"input"> {
  label: string;
  error?: string;
  hint?: string;
  /** Optional control rendered to the right of the label (e.g. "Forgot?"). */
  labelAction?: React.ReactNode;
}

/**
 * Labelled input wired for accessibility (label association, `aria-invalid`,
 * `aria-describedby`) and RHF (`forwardRef`, so `{...register("x")}` just works).
 * Reused by every form in the app.
 */
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, labelAction, id, className, required, ...props },
  ref,
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={inputId}>
          {label}
          {required ? <span className="text-destructive"> *</span> : null}
        </Label>
        {labelAction}
      </div>
      <Input
        id={inputId}
        ref={ref}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(error && "border-destructive focus-visible:ring-destructive/30", className)}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-destructive text-sm">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-muted-foreground text-sm">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
