export const site = {
  name: "ShopLuxe",
  tagline: "Everything you need",
  description: "Your one-stop shop for quality products at the best prices. Shop smart, live better.",
  phone: "+1 234 567 8900",
  email: "support@shopluxe.com",
  address: ["123 Commerce St,", "New York, NY 10001, USA"],
};

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop", menu: "categories" as const },
  { label: "Collections", href: "/collections", menu: "collections" as const },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

export const collections = [
  { label: "Trending Now", href: "/shop?trending=1" },
  { label: "On Sale", href: "/shop?sale=1" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "Top Rated", href: "/shop?sort=rating" },
  { label: "Under $30", href: "/shop?max=30" },
];
