import { describe, expect, it } from "vitest";
import { orderWhatsAppUrl } from "@/lib/whatsapp-checkout";

const items = [{ name: "Heavy Duty Steel Door", qty: 2, price: 6900 }];
const NUMBER = "233541954924"; // from the admin's Settings

describe("order WhatsApp message", () => {
  it("opens the WhatsApp number from Settings and mentions the saved order number", () => {
    const url = new URL(orderWhatsAppUrl(1009, "Ama", items, NUMBER)!);
    expect(url.pathname).toBe("/233541954924");
    expect(url.searchParams.get("text")).toContain("order #1009");
  });
  it("lists doors, quantities and the total", () => {
    const text = new URL(orderWhatsAppUrl(1009, "Ama", items, NUMBER)!).searchParams.get("text") ?? "";
    expect(text).toContain("Heavy Duty Steel Door x 2");
    expect(text).toContain("13,800");
  });
  it("returns nothing, rather than a broken link, when Settings has no WhatsApp number", () => {
    expect(orderWhatsAppUrl(1009, "Ama", items, null)).toBeNull();
    expect(orderWhatsAppUrl(1009, "Ama", items, "")).toBeNull();
  });
});
