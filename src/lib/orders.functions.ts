import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { addressBlock, orderInputSchema, type OrderInput } from "./checkout-schema";

type Db = SupabaseClient<Database>;

/** Current price and stock for the given doors, read from the admin database (public data). */
export const getLiveProducts = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ ids: z.array(z.string().uuid()).max(50) }).parse(d))
  .handler(async ({ data }) => {
    if (data.ids.length === 0) return [];
    const { publicClient } = await import("./supabase-public.server");
    const { data: rows, error } = await publicClient().from("products").select("id, price, stock, available").in("id", data.ids);
    if (error) { console.error(error); throw new Error("Could not check prices right now. Please try again."); }
    return rows.map((r) => ({ id: r.id, price: Number(r.price), stock: r.stock, available: r.available }));
  });

export type PlaceResult = { ok: true; id: number } | { ok: false; error: string };

/**
 * Saves the order in the admin dashboard through the database's place_order function. The server
 * looks up the real prices, checks stock, works out the total, lowers stock and returns the order
 * number. The order appears in the admin's Orders screen as Pending and Unpaid; staff then call the
 * customer to confirm it and arrange payment. No payment is taken on the website.
 */
export async function placeOrderWith(db: Db, data: OrderInput): Promise<PlaceResult> {
  const { data: id, error } = await db.rpc("place_order", {
    p_name: data.name,
    p_phone: data.phone,
    p_address: addressBlock(data),
    p_payment: "Pay on Delivery", // placeholder; staff record the real method when payment is received
    p_items: data.items.map((i) => ({ product_id: i.product_id, qty: i.qty })),
  });
  if (error) {
    console.error("[order] place_order failed:", error.message);
    // place_order writes customer-readable messages for stock problems; anything else stays generic.
    const readable = /^(Sorry,|Your cart)/.test(error.message);
    return { ok: false, error: readable ? error.message : "We could not place your order right now. Please call us and we will take it by phone." };
  }
  return { ok: true, id: Number(id) };
}

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => orderInputSchema.parse(d))
  .handler(async ({ data }): Promise<PlaceResult> => {
    const { publicClient } = await import("./supabase-public.server");
    return placeOrderWith(publicClient(), data);
  });
