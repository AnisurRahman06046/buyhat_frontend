/**
 * Display formatters. The store is a Bangladesh single-seller — currency is BDT
 * (৳) and numbers use the `en-BD` locale. All money in the app is handled in
 * major units (Taka) as `number`; format only at the view boundary.
 */

const LOCALE = "en-BD";
const CURRENCY = "BDT";

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactNumberFormatter = new Intl.NumberFormat(LOCALE, {
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat(LOCALE);

/** `21795` → `৳21,795.00`. Falls back to `৳0.00` for nullish input. */
export function formatMoney(amount: number | string | null | undefined): string {
  const value = typeof amount === "string" ? Number(amount) : (amount ?? 0);
  if (!Number.isFinite(value)) return currencyFormatter.format(0);
  return currencyFormatter.format(value);
}

/** `1248` → `1,248`. */
export function formatNumber(value: number | null | undefined): string {
  return numberFormatter.format(value ?? 0);
}

/** `1200000` → `1.2M`. Useful for KPI cards. */
export function formatCompactNumber(value: number | null | undefined): string {
  return compactNumberFormatter.format(value ?? 0);
}

/** `0.125` → `12.5%` (pass a ratio) or use `isPercent` for an already-scaled value. */
export function formatPercent(
  value: number | null | undefined,
  { isRatio = true, fractionDigits = 1 }: { isRatio?: boolean; fractionDigits?: number } = {},
): string {
  const scaled = isRatio ? (value ?? 0) : (value ?? 0) / 100;
  return new Intl.NumberFormat(LOCALE, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(scaled);
}

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function toDate(input: Date | string | number): Date | null {
  const d = input instanceof Date ? input : new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** `2026-06-27` → `27 Jun 2026`. */
export function formatDate(input: Date | string | number | null | undefined): string {
  if (input == null) return "—";
  const d = toDate(input);
  return d ? dateFormatter.format(d) : "—";
}

/** `… → 27 Jun 2026, 02:30 PM`. */
export function formatDateTime(input: Date | string | number | null | undefined): string {
  if (input == null) return "—";
  const d = toDate(input);
  return d ? dateTimeFormatter.format(d) : "—";
}

const relativeFormatter = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto" });

const RELATIVE_DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "seconds" },
  { amount: 60, unit: "minutes" },
  { amount: 24, unit: "hours" },
  { amount: 7, unit: "days" },
  { amount: 4.34524, unit: "weeks" },
  { amount: 12, unit: "months" },
  { amount: Number.POSITIVE_INFINITY, unit: "years" },
];

/** `2h ago`, `in 3 days`, `just now`. */
export function formatRelativeTime(input: Date | string | number | null | undefined): string {
  if (input == null) return "—";
  const d = toDate(input);
  if (!d) return "—";
  let duration = (d.getTime() - Date.now()) / 1000;
  for (const division of RELATIVE_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return relativeFormatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return "—";
}

/** Discount percentage from list/sale prices: `(560, 450)` → `20`. */
export function discountPercent(listPrice: number, salePrice: number): number {
  if (!Number.isFinite(listPrice) || listPrice <= 0 || salePrice >= listPrice) return 0;
  return Math.round(((listPrice - salePrice) / listPrice) * 100);
}
