import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import heroBronze from "@/assets/hero-door-bronze.jpg";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { BRANCHES, SITE, mapEmbed, mapLink, telLink, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Contact Us — KEY-STEL" },
      { name: "description", content: "Visit KEY-STEL in Kwabenya (main branch) or Kasoa, or call us about security, entrance and interior doors." },
      { property: "og:title", content: "Contact KEY-STEL" },
      { property: "og:description", content: "Two branches: Kwabenya (main) and Kasoa. Call or visit us." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const wa = whatsappLink("Hello KEY-STEL");
  return (
    <>
      <PageHeader eyebrow="LET’S TALK DOORS" title="Visit. Call. Connect." image={heroBronze}>Questions about a product, sizes or delivery? Visit a branch or send us a message.</PageHeader>

      <div className="container-x grid gap-10 py-12 md:grid-cols-2">
        {BRANCHES.map((b) => (
          <div key={b.name} className="contact-branch overflow-hidden border-b bg-card">
            <iframe
              title={`Map of KEY-STEL ${b.name} branch`}
              src={mapEmbed(b.mapQuery)}
              className="h-72 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="py-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black">{b.name} Branch</h2>
                {b.main && <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">Main branch</span>}
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-primary" />
                  <span>{b.area}</span>
                </div>
                <a href={telLink(b.phone)} className="flex items-center gap-3 font-semibold hover:text-primary">
                  <Phone className="h-5 w-5 shrink-0 text-primary" />
                  <span>{b.phone}</span>
                </a>
                <a href={mapLink(b.mapQuery)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-primary hover:underline">
                  Get directions <ArrowUpRight className="size-4"/>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="container-x grid gap-12 pb-12 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <h2 className="text-2xl font-black">Send us a message</h2>
          {SITE.email
            ? <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 font-semibold hover:text-primary"><Mail className="h-5 w-5 shrink-0 text-primary" /><span>{SITE.email}</span></a>
            : <p className="text-sm text-muted-foreground">Prefer to talk? Call either branch using the numbers above.</p>}
          {wa && <a href={wa} target="_blank" rel="noreferrer" className="btn btn-primary"><MessageCircle className="h-4 w-4" /> WhatsApp us</a>}
        </div>
        <EnquiryForm kind="contact" submitLabel="Send message" fields={[
          { name: "name", label: "Name", required: true },
          { name: "phone", label: "Phone", type: "tel", required: true },
          { name: "email", label: "Email", type: "email" },
          { name: "subject", label: "Subject" },
          { name: "message", label: "Message", textarea: true, required: true },
        ]} />
      </div>
    </>
  );
}
