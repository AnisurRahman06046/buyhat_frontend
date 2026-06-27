import { RequireAuth } from "@/features/auth/components/guards";
import { AccountSidebar } from "@/features/profile/components/account-sidebar";

/** Auth-gated account shell with the section sidebar. */
export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="container-page py-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <AccountSidebar />
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </RequireAuth>
  );
}
