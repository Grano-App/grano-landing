"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { headerNav } from "@/content/nav";
import { cn } from "@/lib/cn";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-200",
        scrolled ? "bg-white/95 shadow-card backdrop-blur" : "bg-transparent"
      )}
    >
      <Container className="flex h-[72px] items-center justify-between gap-4 py-4">
        <Link href="/" aria-label="Grano — головна">
          <Logo priority />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {headerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-navy-700 hover:text-navy-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button href="#download" size="md">Скачати</Button>
        </div>
        <button
          type="button"
          aria-label={open ? "Закрити меню" : "Відкрити меню"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>
      {open && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <Container className="flex flex-col gap-4 py-6">
            {headerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base text-navy-900"
              >
                {item.label}
              </Link>
            ))}
            <Button href="#download" size="md" className="self-start">Скачати</Button>
          </Container>
        </div>
      )}
    </header>
  );
}
