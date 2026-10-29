import { createServerFn } from "@tanstack/react-start";
import { buildStorefront } from "./storefront-data";

/**
 * Everything the storefront displays, as managed in the admin dashboard: categories, the doors the
 * owner left on "Shown", and the store settings (phone, WhatsApp, address, social links). A door
 * shop's catalogue is small, so it loads in one round trip and the client filters it locally.
 */
export const fetchStorefront = createServerFn({ method: "GET" }).handler(async () => {
  const hasEnv = (process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"]) &&
    (process.env["SUPABASE_KEY"] || process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"]);
  if (!hasEnv) {
    console.warn("[storefront] SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY (or the VITE_ versions) are not set, so the shop is empty. Add them to the .env file next to package.json and restart the dev server.");
    return buildStorefront({ categories: [], products: [], settings: null });
  }

  const { publicClient } = await import("./supabase-public.server");
  const db = publicClient();
  const [categories, products, settings] = await Promise.all([
    db.from("categories").select("*").order("name", { ascending: true }),
    db.from("products").select("*").eq("available", true).order("created_at", { ascending: false }),
    db.from("settings").select("*").eq("id", 1).maybeSingle(),
  ]);
  const error = categories.error ?? products.error ?? settings.error;
  if (error) {
    console.error("[storefront] load failed:", error);
    throw new Error("Could not load the catalogue right now. Please try again.");
  }
  if (!(categories.data?.length || products.data?.length)) {
    console.warn("[storefront] Connected, but the database returned 0 categories and 0 products. Check that the admin has products set to Shown, and that the public read policies (RLS) allow the anon role to read categories, products and settings.");
  }
  return buildStorefront({ categories: categories.data ?? [], products: products.data ?? [], settings: settings.data });
});