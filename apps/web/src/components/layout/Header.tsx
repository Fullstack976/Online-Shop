import { getData } from "@/lib/data";
import { HeaderActions } from "./HeaderActions";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export async function Header() {
  const categories = await getData().listCategories();
  const links = categories.map((c) => ({ label: c.name, href: `/shop?category=${c.slug}` }));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="container-page relative flex h-16 items-center gap-4 lg:h-[72px]">
        <MobileMenu categories={links} />
        {/* Centered on phones, left-aligned next to the nav on desktop. */}
        <Logo className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0" />
        <NavLinks categories={links} />
        <HeaderActions />
      </div>
    </header>
  );
}
