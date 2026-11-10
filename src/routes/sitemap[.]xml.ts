import { createFileRoute } from "@tanstack/react-router";
import { fetchStorefront } from "@/lib/catalog.functions";

const SITE = "https://key-stel.com";

const STATIC_PATHS = [
  "/",
  "/shop",
  "/about",
  "/contact",
  "/faq",
  "/quote",
  "/delivery-returns",
  "/privacy",
  "/terms",
];

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const data = (await fetchStorefront()) as {
          categories: { slug: string }[];
          products: { slug: string }[];
        };

        const paths = [
          ...STATIC_PATHS,
          ...data.categories.map((c) => `/category/${c.slug}`),
          ...data.products.map((p) => `/product/${p.slug}`),
        ];

        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          paths.map((p) => `  <url><loc>${esc(SITE + p)}</loc></url>`).join("\n") +
          `\n</urlset>\n`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
