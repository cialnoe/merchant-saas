import { createClient } from "@/lib/supabase/server";
import { ProductTable } from "./product-table";
import type { Product } from "@/types/database.types";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Products
        </h1>
        <p className="text-muted-foreground">
          Manage your product catalog, pricing, and stock levels.
        </p>
      </div>
      <ProductTable initialProducts={(products ?? []) as Product[]} />
    </div>
  );
}
