import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import { useCatalog } from "@/lib/storefront";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Wishlist — KEY-STEL" },
      { name: "description", content: "Products you've saved at KEY-STEL." },
      { property: "og:title", content: "Wishlist — KEY-STEL" },
      { property: "og:description", content: "Your saved products." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist } = useStore();
  const { getProduct } = useCatalog();
  const items = wishlist.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p);
  return (
    <>
      <PageHeader eyebrow="Saved" title="Your Wishlist" />
      <div className="container-x py-10">
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <Heart className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 text-2xl font-bold">Nothing saved yet</h2>
            <p className="mt-1 text-muted-foreground">Tap the heart on any product to save it here.</p>
            <Link to="/shop" className="btn btn-primary mt-6">Browse products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 min-[620px]:grid-cols-3 min-[900px]:grid-cols-4 min-[1200px]:grid-cols-5">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        )}
      </div>
    </>
  );
}
