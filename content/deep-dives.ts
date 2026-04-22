export type DeepDive = {
  id: "fields" | "shop" | "ai" | "weather";
  title: string;
  pill?: string;
  lede: string;
  bullets: [string, string, string];
  screenSrc: string;
  alt: string;
  disclaimer?: string;
  mockupSide: "left" | "right";
  bg: "cream" | "white";
};

export const deepDives: DeepDive[] = [
  {
    id: "fields",
    title: "Всі поля — на одній карті",
    lede:
      "Додавайте поля з точними межами, фіксуйте операції, відстежуйте культуру і сезон. Grano веде історію за вас.",
    bullets: [
      "Додавайте поля вручну або через Google Maps",
      "Історія культур, сівозміна, врожайність по роках",
      "Сповіщення про ключові агрооперації в потрібний час",
    ],
    screenSrc: "/screens/field-detail.png",
    alt: "Екран деталей поля з культурою та операціями",
    mockupSide: "left",
    bg: "cream",
  },
  {
    id: "shop",
    title: "Магазин агрохімії — в твоїй кишені",
    lede:
      "Купуйте насіння, добрива і ЗЗР напряму. Каталог, кошик, онлайн-оплата, доставка Новою поштою — без дзвінків і переговорів.",
    bullets: [
      "Великий каталог: насіння, добрива, засоби захисту",
      "Доставка Новою поштою або кур'єром",
      "Онлайн-оплата: Visa, Mastercard, Google Pay, Apple Pay",
    ],
    screenSrc: "/screens/shop-catalog.png",
    alt: "Каталог магазину з насінням і добривами",
    mockupSide: "right",
    bg: "white",
  },
  {
    id: "ai",
    title: "Хвороби рослин — по одному фото",
    pill: "Скоро",
    lede:
      "Сфотографуйте уражений листок — AI визначить проблему і запропонує план обробки. Без довідників, без здогадок.",
    bullets: [
      "Розпізнавання основних хвороб і дефіцитів",
      "Рівень ризику і рекомендовані заходи",
      "Історія всіх діагностик за полем",
    ],
    screenSrc: "/screens/ai-result.png",
    alt: "Екран результату AI-діагностики з діагнозом «Борошниста роса»",
    disclaimer: "AI-діагностика запрацює в повному обсязі в 2026 році.",
    mockupSide: "left",
    bg: "cream",
  },
  {
    id: "weather",
    title: "Прогноз по твоїй області",
    lede:
      "Актуальна погода і прогноз на 7 днів — вмонтовані на головному екрані. Плануйте обробку без зайвих додатків.",
    bullets: [
      "Точний прогноз через Open-Meteo API",
      "Сповіщення про ризики (заморозки, зливи)",
      "Інтеграція з завданнями — плануй по погоді",
    ],
    screenSrc: "/screens/weather-card.png",
    alt: "Картка погоди на головному екрані",
    mockupSide: "right",
    bg: "white",
  },
];
