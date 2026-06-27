"use client";

import { useRouter } from "next/navigation";

import { routes } from "@/config/routes";
import { STAFF_ROLES } from "@/constants/roles";
import { RequireRole } from "@/features/auth/components/guards";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { useSession } from "@/features/auth/hooks/use-session";

import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";

/**
 * Role-guarded admin chrome. Wraps every `/admin/*` page with the sidebar +
 * topbar and enforces staff-only access (defense-in-depth with `middleware`).
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const logout = useLogout();
  const router = useRouter();

  const primaryRole = user?.roles?.[0];
  const name = user?.email ? user.email.split("@")[0] : "Admin";
  const onLogout = () =>
    logout.mutate(undefined, { onSettled: () => router.push(routes.auth.login) });

  return (
    <RequireRole roles={[...STAFF_ROLES]}>
      <div className="bg-background flex min-h-dvh">
        <AdminSidebar
          roles={user?.roles}
          userName={name}
          userRole={primaryRole}
          className="hidden lg:flex"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar userName={name} userRole={primaryRole} onLogout={onLogout} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </RequireRole>
  );
}
