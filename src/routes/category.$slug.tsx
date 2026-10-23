import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ShopView, parseFilters } from "@/components/site/ShopView";
import { getCategory } from "@/lib/catalog";
import { storefrontQuery } from "@/lib/storefront";
import { NotFoundMessage } from "@/components/site/NotFoundMessage";
import doorInDoor from "@/assets/category-door-in-door.jpg";
import alucoCement from "@/assets/category-aluco-cement.jpg";
import heavySteel from "@/assets/category-heavy-steel.jpg";
import classic from "@/assets/category-classic.jpg";
import antiRust from "@/assets/category-anti-rust.jpg";
import standard from "@/assets/category-standard.jpg";
import bedroom from "@/assets/category-bedroom.jpg";
import washroom from "@/assets/category-washroom.jpg";

// Editorial banner art (generated backdrops, not inventory photos). It is only a fallback: a banner
// the dashboard supplies for the category (`hero_image_url`) always wins, and a category with
// neither simply gets the plain header.
// Category names are typed by the owner in the admin, so the art is matched on keywords in the slug.
const BACKGROUNDS: [RegExp, string][] = [
  [/door-in-door/, doorInDoor], [/aluco|cement/, alucoCement], [/rust/, antiRust], [/heavy/, heavySteel],
  [/classic/, classic], [/standard/, standard], [/bedroom/, bedroom], [/wash|bath|toilet/, washroom],
];
const backgroundFor = (slug: string) => BACKGROUNDS.find(([re]) => re.test(slug))?.[1];

export const Route = createFileRoute("/category/$slug")({
  validateSearch: parseFilters,
  loader: async ({ params, context }) => {
    const { categories } = await context.queryClient.fetchQuery(storefrontQuery);
    const cat = getCategory(categories, params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.cat.name} — KEY-STEL` },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "description", content: loaderData.cat.description },
          { property: "og:title", content: `${loaderData.cat.name} — KEY-STEL` },
          { property: "og:description", content: loaderData.cat.description },
        ]
      : [{ title: "Category — KEY-STEL" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <NotFoundMessage title="Category not found" message="This category may have been renamed or removed. Browse everything we have instead." action={{ to: "/shop", label: "Browse all products" }} />
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const filters = Route.useSearch();
  return (
    <>
      <PageHeader eyebrow="Category" title={cat.name} image={cat.heroImage ?? backgroundFor(cat.slug)}>{cat.description}</PageHeader>
      <ShopView filters={filters} fixedCategory={cat.slug} basePath={`/category/${cat.slug}`} />
    </>
  );
}
