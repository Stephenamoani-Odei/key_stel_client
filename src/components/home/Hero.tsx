import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Pause, Play, Phone } from "lucide-react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { SITE, telLink } from "@/lib/site";
import { SocialLinks } from "@/components/site/SocialLinks";
import { useCatalog } from "@/lib/storefront";
import heroDoor from "@/assets/hero-door.jpg";
import heroBackdrop from "@/assets/hero-door-backdrop.jpg";
import heroSteel from "@/assets/hero-door-steel.jpg";
import heroBronze from "@/assets/hero-door-bronze.jpg";
import heroWhite from "@/assets/hero-door-white.jpg";

// Editorial backdrops (generated scenes, not inventory). The door photos in the intro slideshow are
// NOT here: they come from the products the admin dashboard marks as featured.
const MAIN_BACKGROUNDS = [
  { src: heroBackdrop, alt: "Walnut slat security door set into a dark wall" },
  { src: heroSteel, alt: "Graphite double security door in a contemporary entrance" },
  { src: heroBronze, alt: "Bronze entrance door with decorative glass panels" },
  { src: heroWhite, alt: "White entrance door with vertical walnut inlays" },
];

const pad = (n: number) => String(n).padStart(2, "0");

const MAIN_HERO_DELAY_MS = 20_000;

