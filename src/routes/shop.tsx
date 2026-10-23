import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ShopView, parseFilters } from "@/components/site/ShopView";
import heroSteel from "@/assets/hero-door-steel.jpg";

export const Route = createFileRoute("/shop")({
  validateSearch: parseFilters,
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Door Collection — KEY-STEL" },
      { name: "description", content: "Browse KEY-STEL security, entrance and interior doors." },
      { property: "og:title", content: "Door Collection — KEY-STEL" },
      { property: "og:description", content: "Security, entrance and interior doors." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const filters = Route.useSearch();
  return (
    <>
      <PageHeader eyebrow="THE KEY-STEL COLLECTION" title={filters.q ? `Results for "${filters.q}"` : "Our doors."} image={heroSteel}>
        Security, entrance and interior doors.
      </PageHeader>
      <ShopView filters={filters} basePath="/shop" />
    </>
  );
}
