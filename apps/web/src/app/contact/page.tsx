import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ui/ContactForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact Us" };

const faqs = [
  { q: "How long does shipping take?", a: "Orders ship within 24 hours and usually arrive in 2–4 business days. Shipping is free on orders over $50." },
  { q: "What is your return policy?", a: "Changed your mind? Return any unused item within 30 days for a full refund." },
  { q: "Which payment methods do you accept?", a: "Cash on delivery today; card payments are coming soon." },
  { q: "How can I track my order?", a: "You'll receive an email with tracking details as soon as your order ships." },
];

export default function ContactPage() {
  const cards = [
    { icon: Phone, title: "Call us", text: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    { icon: Mail, title: "Email", text: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, title: "Visit", text: site.address.join(" ") },
    { icon: Clock, title: "Hours", text: "Mon – Sun, 9:00 – 20:00" },
  ];
  return (
    <>
      <PageHeader title="Contact us" crumbs={[{ label: "Contact Us" }]} subtitle="Questions about an order or a product? We're here to help." />
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.3fr]">
        <div className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {cards.map(({ icon: Icon, title, text, href }) => (
            <div key={title} className="flex items-start gap-4 rounded-xl bg-cloud p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-navy text-white">
                <Icon className="size-5" strokeWidth={1.6} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="label-caps text-navy">{title}</p>
                {href ? (
                  <a href={href} className="mt-1 block break-words text-sm text-ink/75 hover:text-tan">
                    {text}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-ink/75">{text}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-line p-6 sm:p-8">
          <h2 className="font-display text-xl font-extrabold text-navy">Send us a message</h2>
          <p className="mb-6 mt-1 text-sm text-muted">We usually reply within a few hours.</p>
          <ContactForm />
        </div>
      </div>
      <section id="faq" className="container-page max-w-3xl scroll-mt-28 pb-16">
        <h2 className="text-center font-display text-lg font-extrabold uppercase tracking-wide text-navy">Frequently asked questions</h2>
        <div className="mt-6 divide-y divide-line rounded-xl border border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                {f.q}
                <span className="text-xl text-tan transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
