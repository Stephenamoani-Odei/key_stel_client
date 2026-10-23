import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Prose } from "@/components/site/PageHeader";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Privacy Policy — KEY-STEL" },
      { name: "description", content: "How KEY-STEL handles your personal information." },
      { property: "og:title", content: "Privacy Policy — KEY-STEL" },
      { property: "og:description", content: "How KEY-STEL handles your personal information." },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="KEY-STEL" title="Privacy Policy" />
      <Prose>
        <p className="rounded-lg bg-accent p-4 text-accent-foreground">This policy is a draft and will be updated before launch.</p>
        <h2>Information we collect</h2>
        <p>When you place an order or send an enquiry we collect the details you provide, such as your name, phone, email and delivery address.</p>
        <h2>How we use it</h2>
        <p>We use your information only to process orders, respond to enquiries and arrange delivery. We do not sell your information.</p>
        <h2>Your browser</h2>
        <p>Your cart and wishlist are stored on your device so they are kept between visits.</p>
      </Prose>
    </>
  ),
});
