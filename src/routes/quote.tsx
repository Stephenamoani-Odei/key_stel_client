import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { EnquiryForm } from "@/components/site/EnquiryForm";

export const Route = createFileRoute("/quote")({
  validateSearch: (s: Record<string, any>): { product?: string | undefined } => (typeof s["product"] === "string" ? { product: s["product"] } : {}),
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Request a Quote — KEY-STEL" },
      { name: "description", content: "Request a quote for custom security doors, bulk orders or installation." },
      { property: "og:title", content: "Request a Quote — KEY-STEL" },
      { property: "og:description", content: "Custom sizes, bulk orders and installation quotes." },
    ],
  }),
  component: Quote,
});

function Quote() {
  const { product } = Route.useSearch();
  return (
    <>
      <PageHeader eyebrow="Quotation" title="Request a Quote">Custom sizes, bulk orders or installation — tell us what you need.</PageHeader>
      <div className="container-x max-w-3xl py-12">
        <EnquiryForm kind="quote" submitLabel="Submit quote request" fields={[
          { name: "name", label: "Name", required: true },
          { name: "phone", label: "Phone", type: "tel", required: true },
          { name: "email", label: "Email", type: "email" },
          { name: "product", label: "Product of interest", required: true, defaultValue: product },
          { name: "quantity", label: "Quantity" },
          { name: "dimensions", label: "Dimensions (if applicable)" },
          { name: "location", label: "Delivery location" },
          { name: "details", label: "Additional requirements", textarea: true },
        ]} />
      </div>
    </>
  );
}
