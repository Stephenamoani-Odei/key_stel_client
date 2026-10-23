import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Lock, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { useCatalog } from "@/lib/storefront";
import { CatalogImage } from "@/components/site/CatalogImage";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Your Cart — KEY-STEL" },
      { name: "description", content: "Review the items in your KEY-STEL shopping cart." },
      { property: "og:title", content: "Your Cart — KEY-STEL" },
      { property: "og:description", content: "Review your cart." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cart, setQty, remove, subtotal } = useStore();
  const { getProduct } = useCatalog();
  if (cart.length === 0)
    return (
      <>
        <PageHeader title="Your Cart" />
        <div className="container-x py-20 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-2xl font-bold">Your cart is empty</h2>
          <Link to="/shop" className="btn btn-primary mt-6">Start shopping</Link>
        </div>
      </>
    );
  return (
    <>
      <PageHeader title="Your Cart" />
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y border-t">
          {cart.map((l) => {
            const p = getProduct(l.slug);
            if (!p) return null;
            const price = p.price;
            return (
              <li key={l.slug} className="cart-line flex gap-3 sm:gap-5">
                <CatalogImage src={p.images[0]} alt={p.name} className="h-28 w-20 shrink-0 object-cover sm:h-36 sm:w-28" />
                <div className="flex flex-1 flex-col">
                  <Link to="/product/$slug" params={{ slug: p.slug }} className="font-bold hover:text-primary">{p.name}</Link>
                  <span className="text-sm text-muted-foreground">{formatPrice(price)} each</span>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center rounded-lg border">
                      <Button variant="ghost" size="icon" className="grid h-9 w-9 place-items-center text-primary" aria-label="Decrease" onClick={() => setQty(l.slug, l.qty - 1)}><Minus className="h-4 w-4" /></Button>
                      <span className="w-8 text-center font-bold">{l.qty}</span>
                      <Button variant="ghost" size="icon" className="grid h-9 w-9 place-items-center text-primary disabled:opacity-40" aria-label="Increase" disabled={l.qty >= p.stock} onClick={() => setQty(l.slug, l.qty + 1)}><Plus className="h-4 w-4" /></Button>
                    </div>
                    <span className="font-bold">{formatPrice(price * l.qty)}</span>
                  </div>
                  {l.qty >= p.stock && <span className="mt-1 text-xs text-primary">Maximum available stock reached</span>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove(l.slug)} aria-label={`Remove ${p.name}`} className="self-start text-primary"><Trash2 className="h-5 w-5" /></Button>
              </li>
            );
          })}
        </ul>
        <aside className="cart-summary h-fit bg-surface p-6 lg:sticky lg:top-36">
          <p className="eyebrow mb-3">YOUR ORDER</p><h2 className="text-xl font-bold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-bold">{formatPrice(subtotal)}</dd></div>
                        <div className="flex justify-between"><dt>Delivery</dt><dd className="text-muted-foreground">Confirmed when we call you</dd></div>
          </dl>
          <div className="mt-4 flex justify-between border-t pt-4 text-lg font-black"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
          <Link to="/checkout" className="btn btn-primary mt-6 w-full">Proceed to Checkout <ArrowUpRight className="size-4"/></Link>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><Lock className="size-3 shrink-0 text-primary"/>No account needed — check out as a guest.</p>
          <Link to="/shop" className="btn btn-secondary mt-3 w-full">Continue shopping</Link>
        </aside>
      </div>
    </>
  );
}
