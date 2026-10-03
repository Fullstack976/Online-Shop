import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ui/ContactForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Холбоо барих" };

const faqs = [
  { q: "Хүргэлт хэр удах вэ?", a: "Захиалгыг 24 цагийн дотор илгээж, ихэвчлэн 2–4 ажлын өдөрт хүргэнэ. $50-аас дээш захиалгад хүргэлт үнэгүй." },
  { q: "Буцаалтын нөхцөл ямар вэ?", a: "Бодол өөрчлөгдсөн үү? Хэрэглээгүй барааг 30 хоногийн дотор буцааж, төлбөрөө бүрэн авах боломжтой." },
  { q: "Ямар төлбөрийн хэрэгсэл хүлээн авдаг вэ?", a: "Одоогоор хүргэлтийн үед бэлнээр төлнө. Картаар төлөх боломж тун удахгүй нэмэгдэнэ." },
  { q: "Захиалгаа яаж хянах вэ?", a: "Захиалга илгээгдмэгц хянах мэдээлэл бүхий имэйл танд ирнэ." },
];

export default function ContactPage() {
  const cards = [
    { icon: Phone, title: "Утас", text: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    { icon: Mail, title: "Имэйл", text: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, title: "Хаяг", text: site.address.join(" ") },
    { icon: Clock, title: "Цагийн хуваарь", text: "Даваа – Ням, 9:00 – 20:00" },
  ];
  return (
    <>
      <PageHeader title="Холбоо барих" crumbs={[{ label: "Холбоо барих" }]} subtitle="Захиалга эсвэл барааны талаар асуух зүйл байна уу? Бид туслахад бэлэн." />
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
          <h2 className="font-display text-xl font-extrabold text-navy">Бидэнд бичих</h2>
          <p className="mb-6 mt-1 text-sm text-muted">Бид ихэвчлэн хэдхэн цагийн дотор хариулдаг.</p>
          <ContactForm />
        </div>
      </div>
      <section id="faq" className="container-page max-w-3xl scroll-mt-28 pb-16">
        <h2 className="text-center font-display text-lg font-extrabold uppercase tracking-wide text-navy">Түгээмэл асуултууд</h2>
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
