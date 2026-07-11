"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus, Product } from "@/types/database.types";

const orderSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required.").max(200),
  product_id: z.string().uuid("Select a product."),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
});

export interface OrderFormState {
  error: string | null;
  success: boolean;
}

export async function createOrder(
  _prevState: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  const parsed = orderSchema.safeParse({
    customer_name: formData.get("customer_name"),
    product_id: formData.get("product_id"),
    quantity: formData.get("quantity"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input.", success: false };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in.", success: false };
  }

  // BYPASS: Memisahkan instance ke 'any' khusus untuk operasi tabel
  // Ini menghindari bug konflik tipe 'never' akibat SSR version mismatch
  const db = supabase as any;

  const { data: product, error: productError } = await db
    .from("products")
    .select("id, name, price, stock")
    .eq("id", parsed.data.product_id)
    .eq("user_id", user.id)
    .single();

  if (productError || !product) {
    return { error: "Selected product could not be found.", success: false };
  }

  // EXPLICIT TYPING: Mengembalikan struktur data ke tipe yang valid secara presisi
  const currentProduct = product as Product;

  if (currentProduct.stock < parsed.data.quantity) {
    return {
      error: `Not enough stock. Only ${currentProduct.stock} unit(s) available.`,
      success: false,
    };
  }

  const totalAmount = Number(currentProduct.price) * parsed.data.quantity;

  const { error: insertError } = await db.from("orders").insert({
    user_id: user.id,
    customer_name: parsed.data.customer_name,
    product_id: currentProduct.id,
    product_name: currentProduct.name,
    quantity: parsed.data.quantity,
    total_amount: totalAmount,
    status: "Pending",
  });

  if (insertError) {
    return { error: insertError.message, success: false };
  }

  const { error: stockError } = await db
    .from("products")
    .update({ stock: currentProduct.stock - parsed.data.quantity })
    .eq("id", currentProduct.id)
    .eq("user_id", user.id);

  if (stockError) {
    return { error: stockError.message, success: false };
  }

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard");
  return { error: null, success: true };
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const db = supabase as any;

  const { error } = await db
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteOrder(orderId: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const db = supabase as any;

  const { error } = await db
    .from("orders")
    .delete()
    .eq("id", orderId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");
  return { error: null };
}