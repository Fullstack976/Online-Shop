import type { Metadata, Viewport } from "next";
import { Caveat, Inter, Montserrat } from "next/font/google";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { CartHydrator } from "@/components/cart/CartHydrator";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "cyrillic", "cyrillic-ext"] });
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["500", "600", "700", "800"],
});
// Handwritten accent font; Caveat covers Mongolian Cyrillic (Ө, Ү).
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["500", "600"] });

export const metadata: Metadata = {
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
};

export const viewport: Viewport = {
  // Lets the bottom tab bar sit above the iPhone home indicator.
  viewportFit: "cover",
  themeColor: "#0f1c2e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn" className={`${inter.variable} ${montserrat.variable} ${caveat.variable} antialiased`}>
      {/* Bottom padding keeps page content clear of the mobile tab bar. */}
      <body className="flex min-h-dvh flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] font-sans lg:pb-0">
        <CartHydrator />
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileTabBar />
      </body>
    </html>
  );
}
