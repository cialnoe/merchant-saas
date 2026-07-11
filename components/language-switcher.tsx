"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Languages, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { setLocale } from "@/actions/locale";
import { locales, localeMeta, type Locale } from "@/lib/i18n/config";

export function LanguageSwitcher({
  locale,
  variant = "ghost",
}: {
  locale: Locale;
  variant?: "ghost" | "outline";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSelect(next: Locale) {
    if (next === locale) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="sm" className="gap-2" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Languages className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{localeMeta[locale].flag} {localeMeta[locale].label}</span>
          <span className="sm:hidden">{localeMeta[locale].flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => handleSelect(l)}
            className="gap-2"
          >
            <span>{localeMeta[l].flag}</span>
            <span>{localeMeta[l].label}</span>
            {l === locale && <span className="ml-auto text-xs text-muted-foreground">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
