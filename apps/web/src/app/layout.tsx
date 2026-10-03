import type { Metadata } from "next";
import { Inter, Montserrat, Satisfy } from "next/font/google";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CartHydrator } from "@/components/cart/CartHydrator";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const satisfy = Satisfy({ variable: "--font-satisfy", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${satisfy.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <CartHydrator />
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
