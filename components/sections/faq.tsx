import { AccordionItem } from "@/components/ui/accordion-item";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { faqItems } from "@/content/faq";

export function Faq() {
  return (
    <Section id="faq" bg="cream">
      <Container className="max-w-3xl">
        <SectionTitle center>Питання</SectionTitle>
        {faqItems.map((item) => (
          <AccordionItem key={item.id} id={item.id} question={item.question} answer={item.answer} />
        ))}
      </Container>
    </Section>
  );
}
