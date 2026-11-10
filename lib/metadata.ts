import type { Metadata } from "next";
import { site } from "@/content/site";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description:
    "Мобільний додаток для українських фермерів. Управляйте полями, діагностуйте хвороби рослин, замовляйте насіння.",
  keywords: [
    "додаток для фермерів",
    "цифровий агроном",
    "управління полями",
    "діагностика рослин за фото",
    "магазин агрохімії",
    "Grano",
  ],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description:
      "Мобільний додаток для українських фермерів. Управляйте полями, діагностуйте хвороби рослин, замовляйте насіння.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description:
      "Мобільний додаток для українських фермерів. Поля, операції, діагностика рослин і магазин агрохімії.",
  },
  robots: {
    index: true,
    follow: true,
  },
};