export function Hero() {
  const { categories } = useCatalog();
  const slides = MAIN_BACKGROUNDS.map(background => ({ ...background, label: background.alt }));
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mainHero, setMainHero] = useState(false);
  const root = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const backgroundRefs = useRef<(HTMLImageElement | null)[]>([]);
  const previous = useRef(0);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(".hero-reveal", { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.13, ease: "power3.out" });
      }, root);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);

  useEffect(() => {
    if (count < 2 || paused || mainHero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setActive(i => (i + 1) % count), 6000);
    return () => window.clearTimeout(t);
  }, [active, paused, mainHero, count]);

  useEffect(() => {
    const outgoing = imageRefs.current[previous.current];
    const incoming = imageRefs.current[active];
    if (incoming && outgoing && previous.current !== active) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.killTweensOf(imageRefs.current.filter(Boolean));
      gsap.set(imageRefs.current.filter(Boolean), { zIndex: 0 });
      gsap.set(outgoing, { zIndex: 1 });
      gsap.set(incoming, { zIndex: 2 });
      gsap.fromTo(incoming, { clipPath: "inset(0 0 0 100%)", xPercent: 0 }, { clipPath: "inset(0 0 0 0%)", duration: reduced ? 0 : 1.1, ease: "power4.inOut" });
      gsap.to(outgoing, { xPercent: -8, duration: reduced ? 0 : 1.1, ease: "power4.inOut" });
    }
    previous.current = active;
  }, [active]);

  // After 20 seconds the main hero pops in over the intro hero and stays.
  useEffect(() => {
    const t = window.setTimeout(() => setMainHero(true), MAIN_HERO_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mainHero || !mainRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(mainRef.current, { autoAlpha: 1 });
        return;
      }
      const tl = gsap.timeline();
      tl.fromTo(mainRef.current,
        { autoAlpha: 0, clipPath: "inset(100% 0% 0% 0%)" },
        { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power4.inOut" })
        .fromTo(".main-hero-reveal", { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: "power3.out" }, "-=0.3")
        .fromTo(".main-hero-word", { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.07, ease: "power4.out" }, "-=0.7")
        .fromTo(".main-hero-chip", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }, "-=0.5")
        .fromTo(".main-hero-badge", { scale: 0, rotate: -12 }, { scale: 1, rotate: 0, duration: 0.7, ease: "back.out(2)" }, "-=0.35");
      // Ken Burns on the backdrop, added last so it never delays the copy above.
      tl.fromTo(".main-hero-bg-first", { scale: 1.18 }, { scale: 1.06, duration: 2.4, ease: "power2.out" }, 0.2);
    }, root);
    return () => ctx.revert();
  }, [mainHero]);

  useEffect(() => {
    if (!mainHero) return;
    const backgrounds = backgroundRefs.current.filter((image): image is HTMLImageElement => image !== null);
    const firstBackground = backgrounds[0];
    if (backgrounds.length !== MAIN_BACKGROUNDS.length || !firstBackground) return;
    const ctx = gsap.context(() => {
      gsap.set(backgrounds, { autoAlpha: 0, zIndex: 0 });
      gsap.set(firstBackground, { autoAlpha: 1, zIndex: 1 });
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cycle = gsap.timeline({ repeat: -1 });
      backgrounds.forEach((outgoing, index) => {
        const incoming = backgrounds[(index + 1) % backgrounds.length];
        if (!incoming) return;
        const start = index * 8 + 7;
        cycle.set(outgoing, { zIndex: 1 }, start)
          .set(incoming, { autoAlpha: 1, zIndex: 2, xPercent: 0, scale: 1.06, clipPath: "inset(0 0 0 100%)" }, start)
          .to(incoming, { clipPath: "inset(0 0 0 0%)", duration: 1.25, ease: "power4.inOut" }, start)
          .to(outgoing, { xPercent: -8, duration: 1.25, ease: "power4.inOut" }, start)
          .set(outgoing, { autoAlpha: 0, zIndex: 0, xPercent: 0 }, start + 1.25);
      });
    }, mainRef);
    return () => ctx.revert();
  }, [mainHero]);

  useEffect(() => () => { gsap.killTweensOf(imageRefs.current.filter(Boolean)); }, []);

  return (
    <section ref={root} className={`hero-stage bg-background relative overflow-hidden ${mainHero ? "hero-stage-main-active" : ""}`}>
      {MAIN_BACKGROUNDS.map(background => <img key={background.src} src={background.src} alt="" aria-hidden="true" className="hidden" />)}
      <div className="container-x hero-layout">
        <div className="hero-copy">
          <p className="hero-reveal eyebrow mb-5">YOUR SECURED PARTNER.</p>
          <h1 className="hero-reveal hero-heading font-display">KEY-STEL doors.<br /><span>Security meets<br />distinctive style.</span></h1>
          <p className="hero-reveal hero-description text-muted-foreground">An entrance that feels like you. Explore security and interior doors for your home or business.</p>
          <div className="hero-reveal mt-6"><Button asChild className="hero-shop-button h-11 rounded-full pl-6 pr-2 text-xs"><Link to="/shop">View all doors <span className="ml-5 grid size-7 place-items-center rounded-full bg-primary-foreground text-primary"><ArrowUpRight className="size-4" /></span></Link></Button></div>
          <div className="hero-reveal hero-feature-row">
            <Link to="/shop" className="hero-feature group">
              <div className="hero-feature-image overflow-hidden rounded-lg bg-surface"><img src={heroDoor} alt="Modern black entrance door" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
              <p className="mt-3 flex items-center justify-between gap-3 text-xs font-bold"><span className="line-clamp-1">Find your next door</span> <ArrowUpRight className="size-4 shrink-0 text-primary" /></p>
              <p className="mt-1 text-[10px] text-muted-foreground">Explore the collection</p>
            </Link>
            <div className="hero-quote-wrap"><p className="hero-quote-label text-muted-foreground">YOUR NEXT ENTRANCE</p><Button asChild className="hero-quote-button rounded-full"><Link to="/quote"><ArrowUpRight className="size-5" /><span>Let’s talk<br />doors</span></Link></Button><p className="hero-quote-label text-muted-foreground">REQUEST A QUOTE</p></div>
          </div>
          <SocialLinks label="Follow KEY-STEL" className="hero-reveal hero-social" />
        </div>
        <div className="hero-media-column">
          <div className="hero-media relative isolate overflow-hidden rounded-lg bg-surface">{slides.map((s, i) => <img key={s.src} ref={el => { imageRefs.current[i] = el; }} src={s.src} alt={s.alt} className={`hero-photo absolute inset-0 h-full w-full ${i === 0 ? "hero-photo-first" : ""}`} />)}{count > 1 && <span className="hero-image-number absolute bottom-4 left-4 z-10 rounded-full bg-background/90 px-3 py-1 text-[10px] font-semibold">{pad(active + 1)} / {pad(count)}</span>}</div>
          {count > 0 && (
            <div className="hero-controls flex items-center justify-between gap-3">
              <p className="text-[11px] text-muted-foreground" aria-live="polite">{slides[active]?.label}</p>
              {count > 1 && <>
                <div className="flex items-center gap-1">{slides.map((s, i) => <Button key={s.src} variant="ghost" size="icon" className="hero-dot-button h-8 w-7" onClick={() => setActive(i)} aria-label={`Show slide ${i + 1}`} aria-pressed={active === i}><span className={`hero-dot ${active === i ? "hero-dot-active" : ""}`} /></Button>)}</div>
                <div className="flex items-center"><Button variant="ghost" size="icon" className="size-8 text-primary" onClick={() => setActive(i => (i + count - 1) % count)} aria-label="Previous slide"><ArrowLeft className="size-4" /></Button><Button variant="ghost" size="icon" className="size-8 text-primary" onClick={() => setPaused(!paused)} aria-label={paused ? "Play slideshow" : "Pause slideshow"} title={paused ? "Play slideshow" : "Pause slideshow"}>{paused ? <Play className="size-3" /> : <Pause className="size-3" />}</Button><Button variant="ghost" size="icon" className="size-8 text-primary" onClick={() => setActive(i => (i + 1) % count)} aria-label="Next slide"><ArrowRight className="size-4" /></Button></div>
              </>}
            </div>
          )}
        </div>
      </div>

      {mainHero && (
        <div ref={mainRef} className="main-hero absolute inset-0 z-20 overflow-hidden text-white" style={{ visibility: "hidden" }}>
          {MAIN_BACKGROUNDS.map((background, index) => (
            <img key={background.src} ref={element => { backgroundRefs.current[index] = element; }} src={background.src} alt={background.alt} width={1536} height={1024} className={`main-hero-bg absolute inset-0 h-full w-full object-cover ${index === 0 ? "main-hero-bg-first" : ""}`} />
          ))}
          <div className="main-hero-scrim absolute inset-0 z-[3]" aria-hidden="true" />
          <div className="main-hero-content container-x relative z-[4] flex h-full flex-col justify-center gap-8 py-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="main-hero-reveal eyebrow mb-6 text-white/60">KEY-STEL — YOUR SECURED PARTNER.</p>
              <h2 className="main-hero-title font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
                <span className="block overflow-hidden pb-1"><span className="main-hero-word block">Doors that</span></span>
                <span className="block overflow-hidden pb-1"><span className="main-hero-word block">guard. Doors</span></span>
                <span className="block overflow-hidden pb-1"><span className="main-hero-word block">that <span className="text-primary">impress.</span></span></span>
              </h2>
              <p className="main-hero-description main-hero-reveal mt-6 max-w-md text-sm leading-7 text-white/70">
                Every kind of security door for your home, shop or office — ordered today, paid for on delivery.
              </p>
              <div className="main-hero-categories mt-6 flex flex-wrap gap-2">
                {categories.slice(0, 6).map((c, i) => (
                  <span key={c.slug} className={`main-hero-chip rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-medium text-white/80 backdrop-blur-sm sm:px-3.5 sm:text-[11px] ${i === 3 ? "hidden sm:inline-flex" : i > 3 ? "hidden md:inline-flex" : ""}`}>{c.short}</span>
                ))}
              </div>
              <div className="main-hero-actions main-hero-reveal mt-8 flex flex-wrap items-center gap-3">
                <Button asChild className="h-12 rounded-full px-7 text-xs"><Link to="/shop">Shop all doors <ArrowUpRight className="size-4" /></Link></Button>
                {SITE.phone && <Button asChild variant="outline" className="h-12 rounded-full border-white/25 bg-white/5 px-7 text-xs text-white backdrop-blur-sm hover:bg-white/15 hover:text-white">
                  <a href={telLink(SITE.phone)}><Phone className="size-4" /> Order: {SITE.phone}</a>
                </Button>}
                <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 sm:w-auto bg-primary/10 px-4 py-2.5 text-[11px] font-semibold text-white lg:hidden">
                  <Check className="size-3.5 text-primary" /> Payment on delivery
                </span>
              </div>
              <SocialLinks tone="dark" label="Follow KEY-STEL" className="main-hero-reveal main-hero-social" />
            </div>
          </div>
          <div className="main-hero-badge absolute bottom-24 right-20 z-[4] hidden size-28 place-items-center rounded-full bg-primary text-center text-[10px] font-bold leading-tight text-primary-foreground shadow-xl lg:grid">
            <span>PAYMENT ON<br />DELIVERY</span>
          </div>
        </div>
      )}
    </section>
  );
}
