"use client";

import { cn } from "@/lib/cn";
import type { Attribute, Variant } from "@/types/catalog";

/** Build a {attributeId → optionId} map from a variant's attribute values. */
export function optionsFromVariant(variant?: Variant): Record<string, string> {
  const out: Record<string, string> = {};
  for (const av of variant?.attributeValues ?? []) {
    if (av.optionId) out[av.attributeId] = av.optionId;
  }
  return out;
}

/** Find the variant matching every selected option (or undefined). */
export function resolveVariant(
  variants: Variant[],
  selected: Record<string, string>,
): Variant | undefined {
  const keys = Object.keys(selected);
  if (keys.length === 0) return undefined;
  return variants.find((variant) => {
    const map = optionsFromVariant(variant);
    return keys.every((k) => map[k] === selected[k]);
  });
}

/** Does any variant exist with `optionId` for `attributeId`, given current picks? */
function optionAvailable(
  variants: Variant[],
  attributeId: string,
  optionId: string,
  selected: Record<string, string>,
): boolean {
  const others = Object.entries(selected).filter(([k]) => k !== attributeId);
  return variants.some((variant) => {
    const map = optionsFromVariant(variant);
    if (map[attributeId] !== optionId) return false;
    return others.every(([k, v]) => map[k] === v);
  });
}

export function VariantSelector({
  attributes,
  variants,
  selectedOptions,
  onSelectOption,
}: {
  attributes: Attribute[];
  variants: Variant[];
  selectedOptions: Record<string, string>;
  onSelectOption: (attributeId: string, optionId: string) => void;
}) {
  return (
    <div className="space-y-4">
      {attributes.map((attr) => {
        const selectedId = selectedOptions[attr.id];
        const selectedLabel = attr.options?.find((o) => o.id === selectedId)?.label;
        return (
          <div key={attr.id} className="space-y-2">
            <p className="text-foreground text-sm font-semibold">
              {attr.name}
              {selectedLabel ? (
                <span className="text-muted-foreground ml-1.5 font-normal">{selectedLabel}</span>
              ) : null}
            </p>
            <div className="flex flex-wrap gap-2">
              {(attr.options ?? []).map((option) => {
                const selected = selectedId === option.id;
                const available = optionAvailable(variants, attr.id, option.id, selectedOptions);
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={!available && !selected}
                    aria-pressed={selected}
                    onClick={() => onSelectOption(attr.id, option.id)}
                    className={cn(
                      "min-w-11 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                      selected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-input text-foreground hover:border-primary",
                      !available &&
                        !selected &&
                        "text-muted-foreground cursor-not-allowed line-through opacity-50",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
