import { Check } from "lucide-react";

import { cn } from "@/lib/cn";
import type { Address } from "@/types/user";

export function AddressCard({
  address,
  selected,
  onSelect,
}: {
  address: Address;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "relative w-full rounded-md border p-4 text-left text-sm transition-colors",
        selected
          ? "border-primary bg-primary/5 ring-primary ring-1"
          : "border-input hover:border-primary",
      )}
    >
      {selected ? (
        <Check className="text-primary absolute top-3 right-3 size-4" aria-hidden />
      ) : null}
      {address.label ? (
        <p className="text-label-caps text-muted-foreground">{address.label}</p>
      ) : null}
      <p className="text-foreground font-semibold">{address.recipientName}</p>
      <p className="text-muted-foreground">
        {address.line1}
        {address.line2 ? `, ${address.line2}` : ""}
      </p>
      <p className="text-muted-foreground">
        {address.city}, {address.state} {address.postalCode}
      </p>
      <p className="text-muted-foreground">{address.phone}</p>
    </button>
  );
}
