"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PasswordField } from "@/components/shared/password-field";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { authService } from "@/services/auth.service";
import { isApiError } from "@/services/http-error";

import { resetPasswordSchema, type ResetPasswordValues } from "../schemas/auth-schemas";
import { FormErrorBanner } from "./auth-card";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema) });

  const reset = useMutation({
    mutationFn: (values: ResetPasswordValues) =>
      authService.resetPassword({ token, newPassword: values.password }),
    meta: { silentError: true },
    onSuccess: () => {
      toast.success("Password updated", { description: "You can now sign in." });
      router.push(routes.auth.login);
    },
  });

  if (!token) {
    return (
      <div className="text-center">
        <FormErrorBanner message="This reset link is invalid or has expired." />
        <Button asChild variant="outline" className="mt-6 w-full">
          <Link href={routes.auth.forgotPassword}>Request a new link</Link>
        </Button>
      </div>
    );
  }

  const serverError = reset.isError && isApiError(reset.error) ? reset.error.message : null;

  return (
    <form onSubmit={handleSubmit((v) => reset.mutate(v))} className="space-y-4" noValidate>
      {serverError ? <FormErrorBanner message={serverError} /> : null}
      <PasswordField
        label="New password"
        autoComplete="new-password"
        required
        hint="At least 8 characters."
        error={errors.password?.message}
        {...register("password")}
      />
      <PasswordField
        label="Confirm new password"
        autoComplete="new-password"
        required
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button type="submit" className="w-full" disabled={reset.isPending}>
        {reset.isPending ? "Updating…" : "Reset password"}
      </Button>
    </form>
  );
}
