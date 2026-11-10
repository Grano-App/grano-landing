import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { StoreBadges } from "@/components/ui/store-badges";
import { start } from "@/content/landing";

export function Start() {
  return (
    <Section id="start" bg="white">
      <Container>
        <SectionTitle>{start.title}</SectionTitle>
        <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          {start.steps.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-3 rounded-card border border-gray-200 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 font-display text-base font-bold text-white">
                {i + 1}
              </span>
              <h3 className="text-base font-bold text-navy-900">{step.title}</h3>
              <p className="text-sm text-navy-700">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-lede font-bold text-navy-900">{start.note}</p>
          <StoreBadges placement="start" />
        </div>
      </Container>
    </Section>
  );
}
