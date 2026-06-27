"use client";

import Link from "next/link";
import { Bell, HelpCircle, LogOut, Search, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { routes } from "@/config/routes";
import { ROLE_LABELS, type Role } from "@/constants/roles";
import { cn } from "@/lib/cn";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Admin top bar — global search, notifications, help, and account menu. */
export function AdminTopbar({
  userName = "Admin User",
  userRole,
  hasNotifications = false,
  onLogout,
  className,
}: {
  userName?: string;
  userRole?: Role;
  hasNotifications?: boolean;
  onLogout?: () => void;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "border-border bg-card/80 sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 backdrop-blur-md md:px-6",
        className,
      )}
    >
      <form role="search" className="hidden max-w-md flex-1 sm:block">
        <div className="relative">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search orders, customers, analytics..."
            aria-label="Search admin"
            className="bg-muted/60 border-transparent pl-9"
          />
        </div>
      </form>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell />
          {hasNotifications ? (
            <span className="bg-cta absolute top-2 right-2 size-2 rounded-full" aria-hidden />
          ) : null}
        </Button>
        <Button variant="ghost" size="icon" aria-label="Help">
          <HelpCircle />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Account menu"
              className="hover:bg-muted flex items-center gap-2 rounded-md py-1 pr-1 pl-2 transition-colors"
            >
              <div className="hidden text-right sm:block">
                <p className="text-foreground text-sm font-semibold">{userName}</p>
                <p className="text-muted-foreground text-xs">
                  {userRole ? ROLE_LABELS[userRole] : "Administrator"}
                </p>
              </div>
              <Avatar className="size-9">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {initials(userName)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={routes.account.profile}>
                <User />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={routes.admin.settings}>
                <Settings />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onLogout}>
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
