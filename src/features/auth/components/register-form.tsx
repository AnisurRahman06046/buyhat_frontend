"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { PasswordField } from "@/components/shared/password-field";
import { TextField } from "@/components/shared/text-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { routes } from "@/config/routes";
import { isApiError } from "@/services/http-error";

import { useRegister } from "../hooks/use-auth";
import { registerSchema, type RegisterValues } from "../schemas/auth-schemas";
import { FormErrorBanner } from "./auth-card";

export function RegisterForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { acceptTerms: false },
  });

  const onSubmit = (values: RegisterValues) => {
    registerMutation.mutate(
      {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName || undefined,
      },
      { onSuccess: () => router.push(redirectTo || routes.home) },
    );
  };

  const serverError =
    registerMutation.isError && isApiError(registerMutation.error)
      ? registerMutation.error.message
      : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError ? <FormErrorBanner message={serverError} /> : null}

      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="First name"
          autoComplete="given-name"
          required
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <TextField
          label="Last name"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        required
        error={errors.email?.message}
        {...register("email")}
      />

      <PasswordField
        label="Password"
        autoComplete="new-password"
        required
        hint="At least 8 characters."
        error={errors.password?.message}
        {...register("password")}
      />

      <PasswordField
        label="Confirm password"
        autoComplete="new-password"
        required
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <div className="space-y-1.5">
        <div className="flex items-start gap-2">
          <Controller
            control={control}
            name="acceptTerms"
            render={({ field }) => (
              <Checkbox
                id="acceptTerms"
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
                aria-invalid={errors.acceptTerms ? true : undefined}
                className="mt-0.5"
              />
            )}
          />
          <label htmlFor="acceptTerms" className="text-muted-foreground text-sm">
            I agree to the{" "}
            <Link href="/terms" className="text-primary font-medium hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary font-medium hover:underline">
              Privacy Policy
            </Link>
            .
          </label>
        </div>
        {errors.acceptTerms ? (
          <p className="text-destructive text-sm">{errors.acceptTerms.message}</p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? "Creating account…" : "Create Account"}
      </Button>
    </form>
  );
}
