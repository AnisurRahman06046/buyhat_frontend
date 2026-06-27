"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Newsletter subscribe form (client island). Validation/submission is wired to
 * the promotions/notifications API in a later phase; for now it confirms intent.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("You're subscribed!", { description: "Thanks for joining the BuyHat circle." });
    setEmail("");
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <Input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="bg-card"
      />
      <Button type="submit" aria-label="Subscribe">
        <Send />
      </Button>
    </form>
  );
}
