export function CheckoutSection({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card border-border bg-card shadow-card border p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="border-primary text-primary flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-bold">
          {step}
        </span>
        <h2 className="text-headline-md text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}
