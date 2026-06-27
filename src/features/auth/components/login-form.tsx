"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { PasswordField } from "@/components/shared/password-field";
import { TextField } from "@/components/shared/text-field";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { isApiError } from "@/services/http-error";

import { useLogin } from "../hooks/use-auth";
import { loginSchema, type LoginValues } from "../schemas/auth-schemas";
import { FormErrorBanner } from "./auth-card";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (values: LoginValues) => {
    login.mutate(values, {
      onSuccess: () => router.push(redirectTo || routes.home),
    });
  };

  const serverError = login.isError && isApiError(login.error) ? login.error.message : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError ? <FormErrorBanner message={serverError} /> : null}

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
        autoComplete="current-password"
        required
        error={errors.password?.message}
        labelAction={
          <Link
            href={routes.auth.forgotPassword}
            className="text-primary text-sm font-medium hover:underline"
          >
            Forgot?
          </Link>
        }
        {...register("password")}
      />

      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}
