import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Boxes } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default function NotFound() {
  const { t } = getDictionary();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <Boxes className="h-12 w-12 text-muted-foreground" />
      <div>
        <h1 className="text-3xl font-bold">{t.errors.notFoundTitle}</h1>
        <p className="mt-2 text-muted-foreground">{t.errors.notFoundDesc}</p>
      </div>
      <Link href="/">
        <Button>{t.common.backToHome}</Button>
      </Link>
    </div>
  );
}
