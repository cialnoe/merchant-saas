export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * Each language is tied to a currency + Intl locale for number/date formatting.
 * Switching the UI language automatically switches the currency shown across
 * the app (English -> US Dollar, Indonesian -> Indonesian Rupiah).
 */
export const localeMeta: Record<
  Locale,
  { label: string; flag: string; currency: string; intlLocale: string }
> = {
  en: { label: "English", flag: "🇺🇸", currency: "USD", intlLocale: "en-US" },
  id: { label: "Bahasa Indonesia", flag: "🇮🇩", currency: "IDR", intlLocale: "id-ID" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
