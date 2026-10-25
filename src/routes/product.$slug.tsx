import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Minus, Plus, ShoppingCart, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { canBuy, getProduct, CURRENCY } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { storefrontQuery, useCatalog } from "@/lib/storefront";
import { CatalogImage } from "@/components/site/CatalogImage";
import { Reveal, RevealImage } from "@/components/site/TextReveal";
import { NotFoundMessage } from "@/components/site/NotFoundMessage";
import { whatsappLink } from "@/lib/site";
import { ProductCard, StockBadge } from "@/components/site/ProductCard";
import { ProductPrice, ProductStars } from "@/components/site/ProductDetails";

// Structured data and social cards need absolute image URLs.
const isAbsolute = (u: string) => /^https?:\/\//.test(u);

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params, context }) => {
    const { products } = await context.queryClient.fetchQuery(storefrontQuery);
    const product = getProduct(products, params.slug);
    if (!product) throw notFound();
    return { slug: product.slug, product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Product unavailable — KEY-STEL" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${p.name} — KEY-STEL` },
        ...(p.description ? [{ name: "description", content: p.description }, { property: "og:description", content: p.description }] : []),
        { property: "og:title", content: p.name },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(p.images[0]?.startsWith("https://") ? [{ property: "og:image", content: p.images[0] }, { name: "twitter:image", content: p.images[0] }] : []),
      ],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org", "@type": "Product", name: p.name, ...(p.description ? { description: p.description } : {}), ...(p.images.some(isAbsolute) ? { image: p.images.filter(isAbsolute) } : {}),
          offers: { "@type": "Offer", priceCurrency: CURRENCY, price: p.price, availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" },
        }),
      }],
    };
  },
  notFoundComponent: () => (
    <NotFoundMessage title="Product not found" message="This product may have been removed or is no longer available." action={{ to: "/shop", label: "Back to shop" }} />
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const { getProduct: find, getCategory, products } = useCatalog();
  const p = find(slug);
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const { add, toggleWish, isWished } = useStore();
  if (!p) return null;
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const wa = whatsappLink(`Hello KEY-STEL, I'm interested in ${p.name}.`);
  const buyable = canBuy(p);
  const specs: [string, string | undefined][] = [["Category", getCategory(p.category)?.name], ["Available sizes", p.sizes.length ? p.sizes.join(", ") : undefined]];

  return (
    <div className="container-x py-10">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/shop" className="hover:text-primary">Shop</Link> / {getCategory(p.category) && <><Link to="/category/$slug" params={{ slug: p.category }} className="hover:text-primary">{getCategory(p.category)?.short}</Link> / </>}<span className="text-ink">{p.name}</span>
      </nav>
      <div className="product-layout grid gap-10 lg:grid-cols-2">
        <div>
          <RevealImage className="product-gallery aspect-[4/5] overflow-hidden bg-surface">
            <CatalogImage src={p.images[img] ?? p.images[0]} alt={p.name} className="h-full w-full object-cover" />
          </RevealImage>
          {p.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {p.images.map((src, i) => (
                <Button variant="ghost" key={i} onClick={() => setImg(i)} aria-label={`Image ${i + 1}`} className={`h-20 w-16 overflow-hidden rounded-lg border-2 ${i === img ? "border-primary" : "border-transparent"}`}>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </Button>
              ))}
            </div>
          )}
        </div>
        <Reveal className="product-info">
          <h1 className="mt-3 text-4xl font-black">{p.name}</h1>
          <ProductStars />
          <div className="mt-5"><ProductPrice p={p} large /></div>
          <div className="mt-2"><StockBadge p={p} /></div>
          {p.description && <p className="mt-6 leading-relaxed text-foreground/85">{p.description}</p>}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border">
              <Button variant="ghost" className="grid h-12 w-11 place-items-center text-primary" aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
              <span className="w-10 text-center font-bold" aria-live="polite">{qty}</span>
              <Button variant="ghost" className="grid h-12 w-11 place-items-center text-primary" aria-label="Increase" onClick={() => setQty((q) => Math.min(Math.max(1, p.stock), q + 1))}><Plus className="h-4 w-4" /></Button>
            </div>
            {/* Cart is the primary action; requesting a quote stays available for customers who want it. */}
            <Button variant="ghost" className="btn btn-primary h-12" disabled={!buyable} onClick={() => (add(p.slug, qty) ? toast.success(`${p.name} added to cart`) : toast.error("You already have all available stock in your cart"))}>
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </Button>
            <Link to="/quote" search={{ product: p.name }} className="btn btn-secondary h-12">Request a Quote</Link>
            <Button variant="ghost" onClick={() => toggleWish(p.slug)} aria-label="Wishlist" className="btn btn-secondary h-12 px-4"><Heart className={`h-4 w-4 ${isWished(p.slug) ? "fill-primary" : ""}`} /></Button>
            {wa && <a href={wa} target="_blank" rel="noreferrer" className="btn btn-secondary h-12"><MessageCircle className="h-4 w-4" /> WhatsApp</a>}
          </div>

          <dl className="mt-10 divide-y rounded-xl border">
            {specs.filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="grid grid-cols-3 gap-4 px-5 py-3 text-sm"><dt className="font-semibold text-muted-foreground">{k}</dt><dd className="col-span-2 text-ink">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-6 flex gap-3 rounded-xl bg-surface p-5 text-sm">
            <Truck className="h-5 w-5 shrink-0 text-primary" />
            <p>Delivery arrangements and charges are confirmed with you after ordering. See <Link to="/delivery-returns" className="font-bold text-primary">Delivery & Returns</Link>.</p>
          </div>
        </Reveal>
      </div>
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-black">Related products</h2>
          <div className="grid grid-cols-2 gap-4 min-[620px]:grid-cols-3 min-[900px]:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </section>
      )}
    </div>
  );
}
