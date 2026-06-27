"use client";

import Link from "next/link";
import { Bell, ChevronRight, Heart, MapPin, Package, User, type LucideIcon } from "lucide-react";

import { routes } from "@/config/routes";

import { useProfile } from "../hooks/use-profile";

const CARDS: { label: string; href: string; icon: LucideIcon; description: string }[] = [
  {
    label: "My Orders",
    href: routes.account.orders,
    icon: Package,
    description: "Track and manage your orders",
  },
  {
    label: "Addresses",
    href: routes.account.addresses,
    icon: MapPin,
    description: "Manage your delivery addresses",
  },
  {
    label: "Profile",
    href: routes.account.profile,
    icon: User,
    description: "Update your personal details",
  },
  {
    label: "Notifications",
    href: routes.account.notifications,
    icon: Bell,
    description: "Choose how we reach you",
  },
  {
    label: "Wishlist",
    href: routes.wishlist,
    icon: Heart,
    description: "Items you've saved for later",
  },
];

export function AccountDashboard() {
  const { data: profile } = useProfile();
  const name = profile?.firstName || profile?.displayName || "there";

  return (
    <div>
      <h1 className="text-headline-lg text-foreground">Hello, {name} 👋</h1>
      <p className="text-muted-foreground mt-1">
        Manage your orders, addresses, and account preferences.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-card border-border bg-card shadow-card hover:shadow-card-hover flex items-center gap-4 border p-4 transition-shadow"
            >
              <span className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-full">
                <Icon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-foreground font-semibold">{card.label}</p>
                <p className="text-muted-foreground truncate text-sm">{card.description}</p>
              </div>
              <ChevronRight className="text-muted-foreground size-4" aria-hidden />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
