"use client";

import { useState } from "react";

import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatMoney } from "@/lib/formatters";
import { isApiError } from "@/services/http-error";
import type { Order } from "@/types/order";

import { useRequestReturn } from "../hooks/use-orders";

export function ReturnRequestDialog({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [reason, setReason] = useState("");
  const request = useRequestReturn(order.id);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = { ...prev };
      if (id in next) delete next[id];
      else next[id] = 1;
      return next;
    });

  const items = Object.entries(selected).map(([orderItemId, quantity]) => ({
    orderItemId,
    quantity,
  }));
  const error = request.isError && isApiError(request.error) ? request.error.message : null;

  const submit = () => {
    if (items.length === 0) return;
    request.mutate(
      { items, reason: reason || undefined },
      {
        onSuccess: () => {
          setOpen(false);
          setSelected({});
          setReason("");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Request return</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request a return</DialogTitle>
          <DialogDescription>Select the items you&apos;d like to return.</DialogDescription>
        </DialogHeader>

        {error ? (
          <div
            role="alert"
            className="border-destructive/20 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm"
          >
            {error}
          </div>
        ) : null}

        <ul className="space-y-3">
          {order.items.map((item) => {
            const checked = item.id in selected;
            return (
              <li
                key={item.id}
                className="border-border flex items-center gap-3 rounded-md border p-3"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggle(item.id)}
                  aria-label={`Select ${item.productName}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-medium">{item.productName}</p>
                  <p className="text-muted-foreground text-xs">
                    Ordered {item.quantity} · {formatMoney(item.unitPrice)}
                  </p>
                </div>
                {checked ? (
                  <QuantityStepper
                    value={selected[item.id] ?? 1}
                    onChange={(q) => setSelected((prev) => ({ ...prev, [item.id]: q }))}
                    min={1}
                    max={item.quantity}
                    size="sm"
                  />
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="space-y-1.5">
          <Label htmlFor="return-reason">Reason</Label>
          <Textarea
            id="return-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Wrong size, defective, not as described…"
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button variant="cta" onClick={submit} disabled={request.isPending || items.length === 0}>
            {request.isPending ? "Submitting…" : "Submit return"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
