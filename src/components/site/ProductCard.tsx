import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import gsap from "gsap";
import { canBuy, type Product } from "@/lib/catalog";
import { MOTION } from "@/lib/motion";
import { useStore } from "@/lib/store";
import { useCatalog } from "@/lib/storefront";
import { CatalogImage } from "./CatalogImage";
import { Button } from "@/components/ui/button";
import { ProductPrice, ProductStars } from "./ProductDetails";

export function StockBadge({ p }: { p: Product }) {
  if (p.stock <= 0) return <span className="text-xs font-semibold text-primary">Out of stock</span>;
  if (p.stock <= 3) return <span className="text-xs font-semibold text-primary">Only {p.stock} left</span>;
  return <span className="text-xs font-semibold text-success">In stock</span>;
}

export function ProductCard({ p }: { p: Product }) {
  const { add, toggleWish, isWished } = useStore();
  const { getCategory } = useCatalog();
  const wished = isWished(p.slug);
  const wishButtonRef = useRef<HTMLButtonElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const animateFeedback = (button: HTMLButtonElement | null, duration: number, ease: string) => {
    if (!button || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(button, { scale: 0.88 }, { scale: 1, duration, ease, overwrite: "auto" });
  };
  const addToCart = () => {
    if (add(p.slug)) {
      animateFeedback(cartButtonRef.current, MOTION.duration.cartFeedback, MOTION.ease.button);
      toast.success(`${p.name} added to cart`);
    } else {
      toast.error("No more stock available");
    }
  };
  return <article className="product-card group flex min-w-0 flex-col">
    <div className="relative aspect-[4/5] overflow-hidden bg-surface">
      <Link to="/product/$slug" params={{ slug: p.slug }} className="block h-full"><CatalogImage src={p.images[0]} alt={p.name} loading="lazy" width={800} height={1000} className="product-card-image h-full w-full object-cover transition-transform group-hover:scale-105"/></Link>
      <Button ref={wishButtonRef} variant="ghost" size="icon" onClick={() => { toggleWish(p.slug); animateFeedback(wishButtonRef.current, MOTION.duration.wishlistFeedback, MOTION.ease.elastic); }} aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={wished} title={wished ? "Remove from wishlist" : "Add to wishlist"} className="absolute right-2 top-2 size-8 rounded-full bg-background/95 text-primary"><Heart className={wished ? "fill-primary" : ""}/></Button>
    </div>
    <div className="flex flex-1 flex-col pt-3">
      <span className="mb-1.5 text-[9px] font-semibold uppercase text-muted-foreground">{getCategory(p.category)?.short}</span>
      <Link to="/product/$slug" params={{ slug: p.slug }} className="font-display text-[13px] font-bold leading-5 hover:text-primary">{p.name}</Link>
      <ProductStars /><ProductPrice p={p} />
      <div className="mt-1"><StockBadge p={p}/></div>
      <div className="mt-auto flex items-center justify-between gap-2 border-b pt-3 pb-2.5">
        <Link to="/product/$slug" params={{ slug: p.slug }} className="flex items-center gap-2 text-xs font-bold text-primary">View door <ArrowUpRight className="size-3.5"/></Link>
        {/* The cart icon always adds to cart. Requesting a quote is a separate, opt-in action on the door's own page. */}
        <Button ref={cartButtonRef} size="icon" variant="outline" aria-label={`Add ${p.name} to cart`} title={canBuy(p) ? "Add to cart" : "Currently unavailable"} className="size-8 rounded-none border-primary text-primary" disabled={!canBuy(p)} onClick={addToCart}><ShoppingCart /></Button>
      </div>
    </div>
  </article>;
}
