import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { StoreBadges } from "@/components/ui/store-badges";
import { footerColumns } from "@/content/footer";
import { site } from "@/content/site";

const linkClass = "block py-1 text-sm text-white/70 hover:text-white";

export function Footer() {
  return (
    <footer className="bg-navy-900 py-14 text-white">
      <Container className="grid grid-cols-1 gap-10 md:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo variant="dark" />
          <p className="text-sm text-white/60">{site.tagline}</p>
          <StoreBadges placement="footer" />
        </div>
        {footerColumns.map((col) => (
          <div key={col.title} className="flex flex-col gap-2">
            <p className="text-sm font-bold text-white">{col.title}</p>
            <ul>
              {col.links.map((link) => (
                <li key={link.href}>
                  {"external" in link && link.external ? (
                    <a href={link.href} target="_blank" rel="noreferrer" className={linkClass}>{link.label}</a>
                  ) : link.href.startsWith("/") ? (
                    <Link href={link.href} className={linkClass}>{link.label}</Link>
                  ) : (
                    <a href={link.href} data-track-label="footer" className={linkClass}>{link.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="mt-10 text-xs text-white/50">© 2026 {site.company}. Всі права захищені.</Container>
    </footer>
  );
}
