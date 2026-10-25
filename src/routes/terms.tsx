import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/TextReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const sections = [
  {
    title: "Using this website",
    summary: "Use the website lawfully and provide accurate information when you contact us or order.",
    details: (
      <>
        <p>
          These terms apply when you browse the KEY-STEL website, send an enquiry, request a quote, or submit an
          order. By using the website, you agree to use its features responsibly and not to interfere with its
          operation, attempt unauthorised access, or submit information that is knowingly false or misleading.
        </p>
        <p className="mt-3">
          Please check that the contact and delivery details you submit are accurate and current. We may need to
          contact you to clarify information before proceeding with an order or enquiry.
        </p>
      </>
    ),
  },
  {
    title: "Products, descriptions, and availability",
    summary: "Product information and availability come from KEY-STEL and may change.",
    details: (
      <>
        <p>
          Product names, descriptions, photographs, displayed prices, and availability are provided to help you
          browse the current collection. Product information and stock can change. A product shown on the website
          is not guaranteed to remain available when you submit an order.
        </p>
        <p className="mt-3">
          Images are for product identification and display. Differences in screens, lighting, or image
          presentation may affect how colours and finishes appear. Please contact us if you need to confirm a
          product detail before ordering.
        </p>
      </>
    ),
  },
  {
    title: "Prices and delivery charges",
    summary: "Prices are displayed in Ghanaian cedi; delivery arrangements and charges are confirmed with you.",
    details: (
      <>
        <p>
          Prices shown on the website are for display and are subject to confirmation. They may change, and the
          current price and stock are checked when an order is submitted. If a price or availability has changed,
          we will let you know so you can decide whether to proceed.
        </p>
        <p className="mt-3">
          Delivery charges and arrangements are confirmed with you after you submit an order. The delivery address,
          location, and practical delivery requirements may affect those arrangements.
        </p>
      </>
    ),
  },
  {
    title: "Submitting and confirming an order",
    summary: "Submitting checkout details starts an order request; KEY-STEL contacts you to confirm it.",
    details: (
      <>
        <p>
          When you submit checkout, your order request is sent to KEY-STEL for handling. The database checks
          availability and current prices and calculates the order total. Submitting the form does not by itself
          mean that delivery, stock, or final order arrangements have been confirmed.
        </p>
        <p className="mt-3">
          KEY-STEL staff will contact you using the details provided to confirm the order, discuss any price or
          stock changes, agree delivery arrangements and charges, and explain the next steps. Please make sure
          you can be reached at the phone number you provide.
        </p>
      </>
    ),
  },
  {
    title: "Payment",
    summary: "The website does not accept online payment; payment is arranged with staff after order submission.",
    details: (
      <p>
        No card, mobile-money, or other online payment is collected through this website. After contacting you,
        KEY-STEL staff will confirm the order and arrange payment with you. Do not send payment details through
        website forms or enquiry messages.
      </p>
    ),
  },
  {
    title: "Changes, cancellations, and delivery",
    summary: "Contact KEY-STEL promptly if you need to change or cancel an order request.",
    details: (
      <>
        <p>
          If you need to change or cancel an order request, contact KEY-STEL as soon as possible using the details
          on the <Link to="/contact" className="font-semibold text-primary underline underline-offset-4">contact page</Link>.
          A request may already be under review or being arranged, so changes are not guaranteed until staff
          confirm them with you.
        </p>
        <p className="mt-3">
          Delivery timing, delivery charges, and related arrangements are discussed with you directly. For more
          information, see <Link to="/delivery-returns" className="font-semibold text-primary underline underline-offset-4">Delivery &amp; Returns</Link>.
        </p>
      </>
    ),
  },
  {
    title: "Enquiries and quotes",
    summary: "A quote request is an enquiry and is not a confirmed order.",
    details: (
      <p>
        Submitting a contact message or quote request lets KEY-STEL review your enquiry and contact you using the
        details you provide. A quote or discussion does not reserve stock or confirm an order unless KEY-STEL
        separately confirms the arrangements with you.
      </p>
    ),
  },
  {
    title: "Website operation and content",
    summary: "We aim to keep the website useful and current, but features or information may change.",
    details: (
      <p>
        We may update website content, product listings, or features as the store’s information changes. We aim
        to keep the website accessible, but cannot promise uninterrupted availability at all times. Nothing in
        these terms removes rights that cannot be excluded under applicable law.
      </p>
    ),
  },
  {
    title: "Questions about these terms",
    summary: "Contact KEY-STEL if you need help understanding an order or these terms.",
    details: (
      <p>
        If you have questions about these terms, a product, or an order request, please{" "}
        <Link to="/contact" className="font-semibold text-primary underline underline-offset-4">
          contact KEY-STEL
        </Link>
        .
      </p>
    ),
  },
];

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Terms & Conditions — KEY-STEL" },
      { name: "description", content: "Read the terms for browsing KEY-STEL, requesting quotes, and submitting orders." },
      { property: "og:title", content: "Terms & Conditions — KEY-STEL" },
      { property: "og:description", content: "Read the terms for browsing KEY-STEL, requesting quotes, and submitting orders." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <>
      <PageHeader eyebrow="KEY-STEL" title="Terms & Conditions">
        Please review these terms before browsing, requesting a quote, or submitting an order.
      </PageHeader>
      <div className="container-x mx-auto max-w-4xl py-8 sm:py-10">
        <Accordion type="single" collapsible className="space-y-3">
          {sections.map((section, index) => (
            <Reveal key={section.title} delay={index * 0.04} y={20}>
              <AccordionItem
                value={`terms-${index}`}
                className="terms-card rounded-lg border bg-card px-5 shadow-card transition-shadow hover:shadow-lift sm:px-6"
              >
                <AccordionTrigger className="gap-4 py-4 no-underline hover:no-underline sm:py-5">
                  <span className="min-w-0 text-left">
                    <span className="block text-sm font-bold text-foreground sm:text-base">{section.title}</span>
                    <span className="mt-1 block text-xs font-normal leading-5 text-muted-foreground sm:text-sm">
                      {section.summary}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground">
                  {section.details}
                </AccordionContent>
              </AccordionItem>
            </Reveal>
          ))}
        </Accordion>
      </div>
    </>
  );
}
