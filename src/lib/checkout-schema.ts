import { z } from "zod";

export const GHANA_REGIONS = [
  "Greater Accra", "Ashanti", "Central", "Eastern", "Western", "Western North", "Volta", "Oti",
  "Northern", "Savannah", "North East", "Upper East", "Upper West", "Bono", "Bono East", "Ahafo",
] as const;

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(120),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{9,20}$/, "Enter a valid phone number"),
  email: z.string().trim().max(255).refine((v) => v === "" || z.string().email().safeParse(v).success, "Enter a valid email address").optional().default(""),
  region: z.enum(GHANA_REGIONS, { errorMap: () => ({ message: "Choose your region" }) }),
  city: z.string().trim().min(2, "Enter your city or town").max(100),
  address: z.string().trim().min(5, "Enter your delivery address").max(300),
  digital_address: z.string().trim().max(20).regex(/^$|^[A-Za-z]{2}-?\d{3,4}-?\d{3,4}$/, "Use the format GA-123-4567").optional().default(""),
  delivery_instructions: z.string().trim().max(500).optional().default(""),
  order_notes: z.string().trim().max(500).optional().default(""),
});

/** What the browser may send: who, where, and only door ids with quantities. Prices are never sent. */
export const orderInputSchema = checkoutSchema.extend({
  items: z.array(z.object({
    product_id: z.string().uuid(),
    qty: z.number().int().min(1).max(999),
  })).min(1).max(50),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type OrderInput = z.infer<typeof orderInputSchema>;

/** The delivery details as one block of text. The admin's Orders screen shows it as the address. */
export function addressBlock(c: CheckoutInput) {
  return [
    c.address,
    `${c.city}, ${c.region}`,
    c.digital_address && `Digital address: ${c.digital_address}`,
    c.delivery_instructions && `Delivery instructions: ${c.delivery_instructions}`,
    c.order_notes && `Order notes: ${c.order_notes}`,
    c.email && `Email: ${c.email}`,
  ].filter(Boolean).join("\n");
}
