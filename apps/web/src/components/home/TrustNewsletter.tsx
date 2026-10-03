import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { siteImage } from "@shop/db/assets";
import { NewsletterForm } from "./NewsletterForm";
import { StarRating } from "@/components/product/StarRating";

const avatars = (["avatar-1", "avatar-2", "avatar-3", "avatar-4"] as const).map(siteImage);

export function TrustNewsletter() {
  return (
    <section className="container-page pb-16 pt-6">
      <div className="grid gap-8 rounded-xl border border-line px-6 py-7 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-12 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BadgeCheck className="size-10 shrink-0 text-navy" strokeWidth={1.3} aria-hidden />
            <div>
              <p className="font-display text-sm font-extrabold uppercase tracking-wide text-navy">Мянга мянган хүний итгэл</p>
              <p className="text-xs text-muted">Чанартай бараа, сэтгэл хангалуун хэрэглэгчид.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex shrink-0 -space-x-2.5">
              {avatars.map((src) => (
                <Image key={src} src={src} alt="" width={40} height={40} className="size-10 rounded-full border-2 border-white object-cover" />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-extrabold text-navy">4.8/5</span>
                <StarRating rating={4.8} />
              </div>
              <p className="text-xs text-muted">2,500+ үнэлгээнд үндэслэв</p>
            </div>
          </div>
        </div>
        <div className="border-line lg:border-l lg:pl-12">
          <p className="font-display text-sm font-extrabold uppercase tracking-wide text-navy">Мэдээлэл хүлээн авах</p>
          <p className="mt-1 text-xs text-muted">Шинэ бараа, хямдралын мэдээг хамгийн түрүүнд аваарай.</p>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
