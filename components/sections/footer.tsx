import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/brand/logo";
import { StoreBadges } from "@/components/ui/store-badges";
import { OrnDivider } from "@/components/ui/orn-divider";
import { footerColumns } from "@/content/footer";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-navy-900 pt-20 pb-10 text-white">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo variant="dark" />
            <p className="text-sm text-white/60">{site.tagline}</p>
            <StoreBadges />
          </div>
          {footerColumns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-white">{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-white/70 hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <OrnDivider tone="white" className="my-10" />
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/50 md:flex-row">
          <div>© 2026 {site.company}. Всі права захищені.</div>
          <div>Зроблено {site.developer}</div>
        </div>
      </Container>
    </footer>
  );
}
