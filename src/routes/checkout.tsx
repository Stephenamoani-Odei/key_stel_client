import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { useCatalog } from "@/lib/storefront";
import { addressBlock, checkoutSchema, GHANA_REGIONS } from "@/lib/checkout-schema";
import { getLiveProducts, placeOrder } from "@/lib/orders.functions";
import { PageHeader } from "@/components/site/PageHeader";

export const LAST_ORDER_KEY = "keystel-last-order";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Checkout — KEY-STEL" },
      { name: "description", content: "Place your KEY-STEL order as a guest — no account needed." },
      { property: "og:title", content: "Checkout — KEY-STEL" },
      { property: "og:description", content: "Guest checkout." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

type Live = { id: string; price: number; stock: number; available: boolean };
function Checkout() {
  const { cart, setQty, clear } = useStore();
  const { getProduct } = useCatalog();
  const navigate = useNavigate();
  const fetchLive = useServerFn(getLiveProducts);
  const place = useServerFn(placeOrder);
  const [live, setLive] = useState<Record<string, Live> | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formErr, setFormErr] = useState<string | null>(null);
  const [ackChanges, setAckChanges] = useState(false);
  const [placing, setPlacing] = useState(false);
  const ids = cart.flatMap((l) => getProduct(l.slug)?.id ?? []);
  const idsKey = ids.join(",");

  const refresh = () => {
    setLoadErr(null);
    fetchLive({ data: { ids } })
      .then((rows) => setLive(Object.fromEntries(rows.map((r) => [r.id, r]))))
      .catch((e: Error) => setLoadErr(e.message || "Could not load current prices."));
  };
  useEffect(() => { if (ids.length) refresh(); }, [idsKey]);

  if (cart.length === 0)
    return (
      <>
        <PageHeader title="Checkout" />
        <div className="container-x py-20 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-2xl font-bold">Your cart is empty</h2>
          <Link to="/shop" className="btn btn-primary mt-6">Browse products</Link>
        </div>
      </>
    );

  const lines = cart.flatMap((l) => {
    const p = getProduct(l.slug);
    if (!p) return [];
    const lv = live?.[p.id];
    const price = lv ? lv.price : p.price;
    const issues: string[] = [];
    if (lv) {
      if (!lv.available) issues.push("This item is no longer available.");
      else if (lv.stock < l.qty) issues.push(lv.stock === 0 ? "Now out of stock." : `Only ${lv.stock} available now.`);
      if (lv.price !== p.price) issues.push(`Price updated from ${formatPrice(p.price)} to ${formatPrice(lv.price)}.`);
    } else if (live) issues.push("This item is no longer available.");
    return [{ ...l, p, lv, price, issues, blocking: (!!lv && (!lv.available || lv.stock < l.qty)) || (!!live && !lv) }];
  });
  const priceChanged = lines.some((l) => l.issues.some((i) => i.startsWith("Price")));
  const blocking = lines.some((l) => l.blocking);
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErr(null);
    const parsed = checkoutSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])));
      setFormErr("Please fix the highlighted fields.");
      return;
    }
    setErrors({});
    if (!live || blocking || placing) return;
    if (priceChanged && !ackChanges) { setFormErr("Please confirm the updated prices before continuing."); return; }
    setPlacing(true);
    try {
      const res = await place({ data: { ...parsed.data, items: lines.map((l) => ({ product_id: l.p.id, qty: l.qty })) } });
      if (!res.ok) { setFormErr(res.error); refresh(); return; }
      // Kept only in this browser tab so the confirmation page can show what was ordered.
      try {
        sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify({
          id: res.id, name: parsed.data.name, phone: parsed.data.phone, address: addressBlock(parsed.data),
          items: lines.map((l) => ({ name: l.p.name, qty: l.qty, price: l.price })), total: subtotal, at: new Date().toISOString(),
        }));
      } catch { /* private browsing: the confirmation page still works without it */ }
      await navigate({ to: "/order/$reference", params: { reference: String(res.id) } });
      clear();
    } catch {
      setFormErr("We could not place your order right now. Please try again, or call us and we will take it by phone.");
    } finally {
      setPlacing(false);
    }
  };

  const renderField = ({ name, label, required, type = "text", ph, full }: { name: string; label: string; required?: boolean; type?: string; ph?: string; full?: boolean }) => (
    <div className={full ? "sm:col-span-2" : ""}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold">{label}{required ? <span className="text-primary"> *</span> : <span className="font-normal text-muted-foreground"> (optional)</span>}</label>
      <input id={name} name={name} type={type} placeholder={ph} className="field" aria-invalid={!!errors[name]} autoComplete={name === "name" ? "name" : name === "email" ? "email" : name === "phone" ? "tel" : undefined} />
      {errors[name] && <p className="mt-1 text-xs font-semibold text-primary">{errors[name]}</p>}
    </div>
  );

  return (
    <>
      <PageHeader eyebrow="Guest checkout" title="Checkout">Tell us where to deliver. We will call you to confirm your order and arrange payment.</PageHeader>
      <form onSubmit={onSubmit} noValidate className="container-x grid gap-10 py-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-10 [&_section]:border-b [&_section]:pb-8">
          <section>
            <h2 className="mb-4 text-xl font-bold">1. Your details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {renderField({ name: 'name', label: 'Full name', required: true, full: true })}
              {renderField({ name: 'phone', label: 'Phone number', type: 'tel', ph: 'e.g. 024 000 0000', required: true })}
              {renderField({ name: 'email', label: 'Email address', type: 'email' })}
            </div>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-bold">2. Delivery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="region" className="mb-1.5 block text-sm font-semibold">Region<span className="text-primary"> *</span></label>
                <select id="region" name="region" className="field" defaultValue="" aria-invalid={!!errors["region"]}>
                  <option value="" disabled>Choose region</option>
                  {GHANA_REGIONS.map((r) => <option key={r}>{r}</option>)}
                </select>
                {errors["region"] && <p className="mt-1 text-xs font-semibold text-primary">{errors["region"]}</p>}
              </div>
              {renderField({ name: 'city', label: 'City or town', required: true })}
              {renderField({ name: 'address', label: 'Delivery address', required: true, full: true })}
              {renderField({ name: 'digital_address', label: 'Ghana Digital Address', ph: 'GA-123-4567' })}
              <div className="sm:col-span-2">
                <label htmlFor="delivery_instructions" className="mb-1.5 block text-sm font-semibold">Delivery instructions <span className="font-normal text-muted-foreground">(optional)</span></label>
                <textarea id="delivery_instructions" name="delivery_instructions" rows={2} className="field" maxLength={500} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="order_notes" className="mb-1.5 block text-sm font-semibold">Order notes <span className="font-normal text-muted-foreground">(optional)</span></label>
                <textarea id="order_notes" name="order_notes" rows={2} className="field" maxLength={500} />
              </div>
            </div>
          </section>
        </div>

        <aside className="cart-summary h-fit space-y-4 bg-surface p-6 lg:sticky lg:top-36">
          <h2 className="text-xl font-bold">3. Review your order</h2>
          {!live && !loadErr && <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin text-primary" /> Checking current prices and stock…</p>}
          {loadErr && <p className="text-sm text-primary">{loadErr} <Button type="button" onClick={refresh} className="font-bold underline">Retry</Button></p>}
          <ul className="divide-y">
            {lines.map((l) => (
              <li key={l.slug} className="py-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span><b>{l.p.name}</b> × {l.qty}</span>
                  <span className="font-bold">{formatPrice(l.price * l.qty)}</span>
                </div>
                {l.issues.map((i) => <p key={i} className="mt-1 flex items-start gap-1 text-xs font-semibold text-primary"><AlertTriangle className="h-3.5 w-3.5 shrink-0" />{i}</p>)}
                {l.blocking && l.lv && l.lv.available && l.lv.stock > 0 && (
                  <Button type="button" className="mt-1 text-xs font-bold text-primary underline" onClick={() => { if (l.lv) setQty(l.slug, l.lv.stock); }}>Change to {l.lv.stock}</Button>
                )}
                {l.blocking && <Link to="/cart" className="ml-2 mt-1 text-xs font-bold text-primary underline">Edit cart</Link>}
              </li>
            ))}
          </ul>
          <dl className="space-y-1.5 border-t pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-bold">{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd className="text-right text-muted-foreground">Confirmed when we call you</dd></div>
          </dl>
          <div className="flex justify-between border-t pt-4 text-lg font-black"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
          {priceChanged && (
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5 h-4 w-4 accent-primary" checked={ackChanges} onChange={(e) => setAckChanges(e.target.checked)} />
              I've reviewed the updated prices and want to continue.
            </label>
          )}
          {formErr && <p role="alert" className="text-sm font-semibold text-primary">{formErr}</p>}
          <Button type="submit" className="btn btn-primary h-auto min-h-12 w-full whitespace-normal" disabled={!live || blocking || placing}>
            {placing ? <><Loader2 className="h-4 w-4 animate-spin" /> Placing your order…</> : "Place order"}
          </Button>
          <p className="text-xs leading-5 text-muted-foreground">No payment is taken on this website. After you place your order, a member of the KEY-STEL team will call you to confirm it, agree the delivery charge, and arrange payment.</p>
        </aside>
      </form>
    </>
  );
}
