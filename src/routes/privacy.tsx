import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/TextReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const sections = [
  {
    title: "Information you give us",
    summary: "Details you enter when placing an order, contacting us, or requesting a quote.",
    details: (
      <>
        <p>
          For an order, we ask for your name, phone number, delivery region, city or town, and address. You may
          also provide an email address, digital address, delivery instructions, or order notes. Email is optional.
        </p>
        <p className="mt-3">
          For contact and quote requests, we receive the name and phone number you submit and the message you send.
          Any additional details you include in the form may also be included in that message.
        </p>
      </>
    ),
  },
  {
    title: "How we use your information",
    summary: "We use submitted details to handle orders and respond to enquiries.",
    details: (
      <>
        <ul className="list-disc space-y-2 pl-5">
          <li>Receive and process your order and provide an order reference.</li>
          <li>Contact you to confirm product availability, delivery arrangements, and payment.</li>
          <li>Reply to contact messages and follow up on quote requests.</li>
          <li>Show a confirmation for the order you have just placed.</li>
        </ul>
        <p className="mt-3">
          The website does not take online payment. KEY-STEL staff contact customers to confirm orders and arrange
          payment separately.
        </p>
      </>
    ),
  },
  {
    title: "Order and enquiry records",
    summary: "Orders and messages are sent to the database used by KEY-STEL’s administration dashboard.",
    details: (
      <>
        <p>
          Order details are made available to KEY-STEL staff so they can manage the order and contact you. Contact
          and quote messages are available to staff for follow-up.
        </p>
        <p className="mt-3">
          An order request contains product identifiers and quantities. The database checks current prices and
          stock and calculates the total. The website does not ask for or collect card or mobile-money payment
          details.
        </p>
      </>
    ),
  },
  {
    title: "Information stored in your browser",
    summary: "Your cart and wishlist are saved locally so they remain available in the same browser.",
    details: (
      <>
        <p>
          The website stores cart and wishlist data in your browser’s local storage. This data remains there until
          you remove the items or clear the browser’s stored site data. It is not an account and does not sync
          across browsers or devices.
        </p>
        <p className="mt-3">
          After checkout, a short-lived order summary may be stored in session storage so the confirmation page
          can display your order in the current tab. Session storage is cleared when that tab’s session ends.
        </p>
      </>
    ),
  },
  {
    title: "Access, sharing, and retention",
    summary: "Order and message records are available to staff who handle customer requests.",
    details: (
      <>
        <p>
          Submitted information is processed through the database service used for the website’s order and message
          functions. We do not use these forms to create a customer account.
        </p>
        <p className="mt-3">
          Order and message records are kept in the administration system for business handling. This website
          does not publish a fixed deletion schedule. You can contact KEY-STEL to ask about information you have
          submitted or request a correction.
        </p>
      </>
    ),
  },
  {
    title: "Keeping your information safe",
    summary: "Submissions use server-side functions rather than exposing database administration credentials.",
    details: (
      <p>
        No internet transmission or storage method can be guaranteed completely secure. Please only include the
        information needed to handle your order or enquiry.
      </p>
    ),
  },
  {
    title: "Questions or requests",
    summary: "Contact KEY-STEL with questions about this policy or information you have submitted.",
    details: (
      <p>
        If you have a question about this policy or want to ask about information you submitted, please{" "}
        <Link to="/contact" className="font-semibold text-primary underline underline-offset-4">
          contact KEY-STEL
        </Link>
        .
      </p>
    ),
  },
];

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Privacy Policy — KEY-STEL" },
      { name: "description", content: "Learn what information KEY-STEL collects, how it is used, and how browser storage supports your shopping experience." },
      { property: "og:title", content: "Privacy Policy — KEY-STEL" },
      { property: "og:description", content: "Learn what information KEY-STEL collects, how it is used, and how browser storage supports your shopping experience." },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <>
      <PageHeader eyebrow="KEY-STEL" title="Privacy Policy">
        A clear guide to the information used when you browse, place an order, or contact us.
      </PageHeader>
      <div className="container-x mx-auto max-w-4xl py-8 sm:py-10">
        <Accordion type="single" collapsible className="space-y-3">
          {sections.map((section, index) => (
            <Reveal key={section.title} delay={index * 0.04} y={20}>
              <AccordionItem
                value={`privacy-${index}`}
                className="privacy-card rounded-lg border bg-card px-5 shadow-card transition-shadow hover:shadow-lift sm:px-6"
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
