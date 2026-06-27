"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";

import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { authService } from "@/services/auth.service";

/** Verifies the email token on mount and reports the outcome. */
export function VerifyEmailContent({ token }: { token?: string }) {
  const verify = useMutation({
    mutationFn: (t: string) => authService.verifyEmail({ token: t }),
    meta: { silentError: true },
  });

  const started = useRef(false);
  useEffect(() => {
    if (token && !started.current) {
      started.current = true;
      verify.mutate(token);
    }
  }, [token, verify]);

  if (!token) {
    return (
      <Outcome
        icon={<XCircle className="size-6" />}
        tone="destructive"
        title="Invalid link"
        description="This verification link is missing or malformed."
      />
    );
  }

  if (verify.isPending || verify.isIdle) {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <Spinner className="size-8" />
        <p className="text-body-sm text-muted-foreground mt-4">Verifying your email…</p>
      </div>
    );
  }

  if (verify.isError) {
    return (
      <Outcome
        icon={<XCircle className="size-6" />}
        tone="destructive"
        title="Verification failed"
        description="This link may have expired or already been used."
      />
    );
  }

  return (
    <Outcome
      icon={<CheckCircle2 className="size-6" />}
      tone="success"
      title="Email verified"
      description="Your email address has been confirmed."
    />
  );
}

function Outcome({
  icon,
  tone,
  title,
  description,
}: {
  icon: React.ReactNode;
  tone: "success" | "destructive";
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div
        className={`mx-auto mb-4 flex size-12 items-center justify-center rounded-full ${
          tone === "success" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        }`}
      >
        {icon}
      </div>
      <p className="text-body-md text-foreground">{title}</p>
      <p className="text-body-sm text-muted-foreground mt-1">{description}</p>
      <Button asChild className="mt-6 w-full">
        <Link href={routes.home}>Continue shopping</Link>
      </Button>
    </div>
  );
}
