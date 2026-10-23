import { useMemo } from "react";
import { queryOptions } from "@tanstack/react-query";
import { rootRouteId, useLoaderData } from "@tanstack/react-router";
import { fetchStorefront } from "./catalog.functions";
import { getCategory, getProduct } from "./catalog";
import { whatsappNumberFrom } from "./social";
import type { Storefront } from "./storefront-data";

/**
 * The shared, cached load of all admin-managed content. The root route loads it (server-side on first
 * paint, so product pages and SEO tags are real) and child route loaders reuse the same cache.
 * Changes made in the admin appear on the next navigation after the cache goes stale.
 */
export const STOREFRONT_STALE_MS = 30_000;
export const storefrontQuery = queryOptions({
  queryKey: ["storefront"],
  queryFn: () => fetchStorefront(),
  staleTime: STOREFRONT_STALE_MS,
});

/** Admin content plus lookups, available to any component under the root route. */
export function useCatalog() {
  const data = useLoaderData({ from: rootRouteId }) as Storefront;
  return useMemo(() => ({
    ...data,
    getProduct: (slug: string) => getProduct(data.products, slug),
    getCategory: (slug: string) => getCategory(data.categories, slug),
    whatsappNumber: whatsappNumberFrom(data.social),
  }), [data]);
}
