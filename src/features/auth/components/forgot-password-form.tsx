"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";

import { TextField } from "@/components/shared/text-field";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { authService } from "@/services/auth.service";
import { isApiError } from "@/services/http-error";

import { forgotPasswordSchema, type ForgotPasswordValues } from "../schemas/auth-schemas";
import { FormErrorBanner } from "./auth-card";

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const forgot = useMutation({
    mutationFn: (values: ForgotPasswordValues) => authService.forgotPassword(values),
    meta: { silentError: true },
  });

  if (forgot.isSuccess) {
    return (
      <div className="text-center">
        <div className="bg-success/10 text-success mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
          <MailCheck className="size-6" aria-hidden />
        </div>
        <p className="text-body-md text-foreground">Check your email</p>
        <p className="text-body-sm text-muted-foreground mt-1">
          If an account exists for <span className="font-medium">{getValues("email")}</span>,
          we&apos;ve sent a password reset link.
        </p>
        <Button asChild variant="outline" className="mt-6 w-full">
          <Link href={routes.auth.login}>Back to sign in</Link>
        </Button>
      </div>
    );
  }

  const serverError = forgot.isError && isApiError(forgot.error) ? forgot.error.message : null;

  return (
    <form onSubmit={handleSubmit((v) => forgot.mutate(v))} className="space-y-4" noValidate>
      {serverError ? <FormErrorBanner message={serverError} /> : null}
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        required
        error={errors.email?.message}
        {...register("email")}
      />
      <Button type="submit" className="w-full" disabled={forgot.isPending}>
        {forgot.isPending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
