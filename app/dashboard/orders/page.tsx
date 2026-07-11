import { createClient } from "@/lib/supabase/server";
import { OrderTable } from "./order-table";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Order, Product } from "@/types/database.types";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { locale, t } = getDictionary();

  const [{ data: orders }, { data: products }] = await Promise.all([
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("products")
      .select("*")
      .eq("user_id", user!.id)
      .order("name", { ascending: true }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t.orders.title}
        </h1>
        <p className="text-muted-foreground">{t.orders.subtitle}</p>
      </div>
      <OrderTable
        initialOrders={(orders ?? []) as Order[]}
        products={(products ?? []) as Product[]}
        locale={locale}
        dict={t}
      />
    </div>
  );
}
