import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-tan">404</p>
      <h1 className="mt-4 font-display text-2xl font-extrabold uppercase text-navy">Хуудас олдсонгүй</h1>
      <p className="mt-2 text-muted">Таны хайсан хуудас байхгүй эсвэл өөр хаяг руу шилжсэн байна.</p>
      <Link href="/shop" className="label-caps mt-8 inline-flex h-12 items-center rounded-md bg-navy px-6 text-white hover:bg-navy-700">
        Бараа үзэх
      </Link>
    </div>
  );
}
