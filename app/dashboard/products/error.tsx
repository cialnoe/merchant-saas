"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <AlertTriangle className="h-10 w-10 text-destructive" />
      <div>
        <h2 className="text-xl font-semibold">Couldn&apos;t load products</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Something went wrong while fetching your product catalog.
        </p>
      </div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
