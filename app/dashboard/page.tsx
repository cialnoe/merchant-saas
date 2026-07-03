import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { Order } from "@/types/database.types";

export const dynamic = "force-dynamic";

function statusVariant(status: Order["status"]) {
  if (status === "Completed") return "success" as const;
  if (status === "Processing") return "warning" as const;
  return "secondary" as const;
}

export default async function DashboardOverviewPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { count: totalProducts },
    { count: activeOrders },
    { data: completedOrders },
    { data: recentOrders },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user!.id),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user!.id)
      .in("status", ["Pending", "Processing"]),
    supabase
      .from("orders")
      .select("total_amount")
      .eq("user_id", user!.id)
      .eq("status", "Completed"),
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const revenue = (completedOrders ?? []).reduce(
    (sum, o) => sum + Number(o.total_amount),
    0
  );

  const orders = (recentOrders ?? []) as Order[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Overview
        </h1>
        <p className="text-muted-foreground">
          A quick snapshot of your store&apos;s performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProducts ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Items in your catalog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeOrders ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pending or processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(revenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From completed orders
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </div>
          <Link
            href="/dashboard/orders"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No orders yet. They&apos;ll show up here as soon as you create
              one.
            </p>
          ) : (
            <div className="divide-y">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.product_name} × {order.quantity} ·{" "}
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {formatCurrency(Number(order.total_amount))}
                    </span>
                    <Badge variant={statusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
