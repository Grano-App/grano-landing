import Link from "next/link";
import { Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { headerNav } from "@/content/nav";
import { site } from "@/content/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <Container className="flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label="Grano — головна">
          <Logo priority />
        </Link>
        <nav aria-label="Основне меню" className="hidden items-center gap-7 lg:flex">
          {headerNav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-navy-700 hover:text-navy-900">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={site.phoneHref}
            aria-label={`Зателефонувати ${site.phone}`}
            data-track-label="header"
            className="flex items-center gap-2 text-sm font-bold text-navy-900"
          >
            <Phone className="h-5 w-5 text-green-700" aria-hidden="true" />
            <span className="hidden md:inline">{site.phone}</span>
          </a>
          <Button href="/#lead" size="md" className="whitespace-nowrap px-4 md:px-5">
            <span className="md:hidden">Заявка</span>
            <span className="hidden md:inline">Залишити заявку</span>
          </Button>
        </div>
      </Container>
    </header>
  );
}
