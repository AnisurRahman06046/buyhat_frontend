"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
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
import { isApiError } from "@/services/http-error";

import { useCancelOrder } from "../hooks/use-orders";

export function CancelOrderDialog({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const cancel = useCancelOrder(orderId);
  const error = cancel.isError && isApiError(cancel.error) ? cancel.error.message : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Cancel order</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel this order?</DialogTitle>
          <DialogDescription>
            This can&apos;t be undone. Let us know why (optional).
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div
            role="alert"
            className="border-destructive/20 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm"
          >
            {error}
          </div>
        ) : null}

        <div className="space-y-1.5">
          <Label htmlFor="cancel-reason">Reason</Label>
          <Textarea
            id="cancel-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Changed my mind, ordered by mistake…"
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Keep order</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => cancel.mutate(reason || undefined, { onSuccess: () => setOpen(false) })}
            disabled={cancel.isPending}
          >
            {cancel.isPending ? "Cancelling…" : "Cancel order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
