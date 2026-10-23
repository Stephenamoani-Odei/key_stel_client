import { describe, expect, it } from "vitest";
import type { Tables } from "@/integrations/supabase/types";
import { getCategory, getProduct, filterProducts } from "@/lib/catalog";
import { applySettings, SITE, telLink } from "@/lib/site";
import { buildStorefront, slugify, toSettings } from "@/lib/storefront-data";

const cat = (over: Partial<Tables<"categories">> = {}): Tables<"categories"> => ({ id: "c1", name: "Heavy Duty Steel", group_name: "Security & Entrance Doors", ...over });
const prod = (over: Partial<Tables<"products">> = {}): Tables<"products"> => ({
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6", category_id: "c1", name: "Steel Door", description: " Strong. ", price: 1800, sizes: ["3x7 ft"],
  images: ["https://cdn.example.com/a.jpg", "javascript:alert(1)"], stock: 4, low_stock_threshold: 5, available: true, created_at: "2026-10-01T00:00:00Z", ...over,
});
const settings = (over: Partial<Tables<"settings">> = {}): Tables<"settings"> => ({
  id: 1, store_name: "Key-Stel", phone: "0541954924", whatsapp: "0541954924", address: "Kwabenya", map_url: null, delivery_note: null, receipt_footer: null, ...over,
});

describe("admin database to storefront", () => {
  it("turns an admin door into what the shop renders, dropping unsafe image links", () => {
    const sf = buildStorefront({ categories: [cat()], products: [prod()], settings: settings() });
    expect(sf.products[0]).toMatchObject({ name: "Steel Door", price: 1800, stock: 4, category: "heavy-duty-steel", description: "Strong.", sizes: ["3x7 ft"] });
    expect(sf.products[0]!.images).toEqual(["https://cdn.example.com/a.jpg"]);
  });
  it("never shows a door the owner switched to Hidden", () => {
    const sf = buildStorefront({ categories: [cat()], products: [prod(), prod({ id: "b1b1b1b1-0000-0000-0000-000000000000", name: "Hidden", available: false })], settings: null });
    expect(sf.products.map((p) => p.name)).toEqual(["Steel Door"]);
  });
  it("makes a category from the name and a door slug that survives renames", () => {
    const sf = buildStorefront({ categories: [cat()], products: [prod()], settings: null });
    expect(sf.categories[0]).toMatchObject({ slug: "heavy-duty-steel", group: "Security & Entrance Doors" });
    const renamed = { ...sf.products[0]!, name: "Renamed", slug: "renamed-3fa85f64" };
    expect(getProduct([renamed], sf.products[0]!.slug)?.name).toBe("Renamed");
    expect(getProduct(sf.products, "unknown-slug")).toBeUndefined();
    expect(getCategory(sf.categories, "heavy-duty-steel")?.name).toBe("Heavy Duty Steel");
  });
  it("keeps doors without a category and borrows a photo for the category tile", () => {
    const sf = buildStorefront({ categories: [cat()], products: [prod(), prod({ id: "d2d2d2d2-0000-0000-0000-000000000000", category_id: null, name: "Loose" })], settings: null });
    expect(sf.products.find((p) => p.name === "Loose")?.category).toBe("");
    expect(sf.categories[0]!.image).toBe("https://cdn.example.com/a.jpg");
  });
  it("uses stock to decide what can be bought and sorts in-stock doors first", () => {
    const sf = buildStorefront({ categories: [], products: [prod({ name: "A", stock: 0 }), prod({ id: "e3e3e3e3-0000-0000-0000-000000000000", name: "B", stock: 2 })], settings: null });
    expect(filterProducts(sf.products, {}).map((p) => p.name)).toEqual(["B", "A"]);
    expect(filterProducts(sf.products, { inStock: true }).map((p) => p.name)).toEqual(["B"]);
  });
  it("slugifies names", () => expect(slugify("  Door-in-Door (Steel) ")).toBe("door-in-door-steel"));
});

describe("store settings", () => {
  it("builds social links only from what the owner entered", () => {
    const sf = buildStorefront({ categories: [], products: [], settings: settings({ facebook: "https://facebook.com/keystel", instagram: "", tiktok: null }) });
    expect(sf.social.map((s) => s.key).sort()).toEqual(["facebook", "whatsapp"]);
    expect(sf.social.find((s) => s.key === "whatsapp")?.href).toBe("https://wa.me/233541954924");
  });
  it("hides contact details that are empty instead of inventing them", () => {
    applySettings(toSettings(settings({ phone: "", whatsapp: null })));
    expect(SITE.phone).toBe("");
    expect(SITE.whatsapp).toBe("");
    applySettings(toSettings(settings()));
    expect(SITE.phone).toBe("0541954924");
    expect(SITE.whatsapp).toBe("233541954924");
  });
  it("builds a phone link from a Ghana number", () => {
    expect(telLink("0541954924")).toBe("tel:+233541954924");
    expect(telLink("233541954924")).toBe("tel:+233541954924");
  });
  it("has no data and no crash when the database has nothing yet", () => {
    const sf = buildStorefront({ categories: [], products: [], settings: null });
    expect(sf).toMatchObject({ categories: [], products: [], social: [] });
  });
});
