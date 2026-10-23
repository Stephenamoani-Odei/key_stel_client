import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";

export const faqs = [
  { q: "Can I order a door in a custom size?", a: "Yes. Use Request a Quote with your opening dimensions and we'll get back to you with options and pricing." },
  { q: "Do you offer installation?", a: "Ask about installation when you request a quote or contact us — availability depends on your location and product." },
  { q: "How is delivery arranged?", a: "Delivery details and any charges are confirmed with you after you place an order or request." },
  { q: "Which currency are prices in?", a: "All prices are shown in Ghanaian cedi (GHS)." },
  { q: "Can I order doors in bulk?", a: "Yes. For large projects, request a quote with the number of doors and sizes you need." },
  { q: "Why do some products say 'Price on request'?", a: "Some items are made to order or vary by size, so we price them individually." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "FAQ — KEY-STEL" },
      { name: "description", content: "Answers to common questions about ordering, delivery and custom sizes at KEY-STEL." },
      { property: "og:title", content: "Frequently Asked Questions — KEY-STEL" },
      { property: "og:description", content: "Ordering, delivery and custom sizes." },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="Help" title="Frequently Asked Questions" />
      <div className="container-x max-w-3xl py-12">
        <div className="divide-y rounded-xl border">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none justify-between font-bold">{f.q}<span className="text-primary transition group-open:rotate-45">+</span></summary>
              <p className="mt-2 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-muted-foreground">Still have questions? <Link to="/contact" className="font-bold text-primary">Contact us</Link>.</p>
      </div>
    </>
  ),
});
