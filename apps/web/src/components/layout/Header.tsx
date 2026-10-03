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
      <div className="container-page flex h-[72px] items-center gap-4">
        <MobileMenu categories={links} />
        <Logo />
        <NavLinks categories={links} />
        <HeaderActions />
      </div>
    </header>
  );
}
