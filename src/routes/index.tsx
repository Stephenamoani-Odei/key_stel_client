import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, DoorOpen, MessageCircle, ShieldCheck } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { pickShowcase } from "@/lib/catalog";
import { useCatalog } from "@/lib/storefront";
import { CatalogImage } from "@/components/site/CatalogImage";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { SITE, telLink } from "@/lib/site";
import { Reveal, RevealImage, RevealWords } from "@/components/site/TextReveal";
import { useScrollNav } from "@/lib/useScrollNav";
import { ScrollNav } from "@/components/site/ScrollNav";
import heroDoor from "@/assets/hero-door.jpg";
import { MOTION } from "@/lib/motion";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "KEY-STEL — Security & Interior Doors in Ghana" },
    { name: "description", content: "Explore KEY-STEL's security, entrance and interior door collections. Your Secured Partner in Ghana." },
    { property: "og:title", content: "KEY-STEL — Doors that make an entrance" },
    { property: "og:description", content: "Security, entrance and interior doors. Your Secured Partner." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Home,
});
function Home() {
  const { products, categories } = useCatalog();
  // Featured doors lead, then the newest — chosen in the dashboard, not in code.
  const showcase = pickShowcase(products, 4, { photoOnly: false });
  const { setEl: setRailEl, canPrev, canNext, scrollPrev, scrollNext } = useScrollNav("x");
  const collectionRailRef = useRef<HTMLDivElement>(null);
  const setCollectionRail = useCallback((element: HTMLDivElement | null) => {
    collectionRailRef.current = element;
    setRailEl(element);
  }, [setRailEl]);

  useEffect(() => {
    const element = collectionRailRef.current;
    if (!element || categories.length < 2) return;

    let pointerDown = false;
    const pause = () => { pointerDown = true; };
    const resume = () => { pointerDown = false; };
    element.addEventListener("pointerdown", pause);
    element.addEventListener("pointerup", resume);
    element.addEventListener("pointercancel", resume);

    const interval = window.setInterval(() => {
      if (
        window.matchMedia("(min-width: 640px)").matches ||
        document.hidden ||
        element.matches(":hover") ||
        element.contains(document.activeElement) ||
        pointerDown
      ) return;

      const firstTile = element.querySelector<HTMLElement>(".collection-tile");
      if (!firstTile) return;
      const gap = Number.parseFloat(window.getComputedStyle(element).columnGap) || 0;
      const step = firstTile.getBoundingClientRect().width + gap;
      const atEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 4;
      const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      element.scrollTo({ left: atEnd ? 0 : element.scrollLeft + step, behavior });
    }, 3000);

    return () => {
      window.clearInterval(interval);
      element.removeEventListener("pointerdown", pause);
      element.removeEventListener("pointerup", resume);
      element.removeEventListener("pointercancel", resume);
    };
  }, [categories.length]);

  return (<>
    <Hero />
    <div className="home-highlights border-b bg-background"><div className="container-x grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">{[{ i: ShieldCheck, t: "Security & entrance doors", s: "For homes and businesses" }, { i: DoorOpen, t: "Interior door collections", s: "Bedroom to washroom" }, { i: MessageCircle, t: "Let's find your door", s: `Order enquiries: ${SITE.phone}` }].map(({ i: I, t, s }, i) => <Reveal key={t} delay={i * 0.08} className="flex items-center gap-4 py-6 sm:justify-center"><I className="size-6 shrink-0 text-primary"/><div><p className="text-sm font-bold">{t}</p><p className="mt-1 text-xs text-muted-foreground">{s}</p></div></Reveal>)}</div></div>
    <section className="container-x section-space">
      <div className="section-heading"><div><Reveal delay={0.05}><p className="eyebrow">THE COLLECTIONS / 01</p></Reveal><RevealWords text="Find your kind of door." /></div><div className="flex flex-wrap items-center gap-5"><Reveal delay={0.2}><Link to="/shop" className="text-link">Explore all doors <ArrowUpRight className="size-4"/></Link></Reveal><ScrollNav label="door collections" canPrev={canPrev} canNext={canNext} onPrev={scrollPrev} onNext={scrollNext}/></div></div>
      <Reveal ref={setCollectionRail} staggerChildren=".collection-tile" className="collection-grid">{categories.map((c, i) => <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="collection-tile group"><div className="collection-photo"><CatalogImage src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/><span className="collection-index">0{i + 1}</span></div><div className="flex items-start justify-between gap-3 border-b py-4"><h3 className="text-sm font-bold">{c.name}</h3><ArrowUpRight className="size-4 shrink-0 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"/></div></Link>)}</Reveal>
    </section>
    {showcase.length > 0 && <section className="bg-surface section-space"><div className="container-x"><div className="section-heading"><div><Reveal delay={0.05}><p className="eyebrow">A CLOSER LOOK / 02</p></Reveal><RevealWords text="Doors with character." /></div><Reveal delay={0.2}><Link to="/shop" className="text-link">View the collection <ArrowUpRight className="size-4"/></Link></Reveal></div><div className="grid grid-cols-2 gap-x-4 gap-y-6 min-[620px]:grid-cols-3 min-[900px]:grid-cols-4">{showcase.map((p, i) => <Reveal key={p.id} delay={i * MOTION.stagger.default} duration={MOTION.duration.product}><ProductCard p={p}/></Reveal>)}</div></div></section>}
    <section className="editorial-band"><RevealImage className="editorial-image"><img src={heroDoor} alt="Modern black entrance door at sunset" loading="lazy" className="h-full w-full object-cover"/></RevealImage><div className="editorial-copy"><Reveal delay={0.05}><p className="eyebrow">THE KEY-STEL APPROACH</p></Reveal><RevealWords text={"A door is more than\na way in."} /><Reveal delay={0.2}><p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">It's the first impression of your home. The boundary of your personal space. From heavy duty steel to classic finishes, discover a door that belongs in your building.</p></Reveal><Reveal delay={0.3}><Button asChild variant="outline" className="mt-8 h-12 rounded-none border-primary px-6 text-primary"><Link to="/about">Meet KEY-STEL <ArrowUpRight /></Link></Button></Reveal></div></section>
    <section className="container-x section-space"><div className="section-heading"><div><Reveal delay={0.05}><p className="eyebrow">YOUR NEXT ENTRANCE / 03</p></Reveal><RevealWords text="Let's talk doors." /></div></div><div className="home-steps grid gap-8 border-t pt-8 md:grid-cols-3">{[{ n: "01", t: "Find your style", d: "Browse our door collections for your home or business.", to: "/shop", l: "Browse doors" }, { n: "02", t: "Discuss your project", d: "Talk to our team about your door, dimensions and availability.", to: "/quote", l: "Request a quote" }, { n: "03", t: "Connect with KEY-STEL", d: "Contact our team for pricing and delivery arrangements.", to: "/contact", l: "Contact us" }].map((s, i) => <Reveal key={s.n} delay={i * 0.1}><span className="text-xs font-semibold text-primary">{s.n}</span><h3 className="mt-5 text-xl font-bold">{s.t}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{s.d}</p><Link to={s.to} className="text-link mt-6">{s.l}<ArrowRight className="size-4"/></Link></Reveal>)}</div></section>
    <section className="contact-band bg-primary text-primary-foreground"><div className="container-x flex flex-col justify-between gap-8 py-12 md:flex-row md:items-center"><div><Reveal delay={0.05}><p className="mb-3 text-xs font-semibold uppercase">YOUR SECURED PARTNER.</p></Reveal><RevealWords text="The right door starts here." className="text-3xl font-bold text-primary-foreground md:text-4xl" /></div>{SITE.phone && <Reveal delay={0.2}><a href={telLink(SITE.phone)} className="flex items-center gap-5 border-b border-primary-foreground/50 pb-3 font-display text-2xl font-semibold">{SITE.phone}<ArrowUpRight className="size-6"/></a></Reveal>}</div></section>
  </>);
}
