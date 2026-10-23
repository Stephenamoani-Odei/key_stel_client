// Maps rows from the admin dashboard's database into the shapes the storefront renders.
// Pure functions (no I/O) so they can be unit-tested and shared by the server function.
import type { Tables } from "@/integrations/supabase/types";
import type { Category, Product } from "./catalog";
import { safeUrl, socialRowsFromSettings, toSocialLink, type SocialLink } from "./social";

export interface StoreSettings {
  name: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  mapUrl: string | null;
  email: string | null;
  deliveryNote: string | null;
}

export interface Storefront {
  categories: Category[];
  products: Product[];
  social: SocialLink[];
  settings: StoreSettings;
}

const text = (v: string | null | undefined) => v?.trim() || null;

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item";

export const productSlug = (row: Pick<Tables<"products">, "id" | "name">) =>
  `${slugify(row.name)}-${row.id.replace(/-/g, "").slice(0, 8)}`;

export function toProduct(row: Tables<"products">, categorySlug: string): Product {
  return {
    id: row.id,
    slug: productSlug(row),
    name: row.name,
    category: categorySlug,
    price: Number(row.price),
    stock: Math.max(0, Number(row.stock) || 0),
    createdAt: row.created_at,
    images: (row.images ?? []).map((u) => safeUrl(u)).filter((u): u is string => u !== null),
    description: row.description?.trim() ?? "",
    sizes: (row.sizes ?? []).map((s) => s.trim()).filter(Boolean),
  };
}

export function toCategory(row: Tables<"categories">): Category {
  const group = text(row.group_name);
  return {
    slug: slugify(row.name),
    name: row.name,
    short: row.name,
    description: group ? `Part of our ${group} range.` : `Browse our ${row.name} doors.`,
    group,
    image: null,
    heroImage: null,
  };
}

export function toSettings(row: Tables<"settings"> | null | undefined): StoreSettings {
  return {
    name: text(row?.store_name),
    phone: text(row?.phone),
    whatsapp: text(row?.whatsapp),
    address: text(row?.address),
    mapUrl: safeUrl(row?.map_url, { absoluteOnly: true }),
    email: text(row?.email),
    deliveryNote: text(row?.delivery_note),
  };
}

/** A category with no tile photo of its own borrows the first photo of one of its products. */
export function withCategoryFallbackImages(categories: Category[], products: Product[]): Category[] {
  return categories.map((c) => ({
    ...c,
    image: c.image ?? products.find((p) => p.category === c.slug && p.images[0])?.images[0] ?? null,
  }));
}

export function buildStorefront(rows: {
  categories: Tables<"categories">[];
  products: Tables<"products">[];
  settings: Tables<"settings"> | null;
}): Storefront {
  const categories = rows.categories.map(toCategory);
  const slugById = new Map(rows.categories.map((c, i) => [c.id, categories[i]!.slug]));
  const products = rows.products
    .filter((p) => p.available)
    .map((p) => toProduct(p, (p.category_id && slugById.get(p.category_id)) || ""));
  return {
    categories: withCategoryFallbackImages(categories, products),
    products,
    social: socialRowsFromSettings(rows.settings).map(toSocialLink),
    settings: toSettings(rows.settings),
  };
}
