import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { localeMeta, type Locale } from "@/lib/i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency using the currency tied to the active
 * language (English -> USD, Indonesian -> IDR/Rupiah). Defaults to English
 * so existing calls without a locale argument keep working.
 */
export function formatCurrency(amount: number, locale: Locale = "en"): string {
  const { currency, intlLocale } = localeMeta[locale];
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
    // Rupiah is conventionally shown without decimal places.
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(amount);
}

export function formatDate(dateString: string, locale: Locale = "en"): string {
  const { intlLocale } = localeMeta[locale];
  return new Intl.DateTimeFormat(intlLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}
