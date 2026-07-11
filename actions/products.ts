"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const productSchema = z.object({
  name: z.string().min(1, "Name is required.").max(200),
  sku: z.string().min(1, "SKU is required.").max(100),
  price: z.coerce.number().min(0, "Price must be zero or greater."),
  stock: z.coerce.number().int().min(0, "Stock must be zero or greater."),
});

export interface ProductFormState {
  error: string | null;
  success: boolean;
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    sku: formData.get("sku"),
    price: formData.get("price"),
    stock: formData.get("stock"),
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

  const { error } = await supabase.from("products").insert({
    user_id: user.id,
    name: parsed.data.name,
    sku: parsed.data.sku,
    price: parsed.data.price,
    stock: parsed.data.stock,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "A product with this SKU already exists.", success: false };
    }
    return { error: error.message, success: false };
  }

  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard");
  return { error: null, success: true };
}

export async function updateProduct(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    sku: formData.get("sku"),
    price: formData.get("price"),
    stock: formData.get("stock"),
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

  const { error } = await supabase
    .from("products")
    .update({
      name: parsed.data.name,
      sku: parsed.data.sku,
      price: parsed.data.price,
      stock: parsed.data.stock,
    })
    .eq("id", productId)
    .eq("user_id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "A product with this SKU already exists.", success: false };
    }
    return { error: error.message, success: false };
  }

  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard");
  return { error: null, success: true };
}

export async function deleteProduct(productId: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard");
  return { error: null };
}
