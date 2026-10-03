export const site = {
  name: "ShopLuxe",
  tagline: "Танд хэрэгтэй бүхэн",
  description: "Чанартай бараа, хамгийн боломжийн үнээр — нэг дороос. Ухаалаг худалдан авалт, илүү сайхан амьдрал.",
  phone: "+976 7700 1234",
  email: "support@shopluxe.com",
  address: ["Сүхбаатар дүүрэг, 1-р хороо,", "Улаанбаатар, Монгол улс"],
};

export const mainNav = [
  { label: "Нүүр", href: "/" },
  { label: "Дэлгүүр", href: "/shop", menu: "categories" as const },
  { label: "Цуглуулга", href: "/collections", menu: "collections" as const },
  { label: "Бидний тухай", href: "/about" },
  { label: "Блог", href: "/blog" },
  { label: "Холбоо барих", href: "/contact" },
];

export const collections = [
  { label: "Эрэлттэй бараа", href: "/shop?trending=1" },
  { label: "Хямдралтай", href: "/shop?sale=1" },
  { label: "Шинээр ирсэн", href: "/shop?sort=newest" },
  { label: "Өндөр үнэлгээтэй", href: "/shop?sort=rating" },
  { label: "$30-аас доош", href: "/shop?max=30" },
];
