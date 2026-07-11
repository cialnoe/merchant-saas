"use client";

import { useEffect, useState } from "react";
import { LOCALE_COOKIE, defaultLocale, isLocale, type Locale } from "./config";
import { dictionaries } from "./dictionaries";

function readCookieLocale(): Locale {
  if (typeof document === "undefined") return defaultLocale;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : undefined;
  return isLocale(value) ? value : defaultLocale;
}

/** Reads the locale cookie client-side. Used by error.tsx boundaries, which
 * Next.js requires to be Client Components and therefore can't read
 * next/headers cookies() directly. */
export function useClientDictionary() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    setLocale(readCookieLocale());
  }, []);

  return { locale, t: dictionaries[locale] };
}
