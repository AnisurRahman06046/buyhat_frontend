import type { Metadata } from "next";
import Link from "next/link";

import { routes } from "@/config/routes";
import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your BuyHat account"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href={routes.auth.register} className="text-primary font-semibold hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <LoginForm redirectTo={redirect} />
    </AuthCard>
  );
}
