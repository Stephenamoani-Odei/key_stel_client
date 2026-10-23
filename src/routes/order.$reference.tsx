import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/catalog";
import { useCatalog } from "@/lib/storefront";
import { SITE, telLink } from "@/lib/site";
import { orderWhatsAppUrl, type WhatsAppItem } from "@/lib/whatsapp-checkout";
import { PageHeader } from "@/components/site/PageHeader";
import { LAST_ORDER_KEY } from "./checkout";

export const Route = createFileRoute("/order/$reference")({
  head: ({ params }) => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: `Order ${params.reference} — KEY-STEL` },
      { name: "description", content: "Your KEY-STEL order confirmation." },
      { property: "og:title", content: "Order confirmation — KEY-STEL" },
      { property: "og:description", content: "Order confirmation." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OrderPage,
});

interface Snapshot { id: number; name: string; phone: string; address: string; items: WhatsAppItem[]; total: number; at: string }

function OrderPage() {
  const { reference } = Route.useParams();
  const { whatsappNumber } = useCatalog();
  const [snap, setSnap] = useState<Snapshot | null>(null);

  // The order itself is saved in the shop's system. This copy only lives in this browser tab.
  useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem(LAST_ORDER_KEY) ?? "null") as Snapshot | null;
      if (s && String(s.id) === reference) setSnap(s);
    } catch { /* ignore */ }
  }, [reference]);

  const wa = snap ? orderWhatsAppUrl(snap.id, snap.name, snap.items, whatsappNumber) : null;
  return (
    <>
      <PageHeader eyebrow="Thank you" title="Order received" />
      <div className="container-x max-w-2xl py-12">
        <div className="rounded-xl border bg-surface p-8">
          <CheckCircle2 className="h-9 w-9 text-primary" />
          <h2 className="mt-3 text-2xl font-black">Your order number is #{reference}</h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            We have your order. A member of the KEY-STEL team will call{snap ? <> you on <b className="text-foreground">{snap.phone}</b></> : " you"} shortly to confirm it, agree the delivery charge and arrange payment. No payment has been taken online.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Please keep your order number handy.</p>
        </div>

        {snap && (
          <div className="mt-8 rounded-xl border">
            <ul className="divide-y">
              {snap.items.map((i, n) => (
                <li key={n} className="flex justify-between gap-4 p-4 text-sm">
                  <span><b>{i.name}</b> × {i.qty}</span><span className="font-bold">{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t p-4 font-black"><span>Total</span><span>{formatPrice(snap.total)}</span></div>
            <div className="border-t p-4 text-sm"><p className="mb-1 font-semibold text-muted-foreground">Delivery details</p><p className="whitespace-pre-line">{snap.address}</p></div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {wa && <a href={wa} target="_blank" rel="noreferrer" className="btn btn-primary">Send these details on WhatsApp</a>}
          {SITE.phone && <a href={telLink(SITE.phone)} className="btn btn-secondary">Call us on {SITE.phone}</a>}
          <Link to="/shop" className="btn btn-secondary">Continue shopping</Link>
        </div>
      </div>
    </>
  );
}
