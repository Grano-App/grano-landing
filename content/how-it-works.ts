import type { LucideIcon } from "lucide-react";
import { Download, UserPlus, Leaf } from "lucide-react";

export type Step = {
  index: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const steps: Step[] = [
  {
    index: 1,
    title: "Завантажте Grano",
    description: "В App Store або Google Play.",
    icon: Download,
  },
  {
    index: 2,
    title: "Створіть акаунт",
    description: "Ім'я, телефон і пароль — і ви готові.",
    icon: UserPlus,
  },
  {
    index: 3,
    title: "Додайте поля і починайте",
    description: "Grano візьме на себе облік робіт і нагадування.",
    icon: Leaf,
  },
];
