import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { filterProducts, type Filters } from "@/lib/catalog";
import { useCatalog } from "@/lib/storefront";
import { ProductCard } from "./ProductCard";
import { SITE } from "@/lib/site";

const PAGE = 8;

export function ShopView({ filters, fixedCategory, basePath }: { filters: Filters; fixedCategory?: string; basePath: string }) {
  const navigate = useNavigate();
  const { products } = useCatalog();
  const [shown, setShown] = useState(PAGE);
  const f = { ...filters, category: fixedCategory ?? filters["category"] };
  const list = useMemo(() => filterProducts(products, f), [products, JSON.stringify(f)]);
  const set = (patch: Partial<Filters>) => {
    setShown(PAGE);
    navigate({ to: basePath, search: (prev: Filters) => ({ ...prev, ...patch }), replace: true } as never);
  };

  return (
    <div className="shop-layout container-x py-10">
      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground"><b className="text-ink">{list.length}</b> products</p>
          <select className="field w-auto" aria-label="Sort" value={filters["sort"] ?? "newest"} onChange={(e) => set({ sort: e.target.value as Filters["sort"] })}>
            <option value="featured">Recommended</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </div>
        {list.length === 0 ? (
          <div className="rounded-xl border border-dashed p-14 text-center">
            <SearchX className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 text-xl font-bold">No doors match</h2>
            <p className="mt-1 text-muted-foreground">Try a different search{SITE.phone ? `, or call us on ${SITE.phone} and we'll find it for you` : ""}.</p>
            <Button className="btn btn-secondary mt-5" onClick={() => navigate({ to: basePath, search: {} as never })}>Clear search</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 min-[620px]:grid-cols-3 min-[900px]:grid-cols-4 min-[1200px]:grid-cols-5">
              {list.slice(0, shown).map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
            {shown < list.length && (
              <div className="mt-8 text-center"><Button className="btn btn-secondary" onClick={() => setShown((s) => s + PAGE)}>Load more</Button></div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function parseFilters(s: Record<string, any>): Filters {
  const num = (v: unknown) => (v === undefined || v === "" || isNaN(Number(v)) ? undefined : Number(v));
  const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
  const sorts = ["featured", "newest", "price-asc", "price-desc", "name"];
  return {
    q: str(s["q"]), category: str(s["category"]),
    min: num(s["min"]), max: num(s["max"]), inStock: s["inStock"] === true || s["inStock"] === "true" ? true : undefined,
    sort: sorts.includes(s["sort"] as string) ? (s["sort"] as Filters["sort"]) : undefined,
  };
}
