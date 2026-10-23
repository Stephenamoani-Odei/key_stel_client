import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Prose } from "@/components/site/PageHeader";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Terms & Conditions — KEY-STEL" },
      { name: "description", content: "Terms of using the KEY-STEL website and placing orders." },
      { property: "og:title", content: "Terms & Conditions — KEY-STEL" },
      { property: "og:description", content: "Terms of using the KEY-STEL website and placing orders." },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="KEY-STEL" title="Terms & Conditions" />
      <Prose>
        <p className="rounded-lg bg-accent p-4 text-accent-foreground">These terms are a draft and will be updated before launch.</p>
        <h2>Products and prices</h2>
        <p>Prices are in Ghanaian cedi (GHS) and are shown as set by KEY-STEL when you order. Delivery charges are confirmed when we call you.</p>
        <h2>Orders</h2>
        <p>An order is confirmed only once we have called you, agreed the details and arranged payment with you. No payment is taken on this website.</p>
      </Prose>
    </>
  ),
});
