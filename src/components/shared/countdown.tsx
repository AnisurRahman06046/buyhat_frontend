"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/cn";

interface TimeParts {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getParts(target: number): TimeParts {
  const total = Math.max(0, target - Date.now());
  return {
    total,
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1_000),
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

/**
 * Flash-sale countdown. Ticks every second, clears its interval on unmount/zero,
 * and fires `onComplete` once. Renders a stable placeholder until mounted to
 * avoid hydration mismatch (time differs server vs client).
 */
export function Countdown({
  to,
  onComplete,
  showDays = false,
  variant = "inline",
  className,
}: {
  to: string | number | Date;
  onComplete?: () => void;
  showDays?: boolean;
  variant?: "inline" | "boxed";
  className?: string;
}) {
  const target = useMemo(() => new Date(to).getTime(), [to]);
  const [parts, setParts] = useState<TimeParts>(() => getParts(target));
  const mounted = useMounted();

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const tick = () => {
      const next = getParts(target);
      setParts(next);
      if (next.total <= 0) {
        window.clearInterval(id);
        onCompleteRef.current?.();
      }
    };
    const id = window.setInterval(tick, 1000);
    tick();
    return () => window.clearInterval(id);
  }, [target]);

  const units = [
    ...(showDays || parts.days > 0 ? [{ value: parts.days, label: "Days" }] : []),
    { value: parts.hours, label: "Hours" },
    { value: parts.minutes, label: "Mins" },
    { value: parts.seconds, label: "Secs" },
  ];

  if (variant === "boxed") {
    return (
      <div className={cn("flex items-stretch gap-2", className)} aria-hidden={!mounted}>
        {units.map((u, i) => (
          <div key={u.label} className="flex items-center gap-2">
            <div className="bg-card shadow-card flex min-w-12 flex-col items-center rounded-md px-2 py-1.5">
              <span className="font-heading text-xl font-bold tabular-nums">
                {mounted ? pad(u.value) : "--"}
              </span>
              <span className="text-label-caps text-muted-foreground">{u.label}</span>
            </div>
            {i < units.length - 1 ? (
              <span className="font-heading text-muted-foreground text-lg">:</span>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 font-mono font-semibold tabular-nums",
        className,
      )}
      role="timer"
      aria-label="Time remaining"
    >
      {units.map((u, i) => (
        <span key={u.label} className="inline-flex items-center gap-1">
          <span className="bg-foreground/90 text-background rounded px-1.5 py-0.5 text-xs">
            {mounted ? pad(u.value) : "--"}
          </span>
          {i < units.length - 1 ? <span className="text-muted-foreground">:</span> : null}
        </span>
      ))}
    </div>
  );
}
