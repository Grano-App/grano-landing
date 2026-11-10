export const footerColumns = [
  {
    title: "Продукт",
    links: [
      { label: "Можливості", href: "#features" },
      { label: "Як працює", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Підтримка",
    links: [
      { label: "Центр підтримки", href: "/support" },
      { label: "+380 66 797 50 07", href: "tel:+380667975007" },
      { label: "support@grano-app.com", href: "mailto:support@grano-app.com" },
    ],
  },
  {
    title: "Компанія",
    links: [
      { label: "grano.in.ua", href: "https://grano.in.ua", external: true },
      { label: "Політика конфіденційності", href: "/privacy" },
      { label: "Умови використання", href: "/terms" },
    ],
  },
] as const;
