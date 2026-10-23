import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { effectivePrice } from "./catalog";
import { useCatalog } from "./storefront";

// Guest cart + wishlist persisted in the browser. Will merge into the account cart once sign-in is added.
export interface CartLine { slug: string; qty: number }

interface StoreCtx {
  cart: CartLine[];
  wishlist: string[];
  count: number;
  subtotal: number;
  add: (slug: string, qty?: number) => boolean;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  toggleWish: (slug: string) => void;
  isWished: (slug: string) => boolean;
}

const Ctx = createContext<StoreCtx | null>(null);
const CART_KEY = "keystel-cart-v2";
const WISH_KEY = "keystel-wishlist-v2";

export function clampQty(stock: number | undefined, qty: number) {
  if (stock === undefined) return 0;
  return Math.max(0, Math.min(Math.floor(qty), stock));
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const { getProduct } = useCatalog();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
      setWishlist(JSON.parse(localStorage.getItem(WISH_KEY) || "[]"));
    } catch { /* ignore corrupt storage */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart, ready]);
  useEffect(() => { if (ready) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)); }, [wishlist, ready]);

  const valid = cart.filter((l) => getProduct(l.slug));
  const value: StoreCtx = {
    cart: valid,
    wishlist,
    count: valid.reduce((s, l) => s + l.qty, 0),
    subtotal: valid.reduce((s, l) => s + (effectivePrice(getProduct(l.slug)!) ?? 0) * l.qty, 0),
    add: (slug, qty = 1) => {
      const existing = cart.find((l) => l.slug === slug)?.qty ?? 0;
      const next = clampQty(getProduct(slug)?.stock, existing + qty);
      if (next === existing) return false;
      setCart((c) => (c.some((l) => l.slug === slug) ? c.map((l) => (l.slug === slug ? { ...l, qty: next } : l)) : [...c, { slug, qty: next }]));
      return true;
    },
    setQty: (slug, qty) => {
      const q = clampQty(getProduct(slug)?.stock, qty);
      setCart((c) => (q === 0 ? c.filter((l) => l.slug !== slug) : c.map((l) => (l.slug === slug ? { ...l, qty: q } : l))));
    },
    remove: (slug) => setCart((c) => c.filter((l) => l.slug !== slug)),
    clear: () => setCart([]),
    toggleWish: (slug) => setWishlist((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug])),
    isWished: (slug) => wishlist.includes(slug),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used inside StoreProvider");
  return c;
}
