import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown, ChevronRight, Heart, Phone, Search, X } from "lucide-react";
import cartIcon from "@/assets/cart-icon.png";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { Brand } from "./Brand";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { useCatalog } from "@/lib/storefront";
import { useScrollNav } from "@/lib/useScrollNav";
import { ScrollNav } from "./ScrollNav";
import { SITE, telLink } from "@/lib/site";

const nav = [{ to: "/", label: "Home" }, { to: "/about", label: "About" }, { to: "/shop", label: "Shop doors" }, { to: "/contact", label: "Contact us" }] as const;

export function Header() {
  const { count, wishlist } = useStore();
  const { categories } = useCatalog();
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const catsRef = useRef<HTMLButtonElement>(null);
  const catsScroll = useScrollNav("y");
  const [q, setQ] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!open && !searchOpen && !catsOpen) return;
    const previous = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    const close = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setSearchOpen(false); setCatsOpen(false); } };
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", close); };
  }, [open, searchOpen, catsOpen]);
  useEffect(() => {
    if (!catsOpen) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (catsRef.current?.contains(target) || target.closest("[data-cats-sheet]")) return;
      setCatsOpen(false);
    };
    document.addEventListener("click", onDown);
    return () => document.removeEventListener("click", onDown);
  }, [catsOpen]);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".drawer-anim", { y: 16, opacity: 0, duration: 0.45, stagger: 0.05, delay: 0.12, ease: "power3.out" });
    });
    return () => ctx.revert();
  }, [open]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setOpen(false); setSearchOpen(false);
    navigate({ to: "/shop", search: { q: q.trim() || undefined } });
  };
  return (
    <header className="site-header sticky top-0 z-40 bg-background">
      <div className="container-x navbar-row flex items-center justify-between gap-4">
        <Link to="/" aria-label="KEY-STEL home" className="shrink-0"><Brand /></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          {nav.map(n => <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }} className="nav-item" activeProps={{ className: "nav-item-active" }}>{n.label}</Link>)}
          <button ref={catsRef} type="button" onClick={() => setCatsOpen(v => !v)} aria-expanded={catsOpen} aria-controls="nav-categories" className={`nav-item inline-flex items-center gap-1.5 ${catsOpen ? "nav-item-active" : ""}`}>
            Categories <ChevronDown className={`size-3.5 transition-transform duration-300 ${catsOpen ? "rotate-180" : ""}`} />
          </button>
        </nav>
        <div className="flex items-center gap-1 sm:gap-3">
          <button type="button" onClick={() => setSearchOpen(!searchOpen)} aria-label={searchOpen ? "Close search" : "Open search"} aria-expanded={searchOpen} title="Search doors" className="search-trigger">{searchOpen ? <X /> : <Search />}<span className="hidden sm:inline">{searchOpen ? "Close" : "Search"}</span></button>
          <Button asChild variant="ghost" size="icon" className="relative hidden text-primary sm:inline-flex"><Link to="/wishlist" aria-label="Wishlist" title="Wishlist"><Heart />{wishlist.length > 0 && <span className="nav-count">{wishlist.length}</span>}</Link></Button>
          <Button asChild variant="ghost" className="relative gap-2 px-2 text-primary"><Link to="/cart" aria-label={`Cart, ${count} items`} title="Your cart"><img src={cartIcon} alt="" width={24} height={24} className="size-6 shrink-0" />{count > 0 && <span className="cart-count">{count}</span>}</Link></Button>
          <Button asChild variant="outline" className="ml-2 hidden h-9 rounded-full border-primary px-4 text-xs text-primary xl:inline-flex"><Link to="/quote">Get a quote <ArrowUpRight /></Link></Button>
          <button type="button" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)} className="menu-toggle lg:hidden">
            <span className="menu-toggle-lines" aria-hidden="true"><span /><span /><span /></span>
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>
      </div>
      {searchOpen && <div className="search-sheet animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="container-x flex flex-col gap-4 py-6">
          <form onSubmit={submit} className="search-field">
            <span className="search-field-label">Search</span>
            <input autoFocus value={q} onChange={e => setQ(e.target.value)} aria-label="Search products" placeholder="Search doors by name…" className="search-input" />
            {q.length > 0 && <button type="button" className="search-clear" aria-label="Clear search" onClick={() => setQ("")}><X className="size-4" /></button>}
            <button type="submit" className="search-go" aria-label="Search doors"><span className="hidden sm:inline">Search</span><ArrowUpRight className="size-5" /></button>
          </form>
          <div className="search-meta">
            <div className="search-quick">
              <span className="search-quick-label">Popular</span>
              {categories.slice(0, 6).map(c => <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} onClick={() => setSearchOpen(false)} className="search-chip">{c.name}</Link>)}
            </div>
            <span className="search-hint">Press <kbd>Esc</kbd> to close</span>
          </div>
        </div>
      </div>}
      {catsOpen && <div id="nav-categories" data-cats-sheet className="cats-sheet animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="container-x py-6">
          <div className="cats-sheet-top">
            <p className="cats-sheet-label">Door categories</p>
            <ScrollNav axis="y" label="door categories" canPrev={catsScroll.canPrev} canNext={catsScroll.canNext} onPrev={catsScroll.scrollPrev} onNext={catsScroll.scrollNext} />
          </div>
          <div ref={catsScroll.setEl} className="cats-scroll">
            <div className="cats-grid">
              {categories.map(c => (
                <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} onClick={() => setCatsOpen(false)} className="cats-card">
                  <span className="cats-card-media">{c.image && <img src={c.image} alt="" width={56} height={72} loading="lazy" />}</span>
                  <span className="cats-card-body">
                    <span className="cats-card-name">{c.name}</span>
                    <span className="cats-card-desc">{c.description}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <Link to="/shop" onClick={() => setCatsOpen(false)} className="cats-sheet-all">Browse all doors <ArrowUpRight className="size-4" /></Link>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Payment on delivery{SITE.phone ? ` — ${SITE.phone}` : ""}</span>
          </div>
        </div>
      </div>}
      {open && createPortal(<div id="mobile-menu" className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div className="drawer-panel absolute right-0 top-0 flex h-full flex-col bg-background animate-in slide-in-from-right duration-300">
          <div className="drawer-anim flex h-[68px] shrink-0 items-center justify-between border-b px-4">
            <Brand compact />
            <Button ref={closeRef} variant="ghost" size="icon" aria-label="Close menu" onClick={() => setOpen(false)} className="drawer-close text-primary"><X /></Button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
            <form onSubmit={submit} className="drawer-search drawer-anim mt-5">
              <Search className="size-4 shrink-0 text-primary" />
              <input value={q} onChange={e => setQ(e.target.value)} aria-label="Search products" placeholder="Search doors…" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
              <button type="submit" aria-label="Search doors" className="drawer-search-go"><ArrowUpRight className="size-4" /></button>
            </form>
            <p className="drawer-anim drawer-label mt-8">Browse</p>
            <nav aria-label="Mobile navigation" className="drawer-anim">
              {nav.map((n, i) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="drawer-link"><span className="drawer-index">0{i + 1}</span>{n.label}<ChevronRight className="ml-auto size-4 shrink-0 text-primary" /></Link>)}
            </nav>
            <div className="drawer-anim mt-7 pt-1">
              <button type="button" aria-expanded={catOpen} aria-controls="drawer-categories" onClick={() => setCatOpen(v => !v)} className="drawer-cat-head">
                <span className="drawer-label">Categories</span>
                <span className="drawer-cat-count">{categories.length} door types</span>
                <ChevronDown className={`ml-auto size-4 shrink-0 text-primary transition-transform duration-300 ${catOpen ? "rotate-180" : ""}`} />
              </button>
              <div id="drawer-categories" className={`drawer-fold ${catOpen ? "is-open" : ""}`}>
                <div>
                  <ul className="pb-1 pt-2">
                    {categories.map(c => <li key={c.slug}>
                      <Link to="/category/$slug" params={{ slug: c.slug }} onClick={() => setOpen(false)} className="drawer-cat-row">
                        {c.image ? <img src={c.image} alt="" width={40} height={50} className="drawer-cat-thumb" /> : <span className="drawer-cat-thumb" aria-hidden="true" />}
                        <span className="drawer-cat-name min-w-0 flex-1 truncate text-[13px] font-semibold">{c.name}</span>
                        <ChevronRight className="size-4 shrink-0 text-primary" />
                      </Link>
                    </li>)}
                  </ul>
                </div>
              </div>
            </div>
            <div className="drawer-anim mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t pt-5 text-sm font-semibold">
              <Link to="/wishlist" onClick={() => setOpen(false)} className="flex items-center gap-2"><Heart className="size-4 text-primary" />Wishlist <span className="text-muted-foreground">({wishlist.length})</span></Link>
              <Link to="/cart" onClick={() => setOpen(false)} className="flex items-center gap-2"><img src={cartIcon} alt="" width={16} height={16} className="size-4 shrink-0" />Cart <span className="text-muted-foreground">({count})</span></Link>
            </div>
          </div>
          <div className="drawer-anim shrink-0 border-t p-4">
            {SITE.phone && <a href={telLink(SITE.phone)} className="drawer-order-line mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"><Phone className="size-3.5 shrink-0 text-primary" />Payment on delivery — order on {SITE.phone}</a>}
            <Button asChild className="drawer-cta h-12 w-full rounded-none"><Link to="/quote" onClick={() => setOpen(false)}>Request a quote <ArrowUpRight /></Link></Button>
          </div>
        </div>
      </div>, document.body)}
    </header>
  );
}
