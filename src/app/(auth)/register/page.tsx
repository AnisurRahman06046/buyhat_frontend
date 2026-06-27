import type { Metadata } from "next";
import Link from "next/link";

import { routes } from "@/config/routes";
import { AuthCard } from "@/features/auth/components/auth-card";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = { title: "Create Account" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join BuyHat for faster checkout and order tracking"
      footer={
        <>
          Already have an account?{" "}
          <Link href={routes.auth.login} className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm redirectTo={redirect} />
    </AuthCard>
  );
}
