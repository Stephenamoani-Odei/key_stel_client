import { createFileRoute } from "@tanstack/react-router";
import { Eye, ShieldCheck } from "lucide-react";
import { PageHeader, Prose } from "@/components/site/PageHeader";
import { Reveal, RevealWords } from "@/components/site/TextReveal";
import heroWhite from "@/assets/hero-door-white.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "About KEY-STEL — KEY-STEL" },
      { name: "description", content: "KEY-STEL is a dealer in security, entrance and interior doors in Ghana — our mission, vision and how we work." },
      { property: "og:title", content: "About KEY-STEL — KEY-STEL" },
      { property: "og:description", content: "KEY-STEL is a dealer in security, entrance and interior doors in Ghana — our mission, vision and how we work." },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="KEY-STEL" title="About KEY-STEL" image={heroWhite} />

      <div className="container-x">
        <div className="about-purpose">
          <Reveal>
            <section className="about-panel">
              <p className="about-panel-label"><ShieldCheck className="size-3.5" />Our mission</p>
              <RevealWords as="h2" text="Secure doors, fitted right." />
              <p>To help homes and businesses across Ghana feel safe and look their best — by supplying genuine security, entrance and interior doors, guiding you to the right type and size, and confirming every detail with you before delivery.</p>
            </section>
          </Reveal>
          <Reveal delay={0.12}>
            <section className="about-panel">
              <p className="about-panel-label"><Eye className="size-3.5" />Our vision</p>
              <RevealWords as="h2" text="The door people trust." />
              <p>To become the name Ghanaians think of first when they need a door — known from Kasoa to Kwabenya for strength, finish and service that keeps the promise of Your Secured Partner.</p>
            </section>
          </Reveal>
        </div>
      </div>

      <Prose>
        <p className="text-lg">KEY-STEL is a dealer in <b>security, entrance and interior doors</b>. Our goal is simple: help homes and businesses feel secure and look their best.</p>
        <h2>What we offer</h2>
        <p>Steel security and entrance doors, plus interior and utility doors — with custom sizes and quotes available for larger projects.</p>
        <h2>Your Secured Partner</h2>
        <p>From choosing the right door to planning your entrance, we work with you to find products that fit your space and budget.</p>
      </Prose>
    </>
  ),
});
