import { cookies } from "next/headers";
import { LOCALE_COOKIE, defaultLocale, isLocale, type Locale } from "./config";
import { dictionaries } from "./dictionaries";

export function getLocale(): Locale {
  const cookieLocale = cookies().get(LOCALE_COOKIE)?.value;
  return isLocale(cookieLocale) ? cookieLocale : defaultLocale;
}

export function getDictionary(locale?: Locale) {
  const activeLocale = locale ?? getLocale();
  return { locale: activeLocale, t: dictionaries[activeLocale] };
}
