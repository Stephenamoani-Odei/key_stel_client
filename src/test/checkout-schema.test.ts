import { describe, expect, it } from "vitest";
import { addressBlock, checkoutSchema, orderInputSchema } from "@/lib/checkout-schema";

const base = { name: "Ama Serwaa", phone: "0241234567", region: "Greater Accra", city: "Accra", address: "12 Test Street" };

describe("checkout", () => {
  it("does not require an email, and does not ask how the customer will pay", () => {
    const c = checkoutSchema.parse(base);
    expect(c.email).toBe("");
    expect("payment" in c).toBe(false);
  });
  it("rejects a malformed email but accepts a blank one", () => {
    expect(checkoutSchema.safeParse({ ...base, email: "nope" }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...base, email: "" }).success).toBe(true);
  });
  it("puts the delivery details in one block for the admin's Orders screen", () => {
    const c = checkoutSchema.parse({ ...base, digital_address: "GA-123-4567", delivery_instructions: "Call on arrival", email: "a@b.co" });
    const text = addressBlock(c);
    for (const part of ["12 Test Street", "Accra, Greater Accra", "GA-123-4567", "Call on arrival", "a@b.co"]) expect(text).toContain(part);
  });
  it("accepts only door ids and quantities from the browser, never prices", () => {
    const id = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
    const ok = orderInputSchema.parse({ ...base, items: [{ product_id: id, qty: 2, price: 1, expected_price: 1 }] });
    expect(ok.items[0]).toEqual({ product_id: id, qty: 2 });
    expect(orderInputSchema.safeParse({ ...base, items: [] }).success).toBe(false);
    expect(orderInputSchema.safeParse({ ...base, items: [{ product_id: "x", qty: 1 }] }).success).toBe(false);
  });
});
