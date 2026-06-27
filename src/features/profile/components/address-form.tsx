"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { TextField } from "@/components/shared/text-field";
import { Button } from "@/components/ui/button";
import type { AddressPayload } from "@/types/user";

import { addressSchema, type AddressValues } from "../schemas/address-schema";

function toPayload(values: AddressValues): AddressPayload {
  return {
    ...values,
    label: values.label || undefined,
    line2: values.line2 || undefined,
  };
}

/** Reusable address form (checkout add-new + Phase 9 profile add/edit). */
export function AddressForm({
  defaultValues,
  onSubmit,
  isPending = false,
  error,
  submitLabel = "Save address",
  onCancel,
}: {
  defaultValues?: Partial<AddressValues>;
  onSubmit: (payload: AddressPayload) => void;
  isPending?: boolean;
  error?: string | null;
  submitLabel?: string;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "BD", ...defaultValues },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(toPayload(values)))}
      className="space-y-4"
      noValidate
    >
      {error ? (
        <div
          role="alert"
          className="border-destructive/20 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm"
        >
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField
          label="Recipient name"
          required
          autoComplete="name"
          error={errors.recipientName?.message}
          {...register("recipientName")}
        />
        <TextField
          label="Phone"
          required
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <TextField
        label="Address line 1"
        required
        autoComplete="address-line1"
        error={errors.line1?.message}
        {...register("line1")}
      />
      <TextField
        label="Address line 2"
        autoComplete="address-line2"
        error={errors.line2?.message}
        {...register("line2")}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <TextField label="City" required error={errors.city?.message} {...register("city")} />
        <TextField
          label="State / Division"
          required
          error={errors.state?.message}
          {...register("state")}
        />
        <TextField
          label="Postal code"
          required
          autoComplete="postal-code"
          error={errors.postalCode?.message}
          {...register("postalCode")}
        />
      </div>

      <TextField label="Label (optional)" hint="e.g. Home, Office" {...register("label")} />

      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
