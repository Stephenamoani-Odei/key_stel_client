import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StoreProvider } from "@/lib/store";
import { storefrontQuery } from "@/lib/storefront";
import { applySettings } from "@/lib/site";
import type { Storefront } from "@/lib/storefront-data";
import { NotFoundMessage } from "@/components/site/NotFoundMessage";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return <NotFoundMessage />;
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end. Please try again.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn btn-primary">Try again</button>
          <a href="/" className="btn btn-secondary">Go home</a>
        </div>
      </div>
    </div>
  );
}

const SITE_URL = "https://key-stel.com";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "KEY-STEL",
      alternateName: "Keystel",
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/favicon.png`,
      telephone: "+233541954924",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+233541954924",
        contactType: "customer support",
      },
      sameAs: [
        "https://www.instagram.com/keystel_gh",
        "https://wa.me/keystel",
      ],
    },
    {
      "@type": "HomeGoodsStore",
      name: "KEY-STEL Kasoa",
      parentOrganization: { "@id": `${SITE_URL}/#org` },
      telephone: "+233541954924",
      hasMap: "https://goo.gl/maps/WiWuvqDbzgc5dUYA9",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Near Nurses, Obom Road",
        addressLocality: "Kasoa",
        addressRegion: "Central Region",
        addressCountry: "GH",
      },
    },
  ],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // All dashboard-managed content (products, images, categories, social links) loads here once and is
  // shared by every page, the header/footer and the cart.
  loader: ({ context }) => context.queryClient.fetchQuery(storefrontQuery),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "KEY-STEL (Keystel) | Security, Entrance & Interior Doors in Ghana" },
      {
        name: "description",
        content:
          "KEY-STEL (Keystel) sells washroom, interior, pivot, fire exit and heavy duty doors in Ghana. Visit our Kasoa showroom. Your Secured Partner.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "KEY-STEL" },
      { property: "og:title", content: "KEY-STEL (Keystel) | Security, Entrance & Interior Doors in Ghana" },
      { property: "og:description", content: "Quality doors in Ghana. Visit our Kasoa showroom." },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: `${SITE_URL}/favicon.png` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800;900&family=Manrope:wght@400;500;600;700;800&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(structuredData),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  // Phone, WhatsApp, email and address come from the admin dashboard's Settings; apply them before any child renders.
  applySettings((Route.useLoaderData() as Storefront).settings);
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <Header />
        <main className="min-h-[60vh]"><Outlet /></main>
        <Footer />
        <Toaster position="bottom-right" />
      </StoreProvider>
    </QueryClientProvider>
  );
}