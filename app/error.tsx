"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useClientDictionary } from "@/lib/i18n/use-client-locale";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale, t } = useClientDictionary();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={locale}>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <div>
            <h1 className="text-2xl font-semibold">{t.errors.globalTitle}</h1>
            <p className="mt-2 text-muted-foreground">{t.errors.globalDesc}</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => reset()}>{t.common.tryAgain}</Button>
            <Link href="/">
              <Button variant="outline">{t.common.goHome}</Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
