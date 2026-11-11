import { headerNav } from "./nav";
import { site } from "./site";

export const footerColumns = [
  {
    title: "Продукт",
    links: headerNav.map((n) => ({ label: n.label, href: n.href })),
  },
  {
    title: "Підтримка",
    links: [
      { label: "Центр підтримки", href: "/support" },
      { label: site.phone, href: site.phoneHref },
      { label: site.email, href: `mailto:${site.email}` },
    ],
  },
  {
    title: "Компанія",
    links: [
      { label: "grano.in.ua", href: site.mainSite, external: true },
      { label: "Політика конфіденційності", href: "/privacy" },
      { label: "Умови використання", href: "/terms" },
    ],
  },
];
