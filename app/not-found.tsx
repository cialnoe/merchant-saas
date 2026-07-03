import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Boxes } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <Boxes className="h-12 w-12 text-muted-foreground" />
      <div>
        <h1 className="text-3xl font-bold">404 — Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
      </div>
      <Link href="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
