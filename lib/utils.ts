import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { localeMeta, type Locale } from "@/lib/i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Tetapkan nilai kurs Anda di sini (misal: 1 USD = 16000 IDR)
const EXCHANGE_RATE = 16000; 

export function formatCurrency(amount: number, locale: Locale = "en"): string {
  const { currency, intlLocale } = localeMeta[locale];
  
  // Jika bahasa Indonesia, kalikan dengan kurs sebelum diformat
  let finalAmount = amount;
  if (locale === "id" && currency === "IDR") {
    finalAmount = amount * EXCHANGE_RATE;
  }

  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
    // Rupiah tidak menggunakan angka di belakang koma (desimal)
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(finalAmount);
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