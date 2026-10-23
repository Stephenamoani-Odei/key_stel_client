import { createFileRoute, Link } from "@tanstack/react-router";
import { User } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "My Account — KEY-STEL" },
      { name: "description", content: "Sign in to your KEY-STEL account." },
      { property: "og:title", content: "My Account — KEY-STEL" },
      { property: "og:description", content: "Customer account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Account,
});

function Account() {
  return (
    <>
      <PageHeader eyebrow="Account" title="My Account" />
      <div className="container-x max-w-lg py-16 text-center">
        <User className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-2xl font-bold">Customer accounts are coming soon</h2>
        <p className="mt-2 text-muted-foreground">You don't need an account to shop — check out as a guest any time. Optional accounts with order history are on the way. Your cart and wishlist are saved on this device.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/wishlist" className="btn btn-secondary">Wishlist</Link>
          <Link to="/cart" className="btn btn-primary">View cart</Link>
        </div>
      </div>
    </>
  );
}
