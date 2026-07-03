export type OrderStatus = "Pending" | "Processing" | "Completed";

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          sku: string;
          price: number;
          stock: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          sku: string;
          price: number;
          stock: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          sku?: string;
          price?: number;
          stock?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          customer_name: string;
          product_id: string | null;
          product_name: string;
          quantity: number;
          total_amount: number;
          status: OrderStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          customer_name: string;
          product_id?: string | null;
          product_name: string;
          quantity: number;
          total_amount: number;
          status?: OrderStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          customer_name?: string;
          product_id?: string | null;
          product_name?: string;
          quantity?: number;
          total_amount?: number;
          status?: OrderStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
  };
}

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];
