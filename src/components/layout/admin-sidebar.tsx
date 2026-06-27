"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CreditCard,
  FolderTree,
  LayoutDashboard,
  LayoutTemplate,
  Megaphone,
  Package,
  Settings,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Ticket,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { hasRole, ROLE_LABELS, type Role } from "@/constants/roles";
import { cn } from "@/lib/cn";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  allowedRoles?: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: routes.admin.dashboard, icon: LayoutDashboard },
  {
    label: "Products",
    href: routes.admin.products,
    icon: Package,
    allowedRoles: ["ADMIN", "INVENTORY_MANAGER"],
  },
  { label: "Categories", href: routes.admin.categories, icon: FolderTree, allowedRoles: ["ADMIN"] },
  {
    label: "Attributes",
    href: routes.admin.attributes,
    icon: SlidersHorizontal,
    allowedRoles: ["ADMIN"],
  },
  {
    label: "Inventory",
    href: routes.admin.inventory,
    icon: Warehouse,
    allowedRoles: ["ADMIN", "INVENTORY_MANAGER"],
  },
  {
    label: "Orders",
    href: routes.admin.orders,
    icon: ShoppingCart,
    allowedRoles: ["ADMIN", "CUSTOMER_SUPPORT"],
  },
  { label: "Payments", href: routes.admin.payments, icon: CreditCard, allowedRoles: ["ADMIN"] },
  {
    label: "Customers",
    href: routes.admin.customers,
    icon: Users,
    allowedRoles: ["ADMIN", "CUSTOMER_SUPPORT"],
  },
  {
    label: "Coupons",
    href: routes.admin.coupons,
    icon: Ticket,
    allowedRoles: ["ADMIN", "MARKETING_MANAGER"],
  },
  {
    label: "Promotions",
    href: routes.admin.promotions,
    icon: Megaphone,
    allowedRoles: ["ADMIN", "MARKETING_MANAGER"],
  },
  {
    label: "CMS Builder",
    href: routes.admin.cms,
    icon: LayoutTemplate,
    allowedRoles: ["ADMIN", "MARKETING_MANAGER"],
  },
  {
    label: "Reviews",
    href: routes.admin.reviews,
    icon: Star,
    allowedRoles: ["ADMIN", "CUSTOMER_SUPPORT"],
  },
  { label: "Reports", href: routes.admin.reports, icon: BarChart3, allowedRoles: ["ADMIN"] },
  { label: "Settings", href: routes.admin.settings, icon: Settings, allowedRoles: ["ADMIN"] },
];

function isActive(pathname: string, href: string): boolean {
  if (href === routes.admin.root) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Admin navigation rail. Items are gated by the current user's roles (omit
 * `roles` in dev to show everything). Active state matches the current path.
 */
export function AdminSidebar({
  roles,
  userName = "Admin User",
  userRole,
  className,
}: {
  roles?: Role[];
  userName?: string;
  userRole?: Role;
  className?: string;
}) {
  const pathname = usePathname();
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.allowedRoles || !roles || hasRole(roles, ...item.allowedRoles),
  );

  return (
    <aside
      className={cn("border-border bg-card flex h-dvh w-64 shrink-0 flex-col border-r", className)}
    >
      <div className="px-5 py-5">
        <Link href={routes.admin.dashboard} className="block">
          <p className="font-heading text-primary text-lg leading-tight font-extrabold">
            {siteConfig.name}
          </p>
          <p className="text-label-caps text-muted-foreground">Enterprise Admin</p>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {visibleItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-success/15 text-success"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-border border-t p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-foreground truncate text-sm font-semibold">{userName}</p>
            <p className="text-muted-foreground truncate text-xs">
              {userRole ? ROLE_LABELS[userRole] : "Administrator"}
            </p>
          </div>
        </div>
        <Button variant="default" className="mt-2 w-full">
          Support
        </Button>
      </div>
    </aside>
  );
}
