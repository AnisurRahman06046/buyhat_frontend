import Link from "next/link";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

import { NewsletterForm } from "./newsletter-form";

const FOOTER_COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Customer Service",
    links: [
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Contact Us", href: "/contact" },
      { label: "Support Center", href: "/support" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Affiliates", href: "/affiliates" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

/** Storefront footer — brand, link columns, newsletter, legal line. */
export function ShopFooter() {
  return (
    <footer className="border-border bg-muted/40 mt-16 border-t">
      <div className="container-page grid grid-cols-1 gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Link
            href={routes.home}
            className="font-heading text-primary text-xl font-extrabold tracking-tight"
          >
            {siteConfig.name}
          </Link>
          <p className="text-body-sm text-muted-foreground max-w-xs">{siteConfig.description}</p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h3 className="text-foreground text-sm font-semibold">{col.heading}</h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="text-foreground text-sm font-semibold">Newsletter</h3>
          <p className="text-body-sm text-muted-foreground mt-4 mb-3">
            Get updates on new collections and sales.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-border border-t py-6">
        <p className="container-page text-muted-foreground text-center text-sm">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
