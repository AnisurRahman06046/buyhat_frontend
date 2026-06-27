"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  User,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/cn";

const NAV: { label: string; href: string; icon: LucideIcon; exact?: boolean }[] = [
  { label: "Dashboard", href: routes.account.root, icon: LayoutDashboard, exact: true },
  { label: "Orders", href: routes.account.orders, icon: Package },
  { label: "Addresses", href: routes.account.addresses, icon: MapPin },
  { label: "Profile", href: routes.account.profile, icon: User },
  { label: "Notifications", href: routes.account.notifications, icon: Bell },
  { label: "Wishlist", href: routes.wishlist, icon: Heart },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const active = isActive(item.href, item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
      <Button
        variant="ghost"
        className="text-destructive hover:text-destructive w-full justify-start gap-3"
        onClick={() => logout.mutate(undefined, { onSettled: () => router.push(routes.home) })}
      >
        <LogOut className="size-4 shrink-0" aria-hidden />
        Logout
      </Button>
    </nav>
  );
}
