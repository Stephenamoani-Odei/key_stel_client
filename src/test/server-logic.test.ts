import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { placeOrderWith } from "@/lib/orders.functions";
import { inquirySchema, sendInquiryWith } from "@/lib/inquiries.functions";
import { orderInputSchema } from "@/lib/checkout-schema";
import { cleanSupabaseUrl } from "@/lib/supabase-public.server";

const ID = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
const order = orderInputSchema.parse({
  name: "Ama Serwaa", phone: "0241234567", email: "a@b.co", region: "Greater Accra", city: "Accra", address: "12 Test Street",
  items: [{ product_id: ID, qty: 2, price: 1 }],
});
const fakeDb = (rpc: unknown, insert: unknown = { error: null }) => {
  const calls = { rpc: vi.fn(), insert: vi.fn() };
  const db = {
    rpc: (name: string, args: unknown) => { calls.rpc(name, args); return Promise.resolve(rpc); },
    from: (table: string) => ({ insert: (row: unknown) => { calls.insert(table, row); return Promise.resolve(insert); } }),
  } as unknown as SupabaseClient<Database>;
  return { db, calls };
};
vi.spyOn(console, "error").mockImplementation(() => {});

describe("placing an order", () => {
  it("calls the database function with ids and quantities only, and returns the order number", async () => {
    const { db, calls } = fakeDb({ data: 1010, error: null });
    expect(await placeOrderWith(db, order)).toEqual({ ok: true, id: 1010 });
    const [name, args] = calls.rpc.mock.calls[0]!;
    expect(name).toBe("place_order");
    expect(args).toMatchObject({ p_name: "Ama Serwaa", p_phone: "0241234567", p_payment: "Pay on Delivery", p_items: [{ product_id: ID, qty: 2 }] });
    expect(args.p_address).toContain("12 Test Street");
    expect(JSON.stringify(args)).not.toMatch(/price|total/i);
  });
  it("shows the shop's own stock message to the customer", async () => {
    const { db } = fakeDb({ data: null, error: { message: "Sorry, Steel Door is no longer available in that quantity." } });
    expect(await placeOrderWith(db, order)).toEqual({ ok: false, error: "Sorry, Steel Door is no longer available in that quantity." });
  });
  it("hides technical database errors behind a plain message", async () => {
    const { db } = fakeDb({ data: null, error: { message: 'permission denied for table orders' } });
    const r = await placeOrderWith(db, order);
    expect(r.ok).toBe(false);
    expect(JSON.stringify(r)).not.toContain("permission");
  });
});

describe("contact and quote messages", () => {
  const ok = { name: "Kojo", phone: "0551112222", message: "Hello" };
  it("saves name, phone and message for the admin's Messages screen", async () => {
    const { db, calls } = fakeDb(null);
    expect(await sendInquiryWith(db, inquirySchema.parse(ok))).toEqual({ ok: true });
    expect(calls.insert).toHaveBeenCalledWith("inquiries", ok);
  });
  it("quietly stores nothing when the hidden bot field is filled", async () => {
    const { db, calls } = fakeDb(null);
    expect(await sendInquiryWith(db, inquirySchema.parse({ ...ok, website: "http://spam" }))).toEqual({ ok: true });
    expect(calls.insert).not.toHaveBeenCalled();
  });
  it("reports a failed save instead of pretending it worked", async () => {
    const { db } = fakeDb(null, { error: { message: "boom" } });
    expect((await sendInquiryWith(db, inquirySchema.parse(ok))).ok).toBe(false);
  });
  it("matches the database limits", () => {
    expect(inquirySchema.safeParse({ ...ok, message: "x".repeat(2001) }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...ok, name: "x".repeat(101) }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...ok, phone: "abc" }).success).toBe(false);
  });
});

describe("Supabase URL", () => {
  it("accepts the URL pasted with /rest/v1 or a trailing slash", () => {
    for (const u of ["https://x.supabase.co", "https://x.supabase.co/", "https://x.supabase.co/rest/v1/", " https://x.supabase.co/rest/v1 "])
      expect(cleanSupabaseUrl(u)).toBe("https://x.supabase.co");
  });
});
