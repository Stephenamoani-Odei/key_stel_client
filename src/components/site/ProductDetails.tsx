import { Star } from "lucide-react";
import { effectivePrice, formatPrice, type Product } from "@/lib/catalog";

// Prices come straight from the admin dashboard. Delivery charges are confirmed when the shop calls.
export function ProductPrice({ p, large = false }: { p: Product; large?: boolean }) {
  return <div className="mt-2">
    <span className={large ? "text-3xl font-black text-foreground" : "text-sm font-semibold text-foreground"}>{formatPrice(effectivePrice(p))}</span>
  </div>;
}

export function ProductStars() {
  return <div className="mt-2 flex flex-wrap items-center gap-2" aria-label="Unrated — decorative five stars">
    <span className="flex gap-0.5 text-primary" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="size-3 fill-primary" />)}</span>
    <span className="text-[10px] text-muted-foreground">Not yet rated</span>
  </div>;
}
