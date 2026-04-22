import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { AccordionItem } from "@/components/ui/accordion-item";
import { faqItems } from "@/content/faq";

export function Faq() {
  return (
    <Section id="faq" bg="white">
      <Container className="max-w-3xl">
        <h2 className="mb-10 text-center font-display text-h2 font-bold text-navy-900">
          Часті запитання
        </h2>
        <div>
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              id={item.id}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
