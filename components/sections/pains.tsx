import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { pains } from "@/content/landing";

export function Pains() {
  return (
    <Section id="pains" bg="white">
      <Container>
        <SectionTitle>{pains.title}</SectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {pains.items.map((p) => (
            <p key={p} className="rounded-card border border-gray-200 p-6 text-base text-navy-700">{p}</p>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-lede font-bold text-navy-900">{pains.outro}</p>
      </Container>
    </Section>
  );
}
