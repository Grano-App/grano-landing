export type Testimonial = {
  id: string;
  name: string;
  role: string;
  region: string;
  crop: string;
  initial: string;
  quote: string;
  accent: "green" | "navy" | "warning";
};

export const testimonials: Testimonial[] = [
  {
    id: "kovalchuk",
    name: "Олексій Ковальчук",
    role: "Фермер",
    region: "Полтавщина",
    crop: "Пшениця, 120 га",
    initial: "О",
    quote:
      "Нарешті один додаток замість трьох. Всі поля, операції, сезон — в телефоні, завжди під рукою.",
    accent: "green",
  },
  {
    id: "levchenko",
    name: "Марія Левченко",
    role: "Агроном",
    region: "Вінниччина",
    crop: "Кукурудза, соняшник, 250 га",
    initial: "М",
    quote:
      "AI-діагностика допомагає швидко зрозуміти проблему в полі — без пошуку довідників. Для нашої команди це плюс.",
    accent: "navy",
  },
  {
    id: "shevchenko",
    name: "Василь Шевченко",
    role: "Керівник господарства",
    region: "Черкащина",
    crop: "Ріпак, пшениця, 450 га",
    initial: "В",
    quote:
      "Магазин в додатку економить купу часу — замовляєш насіння прямо з поля, без дзвінків менеджеру.",
    accent: "warning",
  },
];
