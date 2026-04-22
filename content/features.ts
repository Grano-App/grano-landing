import type { LucideIcon } from "lucide-react";
import { MapPinned, ShoppingBag, Sparkles, CloudSun } from "lucide-react";

export type Feature = {
  id: "fields" | "shop" | "ai" | "weather";
  title: string;
  description: string;
  icon: LucideIcon;
  screenSrc: string;
  comingSoon?: boolean;
};

export const features: Feature[] = [
  {
    id: "fields",
    title: "Поля",
    description:
      "Ведіть облік всіх своїх полів з культурами, сезонами та аналітикою врожайності.",
    icon: MapPinned,
    screenSrc: "/screens/fields-list.png",
  },
  {
    id: "shop",
    title: "Магазин",
    description:
      "Замовляйте насіння, добрива та засоби захисту напряму в додатку. Доставка Новою поштою або кур'єром.",
    icon: ShoppingBag,
    screenSrc: "/screens/shop-catalog.png",
  },
  {
    id: "ai",
    title: "AI-діагностика",
    description:
      "Сфотографуйте листок — отримайте діагноз проблеми рослини і рекомендації.",
    icon: Sparkles,
    screenSrc: "/screens/ai-result.png",
    comingSoon: true,
  },
  {
    id: "weather",
    title: "Погода",
    description:
      "Точний прогноз по вашій області на 7 днів — плануйте польові роботи.",
    icon: CloudSun,
    screenSrc: "/screens/home.png",
  },
];
