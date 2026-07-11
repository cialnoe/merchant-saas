import { createClient } from "@/lib/supabase/server";
import { ProductTable } from "./product-table";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Product } from "@/types/database.types";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { locale, t } = getDictionary();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t.products.title}
        </h1>
        <p className="text-muted-foreground">{t.products.subtitle}</p>
      </div>
      <ProductTable
        initialProducts={(products ?? []) as Product[]}
        locale={locale}
        dict={t}
      />
    </div>
  );
}
