import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail } from "lucide-react";
import { Brand } from "./Brand";
import { useCatalog } from "@/lib/storefront";
import { SITE, telLink } from "@/lib/site";
import { SocialLinks } from "@/components/site/SocialLinks";
import footerBackdrop from "@/assets/footer-backdrop.jpg";

export function Footer() {
  const { categories } = useCatalog();
  return <footer className="site-footer bg-ink text-ink-foreground">
    <div className="footer-media" aria-hidden="true"><img src={footerBackdrop} alt="" loading="lazy" width={1920} height={1088} /><span className="footer-scrim" /></div>
    <div className="container-x relative z-10 grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div><Link to="/" aria-label="KEY-STEL home"><Brand light /></Link><p className="mt-6 max-w-xs text-sm leading-6 text-ink-foreground/60">Security, entrance and interior doors.<br/>For the spaces that matter.</p></div>
      <div><h3 className="footer-heading">Our collections</h3><div className="footer-links">{categories.map(c => <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }}>{c.short}</Link>)}</div></div>
      <div><h3 className="footer-heading">KEY-STEL</h3><div className="footer-links"><Link to="/about">About us</Link><Link to="/contact">Contact & locations</Link><Link to="/quote">Request a quote</Link><Link to="/faq">Questions & answers</Link><Link to="/delivery-returns">Delivery & returns</Link></div></div>
      <div><h3 className="footer-heading">Let's talk doors</h3>{SITE.phone && <a href={telLink(SITE.phone)} className="flex items-center gap-2 text-xl font-semibold">{SITE.phone}<ArrowUpRight className="size-4 text-primary"/></a>}{SITE.email && <a href={`mailto:${SITE.email}`} className="mt-3 flex items-center gap-2 text-sm font-medium hover:text-primary"><Mail className="size-4 shrink-0 text-primary" /><span>{SITE.email}</span></a>}<p className="mt-3 text-xs leading-6 text-ink-foreground/60">Contact our team for orders<br/>and product enquiries.</p><Link to="/contact" className="mt-5 inline-flex items-center gap-2 text-sm text-ink-foreground">Visit our branches<ArrowUpRight className="size-4 text-primary"/></Link><SocialLinks tone="dark" label="Follow KEY-STEL" className="footer-social" /></div>
    </div>
    <div className="relative z-10 border-t border-ink-foreground/15"><div className="container-x flex flex-wrap items-center justify-between gap-4 py-6 text-[11px] text-ink-foreground/50"><span>© {new Date().getFullYear()} KEY-STEL. Your Secured Partner.</span><span className="order-last w-full text-center sm:order-none sm:w-auto">Powered by <span className="font-semibold text-ink-foreground/80">DataLens</span></span><div className="flex gap-6"><Link to="/privacy">Privacy policy</Link><Link to="/terms">Terms & conditions</Link></div></div></div>
  </footer>;
}
