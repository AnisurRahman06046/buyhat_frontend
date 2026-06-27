import { NewsletterForm } from "@/components/layout/newsletter-form";
import type { HomepageSection } from "@/types/cms";

export function NewsletterSection({ section }: { section: HomepageSection }) {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container-page flex flex-col items-center gap-4 py-12 text-center">
        <h2 className="text-headline-lg">{section.title ?? "Join the BuyHat Circle"}</h2>
        <p className="text-body-md text-primary-foreground/80 max-w-md">
          Get early access to deals and 10% off your first order.
        </p>
        <div className="w-full max-w-md">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
