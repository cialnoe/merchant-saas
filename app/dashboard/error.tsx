"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useClientDictionary } from "@/lib/i18n/use-client-locale";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useClientDictionary();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <AlertTriangle className="h-10 w-10 text-destructive" />
      <div>
        <h2 className="text-xl font-semibold">{t.errors.dashboardTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t.errors.dashboardDesc}</p>
      </div>
      <Button onClick={() => reset()}>{t.common.tryAgain}</Button>
    </div>
  );
}
