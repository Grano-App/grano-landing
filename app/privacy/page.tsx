import type { Metadata } from "next";
import { PageShell } from "@/components/layouts/page-shell";

export const metadata: Metadata = {
  title: "Політика конфіденційності — Grano",
  description:
    "Політика конфіденційності застосунку Grano. Які дані збираються, як використовуються, як можна запитати видалення.",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <article className="flex flex-col gap-6">
        <h1 className="font-display text-h2 font-bold text-navy-900">
          Політика конфіденційності
        </h1>
        <p className="text-sm text-navy-500">Остання редакція: 2026-04-22</p>

        <p className="rounded-card border border-warning-bg bg-warning-bg/50 p-4 text-sm text-navy-900">
          Це placeholder-версія документа. Остаточну редакцію підготує юридична
          команда ТОВ Грано; до заміни на повний текст використовуйте лише для
          перевірки структури.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">1. Які дані ми збираємо</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Grano збирає: (а) контактні дані, які ви надаєте при реєстрації (ім'я,
          телефон, email); (б) дані про поля та операції, які ви самостійно
          вводите в додаток; (в) технічні логи для забезпечення стабільної роботи.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">2. Як ми використовуємо дані</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Персональні дані використовуються виключно для надання функцій додатку:
          облік полів, замовлення в магазині, сповіщення про операції. Ми не
          продаємо дані третім сторонам.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">3. Зберігання та безпека</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Дані зберігаються на серверах у Європейському Союзі з шифруванням
          TLS 1.3 при передачі та AES-256 при зберіганні.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">4. Ваші права</h2>
        <p className="text-base leading-relaxed text-navy-700">
          Ви маєте право запитати доступ до своїх даних, виправлення чи повне
          видалення. Напишіть на support@grano-app.com з темою «Доступ до даних»
          або «Видалення акаунту» — відповімо протягом 30 днів.
        </p>

        <h2 className="mt-6 text-h4 font-bold text-navy-900">5. Контакти</h2>
        <p className="text-base leading-relaxed text-navy-700">
          З питаннями щодо обробки персональних даних пишіть на
          support@grano-app.com.
        </p>
      </article>
    </PageShell>
  );
}
