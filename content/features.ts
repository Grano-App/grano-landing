import type { LucideIcon } from "lucide-react";
import { MapPinned, ShoppingBag, Sparkles, CloudSun } from "lucide-react";

export type Feature = {
  id: "fields" | "shop" | "ai" | "weather";
  title: string;
  description: string;
  icon: LucideIcon;
  screenSrc: string;
};

export const features: Feature[] = [
  {
    id: "fields",
    title: "Поля",
    description:
      "Поля на карті з межами й площею, культури, посів, обробки й збирання з нагадуваннями.",
    icon: MapPinned,
    screenSrc: "/screens/fields-list.png",
  },
  {
    id: "shop",
    title: "Магазин",
    description:
      "Замовляйте насіння, добрива та засоби захисту напряму в додатку. Доставка Новою поштою, оплата онлайн або при отриманні.",
    icon: ShoppingBag,
    screenSrc: "/screens/shop-catalog.png",
  },
  {
    id: "ai",
    title: "Діагностика за фото",
    description:
      "Сфотографуйте рослину — застосунок допоможе визначити ознаки хвороби й підкаже, на що звернути увагу.",
    icon: Sparkles,
    screenSrc: "/screens/ai-result.png",
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
