import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Prose } from "@/components/site/PageHeader";

export const Route = createFileRoute("/delivery-returns")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Delivery & Returns — KEY-STEL" },
      { name: "description", content: "How delivery and returns work at KEY-STEL." },
      { property: "og:title", content: "Delivery & Returns — KEY-STEL" },
      { property: "og:description", content: "How delivery and returns work at KEY-STEL." },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="KEY-STEL" title="Delivery & Returns" />
      <Prose>
        <p className="rounded-lg bg-accent p-4 text-accent-foreground">Our full delivery and returns terms are being finalised. The points below are general guidance.</p>
        <h2>Delivery</h2>
        <p>Delivery arrangements, timing and any charges are confirmed with you after your order or quote request, based on your location and items.</p>
        <h2>Returns</h2>
        <p>Please contact us as soon as possible if an item arrives damaged or incorrect. Custom-made items may not be returnable.</p>
      </Prose>
    </>
  ),
});
