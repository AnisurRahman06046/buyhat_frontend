"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "@/features/auth/hooks/use-session";
import type { Popup } from "@/types/cms";

import { useActivePopups } from "../hooks/use-cms";

const storageKey = (id: string) => `buyhat:popup:${id}`;

function alreadyShown(popup: Popup): boolean {
  if (typeof window === "undefined") return true;
  if (popup.frequency === "ALWAYS") return false;
  if (popup.frequency === "EVERY_SESSION") {
    return sessionStorage.getItem(storageKey(popup.id)) === "1";
  }
  return localStorage.getItem(storageKey(popup.id)) === "1"; // ONCE (default)
}

function markShown(popup: Popup): void {
  if (typeof window === "undefined" || popup.frequency === "ALWAYS") return;
  const store = popup.frequency === "EVERY_SESSION" ? sessionStorage : localStorage;
  store.setItem(storageKey(popup.id), "1");
}

function audienceOk(popup: Popup, isAuthenticated: boolean): boolean {
  if (popup.audience === "GUESTS") return !isAuthenticated;
  if (popup.audience === "USERS") return isAuthenticated;
  return true; // EVERYONE
}

/** Active-popup rules engine: audience + frequency + trigger. Mounted once. */
export function PromotionPopup() {
  const { data: popups } = useActivePopups();
  const { isAuthenticated, isLoading } = useSession();
  const [active, setActive] = useState<Popup | null>(null);

  useEffect(() => {
    if (isLoading || !popups?.length) return;
    const popup = popups.find((p) => audienceOk(p, isAuthenticated) && !alreadyShown(p));
    if (!popup) return;

    if (popup.trigger === "EXIT_INTENT") {
      const onLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          setActive(popup);
          document.removeEventListener("mouseleave", onLeave);
        }
      };
      document.addEventListener("mouseleave", onLeave);
      return () => document.removeEventListener("mouseleave", onLeave);
    }

    const delayMs = popup.trigger === "AFTER_DELAY" ? (popup.delaySeconds ?? 5) * 1000 : 400;
    const timer = setTimeout(() => setActive(popup), delayMs);
    return () => clearTimeout(timer);
  }, [popups, isAuthenticated, isLoading]);

  if (!active) return null;

  const close = () => {
    markShown(active);
    setActive(null);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-md">
        {active.imageUrl ? (
          <div className="relative aspect-video w-full">
            <ImageWithFallback
              src={active.imageUrl}
              alt={active.title}
              wrapperClassName="size-full"
              sizes="448px"
            />
          </div>
        ) : null}
        <div className="space-y-4 p-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-headline-md text-center">{active.title}</DialogTitle>
            {active.content ? (
              <DialogDescription className="text-center">{active.content}</DialogDescription>
            ) : null}
          </DialogHeader>
          {active.ctaText && active.ctaUrl ? (
            <Button variant="cta" className="w-full" asChild onClick={close}>
              <Link href={active.ctaUrl}>{active.ctaText}</Link>
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
