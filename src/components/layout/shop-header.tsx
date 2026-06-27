"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingCart, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Shop All", href: routes.shop },
  { label: "New Arrivals", href: `${routes.shop}?sort=newest` },
  { label: "Best Sellers", href: `${routes.shop}?sort=best-sellers` },
  { label: "Categories", href: routes.shop },
  { label: "Sale", href: `${routes.shop}?on-sale=true` },
];

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="bg-cta text-cta-foreground absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold">
      {count > 99 ? "99+" : count}
    </span>
  );
}

/**
 * Sticky, blurred storefront header. Cart/wishlist counts and auth state are
 * props (wired in their feature phases). Search submits to the search route.
 * Mobile nav uses an accessible Sheet drawer.
 */
export function ShopHeader({
  cartCount = 0,
  wishlistCount = 0,
  onCartClick,
}: {
  cartCount?: number;
  wishlistCount?: number;
  /** When provided, the cart icon opens the drawer instead of navigating. */
  onCartClick?: () => void;
}) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(routes.search(q));
  };

  return (
    <header className="border-border bg-card/80 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-4">
        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle className="font-heading text-primary text-left text-lg font-extrabold">
                {siteConfig.name}
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-2 flex flex-col px-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-foreground hover:bg-muted rounded-md px-2 py-3 text-base font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link
          href={routes.home}
          className="font-heading text-primary text-xl font-extrabold tracking-tight"
        >
          {siteConfig.name}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-foreground/80 hover:bg-muted hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <form onSubmit={onSearch} className="ml-auto hidden max-w-xs flex-1 md:block" role="search">
          <div className="relative">
            <Search
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              aria-hidden
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search premium collection..."
              aria-label="Search products"
              className="pl-9"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Button variant="ghost" size="icon" aria-label="Search" className="md:hidden" asChild>
            <Link href={routes.search()}>
              <Search />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Account" asChild>
            <Link href={routes.account.root}>
              <User />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Wishlist" className="relative" asChild>
            <Link href={routes.wishlist}>
              <Heart />
              <CountBadge count={wishlistCount} />
            </Link>
          </Button>
          {onCartClick ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Cart"
              className="relative"
              onClick={onCartClick}
            >
              <ShoppingCart />
              <CountBadge count={cartCount} />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" aria-label="Cart" className="relative" asChild>
              <Link href={routes.cart}>
                <ShoppingCart />
                <CountBadge count={cartCount} />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
