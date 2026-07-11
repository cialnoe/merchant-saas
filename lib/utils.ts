import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { localeMeta, type Locale } from "@/lib/i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Anda bisa mengganti angka 16000 ini sesuai kurs yang Anda inginkan,
// atau menggunakan Environment Variable agar mudah diubah tanpa mengubah kode.
const EXCHANGE_RATE_USD_TO_IDR = Number(process.env.NEXT_PUBLIC_USD_TO_IDR_RATE) || 16000;

/**
 * Formats a number as currency using the currency tied to the active
 * language (English -> USD, Indonesian -> IDR/Rupiah). 
 * Jika locale adalah bahasa Indonesia, nilai dasar (USD) otomatis dikalikan 
 * dengan kurs saat ini sebelum diformat.
 */
export function formatCurrency(amount: number, locale: Locale = "en"): string {
  const { currency, intlLocale } = localeMeta[locale];

  // Hitung jumlah akhir berdasarkan bahasa.
  // Asumsi: Semua harga di database disimpan dalam USD.
  let finalAmount = amount;
  if (locale === "id" && currency === "IDR") {
    finalAmount = amount * EXCHANGE_RATE_USD_TO_IDR;
  }

  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
    // Rupiah is conventionally shown without decimal places.
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