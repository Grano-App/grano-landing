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
      { label: "support@grano-app.com", href: "mailto:support@grano-app.com" },
    ],
  },
  {
    title: "Компанія",
    links: [
      { label: "Про Grano", href: "/support#about" },
      { label: "grano.in.ua", href: "https://grano.in.ua", external: true },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
] as const;
