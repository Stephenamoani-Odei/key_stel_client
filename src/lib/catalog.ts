// CATALOGUE: types and pure helpers only.
// There is deliberately NO product, category or image data in this file. Everything the storefront
// shows (photos, names, prices, descriptions, categories, contact details) comes from the admin
// dashboard's Supabase database. See docs/dashboard-integration.md.

export const CURRENCY = "GHS";

export interface Category {
  /** Made from the category name, e.g. "Heavy Duty Steel" becomes "heavy-duty-steel". */
  slug: string;
  name: string;
  short: string;
  description: string;
  /** The parent group the owner chose in the admin (for example "Security & Entrance Doors"). */
  group: string | null;
  /** Collection tile photo: borrowed from a product in the category, else null. */
  image: string | null;
  /** Optional wide banner for the category page. */
  heroImage: string | null;
}

export interface Product {
  id: string;
  /** Name plus a short id, so it stays unique and old links still resolve after a rename. */
  slug: string;
  name: string;
  category: string; // category slug, or "" when the door has no category
  price: number;
  stock: number;
  createdAt: string;
  images: string[]; // ordered, first is the primary photo; may be empty
  description: string;
  sizes: string[];
}

const idFragment = (slug: string) => /-([0-9a-f]{8})$/.exec(slug)?.[1];

export const getProduct = (list: Product[], slug: string) =>
  list.find((p) => p.slug === slug) ??
  (idFragment(slug) ? list.find((p) => p.id.replace(/-/g, "").startsWith(idFragment(slug)!)) : undefined);
export const getCategory = (list: Category[], slug: string) => list.find((c) => c.slug === slug);
export const effectivePrice = (p: Product) => p.price;
export const canBuy = (p: Product) => p.stock > 0;

export const formatPrice = (n: number | null | undefined) =>
  n == null ? "" : new Intl.NumberFormat("en-GH", { style: "currency", currency: CURRENCY }).format(n);

export interface Filters {
  q?: string | undefined;
  category?: string | undefined;
  min?: number | undefined;
  max?: number | undefined;
  inStock?: boolean | undefined;
  sort?: "featured" | "newest" | "price-asc" | "price-desc" | "name" | undefined;
}

const byRecommended = (a: Product, b: Product) =>
  (canBuy(b) ? 1 : 0) - (canBuy(a) ? 1 : 0) || b.createdAt.localeCompare(a.createdAt);

export function filterProducts(list: Product[], f: Filters) {
  const q = f.q?.trim().toLowerCase();
  let out = list.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q)) return false;
    if (f.category && p.category !== f.category) return false;
    if (f.min != null && p.price < f.min) return false;
    if (f.max != null && p.price > f.max) return false;
    if (f.inStock && p.stock <= 0) return false;
    return true;
  });
  switch (f.sort) {
    case "price-asc": out = [...out].sort((a, b) => a.price - b.price); break;
    case "price-desc": out = [...out].sort((a, b) => b.price - a.price); break;
    case "name": out = [...out].sort((a, b) => a.name.localeCompare(b.name)); break;
    case "newest": out = [...out].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
    case "featured":
    default: out = [...out].sort(byRecommended);
  }
  return out;
}

/** Products to lead a hero or showcase with: only ones that have a photo, newest first. */
export function pickShowcase(list: Product[], limit: number, { photoOnly = true } = {}) {
  return list
    .filter((p) => !photoOnly || p.images.length > 0)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}
