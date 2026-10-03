import { siteImage } from "@shop/db/assets";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readMinutes: number;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "cozy-home-refresh",
    title: "7 easy ways to refresh your home this season",
    excerpt: "Small swaps — a new lamp, a few plants, softer textiles — that make any room feel brand new.",
    image: siteImage("blog-home"),
    category: "Home & Living",
    date: "2026-09-24",
    readMinutes: 4,
    body: [
      "You don't need a full renovation to make your space feel new. Start with light: a warm table lamp in the corner instantly makes evenings cosier.",
      "Next, bring in some green. Low-maintenance succulents and cacti thrive on desks and windowsills and add life to any shelf.",
      "Finally, layer textures — a soft pillow, a knitted throw, a ceramic mug you love using every morning. Small details add up.",
    ],
  },
  {
    slug: "capsule-wardrobe-basics",
    title: "Building a capsule wardrobe: the 10 basics",
    excerpt: "A handful of versatile pieces you can mix and match all year long.",
    image: siteImage("blog-fashion"),
    category: "Fashion",
    date: "2026-09-12",
    readMinutes: 6,
    body: [
      "A capsule wardrobe is about owning fewer, better things. Start with a great white tee, well-fitting jeans and a hoodie you'll reach for every weekend.",
      "Add one statement layer — a leather jacket never goes out of style — and a pair of clean sneakers that go with everything.",
      "Choose neutral colours so every piece works together, then add personality with accessories like sunglasses and a classic watch.",
    ],
  },
  {
    slug: "smart-gadgets-2026",
    title: "The smart gadgets worth buying in 2026",
    excerpt: "From smart watches to earbuds — the tech that genuinely makes everyday life easier.",
    image: siteImage("blog-tech"),
    category: "Electronics",
    date: "2026-08-30",
    readMinutes: 5,
    body: [
      "A good smart watch does more than count steps: sleep tracking, heart-rate alerts and quick replies keep you present without reaching for your phone.",
      "Wireless earbuds have become the most-used gadget for many of us. Look for comfortable fit, noise reduction and a pocketable case.",
      "Finally, don't overlook the basics: a fast USB-C charger and an ergonomic mouse make a noticeable difference every day.",
    ],
  },
  {
    slug: "home-workout-starter-kit",
    title: "Your home workout starter kit",
    excerpt: "Everything you need to train effectively at home — without a gym membership.",
    image: siteImage("blog-workout"),
    category: "Sports",
    date: "2026-08-14",
    readMinutes: 3,
    body: [
      "A non-slip yoga mat is the foundation of every home workout, from stretching to HIIT.",
      "Add a set of dumbbells and resistance bands and you can train every major muscle group in a small space.",
      "Stay hydrated with an insulated bottle and you're ready to build a routine that sticks.",
    ],
  },
];

export const formatPostDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
