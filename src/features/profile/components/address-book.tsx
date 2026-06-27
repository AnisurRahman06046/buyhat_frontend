"use client";

import { useState } from "react";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Spinner } from "@/components/shared/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { isApiError } from "@/services/http-error";
import type { Address } from "@/types/user";

import {
  useAddAddress,
  useAddresses,
  useDeleteAddress,
  useSetDefaultAddress,
  useUpdateAddress,
} from "../hooks/use-addresses";
import { AddressForm } from "./address-form";

export function AddressBook() {
  const { data: addresses, isLoading } = useAddresses();
  const add = useAddAddress();
  const update = useUpdateAddress();
  const del = useDeleteAddress();
  const setDefault = useSetDefaultAddress();

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-8" />
      </div>
    );
  }

  const list = addresses ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {list.length} saved address{list.length === 1 ? "" : "es"}
        </p>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus />
              Add address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add address</DialogTitle>
            </DialogHeader>
            <AddressForm
              isPending={add.isPending}
              error={add.isError && isApiError(add.error) ? add.error.message : null}
              onSubmit={(payload) => add.mutate(payload, { onSuccess: () => setAddOpen(false) })}
              onCancel={() => setAddOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No saved addresses"
          description="Add an address to speed up checkout."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {list.map((address) => (
            <div
              key={address.id}
              className="rounded-card border-border bg-card shadow-card border p-4 text-sm"
            >
              <div className="mb-2 flex items-center gap-2">
                {address.label ? (
                  <span className="text-label-caps text-muted-foreground">{address.label}</span>
                ) : null}
                {address.isDefaultShipping ? <Badge variant="success">Default</Badge> : null}
              </div>
              <p className="text-foreground font-semibold">{address.recipientName}</p>
              <p className="text-muted-foreground">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}
              </p>
              <p className="text-muted-foreground">
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p className="text-muted-foreground">{address.phone}</p>

              <div className="mt-3 flex flex-wrap gap-1">
                {!address.isDefaultShipping ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setDefault.mutate({
                        id: address.id,
                        payload: { shipping: true, billing: true },
                      })
                    }
                    disabled={setDefault.isPending}
                  >
                    <Star className="size-3.5" />
                    Set default
                  </Button>
                ) : null}

                <Dialog
                  open={editing?.id === address.id}
                  onOpenChange={(open) => setEditing(open ? address : null)}
                >
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit address</DialogTitle>
                    </DialogHeader>
                    <AddressForm
                      submitLabel="Save changes"
                      isPending={update.isPending}
                      error={
                        update.isError && isApiError(update.error) ? update.error.message : null
                      }
                      defaultValues={{
                        recipientName: address.recipientName,
                        phone: address.phone,
                        line1: address.line1,
                        line2: address.line2 ?? "",
                        city: address.city,
                        state: address.state,
                        postalCode: address.postalCode,
                        country: address.country,
                        label: address.label ?? "",
                      }}
                      onSubmit={(payload) =>
                        update.mutate(
                          { id: address.id, payload },
                          { onSuccess: () => setEditing(null) },
                        )
                      }
                      onCancel={() => setEditing(null)}
                    />
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => del.mutate(address.id)}
                  disabled={del.isPending}
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
