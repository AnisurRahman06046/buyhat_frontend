"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

export interface PasswordFieldProps extends Omit<React.ComponentProps<"input">, "type"> {
  label: string;
  error?: string;
  hint?: string;
  labelAction?: React.ReactNode;
}

/** Password input with an accessible show/hide toggle. RHF-ready via forwardRef. */
export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(
    { label, error, hint, labelAction, id, className, required, ...props },
    ref,
  ) {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
    const [visible, setVisible] = React.useState(false);

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor={inputId}>
            {label}
            {required ? <span className="text-destructive"> *</span> : null}
          </Label>
          {labelAction}
        </div>
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={visible ? "text" : "password"}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "border-input bg-card placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              error && "border-destructive focus-visible:ring-destructive/30",
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-1 transition-colors"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
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
  },
);
