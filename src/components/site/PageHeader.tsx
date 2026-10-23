import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealWords } from "@/components/site/TextReveal";
export function PageHeader({ eyebrow, title, children, image }: { eyebrow?: string; title: string; children?: ReactNode; image?: string | undefined }) {
  const photo = Boolean(image);
  return (
    <section className={`page-heading border-b ${photo ? "page-heading-photo" : "bg-surface"}`}>
      {photo && image && (
        <div className="page-heading-media" aria-hidden="true">
          <img src={image} alt="" />
          <span className="page-heading-scrim" />
        </div>
      )}
      <div className="container-x py-10 sm:py-14">
        <div className="mb-6 flex items-center justify-between">
          <Reveal delay={0.05}><p className="eyebrow">{eyebrow || "KEY-STEL"}</p></Reveal>
          <Link to="/shop" className="page-heading-link hidden items-center gap-2 text-xs text-muted-foreground sm:flex">The door collection<ArrowUpRight className="size-3 text-primary" /></Link>
        </div>
        <RevealWords as="h1" className="page-title font-bold" text={title} />
        <Reveal delay={0.25}>{children && <div className={`mt-5 max-w-xl text-sm leading-7 ${photo ? "text-white/75" : "text-muted-foreground"}`}>{children}</div>}</Reveal>
      </div>
    </section>
  );
}
export function Prose({ children }: { children: ReactNode }) {
  return <div className="container-x max-w-3xl py-14 space-y-6 text-sm text-foreground/85 leading-8 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold">{children}</div>;
}
