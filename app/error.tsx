"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
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
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <div>
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-muted-foreground">
              An unexpected error occurred. You can try again or head back
              home.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => reset()}>Try again</Button>
            <Link href="/">
              <Button variant="outline">Go home</Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
