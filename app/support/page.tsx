import type { Metadata } from "next";
import { PageShell } from "@/components/layouts/page-shell";
import { AccordionItem } from "@/components/ui/accordion-item";
import { Button } from "@/components/ui/button";
import { faqItems } from "@/content/faq";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Підтримка — Grano",
  description:
    "Центр підтримки Grano. Відповіді на часті запитання та способи зв'язку з командою.",
};

export default function SupportPage() {
  return (
    <PageShell>
      <h1 className="font-display text-h2 font-bold text-navy-900">
        Центр підтримки
      </h1>
      <p className="mt-4 text-lede text-navy-500">
        Відповімо на ваші питання про Grano. Якщо не знайшли відповіді нижче —
        напишіть нам.
      </p>

      <section id="contact" className="mt-10 rounded-card bg-cream-50 p-6">
        <h2 className="text-h4 font-bold text-navy-900">Як зв'язатись</h2>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-navy-500">Email</dt>
            <dd>
              <a className="text-navy-900 underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-navy-500">Телефон</dt>
            <dd>
              <a className="text-navy-900 underline" href={site.phoneHref}>
                {site.phone}
              </a>
              <span className="ml-2 text-xs text-navy-500">({site.supportHours})</span>
            </dd>
          </div>
        </dl>
        <Button href={`mailto:${site.email}`} external className="mt-6">Написати нам</Button>
      </section>

      <section className="mt-12">
        <h2 className="text-h3 font-bold text-navy-900">Часті запитання</h2>
        <div className="mt-6">
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              id={item.id}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
