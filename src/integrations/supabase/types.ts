// Types for the tables and function the website uses from the admin dashboard's database.
// The admin owns this schema (see docs/dashboard-integration.md); ask DataLens before assuming new columns.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: { id: string; name: string; group_name: string | null };
        Insert: { id?: string; name: string; group_name?: string | null };
        Update: { id?: string; name?: string; group_name?: string | null };
        Relationships: [];
      };
      products: {
        Row: {
          id: string; category_id: string | null; name: string; description: string | null; price: number;
          sizes: string[] | null; images: string[] | null; stock: number; low_stock_threshold: number;
          available: boolean; created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]> & { name: string; price: number };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [];
      };
      settings: {
        Row: {
          id: number; store_name: string | null; phone: string | null; whatsapp: string | null; address: string | null;
          map_url: string | null; delivery_note: string | null; receipt_footer: string | null;
          email?: string | null; facebook?: string | null; instagram?: string | null; tiktok?: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["settings"]["Row"]>;
        Relationships: [];
      };
      inquiries: {
        Row: { id: string; name: string; phone: string; message: string; created_at: string; is_read: boolean };
        Insert: { name: string; phone: string; message: string };
        Update: never;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      place_order: {
        Args: { p_name: string; p_phone: string; p_address: string; p_payment: string; p_items: Json };
        Returns: number;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
