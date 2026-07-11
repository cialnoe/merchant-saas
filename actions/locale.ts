"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LOCALE_COOKIE, isLocale, type Locale } from "@/lib/i18n/config";

export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) return;

  cookies().set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  // Re-render every currently rendered route with the new language + currency.
  revalidatePath("/", "layout");
}
