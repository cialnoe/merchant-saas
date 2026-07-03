import { createClient } from "@/lib/supabase/server";
import { OrderTable } from "./order-table";
import type { Order, Product } from "@/types/database.types";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
          Orders
        </h1>
        <p className="text-muted-foreground">
          Track and manage customer orders through their lifecycle.
        </p>
      </div>
      <OrderTable
        initialOrders={(orders ?? []) as Order[]}
        products={(products ?? []) as Product[]}
      />
    </div>
  );
}
