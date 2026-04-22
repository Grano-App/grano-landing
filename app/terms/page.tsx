import type { Metadata } from "next";
import { PageShell } from "@/components/layouts/page-shell";

export const metadata: Metadata = {
  title: "Умови використання — Grano",
  description:
    "Умови використання застосунку Grano та послуг магазину агрохімії.",
};

export default function TermsPage() {
  return (
    <PageShell>
      <article className="flex flex-col gap-6">
        <h1 className="font-display text-h2 font-bold text-navy-900">
          Умови використання
        </h1>
        <p className="text-sm text-navy-500">Остання редакція: 2026-04-22</p>

        <p className="rounded-card border border-warning-bg bg-warning-bg/50 p-4 text-sm text-navy-900">
          Це placeholder-версія документа. Остаточну редакцію підготує юридична
          команда ТОВ Грано.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">1. Загальні положення</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Використовуючи додаток Grano, ви погоджуєтесь з цими умовами. Якщо ви
          не згодні з будь-яким пунктом — не використовуйте додаток.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">2. Реєстрація</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Для використання додатку потрібна реєстрація з вказанням дійсних
          контактних даних. Відповідальність за достовірність даних несе
          користувач.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">3. Замовлення в магазині</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Оформлене замовлення є офертою. Підтвердження від Grano — акцептом.
          Доставка та оплата здійснюються згідно з обраним способом.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">4. Відповідальність</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Grano надається «як є». Ми не несемо відповідальності за рішення,
          прийняті на основі рекомендацій AI-діагностики — остаточне рішення
          приймає агроном.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">5. Зміни умов</h2>
        <p className="text-base leading-relaxed text-navy-700">
          ТОВ Грано має право оновлювати ці умови. Про суттєві зміни
          повідомляємо email-розсилкою та нотифікацією в додатку.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">6. Контакти</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Питання щодо умов — на support@grano-app.com.
        </p>
      </article>
    </PageShell>
  );
}
