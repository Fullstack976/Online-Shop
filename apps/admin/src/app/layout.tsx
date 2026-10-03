import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { AuthLinkForwarder } from "@/components/auth-link-forwarder";
import "./globals.css";

// Mongolian Cyrillic needs `cyrillic-ext` for Ө ө and Ү ү.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "ShopLuxe Админ",
    template: "%s · ShopLuxe Админ",
  },
  description: "ShopLuxe-ийн бүтээгдэхүүн, захиалга, үйлчлүүлэгчдийг удирдах самбар.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn" className={`${inter.variable} ${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full bg-page font-sans text-ink">
        <AuthLinkForwarder />
        {children}
      </body>
    </html>
  );
}
