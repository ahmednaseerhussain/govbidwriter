import { buildMetadata } from "@/lib/seo/meta";
import { ContactForm } from "./contact-form";

export const metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Questions about GovBidWriter, the Pro plan, or a feature request? Send us a message — we respond within one business day.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="container max-w-2xl py-12">
      <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">
        Contact us
      </h1>
      <p className="mt-3 text-muted-foreground">
        Questions about the product, pricing, or a feature you need for your
        next bid? Send a message — we respond within one business day.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </section>
  );
}
