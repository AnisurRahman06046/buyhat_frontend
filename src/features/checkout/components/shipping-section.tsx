"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { AddressForm } from "@/features/profile/components/address-form";
import { useAddAddress, useAddresses } from "@/features/profile/hooks/use-addresses";
import { isApiError } from "@/services/http-error";

import { AddressCard } from "./address-card";

export function ShippingSection({
  selectedAddressId,
  onSelect,
}: {
  selectedAddressId: string | null;
  onSelect: (id: string) => void;
}) {
  const { data: addresses, isLoading } = useAddresses();
  const add = useAddAddress();
  const [adding, setAdding] = useState(false);

  const list = addresses ?? [];
  const showForm = adding || (!isLoading && list.length === 0);

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {list.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {list.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              selected={selectedAddressId === address.id}
              onSelect={() => onSelect(address.id)}
            />
          ))}
        </div>
      ) : null}

      {showForm ? (
        <div className="border-border bg-muted/30 rounded-md border p-4">
          <p className="text-foreground mb-3 text-sm font-semibold">Add a new address</p>
          <AddressForm
            isPending={add.isPending}
            error={add.isError && isApiError(add.error) ? add.error.message : null}
            submitLabel="Save & use this address"
            onCancel={list.length > 0 ? () => setAdding(false) : undefined}
            onSubmit={(payload) =>
              add.mutate(payload, {
                onSuccess: (created) => {
                  setAdding(false);
                  onSelect(created.id);
                },
              })
            }
          />
        </div>
      ) : (
        <Button variant="outline" onClick={() => setAdding(true)}>
          <Plus />
          Add new address
        </Button>
      )}
    </div>
  );
}
