"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Spinner } from "@/components/shared/spinner";
import { routes } from "@/config/routes";
import type { Role } from "@/constants/roles";

import { useHasRole, useSession } from "../hooks/use-session";

function FullScreenLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}

function loginRedirect(pathname: string): string {
  return `${routes.auth.login}?redirect=${encodeURIComponent(pathname)}`;
}

/** Gate that requires an authenticated session (any role). */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace(loginRedirect(pathname));
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) return <FullScreenLoader />;
  if (!isAuthenticated) return null;
  return <>{children}</>;
}

/** Gate that requires one of the given roles (redirects non-staff home). */
export function RequireRole({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useSession();
  const allowed = useHasRole(...roles);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.replace(loginRedirect(pathname));
    else if (!allowed) router.replace(routes.home);
  }, [isLoading, isAuthenticated, allowed, router, pathname]);

  if (isLoading) return <FullScreenLoader />;
  if (!isAuthenticated || !allowed) return null;
  return <>{children}</>;
}
