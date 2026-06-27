import { RequireAuth } from "@/features/auth/components/guards";

/**
 * Auth gate for all `/account/*` routes (defense-in-depth with `middleware`).
 * Phase 9 adds the account navigation/sidebar here.
 */
export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="container-page py-8">{children}</div>
    </RequireAuth>
  );
}
